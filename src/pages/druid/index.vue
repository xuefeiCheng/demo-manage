<template lang="html">
  <div id="app" style="height: auto;">
    <Row>
      <Col span="24">
        <iframe :src="druid" id="druidMonitor" frameborder="0" width="100%" :height="height" ref="druid"></iframe>
      </Col>
    </Row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      druid: this.baseURL + '/druid/login.html?token=' + this.$store.getters.token,
      height: 800
    }
  },
  mounted () {
    // 控制iframe高度
    let height = document.documentElement.clientHeight || document.body.clientHeight
    this.height = height - 112
  }
}
</script>

<style lang="css" scoped>
</style>
