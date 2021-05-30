<template>
  <div class="absolute left-1/2 transform -translate-x-1/2 h-full" style='width: min(100%, calc(80px * 8 + 26px));'>
    <div class='absolute left-1/2 transform -translate-x-1/2' style='width: min(100%, 40rem); height: calc(100% - 7.2rem)'>
      <div class='relative left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2' style=''>
        <h1 class='text-4xl text-center'>Chess Enabled</h1>
        <h2 class='text-xl text-center'>The best chess experience on Earth</h2>
      </div>
    </div>
    <div class='absolute left-1/2 transform -translate-x-1/2' style='bottom: 2.3rem; width: 17.6rem'>
      <div @click='$router.push("/login")' class='inline-block cursor-pointer bg-blue-400 hover:bg-blue-500 transition-colors delay-75 duration-300 ease-in-out' style='margin-left: 1.5rem; margin-top: 1.1rem; padding: 0.6rem 1rem; border-radius: 0.4rem'>
        <NuxtLink to='/login'>
          <i class='fas fa-sign-in-alt inline-block' style='font-size: 1.1rem'></i>
          <h1 class='text-lg inline-block'>Login</h1>
        </NuxtLink>
      </div>
      <div @click='$router.push("/register")' class='inline-block cursor-pointer bg-blue-400 hover:bg-blue-500 transition-colors delay-75 duration-300 ease-in-out' style='margin-left: 1.5rem; margin-top: 1.1rem; padding: 0.6rem 1rem; border-radius: 0.4rem'>
        <NuxtLink to='/register'>
          <i class='fas fa-magic inline-block' style='font-size: 1.1rem'></i>
          <h1 class='text-lg inline-block'>Register</h1>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
