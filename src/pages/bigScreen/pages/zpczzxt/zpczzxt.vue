<template>
<!-- 诈骗处置子系统 -->
  <div class="data mapTab noback inter_mapTab inter_margin analysis">
      <!-- title 部分 -->
      <div class="border-self analysis_title">
        <div class="inter_title">{{title}}</div>
        <div class="des">?</div>
        <div class="des_content">{{des}}</div>
      </div>
      <!-- 主体部分 -->
      <div class="zpcz_content border-self">
          <div class="zpcz_sons border-self">
            <div class="zpcz_son_title border-self-bottom">定位分析模块</div>
            <div class="zpcz_son_content">
              <img src="static/img/bigscreen/zpdxxfx01.PNG" alt="" style="height:100%;width:100%">
            </div>
          </div>
          <div class="zpcz_sons border-self">
            <div class="zpcz_son_title border-self-bottom">处置提醒模块</div>
            <div class="zpcz_son_content">
              <img src="static/img/bigscreen/zpdxxfx01.PNG" alt="" style="height:100%;width:100%">
            </div>
          </div>
          <div class="zpcz_sons border-self">
              <div style="height:100%;position:relative">
                <div class="zpcz_son_title border-self-bottom">自动反置</div>
                <div class="zpcz_son_content">
                  <img src="static/img/bigscreen/zpdxxfx01.PNG" alt="" style="height:100%;width:100%">
                </div>
            </div>
          </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'zpczzxt',
  data () {
    return {
      title: '诈骗处置子系统',
      des: '诈骗处置系统提供多样化的诈骗电话和信息处置方法和策略。一方面，通过接入IMS核心网进行回拨取证，对检测出的有害电话进行实时拦截和阻断；另一方面，以各种形式对受害用户进行短信提醒。处置系统可以接受综合业务管理系统的处置指令及策略，实施相应处置操作并反馈处置结果。'
    }
  }
}
</script>

<style scoped>
  .border-self {box-shadow: none !important;}
  .border-self-bottom {
    border:0;
    border-bottom: 1px solid #269fed73;
  }
  /* 诈骗处置子系统 */
  .zpcz_content{
    height: calc(100% - 100px);width:100%;box-sizing:border-box;display:flex;
  }
  .zpcz_sons{
    flex:1;margin:15px;
  }
  .zpcz_son_title{
    width:100%;height:10%;font-size:20px;color:#fff;text-align:center;padding:20px 0;box-sizing: border-box;
  }
  .zpcz_son_content{
    height: 90%;
    box-sizing: border-box;
    padding: 10px;
  }
</style>
