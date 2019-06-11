<template>
  <div class="border-self data noback mapTab inter_mapTab inter_margin analysis">
    <div style="color: #fff;height:60%;box-sizing:border-box;padding:20px;">
      <h1>系统功能：</h1>
      <div class="content noback">{{content}}</div>
    </div>
    <div style="height:35%;margin:0 20px;">
      <img src="static/img/bigscreen/shiyan_yanzheng.png" alt="" style="width:100%;height:100%;">
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      content: `为了更好的发挥防范效果，对诈骗电话进行持续打击，面对诈骗分子不断翻新的诈骗手段和应对不断变化的诈骗形势，一方面需要对包括电信诈骗形势分析和防范效果，新型诈骗行为分析和防范策略动态调整等课题进行进一步深入研究，同时也应该建设相应的试验系统，在软件功能，配置策略以及最新的技术制式应用到现网系统之前，经过全面严格的测试和试运行，以保证系统的防范效果，也同时保证系统的安全运行水平。
试验验证系统主要供是在系统上线前的开发和内部测试，系统环境与正式运行的系统采用统一的云计算和大数据架构，采用镜像数据的方式，在试验验证系统中部署大数据平台中的部分样本数据，供开发方进行应用开发和验证。为保证安全性，试验验证系统与正式系统采用防火墙进行防护隔离。`
    }
  }
}
</script>

<style scoped>
.content {
  text-indent: 2em;
  font-size: 36px;
}
</style>
