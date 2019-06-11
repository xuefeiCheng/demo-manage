<template>
  <div class="data mapTab noback inter_mapTab inter_margin analysis">
      <!-- title 部分 -->
      <div class="border-self analysis_title">
          <div class="inter_title">{{title}}</div>
          <div class="des">
            ?
          </div>
          <div class="des_content">
            广西电信网由中国联通、中国移动、中国电信3家运营商网络构成。前端专用防范系统通过接入电信网长途线路中，完成呼叫接入控制、有害呼叫识别与检测、有害呼叫拦截等功能。系统实现对广西电信网络有害信息的整体防范，系统具备监测每一个进入本省的省际长途电话呼叫的能力，系统在本省电信网出入汇聚点进行部署。以信令特征检测为基础，实现对有害呼叫的实时检测，实时号码匹配（黑白灰名单）。具备防范策略关联，实现高效、准确、灵活的实时检测和防范
          </div>
      </div>
      <!-- 主体部分 -->
      <div class="analysis_content">
          <div style="flex:0 0 60.1%;padding:15px;box-sizing:border-box" class="border-self">
            <img src="static/img/bigscreen/dxwqdjr.png" alt="" style="height:100%;width:100%">
          </div>
          <div style="flex:0 0 39.9%" class="border-self">
              <div style="height:100%;position:relative">
                <div class="box_title border-self" style="height:7%;font-size:22px;padding-top:8px">
                    <span class="cicle"></span><span>数据表格</span>
                </div>
                <div class="box_conent" style="height:92%">
                  <div class="inter_table" style="height:100%">
                    <div class="inter_table_header" style="font-size:20px">
                      <ul>
                        <li style="width:15%">运营商</li>
                        <li style="width:20%">局点</li>
                        <li style="width:15%">呼叫量</li>
                        <li style="width:15%">应答量</li>
                        <li style="width:15%">拦截量</li>
                        <li style="width:15%">检出量</li>
                      </ul>
                    </div>
                    <div class="inter_table_body">
                      <div :class="{anim: animate === true}">
                        <ul v-for="(item, index) in tableData" :key="index">
                          <li style="width:15%">{{item.yunys}}</li>
                          <li class="YELLOW" style="width:20.4%">{{item.judian}}</li>
                          <li style="width:15.3%">{{sum(item.value2, item.value3, item.value4)}}</li>
                          <li class="YELLOW" style="width:15.3%">{{item.value2}}</li>
                          <li style="width:15.3%">{{item.value3}}</li>
                          <li class="YELLOW" style="width:15%">{{item.value4}}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
          </div>
      </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'interMap',
  data () {
    return {
      animate: false,
      transition: true,
      tableData: [
        // 呼叫 应答 拦截 检出
        {yunys: '电信', judian: '南宁民族C', value1: '2989640', value2: '1742136', value3: '6', value4: '6'},
        {yunys: '电信', judian: '南宁民族SS', value1: '1059479', value2: '191101', value3: '1', value4: '1'},
        {yunys: '电信', judian: '南宁琅东C', value1: '3086687', value2: '1794673', value3: '4', value4: '4'},
        {yunys: '电信', judian: '南宁琅东SS', value1: '507101', value2: '156680', value3: '1', value4: '1'},
        {yunys: '电信', judian: '柳州白云SS', value1: '245881', value2: '69469', value3: '2', value4: '2'},
        {yunys: '电信', judian: '柳州龙城SS', value1: '170472', value2: '49725', value3: '1', value4: '1'},
        {yunys: '电信', judian: '玉林东明SS', value1: '197255', value2: '65181', value3: '0', value4: '0'},
        {yunys: '电信', judian: '玉林城北SS', value1: '223213', value2: '66662', value3: '2', value4: '2'},
        {yunys: '联通', judian: '东盟十楼TGB', value1: '716333', value2: '151393', value3: '0', value4: '0'},
        {yunys: '联通', judian: '东盟四楼TSS2', value1: '5323921', value2: '2510708', value3: '6', value4: '6'},
        {yunys: '联通', judian: '石柱岭TSS1', value1: '5333233', value2: '2516050', value3: '8', value4: '8'},
        {yunys: '联通', judian: '软件园TGA', value1: '620549', value2: '134438', value3: '245', value4: '245'},
        {yunys: '移动', judian: '移动608', value1: '13653828', value2: '7959473', value3: '32', value4: '32'},
        {yunys: '移动', judian: '移动白沙', value1: '13454419', value2: '7832513', value3: '23', value4: '23'},
        {yunys: '电信', judian: '南宁民族C', value1: '2506477', value2: '1474124', value3: '1', value4: '1'},
        {yunys: '电信', judian: '南宁民族SS', value1: '893905', value2: '122336', value3: '16', value4: '16'},
        {yunys: '电信', judian: '南宁琅东C', value1: '2622936', value2: '1535863', value3: '3', value4: '3'},
        {yunys: '电信', judian: '南宁琅东SS', value1: '353017', value2: '98417', value3: '4', value4: '4'},
        {yunys: '电信', judian: '柳州白云SS', value1: '176784', value2: '44506', value3: '5', value4: '5'},
        {yunys: '电信', judian: '柳州龙城SS', value1: '125095', value2: '31534', value3: '3', value4: '3'},
        {yunys: '电信', judian: '玉林东明SS', value1: '145603', value2: '47227', value3: '2', value4: '2'},
        {yunys: '电信', judian: '玉林城北SS', value1: '169797', value2: '48437', value3: '1', value4: '1'},
        {yunys: '联通', judian: '东盟十楼TGB', value1: '514069', value2: '98824', value3: '28', value4: '28'},
        {yunys: '联通', judian: '东盟四楼TSS2', value1: '4837814', value2: '2406552', value3: '13', value4: '13'},
        {yunys: '联通', judian: '石柱岭TSS1', value1: '4850733', value2: '2416063', value3: '17', value4: '17'},
        {yunys: '联通', judian: '软件园TGA', value1: '426574', value2: '86731', value3: '78', value4: '78'},
        {yunys: '移动', judian: '移动608', value1: '11516991', value2: '6716370', value3: '28', value4: '28'},
        {yunys: '移动', judian: '移动白沙', value1: '11344231', value2: '6608599', value3: '36', value4: '36'}
      ],
      title: '电信网前端接入与拦截子系统'
    }
  },
  filters: {
    substr: function (value, length, str) {
      if (!value) return ''
      const le = value.length
      return value.substr(0, length) + (length < le ? str : '')
    },
    timeFilter (time) {
      return time.slice(0, 4) + '-' + time.slice(4, 6) + '-' + time.slice(6, 8) + ' ' + time.slice(8, 10) + ':' + time.slice(10, 12) + ':' + time.slice(12, 14)
    }
  },
  mounted () {
    // this.category()
    this.scrollvalid = setInterval(this.scroll, 3000)
  },
  methods: {
    // 数据表格 滚动 [新加]
    scroll () {
      this.animate = true
      setTimeout(() => {
        this.tableData.push(this.tableData[0]) // 将数组的第一个元素添加到数组的
        this.tableData.shift() // 删除数组的第一个元素
        this.animate = false // margin-top 为0 的时候取消过渡动画，实现无缝滚动
      }, 500)
    },
    category () { // 获得受害事件
      axios.post('/business/review/0/30', {}).then((res) => {
        if (res.code === 200) {
          this.tableData = res.data.list
        }
      })
    },
    sum (value1, value2, value3) {
      return parseInt(value1) + parseInt(value2) + parseInt(value3)
    }
  },
  beforeDestroy () {
    // 清除定时器
    clearInterval(this.scrollvalid)
  }
}
</script>

<style scoped>
  @keyframes rowup {
    0% {
        -webkit-transform: translate3d(0, 25px, 0);
        transform: translate3d(0, 25px, 0);
    }
    100% {
        -webkit-transform: translate3d(0, -470px, 0);
        transform: translate3d(0, -470px, 0);
    }
}
  .anim {
    transition: all 0.5s;
    position: relative;
  }
  .inter_mapTab .inter_table .inter_table_body ul li {
    height: 25px !important;
    line-height: 25px !important;
    font-size: 15px !important;
  }
  .inter_mapTab .inter_table .inter_table_body {
    height: 94% !important;
  }
  .border-self {box-shadow: none !important;}
</style>
