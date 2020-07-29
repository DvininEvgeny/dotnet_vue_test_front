<template>
   <div id="app">
      <Users />
   </div>
</template>

<script>
import Users from '@/components/Users'

export default {
   name: 'App',
   components: {
      Users,
   },
}
</script>

<style>
#app {
   text-align: center;
   margin-top: 30px;
}
</style>
