<template>
  <div class="border-self data noback mapTab inter_mapTab inter_margin analysis">
    <div style="color: #fff;height:40%;box-sizing:border-box;padding:20px;">
      <h1>系统功能：</h1>
      <div class="content noback">{{content}}</div>
    </div>
    <div style="height:35%;margin:0 20px;">
      <img src="static/img/bigscreen/anquangeli.png" alt="" style="width:100%;height:100%;">
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      content: `安全隔离系统用以保存与用户个人信息相关的敏感数据，从前端采集到的敏感用户数据在云资源池的应用平台中通过单向隔离设备导入到安全隔离系统保存，安全隔离系统设置于屏蔽机柜中。`
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
