<template>
  <div>
    <NuxtLink to='profile'>Profile</NuxtLink>
    <div v-if='error' class='text-red-600'>
      {{ error }}
    </div>
    <div v-else>
      <div v-if='queue_error' class='text-red-600'>
        {{ queue_error }}
      </div>
      <div v-else>
        <div v-if='matched && matched_go'>
          <div v-if='matched.status === "accepted"'>
            <h1>Match found!</h1>
            <h1>{{ Math.max(0, Math.min(30, matched_countdown)) }} seconds until cancel</h1>
            <h1>Waiting for opponent to accept...</h1>
          </div>
          <div v-else-if='matched.status === "pending"'>
            <h1>Match found!</h1>
            <h1>{{ Math.max(0, Math.min(30, matched_countdown)) }} seconds to accept</h1>
            <div v-if='match_error' class='text-red-600'>
              {{ match_error }}
            </div>
            <div v-else>
              <button @click='acceptMatch()'>Accept</button>
            </div>
          </div>
          <div v-else>
            <h1>Match in progress</h1>
            <NuxtLink :to='"/match/" + matched.match_id'>Enter</NuxtLink>
          </div>
        </div>
        <div v-else-if='queued === true'>
          <button @click='leaveQueue("chess")'>Finding opponents...</button>
        </div>
        <div v-else-if='queued === false'>
          <button @click='joinQueue("chess")'>Play chess</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Socket } from 'phoenix/assets/js/phoenix.js';
import { server } from '@/server';

export default {
  data() {
    return {
      closed: false, // everything will shut down when this is true
      closed_ack: false,
      socket: null,
      queue: null,
      matches: null,
      match: null,
      queue_cbq: [],
      matches_cbq: [],
      match_cbq: [],
      joined_queue: false, // state grabber will only run when this and below are true
      joined_matches: false,
      joined_match: false,
      got_state: false, // .on callbacks will only run in the queue when this is true
      queue_idx: null,
      matches_idx: null,
      match_idx: null,
      queued: null,
      matched: false,
      matched_go: false,
      matched_countdown: null,
      matches_result: [],
      sending_clear: false,
      error: '',
      error_pending: false,
      queue_error: '',
      match_error: '',
    }
  },
  async created() {
    this.socket = new Socket(server.socket_root)
    this.socket.onClose(async () => {
      if (this.error_pending) {
        return;
      }
      this.error_pending = true;
      this.joined_queue = false;
      this.joined_matches = false;
      this.joined_match = false;
      this.got_state = false;
      if (this.match) {
        this.match.leave()
        delete this.match;
      }
      this.match = null;
      await new Promise(r => setTimeout(r, 3600))
      if (this.error_pending) {
        this.error = "network error";
      }
    })
    this.socket.connect()

    this.queue = this.socket.channel('queue:' + this.$auth.user.user_id, { token: this.$auth.strategy.token.get() })
    this.queue.on("joined_queue", async (msg) => {
      console.log('joined queue', msg)
      this.queue_cbq.push({
        idx: msg.idx,
        arg: null,
        fn: async (_) => {
          this.queued = true;
        }
      })
    })
    this.queue.on("left_queue", async (msg) => {
      console.log('left queue', msg)
      this.queue_cbq.push({
        idx: msg.idx,
        arg: null,
        fn: async (_) => {
          this.queued = false;
        }
      })
    })
    this.queue.on("match_pending", async (msg) => {
      console.log('match pending', msg)
      this.queue_cbq.push({
        idx: msg.idx,
        arg: msg.match,
        fn: async (match) => {
          this.queued = false;
          this.matched = match;
          this.match = this.socket.channel('match:' + this.matched.match_id)
          await this.setupMatchCbs();
          this.match.join()
            .receive('ok', async (_) => {
              console.log('joined match:' + this.matched.match_id)
              this.joined_match = true;
            })
            .receive('error', async (msg) => {
              try {
                console.log('error', msg)
                await this.showError(msg.reason)
              } catch {
                await this.showError("something went wrong")
              }
            })
          await this.getMatchState();
        }
      })
    })
    this.queue.join()
      .receive('ok', async (msg) => {
        console.log('joined queue:' + this.$auth.user.user_id)
        this.joined_queue = true;
      })
      .receive('error', async (msg) => {
        try {
          console.log('error', msg)
          await this.showError(msg.reason)
        } catch {
          await this.showError("something went wrong")
        }
      })

    this.matches = this.socket.channel('matches:' + this.$auth.user.user_id, { token: this.$auth.strategy.token.get() })
    this.matches.on('match_cleared', async (msg) => {
      console.log('match cleared', msg)
      this.matches_cbq.push({
        idx: msg.idx,
        arg: msg.match_id,
        fn: async (match_id) => {
          if (this.matched.match_id === match_id) {
            this.matched = false;
            if (this.match) {
              this.match.leave()
              delete this.match
            }
            this.match = null;
          }
          this.sending_clear = false;
        }
      })
    })
    this.matches.join()
      .receive('ok', async (msg) => {
        console.log('joined matches:' + this.$auth.user.user_id)
        this.joined_matches = true;
      })
      .receive('error', async (msg) => {
        try {
          console.log('error', msg)
          await this.showError(msg.reason)
        } catch {
          await this.showError("something went wrong")
        }
      })

    // polls for restate and cbqs
    while (!this.closed) {
      if (this.got_state && this.queue_cbq.length) {
        let cb = this.queue_cbq.shift()
        if (cb.idx > this.queue_idx) {
          await cb.fn(cb.arg)
        }
      }
      if (this.got_state && this.matches_cbq.length) {
        let cb = this.matches_cbq.shift()
        if (cb.idx > this.matches_idx) {
          await cb.fn(cb.arg)
        }
      }
      if (this.got_state && this.match_cbq.length) {
        let cb = this.match_cbq.shift()
        if (cb.idx > this.match_idx) {
          await cb.fn(cb.arg)
        }
      }
      if (this.matched && !this.sending_clear) {
        // TODO: waste of computational power
        let prev = Date.parse(this.matched.inserted_at);
        let cur = Date.parse((new Date()).toString());
        let diff = Math.floor((cur - prev) / 1000)
        this.matched_countdown = 30 - diff;
        if (diff >= 30 && (this.matched.status === "pending" || this.matched.status === "accepted")) {
          // send claim to clear match
          this.sending_clear = true;
          this.match.push('clear_match', { token: this.$auth.strategy.token.get() })
            .receive('ok', (msg) => {
              // console.log('ok', msg)
            })
            .receive('error', async (msg) => {
              try {
                if (
                  msg.reason === "CHESS_ENABLED_INTERNAL_TRANSFER_CLEAR_MATCH_NOT_MEMBER+24e50024-590f-4446-abd9-4fbe37d8b961" ||
                  msg.reason === "CHESS_ENABLED_INTERNAL_TRANSFER_CLEAR_MATCH_MOVED_TO_WAGERING+69b586e8-68d1-4d7d-ace7-0904cee09414"
                ) {
                  // noop
                } else if (
                  msg.reason === "CHESS_ENABLED_INTERNAL_TRANSFER_CLEAR_MATCH_TOO_EARLY+332e403b-f718-43d4-ab0e-7a388edd74cb"
                ) {
                  // retry
                  console.log('retrying clear_match...')
                  this.sending_clear = false;
                } else {
                  console.log('error', msg)
                  await this.showError(msg.reason)
                }
              } catch {
                await this.showError("something went wrong")
              }
            })
        } else {
          this.matched_go = true;
        }
      } else {
        // this.matched_go = true;
      }
      if (this.joined_queue && this.joined_matches && !this.got_state) {
        this.error = "";
        this.error_pending = false;
        this.queue.push("list_queued")
          .receive('ok', async (msg) => {
            console.log('got queued', msg)
            this.queued = !!msg.queued.length
            this.queue_idx = msg.idx
          })
          .receive('error', async (msg) => {
            try {
              console.log('error', msg)
              await this.showError(msg.reason)
            } catch {
              await this.showError("something went wrong")
            }
          })
        this.matches.push("list_matches")
          .receive('ok', async (msg) => {
            console.log('got matches', msg)
            if (msg.matches.length && !msg.matches[0].closed) {
              this.matched = msg.matches[0];
              this.match = this.socket.channel('match:' + this.matched.match_id)
              await this.setupMatchCbs();
              this.match.join()
                .receive('ok', async (msg) => {
                  console.log('joined match:' + this.matched.match_id)
                  this.joined_match = true;
                })
                .receive('error', async (msg) => {
                  try {
                    console.log('error', msg)
                    await this.showError(msg.reason)
                  } catch {
                    await this.showError("something went wrong")
                  }
                })
              await this.getMatchState();
            }
            this.matches_result = msg.matches;
            this.matches_result.shift();
            this.matches_idx = msg.idx
          })
          .receive('error', async (msg) => {
            try {
              console.log('error', msg)
              await this.showError(msg.reason)
            } catch {
              await this.showError("something went wrong")
            }
          })
        this.got_state = true;
      }
      await new Promise(r => setTimeout(r, 0))
    }
    this.closed_ack = true;
  },
  methods: {
    async showError(err) {
      if (err === undefined) {
        this.error = 'something went wrong'
      } else {
        this.error = err;
      }
    },
    async showQueueError(err) {
      if (err === undefined) {
        this.queue_error = 'something went wrong'
      } else {
        this.queue_error = err;
      }
      await new Promise(r => setTimeout(r, 1800));
      this.queue_error = '';
    },
    async showMatchError(err) {
      if (err === undefined) {
        this.match_error = 'something went wrong'
      } else {
        this.match_error = err;
      }
      await new Promise(r => setTimeout(r, 1800));
      this.match_error = '';
    },
    async setupMatchCbs() {
      this.match.on('match_accepted', (msg) => {
        console.log('match accepted', msg)
        this.match_cbq.push({
          idx: msg.idx,
          arg: msg.user_id,
          fn: async (user_id) => {
            if (user_id === this.$auth.user.user_id) {
              this.matched.status = "accepted";
            }
          }
        })
      })
      this.match.on('match_wagering', (msg) => {
        console.log('match wagering', msg)
        this.match_cbq.push({
          idx: msg.idx,
          arg: null,
          fn: async (_) => {
            this.matched.status = "wagering";
            await this.$router.push("/match/" + this.matched.match_id)
          }
        })
      })
    },
    async getMatchState() {
      this.match.push('get_match')
        .receive('ok', async (msg) => {
          this.match_idx = msg.idx;
        })
        .receive('error', async (msg) => {
          try {
            console.log('error', msg)
            await this.showError(msg.reason)
          } catch {
            await this.showError("something went wrong")
          }
        })
    },
    async joinQueue(type) {
      this.queue.push('join_queue', { type: type })
        .receive('ok', (msg) => {
          // console.log('ok', msg)
        })
        .receive('error', async (msg) => {
          try {
            console.log('error', msg)
            await this.showQueueError(msg.reason)
          } catch {
            await this.showQueueError('queueing failed')
          }
        })
    },
    async leaveQueue(type) {
      this.queue.push('leave_queue', { type: type })
        .receive('ok', (msg) => {
          // console.log('ok', msg)
        })
        .receive('error', async (msg) => {
          try {
            console.log('error', msg)
            await this.showQueueError(msg.reason)
          } catch {
            await this.showQueueError('unqueueing failed')
          }
        })
    },
    async acceptMatch() {
      this.match.push('accept_match', { token: this.$auth.strategy.token.get() })
        .receive('ok', (msg) => {
          // console.log('ok', msg)
        })
        .receive('error', async (msg) => {
          try {
            console.log('error', msg)
            await this.showMatchError(msg.reason)
          } catch {
            await this.showMatchError('accepting match failed')
          }
        })
    },
  },
  async beforeDestroy() {
    this.closed = true;
    while (!this.closed_ack) {
      await new Promise(r => setTimeout(r, 0))
    }
    if (this.queue) {
      this.queue.leave();
      delete this.queue;
    }
    if (this.matches) {
      this.matches.leave();
      delete this.matches;
    }
    if (this.match) {
      this.match.leave();
      delete this.match;
    }
    if (this.socket) {
      this.socket.disconnect();
      delete this.socket;
    }
    this.socket = null;
    this.queue = null;
    this.matches = null;
    this.match = null;
  }
}
</script>
