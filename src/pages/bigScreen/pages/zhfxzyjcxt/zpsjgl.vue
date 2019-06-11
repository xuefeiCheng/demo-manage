<template>
  <div class="data mapTab noback inter_mapTab inter_margin analysis">
      <!-- title 部分 -->
      <div class="border-self analysis_title">
          <div class="inter_title">{{title}}</div>
          <div class="des">
            ?
          </div>
          <div class="des_content" v-html='des'></div>
      </div>
      <!-- 主体部分 -->
      <div class="analysis_content border-self" style="background:url('static/img/bigscreen/zpsjglANDhy.png') no-repeat center;">
      </div>
  </div>
</template>

<script>
export default {
  name: 'interMap',
  data () {
    return {
      title: '诈骗事件关联与还原',
      des: `基于各分析检测子系统输出的诈骗电话号码、诈骗短消息号码、伪基站位置及持有人信息、恶意域名/URL、受害人电话号码等分析结果，并结合施骗人和受害人的姓名、身份证号、银行卡号、地理位置/轨迹等相关情报，一方面以受害人为核心，从时间和空间维度上进行诈骗事件的关联，并将案件时间窗口内的原始CDR日志抽取出来，通过人工研判进一步发现遗漏事件（如诈骗同伙与受害人的通联事件等），从而尽可能地还原通讯信息诈骗的整个过程及场景。
    <br/>基于诈骗案例的相关分析结果、情报和原始日志将单独存档，进一步做查询检索、案例分析和展示汇报；以诈骗团伙为核心，从时间和空间维度上进行诈骗事件、诈骗案例的关联与统计分析（串并案分析），归纳其诈骗类型、诈骗手段、作案时间、作案地点、受害人群等犯罪特点。`
    }
  }
}
</script>

<style scoped>
  .border-self {box-shadow: none !important;}
</style>
