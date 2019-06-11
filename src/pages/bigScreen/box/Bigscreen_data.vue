<template>
  <div style="height:100%;width:100%;">
    <!-- margin-top:-19px; -->
    <!-- 84.6 88.5 -->
    <!-- 内网地址 -->
    <!-- <iframe src="http://10.1.62.13:8231/bdp/#!/customBigScreen" allowTransparency="true" frameborder="0" scrolling="auto" style="width:100%;height:89.1%;background-color:transparent"></iframe> -->
    <!-- 现网地址 -->
    <iframe :src='src' allowTransparency="true" frameborder="0" scrolling="auto" style="width:100%;height:100%;background-color:transparent"></iframe>
  </div>
</template>

<script>
export default {
  name: 'wiabuWEB',
  data () {
    return {
      data: {
        'index': 'http://10.123.2.49:8231/bdp/#!/customBigScreen',
        // 'index': 'http://10.1.62.13:8231/bdp/#!/customBigScreen',
        'zhapian': 'http://10.123.8.13:8021/#/index/main/analysis.situationAnalysis', // 恒安 互联网诈骗防范拦截系统
        'zonghe': 'http://10.123.8.11:5000/#/jumpLogin', // 恒安 互联网综合管理系统
        'cloud': 'http://10.123.7.64:8080/cas', // 云计算资源池
        'support': 'http://10.123.8.54/vesapp/page/getPage.do?model=fullIndex&key=changan&token=%2bXlir%2b4GMQI%2bAIDbQ8qhKzJqjLwpCSC5', // 运维支撑
        'analysis': 'http://10.123.2.49:8080'
      },
      src: ''
    }
  },
  mounted () {
    this.src = this.data[this.$route.params.src]
  },
  watch: {
    $route: 'getPath'
  },
  methods: {
    getPath () {
      this.src = this.data[this.$route.params.src]
      // 存储到浏览器，解决刷新
      // sessionStorage.setItem('waibuSRC', this.src) // 存入一个值
    }
  }
}
</script>
