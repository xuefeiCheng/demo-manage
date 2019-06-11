<template>
  <div>
     用户管理{{now}}
  </div>
</template>

<script>
export default {
  name: 'page-one',
  computed: {
    now: () => {
      return Date.now()
    }
  }
}
</script>

<style>
</style>
