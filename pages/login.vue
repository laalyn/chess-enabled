<template>
  <div>
    <NuxtLink to='/'>Back</NuxtLink>
    <form @submit.prevent>
      <input v-model='form.email' type='email' placeholder='Email'>
      <input v-model='form.password' type='password' placeholder='Password'>
      <div v-if='error' class='text-red-600'>
        {{ error }}
      </div>
      <div v-else>
        <button @click='submit'>Login</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  auth: false,
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
      error: '',
    };
  },
  methods: {
    async showError(err) {
      if (err === undefined) {
        this.error = 'something went wrong'
      } else {
        this.error = err;
      }
      await new Promise(r => setTimeout(r, 1800));
      this.error = '';
    },
    async submit() {
      let result;
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
