<template>
  <div class="border-self data noback mapTab inter_mapTab inter_margin analysis">
    <Table :columns="columns1" :data="data1" border size="large" class="generator"></Table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      columns1: [
        {
          title: '系统名称',
          key: 'name'
        },
        {
          title: '系统包含主要内容',
          key: 'conent'
        }
      ],
      data1: [
        {
          name: '微模块系统',
          conent: '含33个标准机柜以及1个电磁屏蔽机柜、1个综合机柜，机柜含底座、走线槽等，含1个UPS输出分配柜，1个空调配电屏，微模块密闭冷通道（包含假面板）、电力电缆等配套设备，含天窗、通道门、温湿度监控、电源监控、空调漏水监控等。'
        },
        {
          name: '空调系统',
          conent: '二楼机房冷通道内安装七套精密空调、负一楼配电房安装一套精密空调'
        },
        {
          name: 'AUPS系统',
          conent: '在负一楼配电房安装一套AUPS系统，包含电源输入柜、滤波器、AUPS主机、电源输出柜、后备蓄电池（满负载情况下，后备时间半小时）'
        },
        {
          name: '气体消防系统',
          conent: '在负一楼配电房和二楼机房各安装一套七氟丙烷气体消防系统'
        },
        {
          name: '接地系统',
          conent: '二楼机房和负一楼配电房进行接地，接地点均是大楼钢筋。'
        },
        {
          name: '电力系统',
          conent: '提供本次项目所需的所有电力电缆，包括AUPS电力输入输出、微模块内所有机柜的配电、列间空调的配电等。'
        },
        {
          name: '监控系统',
          conent: '在二楼机房内安装5个监控摄像机、负一楼配电房安装1个监控摄像机。'
        }
      ]
    }
  }
}
</script>

<style>
.generator .ivu-table-large th {
  height: 100px;
}
.generator .ivu-table {
  font-size: 32px;
  color: #eee;
}
.generator .ivu-table td, .generator .ivu-table th{
  background: #0b1e55
}
.generator .ivu-table-row-hover td{
  background: #045194
}
</style>
