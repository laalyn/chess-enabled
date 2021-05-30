<template>
  <div>
    <NuxtLink to='/'>Back</NuxtLink>
    <br>
    <button @click='logout'>Logout</button>
  </div>
</template>

<script>
export default {
  methods: {
    async logout() {
      await this.$auth.logout()
      await this.$router.push('/logged-out')
    },
  }
}
</script>
