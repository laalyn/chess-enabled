<template>
  <div class='absolute left-1/2 transform -translate-x-1/2 h-full' style='width: min(100%, calc(80px * 8 + 26px));'>
    <div class='absolute right-0'>
      <i class="fas fa-sign-out-alt cursor-pointer hover:text-red-600 transition-colors delay-75 duration-300 ease-in-out" @click='logout()' style='font-size: 1.5rem; margin-top: 0.5rem; margin-right: 0.6rem'></i>
    </div>
    <div v-if='error' class='text-red-600 relative' style='top: 1.7rem; left: 0.2rem'>
      {{ error }}
    </div>
    <div v-else-if='show' class='relative' style='top: 1.7rem'>
      <h1 class='text-3xl' style='margin-left: 0.9rem'>Welcome to Chess Enabled</h1>
      <div class='inline-block bg-yellow-500' style='margin-left: 1rem; margin-top: 1rem; padding: 0.8rem 1rem; border-radius: 0.6rem'>
        <i class="fas fa-trophy inline-block" style='font-size: 2rem'></i>
        <h1 class='text-3xl inline-block'>{{ elo }}</h1>
        <p class='text-lg inline-block' style='transform: translateY(-0.1rem)'>{{ wins < 10 ? "Elo" : "Elo" }}</p>
      </div>
      <div class='inline-block bg-blue-500' style='margin: 0 1rem; margin-top: 1rem; padding: 0.8rem 1rem; border-radius: 0.6rem'>
        <i class="fas fa-star inline-block" style='font-size: 2rem'></i>
        <h1 class='text-3xl inline-block'>{{ wins }}</h1>
        <p class='text-lg inline-block' style='transform: translateY(-0.1rem)'>Win{{ (10 - wins) === 1 ? "" : "s" }}</p>
      </div>
      <div v-if='matched'>
        <div v-if='match_error' class='text-red-600' style='margin-top: 1.1rem; margin-left: 1.5rem'>
          {{ match_error }}
        </div>
        <div v-else>
          <div v-if='matched.status === "accepted"'>
            <div class='inline-block bg-indigo-400 hover:bg-indigo-400 transition-colors delay-75 duration-300 ease-in-out' style='margin-left: 1.5rem; margin-top: 1.1rem; padding: 0.6rem 1rem; border-radius: 0.4rem'>
              <i class='fas fa-hourglass inline-block' style='font-size: 1.1rem'></i>
              <h1 class='text-lg inline-block'>Waiting ({{ Math.max(0, Math.min(30, matched_countdown)) }} seconds)</h1>
            </div>
          </div>
          <div v-else-if='matched.status === "pending"'>
            <div @click='acceptMatch()' class='inline-block cursor-pointer bg-yellow-400 hover:bg-yellow-500 transition-colors delay-75 duration-300 ease-in-out' style='margin-left: 1.5rem; margin-top: 1.1rem; padding: 0.6rem 1rem; border-radius: 0.4rem'>
              <i class='fas fa-exclamation inline-block' style='font-size: 1.1rem'></i>
              <h1 class='text-lg inline-block'>Accept ({{ Math.max(0, Math.min(30, matched_countdown)) }} seconds)</h1>
            </div>
          </div>
          <div v-else>
            <div @click='$router.push("/match/" + matched.match_id)' class='inline-block cursor-pointer bg-purple-400 hover:bg-purple-500 transition-colors delay-75 duration-300 ease-in-out' style='margin-left: 1.5rem; margin-top: 1.1rem; padding: 0.6rem 1rem; border-radius: 0.4rem'>
              <NuxtLink :to='"/match/" + matched.match_id'>
                <i class='fas fa-door-open inline-block' style='font-size: 1.1rem'></i>
                <h1 class='text-lg inline-block'>Enter match</h1>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div v-if='queue_error' class='text-red-600' style='margin-top: 1.1rem; margin-left: 1.5rem'>
          {{ queue_error }}
        </div>
        <div v-else>
          <div v-if='queued === true'>
            <div @click='leaveQueue("chess")' class='inline-block cursor-pointer bg-red-500 hover:bg-red-600 transition-colors delay-75 duration-300 ease-in-out' style='margin-left: 1.5rem; margin-top: 1.1rem; padding: 0.6rem 1rem; border-radius: 0.4rem'>
              <i class='fas fa-clock inline-block' style='font-size: 1.1rem'></i>
              <h1 class='text-lg inline-block'>Finding opponents</h1>
            </div>
          </div>
          <div v-else-if='queued === false'>
            <div @click='joinQueue("chess")' class='inline-block cursor-pointer bg-green-400 hover:bg-green-500 transition-colors delay-75 duration-300 ease-in-out' style='margin-left: 1.5rem; margin-top: 1.1rem; padding: 0.6rem 1rem; border-radius: 0.4rem'>
              <i class='fas fa-play inline-block' style='font-size: 1.1rem'></i>
              <h1 class='text-lg inline-block'>Play chess</h1>
            </div>
          </div>
        </div>
      </div>
    <div class='alan-btn'></div>
  </div>
</template>

<script>
import { Socket } from 'phoenix/assets/js/phoenix.js';
import { server } from '@/server';
import { codes } from '@/codes';
import alanBtn from '@alan-ai/alan-sdk-web';

export default {
  data() {
    return {
      closed: false, // everything will shut down when this is true
      closed_ack: false,
      closed_ack_accepting_match: false,
      socket: null,
      queue: null,
      matches: null,
      match: null,
      time: null,
      queue_cbq: [],
      matches_cbq: [],
      match_cbq: [],
      joined_queue: false, // state grabber will only run when this and below are true
      joined_matches: false,
      joined_match: false, // important! match does not grab state, it is from matches
      joined_time: false,
      queue_got_state: false,
      matches_got_state: false,
      time_got_state: false,
      got_state: false, // .on callbacks will only run in the queue when this is true
      grabbing_state: false,
      queue_idx: null,
      matches_idx: null,
      match_idx: null,
      queued: null,
      matched: false,
      matched_go: false,
      matched_countdown: null,
      matches_result: [],
      elo: null,
      wins: null,
      sending_clear: false,
      retry_clear: false,
      time_offset: null,
      time_offsets: [],
      error: '',
      error_pending: false,
      queue_error: '',
      match_error: '',
      show: false,
      alan: null,
      alan_open: false,
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
      this.joined_time = false;
      this.got_state = false;
      this.grabbing_state = false;
      this.queue_got_state = false;
      this.matches_got_state = false;
      this.time_got_state = false;
      this.time_offsets = [];
      if (this.match) {
        this.match.leave()
        delete this.match;
      }
      this.match = null;
      this.alan_open = false;
      await new Promise(r => setTimeout(r, 3600))
      if (this.error_pending) {
        this.error = "network error";
        this.matched_go = false;
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
          this.match_idx = match.idx;
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

    console.log(" === opening alan === ")
    if (this.alan) {
      this.alan.remove()
      delete this.alan;
    }
    this.alan = null;
    this.alan = alanBtn({
      key: 'a04d8b623a187cea81301b0f1d4563cb2e956eca572e1d8b807a3e2338fdd0dc/stage',
      onCommand: (commandData) => {
        let cmd = commandData.command.split("=>")[0].trim()
        console.log(commandData.command)
        let pld = JSON.parse(commandData.command.split("=>")[1])
        switch (cmd) {
          case ":queue_chess": {
            this.alan_open = true;
            this.joinQueue("chess");
          break }

          case ":unqueue_chess": {
            this.alan_open = true;
            this.leaveQueue("chess");
          break }

          case ":accept_match": {
            if (!this.matched) {
              this.hotSpeak("there is no match to accept")
              return;
            }
            this.alan_open = true;
            this.acceptMatch()
          break }

          case ":enter_match": {
            if (!this.matched) {
              this.hotSpeak("there is no match to enter")
              return;
            }
            this.$router.push("/match/" + this.matched.match_id)
          }
        }
      },
      rootEl: document.getElementById('alan-btn'),
    });

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
    this.matches.on('match_closed', async (msg) => {
      console.log('match closed', msg)
      this.matches_cbq.push({
        idx: msg.idx,
        arg: msg.match,
        fn: async (match) => {
          // TODO insert to beginning of matches_result
          if (this.matched.match_id === match.match_id) {
            this.elo += match.elo_delta;
            if (match.status === "won") {
              this.wins++;
            }
            this.matched = false;
            if (this.match) {
              this.match.leave()
              delete this.match
            }
            this.match = null;
          }
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

    this.time = this.socket.channel('time:lobby')
    this.time.join()
      .receive('ok', async (msg) => {
        console.log('joined time:lobby')
        this.joined_time = true;
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
      if (this.matched && (!this.sending_clear || this.retry_clear)) {
        if (this.matched.status === "pending" || this.matched.status === "accepted") {
          let prev = Date.parse(this.matched.inserted_at);
          let cur = Date.parse((new Date()).toString()) + this.time_offset;
          let diff = Math.floor((cur - prev) / 1000)
          this.matched_countdown = 30 - diff;
          if (this.got_state && diff >= 30) {
            // send claim to clear match
            this.sending_clear = true;
            this.retry_clear = false;
            this.match.push('clear_match', { token: this.$auth.strategy.token.get() })
              .receive('ok', (msg) => {
                // console.log('ok', msg)
              })
              .receive('error', async (msg) => {
                try {
                  if (
                    msg.reason === codes.nonexistent ||
                    msg.reason === codes.moved_on
                  ) {
                    // noop
                  } else if (
                    msg.reason === codes.too_early
                  ) {
                    // retry
                    console.log('retrying clear_match...')
                    this.retry_clear = true;
                  } else {
                    console.log('error', msg)
                    await this.showError(msg.reason)
                  }
                } catch {
                  await this.showError("something went wrong")
                }
              })
          }
        }
        this.matched_go = true;
      }
      if (this.joined_queue && this.joined_matches && this.joined_time && !this.got_state && !this.grabbing_state) {
        this.grabbing_state = true;
        this.queue.push("list_queued")
          .receive('ok', async (msg) => {
            console.log('got queued', msg)
            this.queued = !!msg.queued.length
            this.queue_idx = msg.idx
            this.queue_got_state = true;
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
            this.elo = msg.matches.elo;
            this.wins = msg.matches.wins;
            if (msg.matches.list.length && !msg.matches.list[0].closed) {
              this.matched = msg.matches.list[0];
              this.match_idx = msg.matches.list[0].idx;
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
            } else {
              this.matched = false;
            }
            // TODO rename to something nicer (matches_list ??)
            this.matches_result = msg.matches.list;
            this.matches_result.shift();
            this.matches_idx = msg.idx
            this.matches_got_state = true;
          })
          .receive('error', async (msg) => {
            try {
              console.log('error', msg)
              await this.showError(msg.reason)
            } catch {
              await this.showError("something went wrong")
            }
          })
        for (let i = 0; i < 3; i++) {
          this.time.push('cur_time')
            .receive('ok', async (msg) => {
              let local_cur = Date.parse((new Date()).toString())
              let server_cur = Date.parse(msg.timestamp)
              this.time_offsets.push(server_cur - local_cur);
              if (this.time_offsets.length >= 3) {
                this.time_offsets.sort((n1, n2) => {
                  return n1 - n2;
                })
                console.log(this.time_offsets)
                this.time_offset = this.time_offsets[Math.ceil(this.time_offsets.length / 2)]
                console.log('time offset median ' + this.time_offset)
                this.time_got_state = true;
              }
            })
            .receive('error', async (msg) => {
              try {
                console.log('error', msg)
                await this.showError(msg.reason)
              } catch {
                await this.showError("something went wrong")
              }
            })
        }
      }
      if (this.queue_got_state && this.matches_got_state && this.time_got_state) {
        this.error = "";
        this.error_pending = false;
        this.got_state = true;
        this.grabbing_state = false;
        this.show = true; // only set to true once and that's it, never changed again
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
    async hotSpeak(message) {
      this.alan.callProjectApi("hotSpeak", { message: message }, (error, result) => {
        if (error) {
          console.log('error', error)
        }
      })
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
      this.match.on('match_open', (msg) => {
        console.log('match open', msg)
        this.match_cbq.push({
          idx: msg.idx,
          arg: null,
          fn: async (_) => {
            // this.matched.status = "open";
            await this.$router.push("/match/" + this.matched.match_id)
          }
        })
      })
    },
    async joinQueue(type) {
      this.queue.push('join_queue', { type: type })
        .receive('ok', (msg) => {
          // console.log('ok', msg)
          this.alan_open = false;
        })
        .receive('error', async (msg) => {
          try {
            console.log('error', msg)
            let p1 = this.showQueueError(msg.reason)
            if (this.alan_open) {
              await Promise.all([p1, this.hotSpeak(msg.reason)])
            } else {
              await p1;
            }
            this.alan_open = false;
          } catch {
            await this.showQueueError('queueing failed')
          }
        })
    },
    async leaveQueue(type) {
      this.queue.push('leave_queue', { type: type })
        .receive('ok', (msg) => {
          // console.log('ok', msg)
          this.alan_open = false;
        })
        .receive('error', async (msg) => {
          try {
            console.log('error', msg)
            let p1 = this.showQueueError(msg.reason)
            if (this.alan_open) {
              await Promise.all([p1, this.hotSpeak(msg.reason)])
            } else {
              await p1;
            }
            this.alan_open = false;
          } catch {
            await this.showQueueError('unqueueing failed')
          }
        })
    },
    async acceptMatch() {
      this.accepting_match = true;
      this.closed_ack_accepting_match = false;
      while (!this.got_state && !this.closed) {
        await new Promise(r => setTimeout(r, 0))
      }
      this.closed_ack_accepting_match = true;
      this.accepting_match = false;
      if (this.match) {
        this.match.push('accept_match', { token: this.$auth.strategy.token.get() })
          .receive('ok', (msg) => {
            // console.log('ok', msg)
            this.alan_open = false;
          })
          .receive('error', async (msg) => {
            try {
              console.log('error', msg)
              let p1 = this.showMatchError(msg.reason)
              if (this.alan_open) {
                await Promise.all([p1, this.hotSpeak(msg.reason)])
              } else {
                await p1;
              }
              this.alan_open = false;
            } catch {
              await this.showMatchError('accepting match failed')
            }
          })
      }
    },
    async logout() {
      await this.$auth.logout()
      await this.$router.push('/logged-out')
    },
  },
  async beforeDestroy() {
    this.closed = true;
    while (!this.closed_ack || (this.accepting_match && !this.closed_ack_accepting_match)) {
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
    if (this.time) {
      this.time.leave();
      delete this.time;
    }
    if (this.socket) {
      this.socket.disconnect();
      delete this.socket;
    }
    if (this.alan) {
      // TODO wait until alan connection status update ???
      this.alan.deactivate()
      this.alan.stop();
      this.alan.remove();
      delete this.alan;
    }
    this.alan = null;
    this.socket = null;
    this.queue = null;
    this.matches = null;
    this.match = null;
    this.time = null;
    this.time_offsets = [];
    console.log('destroyed')
  }
}
</script>
