<template>
  <div class='absolute left-1/2 transform -translate-x-1/2 h-full' style='width: min(100%, calc(80px * 8 + 26px));'>
    <NuxtLink to='/'><i class="fas fa-long-arrow-alt-left cursor-pointer hover:text-blue-500 transition-colors delay-75 duration-300 ease-in-out" style='font-size: 1.4rem; margin-top: 0.8rem; margin-left: 0.6rem'></i></NuxtLink>
    <h1 class='absolute top-0 text-2xl left-1/2 transform -translate-x-1/2' style='margin-top: 0.4rem'>Register</h1>
    <form @submit.prevent style='margin-left: 0.8rem; margin-right: 0.8rem'>
      <input v-model='form.email' v-on:keyup.enter='submit()' type='email' placeholder='Email' class='block w-full border-2' style='margin-top: 0.6rem; padding: 0.6rem 1rem; border-radius: 0.4rem'>
      <input v-model='form.password' v-on:keyup.enter='submit()' type='password' placeholder='Password' class='block w-full border-2' style='margin-top: 0.6rem; padding: 0.6rem 1rem; border-radius: 0.4rem'>
      <input v-model='form_v.pass_confirm' v-on:keyup.enter='submit()' type='password' placeholder='Confirm Password' class='block w-full border-2' style='margin-top: 0.6rem; padding: 0.6rem 1rem; border-radius: 0.4rem'>
      <div v-if='error' class='text-red-600' style='margin-left: 0.4rem; margin-top: 0.6rem'>
        {{ error.message }}
      </div>
      <div v-else style='margin-left: 0.4rem'>
        <div @click='submit()' class='inline-block cursor-pointer bg-purple-400 hover:bg-purple-500 transition-colors delay-75 duration-300 ease-in-out' style='margin-top: 0.6rem; padding: 0.6rem 1rem; border-radius: 0.4rem'>
          <i class='fas fa-paper-plane inline-block' style='font-size: 1.1rem'></i>
          <h1 class='text-lg inline-block'>Submit</h1>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { server } from '~/server';
import * as UUID from 'uuid';

export default {
  auth: false,
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
      form_v: {
        pass_confirm: '',
      },
      error: '',
    };
  },
  async beforeCreate() {
    if (this.$auth.loggedIn) {
      await this.$router.replace('/app');
    }
  },
  methods: {
    async showError(err) {
      let expected_uuid = UUID.v4()
      if (err === undefined) {
        this.error = { id: expected_uuid, message: 'something went wrong' }
      } else {
        this.error = { id: expected_uuid, message: err }
      }
      await new Promise(r => setTimeout(r, 1800))
      if (this.error.id === expected_uuid) {
        this.error = false;
      }
    },
    async submit() {
      if (this.form.password !== this.form_v.pass_confirm) {
        await this.showError("password confirmation doesn't match")
        return;
      }

      let result;
      try {
        result = await this.$axios.post(server.root + '/users', { user: this.form });
      } catch (error) {
        try {
          console.log(error.response)
          await this.showError(error.response.data.error);
        } catch {
          await this.showError("something went wrong");
        }
        return;
      }
      console.log(result)

      try {
        result = await this.$auth.loginWith('local', { data: { local: this.form } });
      } catch (error) {
        try {
          console.log(error.response)
          await this.showError(error.response.data.error);
        } catch {
          await this.showError("something went wrong");
        }
        return;
      }
      console.log(result);
      await this.$router.push('/');
    },
  },
};
</script>
