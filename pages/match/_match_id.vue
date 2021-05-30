<!-- TODO drag&drop mode mode -->
<!-- TODO don't use string splitting, but check id -->

<template>
  <div class="absolute left-1/2 transform -translate-x-1/2 h-full" style='width: min(100%, calc(80px * 8 + 26px));'>
    <NuxtLink to='/'><i class="fas fa-long-arrow-alt-left cursor-pointer hover:text-blue-500 transition-colors delay-75 duration-300 ease-in-out" style='font-size: 1.4rem; margin-top: 0.8rem; margin-left: 0.6rem'></i></NuxtLink>
    <h1 class='absolute top-0 text-2xl left-1/2 transform -translate-x-1/2' style='margin-top: 0.4rem'>Chess match</h1>
    <div v-if='error' class='text-red-600'>
      {{ error }}
    </div>
    <div v-else-if='show' class='relative' style='margin-top: 0.2rem'>
      <!-- OVERLAY -->
      <div v-if='match_closed' class='absolute bg-white left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10' style='padding: 0.8rem 1.2rem; border-radius: 0.6rem; box-shadow: 0 0 0.9rem rgba(0, 0, 0, 0.5);'>
        <h1 class='text-3xl'>You {{ won ? (won === "tied" ? "tied." : "won!") : "lost." }}</h1>
        <div @click='$router.push("/")' class='inline-block cursor-pointer bg-blue-400 hover:bg-blue-500 transition-colors delay-75 duration-300 ease-in-out' style='margin-top: 0.8rem; padding: 0.6rem 1rem; border-radius: 0.4rem'>
          <NuxtLink to='/'>
            <i class='fas fa-door-closed inline-block' style='font-size: 1.1rem'></i>
            <h1 class='text-lg inline-block'>Back home</h1>
          </NuxtLink>
        </div>
      </div>
      <!-- OVERLAY fin-->

      <!-- OPPONENT'S BAR -->
      <div v-if='running'>
        <div class=' transition delay-75 duration-300 ease-in-out' style='padding: 0 0'>
          <div class='inline-block border-2' style='padding: 0.2rem 0.4rem; border-radius: 0.4rem;'>
            <h1 class='text-black text-lg'>{{ Math.max(0, Math.min(Math.floor(opponent_time_left / 60), 15)) }}:{{ (Math.floor(opponent_time_left / 60) >= 15 ? 0 : Math.max(0, opponent_time_left % 60)).toString().padStart(2, '0') }}</h1>
          </div>
          <div class='w-full border-2' style='height: 0.4rem; margin-top: 0.4rem; margin-bottom: 0.4rem; border-radius: 0.2rem'>
          </div>
        </div>
      </div>
      <div v-else>
        <div v-if='color !== "white"'>
          <div class=' transition delay-75 duration-300 ease-in-out' style='padding: 0 0.1rem'>
            <div class='inline-block border-2' style='padding: 0.2rem 0.4rem; border-radius: 0.4rem; box-shadow: 0 0 0.3rem black; border-color: white'>
              <h1 class='text-lg'>{{ Math.max(0, Math.min(Math.floor(opponent_time_left / 60), 15)) }}:{{ (Math.floor(opponent_time_left / 60) >= 15 ? 0 : Math.max(0, opponent_time_left % 60)).toString().padStart(2, '0') }}</h1>
            </div>
            <div class='w-full' style='height: 0.4rem; box-shadow: 0 0 0.3rem black; margin-top: 0.4rem; margin-bottom: 0.4rem; border-radius: 0.2rem'>
            </div>
          </div>
        </div>
        <div v-else class=' transition delay-75 duration-300 ease-in-out'>
          <div class='inline-block border-2' style='padding: 0.2rem 0.4rem; border-radius: 0.4rem; background-color: dimgray; border-color: white'>
            <h1 class='text-gray-200 text-lg'>{{ Math.max(0, Math.min(Math.floor(opponent_time_left / 60), 15)) }}:{{ (Math.floor(opponent_time_left / 60) >= 15 ? 0 : Math.max(0, opponent_time_left % 60)).toString().padStart(2, '0') }}</h1>
          </div>
          <div class='w-full' style='height: 0.4rem; background-color: dimgray; margin-top: 0.4rem; margin-bottom: 0.4rem; border-radius: 0.2rem'>
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
        <div class=' transition delay-75 duration-300 ease-in-out' style='padding: 0 0'>
          <div class='w-full border-2' style='height: 0.4rem; margin-top: 0.4rem; margin-bottom: 0.4rem; border-radius: 0.2rem'>
          </div>
          <div class='inline-block float-right border-2' style='padding: 0.2rem 0.4rem; border-radius: 0.4rem;'>
            <h1 class='text-black text-lg'>{{ Math.max(0, Math.min(Math.floor(time_left / 60), 15)) }}:{{ (Math.floor(time_left / 60) >= 15 ? 0 : Math.max(0, time_left % 60)).toString().padStart(2, '0') }}</h1>
          </div>
        </div>
      </div>
      <div v-else>
        <div v-if='color === "white"'>
          <div class=' transition delay-75 duration-300 ease-in-out' style='padding: 0 0.1rem'>
            <div class='w-full' style='height: 0.4rem; box-shadow: 0 0 0.3rem black; margin-top: 0.4rem; margin-bottom: 0.4rem; border-radius: 0.2rem'>
            </div>
            <div class='float-right inline-block border-2' style='padding: 0.2rem 0.4rem; border-radius: 0.4rem; box-shadow: 0 0 0.3rem black; border-color: white'>
              <h1 class='text-lg'>{{ Math.max(0, Math.min(Math.floor(time_left / 60), 15)) }}:{{ (Math.floor(time_left / 60) >= 15 ? 0 : Math.max(0, time_left % 60)).toString().padStart(2, '0') }}</h1>
            </div>
          </div>
        </div>
        <div v-else class=' transition delay-75 duration-300 ease-in-out'>
          <div class='w-full' style='height: 0.4rem; background-color: dimgray; margin-top: 0.4rem; margin-bottom: 0.4rem; border-radius: 0.2rem'>
          </div>
          <div class='float-right inline-block border-2 text-gray-200' style='padding: 0.2rem 0.4rem; border-radius: 0.4rem; background-color: dimgrey; border-color: white'>
            <h1 class='text-lg'>{{ Math.max(0, Math.min(Math.floor(time_left / 60), 15)) }}:{{ (Math.floor(time_left / 60) >= 15 ? 0 : Math.max(0, time_left % 60)).toString().padStart(2, '0') }}</h1>
          </div>
        </div>
      </div>
      <!-- YOUR BAR fin -->

      <div v-if='submit_error'>
        <h1 class="text-red-600" style='margin-left: 0.2rem'>{{ submit_error.message }}</h1>
      </div>
      <div v-else-if='alan_info'>
        <h1 class='text-blue-600' style='margin-left: 0.2rem'>{{ alan_info }}</h1>
      </div>
    </div>

    <div class='alan-btn'></div>
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
      alan_needs_confirm: false,
      alan_info: '',
      red_disp: false,
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
      this.alan_lock = false;
      this.alan_open = false;
      this.alan_needs_confirm = false;
      this.alan_info = '';
      this.red_disp = false;
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
          this.alan_info = ""
          if (move.user_id === this.$auth.user.user_id) {
            this.running = false;
            this.time_spent = move.time_spent;
            this.opponent_running = Date.parse(move.running.toString())
            // ???
            // if (this.selected === this.parse(move.from_r, move.from_c)) {
            //   // this.selected = 'none';
            // }
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
          await new Promise(r => setTimeout(r, 0))
          // try to hot speak
          if (this.won) {
            await this.hotSpeak("Congratulations! You won.")
          } else {
            await this.hotSpeak("You didn't win this time, but I'm sure you'll win in the future.")
          }
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
          await new Promise(r => setTimeout(r, 0))
          // try to hot speak
          if (this.won === "tied") {
            await this.hotSpeak("Wow, you tied with the opponent.")
          } else if (this.won) {
            await this.hotSpeak("Congratulations! You won.")
          } else {
            await this.hotSpeak("You didn't win this time, but I'm sure you'll win in the future.")
          }
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
      onCommand: async (commandData) => {
        let cmd = commandData.command.split("=>")[0].trim()
        console.log(commandData.command)
        let pld = JSON.parse(commandData.command.split("=>")[1])
        switch (cmd) {
          case ":list_threats": {
            this.red_disp = true;
            let locs = this.getThreats()
            let outp = ""
            for (let i = 0; i < locs.length; i++) {
              if (locs[i].split(" ")[0] === "A") {
                locs[i] = "ae " + locs[i].split(" ")[1]
              }
              if (i === locs.length - 1) {
                if (locs.length > 1) {
                  outp += "and " + locs[i] //  + "."
                } else {
                  outp += locs[i] //  + "."
                }
              } else {
                if (locs.length > 2) {
                  outp += locs[i] + ", "
                } else {
                  outp += locs[i] + " "
                }
              }
              // set color to red
              let dar = 8 - parseInt(locs[i].split(" ")[1]) + 1 - 1;
              let dac = locs[i].split(" ")[0].charCodeAt(0) - 65 + 1 - 1;
              document.getElementById(this.parse(dar, dac)).src = "/chess/" + this.board[dar][dac].type.split("_")[1] + "_threatened.svg"
              document.getElementById(this.parse(dar, dac)).alt = this.board[dar][dac].type.split("_")[1] + " threatened"
            }
            this.$forceUpdate();
            if (!outp) {
              outp = "There are no threats on any of your pieces. Good job!"
            } else {
              if (locs.length === 1) {
                outp = "Your piece, " + outp + " is threatened.";
              } else {
                outp = "Some of your pieces have threats, which are " + outp + ".";
              }
            }
            console.log(outp)
            this.alan_info = outp;
            this.alan_info = this.alan_info.replace(" ae ", " A ")

            await this.hotSpeak(outp)
          break }

          case ":confirm_risky_move": {
            this.alan_needs_confirm = pld.needs_confirm;
            if (this.alan_needs_confirm === 'rejected') {
              this.alan_info = "";
            }
          break }

          case ":exact_move": {
            this.alan_lock = true;
            if (this.selected !== 'none') {
              console.log("unselecting")
              await this.action(this.unparse(this.selected).r, this.unparse(this.selected).c, true)
            }
            this.selected = 'none';
            this.selected_val = '';
            this.submitted = 'none';
            this.submitted_val = '';
            // do not allow not-turn
            if (!this.running) {
              this.alan_lock = false;
              await this.hotSpeak("it is not your turn")
              return;
            }
            if (JSON.stringify(pld.from) === JSON.stringify(pld.to)) {
              this.alan_lock = false;
              await this.hotSpeak("you cannot move to yourself")
              return;
            }
            let x = pld.from.letter.charCodeAt(0) - 65 + 1;
            let y = pld.from.number
            y = 8 - y + 1;
            if (!this.board[y - 1][x - 1].id) {
              this.alan_lock = false;
              await this.hotSpeak("no piece is here")
              return;
            }
            if (this.board[y - 1][x - 1].type.split("_")[0] !== this.color) {
              this.alan_lock = false;
              await this.hotSpeak("this isn't your piece")
              return;
            }

            await this.action(y - 1, x - 1, true)
            this.$forceUpdate()

            // play the move before
            let cur_threats = this.getThreats();
            console.log('cur threats', cur_threats)
            let backup = this.board[8 - pld.to.number + 1 - 1][pld.to.letter.charCodeAt(0) - 65 + 1 - 1];
            this.board[8 - pld.to.number + 1 - 1][pld.to.letter.charCodeAt(0) - 65 + 1 - 1] = this.board[y - 1][x - 1];
            this.board[y - 1][x - 1] = { id: null, user_id: null, type: 'none' }
            let fut_threats = this.getThreats();
            console.log('fut threats', fut_threats)
            this.board[y - 1][x - 1] = this.board[8 - pld.to.number + 1 - 1][pld.to.letter.charCodeAt(0) - 65 + 1 - 1];
            this.board[8 - pld.to.number + 1 - 1][pld.to.letter.charCodeAt(0) - 65 + 1 - 1] = backup;
            let com_threats = cur_threats.filter(val => fut_threats.includes(val))
            let new_threats = []
            for (let threat of fut_threats) {
              if (!com_threats.includes(threat)) {
                new_threats.push(threat)
              }
            }
            if (new_threats.length && this.board[8 - pld.to.number + 1 - 1][pld.to.letter.charCodeAt(0) - 65 + 1 - 1].type.split("_")[1] !== "king") {
              this.alan_needs_confirm = true;
              this.red_disp = true;
              let locs = [];
              let outp = ""
              let includes_cur = false;
              for (let threat of new_threats) {
                // check if it goes-to to
                if (threat === pld.to.letter + " " + pld.to.number.toString()) {
                  includes_cur = true;
                } else {
                  locs.push(threat)
                }
              }
              for (let threat of fut_threats) {
                if (threat !== pld.to.letter + " " + pld.to.number.toString()) {
                  // set color to red
                  let dar = 8 - parseInt(threat.split(" ")[1]) + 1 - 1;
                  let dac = threat.split(" ")[0].charCodeAt(0) - 65 + 1 - 1;
                  console.log("setting red")
                  document.getElementById(this.parse(dar, dac)).src = "/chess/" + this.board[dar][dac].type.split("_")[1] + "_threatened.svg"
                  document.getElementById(this.parse(dar, dac)).alt = this.board[dar][dac].type.split("_")[1] + " threatened"
                }
              }
              this.$forceUpdate();
              for (let i = 0; i < locs.length; i++) {
                if (locs[i].split(" ")[0] === "A") {
                  locs[i] = "ae " + locs[i].split(" ")[1]
                }
                if (i === locs.length - 1) {
                  if (locs.length > 1) {
                    outp += "and " + locs[i] // + "."
                  } else {
                    outp += locs[i] // + "."
                  }
                } else {
                  if (locs.length > 2) {
                    outp += locs[i] + ", "
                  } else {
                    outp += locs[i] + " "
                  }
                }
              }
              let speak = "something went wrong. technical support is already on the problem.";
              if (locs.length === 1) {
                if (com_threats.length === 1) {
                  speak = "By doing this, you are introducing threats to your piece at " + outp + ", along with" + (includes_cur ? " the piece you are moving and " : " ") + "one other threat."
                } else if (!com_threats.length) {
                  speak = "By doing this, you are introducing threats to your piece at " + outp + (includes_cur ? ", along with the piece you are trying to move" : ".")
                } else {
                  speak = "By doing this, you are introducing threats to your piece at " + outp + ", along with" + (includes_cur ? " the piece you are moving and " : " ") + com_threats.length + " other threats."
                }
              } else if (locs.length === 0) {
                if (com_threats.length === 1) {
                  speak = "By doing this, you are introducing threats to the piece you are trying to move, along with one other threat."
                } else if (!com_threats.length) {
                  speak = "By doing this, you are introducing threats to the piece you are trying to move."
                } else {
                  speak = "By doing this, you are introducing threats to the piece you are trying to move, along with " + com_threats.length + " other threats.";
                }
              } else {
                if (com_threats.length === 1) {
                  speak = "By doing this, you are introducing threats to your pieces at " + outp + ", along with" + (includes_cur ? " the piece you are moving and " : " ") + "one other threat."
                } else if (!com_threats.length) {
                  speak = "By doing this, you are introducing threats to your pieces at " + outp + (includes_cur ? ", along with the piece you are trying to move" : ".")
                } else {
                  speak = "By doing this, you are introducing threats to your pieces at " + outp + ", along with" + (includes_cur ? " the piece you are moving and " : " ") + com_threats.length + " other threats."
                }
              }
              console.log(speak)
              this.alan_info = speak + " Are you sure you want to do this?";
              this.alan_info = this.alan_info.replace(" ae ", " A ")
              await this.hotSpeakWithRiskyConfirm(speak)
            }
            let js = 0;
            while (!this.closed && this.alan_needs_confirm) {
              if (js % 100 === 0) {
                console.log(this.alan_needs_confirm)
              }
              if (this.alan_needs_confirm === "rejected") {
                this.alan_needs_confirm = false;
                this.alan_lock = false;
                return;
              }
              await new Promise(r => setTimeout(r, 0))
              js++;
            }

            this.alan_open = true;
            x = pld.to.letter.charCodeAt(0) - 65 + 1;
            y = pld.to.number
            y = 8 - y + 1;
            await this.action(y - 1, x - 1, true)
            this.alan_lock = false;
          break }

          case ":fuzzy_move_add": {
            this.alan_lock = true;
            if (this.selected !== 'none') {
              console.log("unselecting")
              await this.action(this.unparse(this.selected).r, this.unparse(this.selected).c, true)
            }
            this.selected = 'none';
            this.selected_val = '';
            this.submitted = 'none';
            this.submitted_val = '';
            // do not allow not-turn
            if (!this.running) {
              this.alan_lock = false;
              await this.hotSpeak("it is not your turn")
              return;
            }
            // step 1: find the piece based off of positional
            let found = false;
            if (pld.positional === "left most") {
              // columns left to right
              for (let c = (this.color === 'white' ? 0 : 7); c !== (this.color === 'white' ? 8 : -1); c += (this.color === 'white' ? 1 : -1)) {
                if (found) {
                  break;
                }
                // full row
                for (let r = 0; r < 8; r++) {
                  if (this.board[r][c].type.split("_")[0] === this.color && this.board[r][c].type.split("_")[1] === pld.piece) {
                    if (found) {
                      this.alan_lock = false;
                      await this.hotSpeak("sorry, this is ambiguous")
                      return;
                    }
                    found = { r: r, c: c }
                    // dont break
                  }
                }
              }
            } else if (pld.positional === "right most") {
              // columns right to left
              for (let c = (this.color === 'white' ? 7 : 0); c !== (this.color === 'white' ? -1 : 8); c += (this.color === 'white' ? -1 : 1)) {
                if (found) {
                  break;
                }
                // full row
                for (let r = 0; r < 8; r++) {
                  if (this.board[r][c].type.split("_")[0] === this.color && this.board[r][c].type.split("_")[1] === pld.piece) {
                    if (found) {
                      this.alan_lock = false;
                      await this.hotSpeak("sorry, this is ambiguous")
                      return;
                    }
                    found = { r: r, c: c }
                    // dont break
                  }
                }
              }
            } else if (pld.positional === "bottom most" || pld.positional === "lower most") {
              // rows bottom to top
              for (let r = (this.color === 'white' ? 7 : 0); r !== (this.color === 'white' ? -1 : 8); r += (this.color === 'white' ? -1 : 1)) {
                if (found) {
                  break;
                }
                // full col
                for (let c = 0; c < 8; c++) {
                  if (this.board[r][c].type.split("_")[0] === this.color && this.board[r][c].type.split("_")[1] === pld.piece) {
                    if (found) {
                      this.alan_lock = false;
                      await this.hotSpeak("sorry, this is ambiguous")
                      return;
                    }
                    found = { r: r, c: c }
                    // dont break
                  }
                }
              }
            } else if (pld.positional === "upper most" || pld.positional === "top most") {
              for (let r = (this.color === 'white' ? 0 : 7); r !== (this.color === 'white' ? 8 : -1); r += (this.color === 'white' ? 1 : -1)) {
                if (found) {
                  break;
                }
                // full col
                for (let c = 0; c < 8; c++) {
                  if (this.board[r][c].type.split("_")[0] === this.color && this.board[r][c].type.split("_")[1] === pld.piece) {
                    if (found) {
                      this.alan_lock = false;
                      await this.hotSpeak("sorry, this is ambiguous")
                      return;
                    }
                    found = { r: r, c: c }
                    // dont break
                  }
                }
              }
            } else {
              // full row
              for (let r = 0; r < 8; r++) {
                // full col
                for (let c = 0; c < 8; c++) {
                  if (this.board[r][c].type.split("_")[0] === this.color && this.board[r][c].type.split("_")[1] === pld.piece) {
                    if (found) {
                      this.alan_lock = false;
                      await this.hotSpeak("sorry, this is ambiguous")
                      return;
                    }
                    found = { r: r, c: c }
                    // dont break
                  }
                }
                // no breaking here also
              }
            }

            if (!found) {
              this.alan_lock = false;
              await this.hotSpeak("this piece does not exist")
              return;
            }

            // step 2: get direction offset
            let r_ofs = 0, c_ofs = 0;
            if (pld.direction === "up") {
              r_ofs -= pld.amount;
            } else if (pld.direction === "down") {
              r_ofs += pld.amount;
            } else if (pld.direction === "left") {
              c_ofs -= pld.amount;
            } else if (pld.direction === "right") {
              c_ofs += pld.amount;
            }
            if (pld.direction_add === "up") {
              r_ofs -= pld.amount;
            } else if (pld.direction_add === "down") {
              r_ofs += pld.amount;
            } else if (pld.direction_add === "left") {
              c_ofs -= pld.amount;
            } else if (pld.direction_add === "right") {
              c_ofs += pld.amount;
            }

            if (pld.piece === "knight") {
              if (pld.direction === "up" && pld.direction_add === "left") {
                r_ofs = -2;
                c_ofs = -1;
              } else if (pld.direction === "up" && pld.direction_add === "right") {
                r_ofs = -2;
                c_ofs = 1;
              } else if (pld.direction === "right" && pld.direction_add === "up") {
                c_ofs = 2;
                r_ofs = -1;
              } else if (pld.direction === "right" && pld.direction_add === "down") {
                c_ofs = 2;
                r_ofs = 1;
              } else if (pld.direction === "down" && pld.direction_add === "right") {
                r_ofs = 2;
                c_ofs = 1;
              } else if (pld.direction === "down" && pld.direction_add === "left") {
                r_ofs = 2;
                c_ofs = -1;
              } else if (pld.direction === "left" && pld.direction_add === "down") {
                c_ofs = -2;
                r_ofs = 1;
              } else if (pld.direction === "left" && pld.direction_add === "up") {
                c_ofs = -2;
                r_ofs = -1;
              } else {
                r_ofs = 0;
                c_ofs = 0;
              }
            }

            if (r_ofs === 0 && c_ofs === 0) {
              // no direction caught
              this.alan_lock = false;
              await this.hotSpeak("sorry, i do not understand")
              return;
            }

            if (this.color !== 'white') {
              r_ofs = -r_ofs;
              c_ofs = -c_ofs;
            }

            if (found.r + r_ofs < 0 || found.r + r_ofs >= 8 || found.c + c_ofs < 0 || found.c + c_ofs >= 8) {
              this.alan_lock = false;
              await this.hotSpeak("you are trying to move out of the board")
              return;
            }

            await this.action(found.r, found.c, true)
            this.$forceUpdate()

            let cur_threats = this.getThreats();
            console.log('cur threats', cur_threats)
            let backup = this.board[found.r + r_ofs][found.c + c_ofs];
            this.board[found.r + r_ofs][found.c + c_ofs] = this.board[found.r][found.c];
            this.board[found.r][found.c] = { id: null, user_id: null, type: 'none' }
            let fut_threats = this.getThreats();
            console.log('fut threats', fut_threats)
            this.board[found.r][found.c] = this.board[found.r + r_ofs][found.c + c_ofs];
            this.board[found.r + r_ofs][found.c + c_ofs] = backup;
            let com_threats = cur_threats.filter(val => fut_threats.includes(val))
            let new_threats = []
            for (let threat of fut_threats) {
              if (!com_threats.includes(threat)) {
                new_threats.push(threat)
              }
            }
            if (new_threats.length && this.board[found.r + r_ofs][found.c + c_ofs].type.split("_")[1] !== "king") {
              this.alan_needs_confirm = true;
              this.red_disp = true;
              let locs = [];
              let outp = ""
              let includes_cur = false;
              for (let threat of new_threats) {
                // check if it goes-to `to'
                if (threat === (String.fromCharCode(("A").charCodeAt(0) + found.c + c_ofs)) + " " + (8 - (found.r + r_ofs))) {
                  includes_cur = true;
                } else {
                  locs.push(threat)
                }
              }
              for (let threat of fut_threats) {
                if (threat !== (String.fromCharCode(("A").charCodeAt(0) + found.c + c_ofs)) + " " + (8 - (found.r + r_ofs))) {
                  // set color to red
                  let dar = 8 - parseInt(threat.split(" ")[1]) + 1 - 1;
                  let dac = threat.split(" ")[0].charCodeAt(0) - 65 + 1 - 1;
                  console.log("setting red")
                  document.getElementById(this.parse(dar, dac)).src = "/chess/" + this.board[dar][dac].type.split("_")[1] + "_threatened.svg"
                  document.getElementById(this.parse(dar, dac)).alt = this.board[dar][dac].type.split("_")[1] + " threatened"
                }
              }
              if (includes_cur) {

              }
              this.$forceUpdate()
              for (let i = 0; i < locs.length; i++) {
                if (locs[i].split(" ")[0] === "A") {
                  locs[i] = "ae " + locs[i].split(" ")[1]
                }
                if (i === locs.length - 1) {
                  if (locs.length > 1) {
                    outp += "and " + locs[i] // + "."
                  } else {
                    outp += locs[i] // + "."
                  }
                } else {
                  if (locs.length > 2) {
                    outp += locs[i] + ", "
                  } else {
                    outp += locs[i] + " "
                  }
                }
              }
              let speak = "something went wrong. technical support is already on the problem.";
              if (locs.length === 1) {
                if (com_threats.length === 1) {
                  console.log("1")
                  speak = "By doing this, you are introducing threats to your piece at " + outp + ", along with" + (includes_cur ? " the piece you are moving and " : " ") + "one other threat."
                } else if (!com_threats.length) {
                  console.log("2")
                  speak = "By doing this, you are introducing threats to your piece at " + outp + (includes_cur ? ", along with the piece you are trying to move" : ".")
                } else {
                  console.log("3")
                  speak = "By doing this, you are introducing threats to your piece at " + outp + ", along with " + (includes_cur ? " the piece you are moving and " : " ") + com_threats.length + " other threats."
                }
              } else if (locs.length === 0) {
                if (com_threats.length === 1) {
                  console.log("4")
                  speak = "By doing this, you are introducing threats to the piece you are trying to move, along with one other threat."
                } else if (!com_threats.length) {
                  console.log("5")
                  speak = "By doing this, you are introducing threats to the piece you are trying to move."
                } else {
                  console.log("6")
                  speak = "By doing this, you are introducing threats to the piece you are trying to move, along with " + com_threats.length + " other threats.";
                }
              } else {
                if (com_threats.length === 1) {
                  console.log("7")
                  speak = "By doing this, you are introducing threats to your pieces at " + outp + ", along with" + (includes_cur ? " the piece you are moving and " : " ") + "one other threat."
                } else if (!com_threats.length) {
                  console.log("8")
                  speak = "By doing this, you are introducing threats to your pieces at " + outp + (includes_cur ? ", along with the piece you are trying to move" : ".")
                } else {
                  console.log("9")
                  speak = "By doing this, you are introducing threats to your pieces at " + outp + ", along with " + (includes_cur ? " the piece you are moving and " : " ") + com_threats.length + " other threats."
                }
              }
              console.log(speak)
              this.alan_info = speak + " Are you sure you want to do this?";
              this.alan_info = this.alan_info.replace(" ae ", " A ")
              await this.hotSpeakWithRiskyConfirm(speak)
            }
            let js = 0;
            while (!this.closed && this.alan_needs_confirm) {
              if (js % 100 === 0) {
                console.log(this.alan_needs_confirm)
              }
              if (this.alan_needs_confirm === "rejected") {
                this.alan_needs_confirm = false;
                this.alan_lock = false;
                return;
              }
              await new Promise(r => setTimeout(r, 0))
              js++;
            }

            this.alan_open = true;
            await this.action(found.r + r_ofs, found.c + c_ofs, true)

            this.alan_lock = false;
          break }
        }
      },
      onConnectionStatus: (status) => {
        console.log('==============', status)
      },
      rootEl: document.getElementById('alan-btn')
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
        this.time_left = 15 * 60 - time_spent_secs;
        this.opponent_time_left = 15 * 60 - opponent_time_spent_secs;

        let time_spent_mins = Math.floor(time_spent_secs / 60); // minutes
        let opponent_time_spent_mins = Math.floor(opponent_time_spent_secs / 60);
        if (this.got_state && time_spent_mins >= 15 || opponent_time_spent_mins >= 15) {
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
              console.log('error', msg)
              if (msg.reason === codes.closed) {
                // TODO: imp summary page
                await this.$router.replace('/')
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
    async hotSpeakWithRiskyConfirm(message) {
      this.alan.callProjectApi("hotSpeakWithRiskyConfirm", { message: message }, (error, result) => {
        if (error) {
          console.log('error', error)
        }
      })
    },
    getThreats() {
      let ret = [];
      // find pieces
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          if (this.board[i][j].type.split("_")[0] === this.color) {
            // found a piece
            // go from piece to every possible direction
            // if hit same color -> disengage
            // else hit opponent color -> mark

            // slot checking
            let slots = [
              { r: i - 1, c: j - 1, is_a: ["king", "pawn"] },
              { r: i - 1, c: j    , is_a: ["king"] },
              { r: i - 1, c: j + 1, is_a: ["king", "pawn"] },
              { r: i    , c: j + 1, is_a: ["king"] },
              { r: i + 1, c: j + 1, is_a: ["king", "pawn"] },
              { r: i + 1, c: j    , is_a: ["king"] },
              { r: i + 1, c: j - 1, is_a: ["king", "pawn"] },
              { r: i    , c: j - 1, is_a: ["king"] },
              { r: i - 2, c: j - 1, is_a: ["knight"] },
              { r: i - 2, c: j + 1, is_a: ["knight"] },
              { r: i - 1, c: j + 2, is_a: ["knight"] },
              { r: i + 1, c: j + 2, is_a: ["knight"] },
              { r: i + 2, c: j - 1, is_a: ["knight"] },
              { r: i + 2, c: j + 1, is_a: ["knight"] },
              { r: i - 1, c: j - 2, is_a: ["knight"] },
              { r: i + 1, c: j - 2, is_a: ["knight"] },
            ]
            for (let slot of slots) {
              if (slot.r < 0 || slot.r >= 8 || slot.c < 0 || slot.c >= 8) {
                continue;
              }
              if (this.board[slot.r][slot.c].user_id && this.board[slot.r][slot.c].user_id !== this.$auth.user.user_id) {
                if (slot.is_a.includes(this.board[slot.r][slot.c].type.split("_")[1])) {
                  ret.push(String.fromCharCode(("A").charCodeAt(0) + j) + " " + (8 - i).toString())
                }
              }
            }

            // inf checking
            let dirs = [
              { dr: -1, dc: -1, is_a: ["queen", "bishop"] },
              { dr: -1, dc:  0, is_a: ["queen", "rook"] },
              { dr: -1, dc:  1, is_a: ["queen", "bishop"] },
              { dr:  0, dc:  1, is_a: ["queen", "rook"] },
              { dr:  1, dc:  1, is_a: ["queen", "bishop"] },
              { dr:  1, dc:  0, is_a: ["queen", "rook"] },
              { dr:  1, dc: -1, is_a: ["queen", "bishop"] },
              { dr:  0, dc: -1, is_a: ["queen", "rook"] },
            ]
            for (let dir of dirs) {
              let r = i + dir.dr, c = j + dir.dc;
              while (!(r < 0 || r >= 8 || c < 0 || c >= 8)) {
                if (this.board[r][c].user_id) {
                  if (this.board[r][c].user_id !== this.$auth.user.user_id && dir.is_a.includes(this.board[r][c].type.split("_")[1])) {
                    ret.push(String.fromCharCode(("A").charCodeAt(0) + j) + " " + (8 - i).toString())
                  }
                  break;
                }
                r += dir.dr;
                c += dir.dc;
              }
            }
          }
        }
      }
      console.log([...new Set(ret)])

      return [...new Set(ret)];
    },
    async action(i, j, by_alan = false) {
      if (this.block || this.closed || (this.selected === 'none' && this.board[i][j].type.split("_")[0] !== this.color)) {
        return;
      }
      if (this.alan_lock && !by_alan) {
        await this.showSubmitError("Alan is still waiting for your response.")
        return;
      }
      if (this.red_disp) {
        // clear it
        for (let i = 0; i < 8; i++) {
          for (let j = 0; j < 8; j++) {
            if (document.getElementById(this.parse(i, j)) && document.getElementById(this.parse(i, j)).alt.split(" ")[1] === "threatened") {
              document.getElementById(this.parse(i, j)).src = "/chess/" + this.color + "_" + document.getElementById(this.parse(i, j)).alt.split(" ")[0] + ".svg";
              document.getElementById(this.parse(i, j)).alt = this.color + " " + document.getElementById(this.parse(i, j)).alt.split(" ")[0];
            }
          }
        }
        this.red_disp = false;
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
      this.alan.deactivate()
      this.alan.stop();
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
