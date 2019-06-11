<template>
  <div style="height:100%;width:100%;">
    <img :src='res' alt="信大" style="width:100%;height:100%">
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      src: 'static/img/bigscreen/',
      res: ''
    }
  },
  mounted () {
    // this.res = sessionStorage.getItem('testKey')
    this.res = this.src + this.$route.params.xuhao + '.png'
  },
  watch: {
    $route (to, from) {
      this.res = this.src + this.$route.params.xuhao + '.png'
      // 存储到浏览器，解决刷新
      // sessionStorage.setItem('testKey', this.res) // 存入一个值
    }
  }
}
</script>
