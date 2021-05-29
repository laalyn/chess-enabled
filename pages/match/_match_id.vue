<!-- TODO selected as another image -->
<!-- TODO drag&drop mode mode -->

<template>
  <div class="absolute left-1/2 transform -translate-x-1/2 h-full" style='width: min(100%, calc(80px * 8 + 26px));'>
    <NuxtLink to='/'>Back</NuxtLink>
    <div v-if='error' class='text-red-600'>
      {{ error }}
    </div>
    <div v-else-if='show'>
      <!-- OVERLAY -->
      <div v-if='match_closed'>
        <h1>THE MATCH IS CLOSED. You {{ won ? (won === "tied" ? "tied with the opponent." : "won!") : "lost." }}</h1>
        <NuxtLink :to='"/summary/" + match_id'>View summary</NuxtLink>
      </div>
      <!-- OVERLAY fin-->

      <!-- OPPONENT'S BAR -->
      <div v-if='running'>
        <div style='padding: 0 0'>
          <div class='inline-block border-2' style='padding: 0.2rem 0.4rem; border-radius: 0.4rem;'>
            <h1 class='text-black'>{{ Math.max(0, Math.min(Math.floor(opponent_time_left / 60), 10)) }}:{{ (Math.floor(opponent_time_left / 60) >= 10 ? 0 : Math.max(0, opponent_time_left % 60)).toString().padStart(2, '0') }}</h1>
          </div>
          <div class='w-full' style='height: 0.4rem; border-width: 1px; margin-top: 0.4rem; margin-bottom: 0.4rem'>
          </div>
        </div>
      </div>
      <div v-else>
        <div v-if='color !== "white"'>
          <div style='padding: 0 0.1rem'>
            <div class='inline-block border-2' style='padding: 0.2rem 0.4rem; border-radius: 0.4rem; box-shadow: 0 0 0.3rem black; border-color: white'>
              <h1 class=''>{{ Math.max(0, Math.min(Math.floor(opponent_time_left / 60), 10)) }}:{{ (Math.floor(opponent_time_left / 60) >= 10 ? 0 : Math.max(0, opponent_time_left % 60)).toString().padStart(2, '0') }}</h1>
            </div>
            <div class='w-full' style='height: 0.4rem; box-shadow: 0 0 0.3rem black; margin-top: 0.4rem; margin-bottom: 0.4rem'>
            </div>
          </div>
        </div>
        <div v-else>
          <div class='inline-block border-2' style='padding: 0.2rem 0.4rem; border-radius: 0.4rem; background-color: dimgray; border-color: white'>
            <h1 class='text-gray-200'>{{ Math.max(0, Math.min(Math.floor(opponent_time_left / 60), 10)) }}:{{ (Math.floor(opponent_time_left / 60) >= 10 ? 0 : Math.max(0, opponent_time_left % 60)).toString().padStart(2, '0') }}</h1>
          </div>
          <div class='w-full' style='height: 0.4rem; background-color: dimgray; margin-top: 0.4rem; margin-bottom: 0.4rem'>
          </div>
        </div>
      </div>
      <!-- OPPONENT'S BAR fin -->

      <!-- BOARD -->
      <div v-if='color === "white"' class='flex'>
        <div class='relative select-none' style='height: auto; color: white; width: 26px; border-width: 4px 0 0 4px'></div>
        <div class="relative select-none" :style='"width: min(calc(100vw / 8 - 26px / 8), 80px); height: 26px; border-width: 4px 2px 0 4px; text-align: center"'><p class='absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2'>A</p></div>
        <div class="relative select-none" :style='"width: min(calc(100vw / 8 - 26px / 8), 80px); height: 26px; border-width: 4px 2px 0 2px; text-align: center"'><p class='absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2'>B</p></div>
        <div class="relative select-none" :style='"width: min(calc(100vw / 8 - 26px / 8), 80px); height: 26px; border-width: 4px 2px 0 2px; text-align: center"'><p class='absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2'>C</p></div>
        <div class="relative select-none" :style='"width: min(calc(100vw / 8 - 26px / 8), 80px); height: 26px; border-width: 4px 2px 0 2px; text-align: center"'><p class='absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2'>D</p></div>
        <div class="relative select-none" :style='"width: min(calc(100vw / 8 - 26px / 8), 80px); height: 26px; border-width: 4px 2px 0 2px; text-align: center"'><p class='absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2'>E</p></div>
        <div class="relative select-none" :style='"width: min(calc(100vw / 8 - 26px / 8), 80px); height: 26px; border-width: 4px 2px 0 2px; text-align: center"'><p class='absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2'>F</p></div>
        <div class="relative select-none" :style='"width: min(calc(100vw / 8 - 26px / 8), 80px); height: 26px; border-width: 4px 2px 0 2px; text-align: center"'><p class='absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2'>G</p></div>
        <div class="relative select-none" :style='"width: min(calc(100vw / 8 - 26px / 8), 80px); height: 26px; border-width: 4px 4px 0 2px; text-align: center"'><p class='absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2'>H</p></div>
      </div>
      <div v-else class='flex'>
        <div class='relative select-none' style='height: auto; color: white; width: 26px; border-width: 4px 0 0 4px'></div>
        <div class="relative select-none" :style='"width: min(calc(100vw / 8 - 26px / 8), 80px); height: 26px; border-width: 4px 2px 0 4px; text-align: center"'><p class='absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2'>H</p></div>
        <div class="relative select-none" :style='"width: min(calc(100vw / 8 - 26px / 8), 80px); height: 26px; border-width: 4px 2px 0 2px; text-align: center"'><p class='absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2'>G</p></div>
        <div class="relative select-none" :style='"width: min(calc(100vw / 8 - 26px / 8), 80px); height: 26px; border-width: 4px 2px 0 2px; text-align: center"'><p class='absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2'>F</p></div>
        <div class="relative select-none" :style='"width: min(calc(100vw / 8 - 26px / 8), 80px); height: 26px; border-width: 4px 2px 0 2px; text-align: center"'><p class='absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2'>E</p></div>
        <div class="relative select-none" :style='"width: min(calc(100vw / 8 - 26px / 8), 80px); height: 26px; border-width: 4px 2px 0 2px; text-align: center"'><p class='absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2'>D</p></div>
        <div class="relative select-none" :style='"width: min(calc(100vw / 8 - 26px / 8), 80px); height: 26px; border-width: 4px 2px 0 2px; text-align: center"'><p class='absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2'>C</p></div>
        <div class="relative select-none" :style='"width: min(calc(100vw / 8 - 26px / 8), 80px); height: 26px; border-width: 4px 2px 0 2px; text-align: center"'><p class='absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2'>B</p></div>
        <div class="relative select-none" :style='"width: min(calc(100vw / 8 - 26px / 8), 80px); height: 26px; border-width: 4px 4px 0 2px; text-align: center"'><p class='absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2'>A</p></div>
      </div>
      <div v-for="i in color === 'white' ? 8 : [8, 7, 6, 5, 4, 3, 2, 1]" class="flex">
        <div v-if='i === (color === "white" ? 1 : 8)'>
          <div class='relative select-none' style='height: min(calc(100vw / 8 - 26px / 8), 80px); width: 26px; border-width: 4px 0 2px 4px'>
            <p class='absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2'>
              {{ ( 8 - i + 1) }}
            </p>
          </div>
        </div>
        <div v-else-if='i === (color === "white" ? 8 : 1)'>
          <div class='relative select-none' style='height: min(calc(100vw / 8 - 26px / 8), 80px); width: 26px; border-width: 2px 0 4px 4px'>
            <p class='absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2'>
              {{ ( 8 - i + 1) }}
            </p>
          </div>
        </div>
        <div v-else>
          <div class='relative select-none' style='height: min(calc(100vw / 8 - 26px / 8), 80px); width: 26px; border-width: 2px 0 2px 4px;'>
            <p class='absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2'>
              {{ ( 8 - i + 1) }}
            </p>
          </div>
        </div>
        <div v-for="j in color === 'white' ? 8 : [8, 7, 6, 5, 4, 3, 2, 1]" @mousedown="action(i - 1, j - 1)" class="relative border-2 select-none" :style='"width: min(calc(100vw / 8 - 26px / 8), 80px); height: min(calc(100vw / 8 - 26px / 8), 80px);" +
          //                                                                                       top rig bot lef
          (i === (color === "white" ? 1 : 8) && j === (color === "white" ? 1 : 8) ? "border-width: 4px 2px 2px 4px;" : // top left
          (i === (color === "white" ? 1 : 8) && j === (color === "white" ? 8 : 1) ? "border-width: 4px 4px 2px 2px;" : // top right
          (i === (color === "white" ? 8 : 1) && j === (color === "white" ? 1 : 8) ? "border-width: 2px 2px 4px 4px;" : // bottom left
          (i === (color === "white" ? 8 : 1) && j === (color === "white" ? 8 : 1) ? "border-width: 2px 4px 4px 2px;" : // bottom right
          (i === (color === "white" ? 1 : 8)                                      ? "border-width: 4px 2px 2px 2px;" : // no edge top
          (i === (color === "white" ? 8 : 1)                                      ? "border-width: 2px 2px 4px 2px;" : // no edge bottom
          (                                     j === (color === "white" ? 1 : 8) ? "border-width: 2px 2px 2px 4px;" : // no edge left
          (                                     j === (color === "white" ? 8 : 1) ? "border-width: 2px 4px 2px 2px;" : // no edge right
                                                                                    "border-width: 2px 2px 2px 2px;" ) // default
          )))))))
        '>
          <div v-if='board[i - 1][j - 1].type !== "none"'>
            <div v-on:drop='drop($event, i, j)' v-on:dragover='allowDrop($event)'>
              <img :src='"/chess/" + board[i - 1][j - 1].type + ".svg"' :id="parse(i - 1, j - 1)" width='100%' height='100%' draggable='true' v-on:dragstart='drag($event, i, j)' :alt='board[i - 1][j - 1].type === "none" ? "" : board[i - 1][j - 1].type.replace("/_/g", " ")'>
            </div>
          </div>
        </div>
      </div>
      <!-- BOARD fin -->

      <!-- YOUR BAR -->
      <div v-if='!running'>
        <div style='padding: 0 0'>
          <div class='w-full' style='height: 0.4rem; border-width: 1px; margin-top: 0.4rem; margin-bottom: 0.4rem'>
          </div>
          <div class='inline-block float-right border-2' style='padding: 0.2rem 0.4rem; border-radius: 0.4rem;'>
            <h1 class='text-black'>{{ Math.max(0, Math.min(Math.floor(time_left / 60), 10)) }}:{{ (Math.floor(time_left / 60) >= 10 ? 0 : Math.max(0, time_left % 60)).toString().padStart(2, '0') }}</h1>
          </div>
        </div>
      </div>
      <div v-else>
        <div v-if='color === "white"'>
          <div style='padding: 0 0.1rem'>
            <div class='w-full' style='height: 0.4rem; box-shadow: 0 0 0.3rem black; margin-top: 0.4rem; margin-bottom: 0.4rem'>
            </div>
            <div class='float-right inline-block border-2' style='padding: 0.2rem 0.4rem; border-radius: 0.4rem; box-shadow: 0 0 0.3rem black; border-color: white'>
              <h1 class=''>{{ Math.max(0, Math.min(Math.floor(time_left / 60), 10)) }}:{{ (Math.floor(time_left / 60) >= 10 ? 0 : Math.max(0, time_left % 60)).toString().padStart(2, '0') }}</h1>
            </div>
          </div>
        </div>
        <div v-else>
          <div class='w-full' style='height: 0.4rem; background-color: dimgray; margin-top: 0.4rem; margin-bottom: 0.4rem'>
          </div>
          <div class='float-right inline-block border-2 text-gray-200' style='padding: 0.2rem 0.4rem; border-radius: 0.4rem; background-color: dimgrey; border-color: white'>
            <h1 class=''>{{ Math.max(0, Math.min(Math.floor(time_left / 60), 10)) }}:{{ (Math.floor(time_left / 60) >= 10 ? 0 : Math.max(0, time_left % 60)).toString().padStart(2, '0') }}</h1>
          </div>
        </div>
      </div>
      <!-- YOUR BAR fin -->

      <div v-if='submit_error'>
        <h1 class="text-red-600" style='margin-left: 0.2rem'>{{ submit_error.message }}</h1>
      </div>
    </div>
  </div>
</template>

<script>
import { Socket } from 'phoenix/assets/js/phoenix.js';
import { server } from '@/server';
import { codes } from '@/codes';
import * as UUID from 'uuid';
import alanBtn from '@alan-ai/alan-sdk-web';

export default {
  async asyncData({ params }) {
    const match_id = params.match_id;
    return { match_id }
  },
  data() {
    return {
      closed: false,
      closed_ack: false,
      socket: null,
      match: null,
      time: null,
      match_cbq: [],
      joined_match: false,
      joined_time: false,
      match_got_state: false,
      time_got_state: false,
      got_state: false,
      grabbing_state: false,
      match_idx: null,
      // match result start
      board: null,
      time_spent: null,
      running: false,
      time_left: null,
      opponent_time_spent: null,
      opponent_running: false,
      opponent_time_left: null,
      color: '',
      match_closed: false, // only on event, not state
      // match result fin
      // match mechanics start
      selected: 'none',
      selected_val: '',
      submitted: 'none',
      submitted_val: '',
      block: false,
      won: null,
      // match mechanics fin
      sending_close: false,
      retry_close: false,
      time_offset: null,
      time_offsets: [],
      error: '',
      error_pending: false,
      submit_error: '',
      show: false,
      alan: null,
      alan_lock: false,
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
      this.joined_match = false;
      this.joined_time = false;
      this.got_state = false;
      this.grabbing_state = false;
      this.match_got_state = false;
      this.time_got_state = false;
      this.time_offsets = [];
      this.block = false;
      if (this.submitted !== 'none') {
        this.selected = 'none';
        this.selected_val = '';
        this.submitted = 'none';
        this.submitted_val = '';
      }
      await new Promise(r => setTimeout(r, 3600))
      if (this.error_pending) {
        this.error = "network error";
      }
    })
    this.socket.connect()

    this.match = this.socket.channel('match:' + this.match_id)
    this.match.on('sent_move', async (msg) => {
      console.log('sent move', msg)
      this.match_cbq.push({
        idx: msg.idx,
        arg: msg.move,
        fn: async (move) => {
          if (move.user_id === this.$auth.user.user_id) {
            this.running = false;
            this.time_spent = move.time_spent;
            this.opponent_running = Date.parse(move.running.toString())
          } else {
            this.opponent_running = false;
            this.opponent_time_spent = move.time_spent;
            this.running = Date.parse(move.running.toString())
          }
          if (this.submitted === 'none') {
            this.board[move.to_r][move.to_c] = this.board[move.from_r][move.from_c]
            this.board[move.from_r][move.from_c] = { id: null, user_id: null, type: 'none' };
            this.$forceUpdate()
          } else {
            // document.getElementById(this.submitted).style.color = 'black';
            this.selected = 'none';
            this.selected_val = '';
            this.submitted = 'none';
            this.submitted_val = '';
            this.block = false;
          }
          if (this.selected === this.parse(move.to_r, move.to_c)) {
            this.selected = 'none';
          }
        }
      })
    })
    this.match.on('match_closed_with_move', async (msg) => {
      console.log('match closed with move', msg)
      this.match_cbq.push({
        idx: msg.idx,
        arg: msg.move,
        fn: async (move) => {
          if (move.user_id === this.$auth.user.user_id) {
            this.running = false;
            this.time_spent = move.time_spent;
            this.opponent_running = Date.parse(move.running.toString())
            this.won = true;
          } else {
            this.opponent_running = false;
            this.opponent_time_spent = move.time_spent;
            this.running = Date.parse(move.running.toString())
            this.won = false;
          }
          if (this.submitted === 'none') {
            this.board[move.to_r][move.to_c] = this.board[move.from_r][move.from_c]
            this.board[move.from_r][move.from_c] = { id: null, user_id: null, type: 'none' };
            this.$forceUpdate()
          } else {
            document.getElementById(this.submitted).style.color = 'black';
            this.selected = 'none';
            this.selected_val = '';
            this.submitted = 'none';
            this.submitted_val = '';
            this.block = false;
          }
          this.match_closed = true;
        }
      })
    })
    this.match.on('match_closed', async (msg) => {
      console.log('match closed', msg)
      this.match_cbq.push({
        idx: msg.idx,
        arg: null,
        fn: async (_) => {
          if (this.sending_close === "both" || this.sending_close === "myself") {
            this.time_left = 0;
            this.won = false;
          }
          if (this.sending_close === "both" || this.sending_close === "opponent") {
            this.opponent_time_left = 0;
            this.won = true;
          }
          if (this.sending_close === "both") {
            this.won = "tied"
          }
          this.match_closed = true;
          this.sending_close = false;
        }
      })
    })
    this.match.join()
      .receive('ok', async (msg) => {
        console.log('joined match:' + this.match_id)
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

    console.log(" === opening alan === ")
    if (this.alan) {
      this.alan.remove()
      delete this.alan;
    }
    this.alan = null;
    this.alan = alanBtn({
      key: 'a1c5ea949c8258cd81301b0f1d4563cb2e956eca572e1d8b807a3e2338fdd0dc/stage',
      onCommand: (commandData) => {
        let cmd = commandData.command.split("=>")[0].trim()
        console.log(commandData.command)
        let pld = JSON.parse(commandData.command.split("=>")[1])
        switch (cmd) {
          case ":exact_move": {
            this.alan_lock = true;
            this.selected = 'none';
            this.selected_val = '';
            this.submitted = 'none';
            this.submitted_val = '';
            // do not allow not-turn
            if (!this.running) {
              this.hotSpeak("it is not your turn")
              return;
            }
            if (JSON.stringify(pld.from) === JSON.stringify(pld.to)) {
              this.hotSpeak("you cannot move to yourself")
              return;
            }
            let x = pld.from.letter.charCodeAt(0) - 65 + 1;
            let y = pld.from.number
            y = 8 - y + 1;
            this.action(y - 1, x - 1, true)
            x = pld.to.letter.charCodeAt(0) - 65 + 1;
            y = pld.to.number
            y = 8 - y + 1;
            this.action(y - 1, x - 1, true)
            this.alan_lock = false;
            this.alan_open = true;
          break }

          case ":fuzzy_move_add": {
          break }
        }
      },
      onConnectionStatus: (status) => {
        console.log('==============', status)
      },
    });

    // p100 poller
    while (!this.closed) {
      if (this.got_state && this.match_cbq.length) {
        let cb = this.match_cbq.shift()
        if (cb.idx > this.match_idx) {
          await cb.fn(cb.arg)
        }
      }
      if (!this.match_closed && (this.running || this.opponent_running) && (!this.sending_close || this.retry_close)) {
        let time_spent = this.time_spent; // us
        let opponent_time_spent = this.opponent_time_spent;
        if (this.running) {
          let prev = this.running
          let cur = Date.parse((new Date()).toString()) + this.time_offset;
          let diff = cur - prev // ms
          time_spent += diff * 1000;
        } else {
          let prev = this.opponent_running
          let cur = Date.parse((new Date()).toString()) + this.time_offset;
          let diff = cur - prev // ms
          opponent_time_spent += diff * 1000;
        }

        let time_spent_secs = Math.floor(time_spent / 1_000_000) // seconds
        let opponent_time_spent_secs = Math.floor(opponent_time_spent / 1_000_000)
        this.time_left = 10 * 60 - time_spent_secs;
        this.opponent_time_left = 10 * 60 - opponent_time_spent_secs;

        let time_spent_mins = Math.floor(time_spent_secs / 60); // minutes
        let opponent_time_spent_mins = Math.floor(opponent_time_spent_secs / 60);
        if (this.got_state && time_spent_mins >= 10 || opponent_time_spent_mins >= 10) {
          if (Math.floor(Math.abs(time_spent - opponent_time_spent) / 1000) < 1) {
            this.sending_close = "both"
          } else if (time_spent > opponent_time_spent) {
            this.sending_close = "myself"
          } else {
            this.sending_close = "opponent"
          }
          this.retry_close = false;
          this.match.push('close_match')
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
                  console.log('retrying close_match...')
                  this.retry_close = true;
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
      if (this.joined_match && this.joined_time && !this.got_state && !this.grabbing_state) {
        this.grabbing_state = true;
        this.match.push('get_match')
          .receive('ok', async (msg) => {
            console.log('got match', msg)
            this.match_idx = msg.idx;
            // clear the board
            this.board = [
              [{ id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }],
              [{ id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }],
              [{ id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }],
              [{ id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }],
              [{ id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }],
              [{ id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }],
              [{ id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }],
              [{ id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }, { id: null, user_id: null, type: 'none' }],
            ];
            // go through players and set data
            for (let key of Object.keys(msg.match.players)) {
              if (key === this.$auth.user.user_id) {
                // me
                if (msg.match.players[key].running) {
                  this.running = Date.parse(msg.match.players[key].running.toString());
                } else {
                  this.running = msg.match.players[key].running;
                }
                this.time_spent = msg.match.players[key].time_spent;
                // set color
                this.color = msg.match.players[key].color;
              } else {
                // opponent
                if (msg.match.players[key].running) {
                  this.opponent_running = Date.parse(msg.match.players[key].running.toString());
                } else {
                  this.opponent_running = msg.match.players[key].running;
                }
                this.opponent_time_spent = msg.match.players[key].time_spent;
              }
            }
            // set the pieces
            for (let piece of msg.match.pieces) {
              this.board[piece.row][piece.col] = { id: piece.id, user_id: piece.user_id, type: (piece.user_id === this.$auth.user.user_id ? (this.color === 'white' ? 'white' : 'black') : (this.color === 'white' ? 'black' : 'white')) + '_' + piece.type }
            }
            // unselect if shouldn't select
            if (this.selected !== 'none') {
              let fr = this.unparse(this.selected)
              if (this.board[fr.r][fr.c].id === null) {
                this.selected = 'none';
                this.selected_val = '';
              }
            }
            this.match_got_state = true;
          })
          .receive('error', async (msg) => {
            try {
              // TODO if match closed, redirect to match finish page (http instead of sockets now)
              console.log('error', msg)
              if (msg.reason === codes.closed) {
                await this.$router.replace('/summary/' + this.match_id)
              }
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
                this.time_offset = this.time_offsets[Math.floor(this.time_offsets.length / 2)]
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
      if (this.match_got_state && this.time_got_state) {
        this.error = '';
        this.error_pending = false;
        this.got_state = true;
        this.grabbing_state = false;
        this.show = true;
      }
      await new Promise(r => setTimeout(r, 0))
    }
    this.closed_ack = true;
  },
  methods: {
    allowDrop(event) {
      event.preventDefault()
    },
    async drop(event, i, j) {
      event.preventDefault()
      return;
      await this.action(i - 1, j - 1)
    },
    async drag(event, i, j) {
      event.dataTransfer.setData("from", event.target.id)
      return;
      await this.action(i - 1, j - 1)
    },
    async showError(err) {
      if (err === undefined) {
        this.error = 'something went wrong'
      } else {
        this.error = err;
      }
    },
    async showSubmitError(err) {
      let expected_uuid = UUID.v4()
      if (err === undefined) {
        this.submit_error = { id: expected_uuid, message: 'something went wrong' }
      } else {
        this.submit_error = { id: expected_uuid, message: err }
      }
      await new Promise(r => setTimeout(r, 1800))
      if (this.submit_error.id === expected_uuid) {
        this.submit_error = false;
      }
    },
    async hotSpeak(message) {
      this.alan.callProjectApi("hotSpeak", { message: message }, (error, result) => {
        if (error) {
          console.log('error', error)
        }
      })
    },
    async action(i, j, by_alan = false) {
      if (this.block || (this.alan_lock && !by_alan) || this.closed || (this.selected === 'none' && this.board[i][j].type.split("_")[0] !== this.color)) {
        return;
      }
      if (this.selected === 'none') {
        if (this.board[i][j].id === null) {
          return;
        }
        this.selected = this.parse(i, j);
        document.getElementById(this.parse(i, j)).src = "/chess/" + this.board[i][j].type.split("_")[1] + "_selected.svg"
        document.getElementById(this.parse(i, j)).alt = this.board[i][j].type.replace("/_/g", " ") + " selected";
      } else if (this.selected === this.parse(i, j)) {
        this.selected = 'none';
        document.getElementById(this.parse(i, j)).src = "/chess/" + this.board[i][j].type + ".svg";
        document.getElementById(this.parse(i, j)).alt = this.board[i][j].type.replace("/_/g", " ");
      } else {
        if (!this.running) {
          return;
        }
        this.error = false;
        this.block = true;
        let fr = this.unparse(this.selected);
        let piece_id = this.board[fr.r][fr.c].id;
        this.selected_val = this.board[fr.r][fr.c];
        this.submitted_val = this.board[i][j];
        // document.getElementById(this.parse(i, j)).style.color = 'grey';
        this.board[i][j] = this.board[fr.r][fr.c];
        this.board[fr.r][fr.c] = { id: null, user_id: null, type: 'none' };
        this.$forceUpdate();
        // document.getElementById(this.selected).style.color = 'black';
        this.submitted = this.parse(i, j);
        this.match.push('send_move', { token: this.$auth.strategy.token.get(), id: piece_id, to_r: i, to_c: j })
          .receive('ok', (msg) => {
            // console.log('ok', msg)
            this.alan_open = false;
          })
          .receive('error', async (msg) => {
            try {
              if (this.submitted === 'none') {
                return;
              }
              let selected = this.unparse(this.selected);
              let submitted = this.unparse(this.submitted);
              this.board[selected.r][selected.c] = this.selected_val;
              this.board[submitted.r][submitted.c] = this.submitted_val;
              // document.getElementById(this.selected).src = "/chess/" + this.board[i][j].type + ".svg";
              // document.getElementById(this.selected).alt = this.board[i][j].type.replace("/_/g", " ");
              this.$forceUpdate();
              this.selected = 'none';
              this.submitted = 'none';
              this.block = false;
              let p1 = this.showSubmitError(msg.reason)
              if (this.alan_open) {
                await Promise.all([p1, this.hotSpeak(msg.reason)])
              } else {
                await p1;
              }
              this.alan_open = false;
            } catch {
              await this.showSubmitError('sending move failed')
            }
          })
      }
    },
    parse(i, j) {
      return i.toString() + '.' + j.toString();
    },
    unparse(s) {
      return { r: parseInt(s.charAt(0)), c: parseInt(s.charAt(2)) };
    },
  },
  async beforeDestroy() {
    this.closed = true;
    while (!this.closed_ack) {
      await new Promise(r => setTimeout(r, 0))
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
      this.alan.remove();
      delete this.alan;
    }
    this.alan = null;
    this.socket = null;
    this.match = null;
    this.time = null;
    this.time_offsets = [];
    console.log('destroyed')
  }
}
</script>
