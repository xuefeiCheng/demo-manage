<template>
  <div class="data mapTab noback inter_mapTab inter_margin" style="height:89%">
      <!-- title 部分 -->
      <div class="border-self" style="box-sizing:border-box;height:100px;font-size:23px;text-align:center;color:#ccc;padding-top:20px;">
          <div class="inter_title">{{title}}</div>
      </div>
      <!-- 主体部分 -->
      <div style="height: calc(100% - 117px);width:100%;box-sizing:order-box;display:flex">
          <div style="flex:0 0 60.1%;padding:15px" class="border-self">
            <img src="static/img/bigscreen/zpdxxfx01.PNG" alt="" style="height:100%;width:100%">
          </div>
          <div style="flex:0 0 39.9%" class="border-self">
              <div style="height:100%;position:relative">
                <div class="des">
                  ?
                  <div class="des_content">
                    基于信令接入子系统输出的CDR（短消息、话单），结合黑白名单过滤、模板匹配、短文本分类、通联行为特征分析以及关联学习等技术手段，实现针对诈骗短消息的分析识别，提取诈骗短消息SP号、诈骗电话号码、诈骗短消息受害人号码、恶意URL、地理位置、被仿冒对象号码(如银行、邮局、快递、学校、社保机构……)
                  </div>
                </div>
                <div class="box_title border-self" style="height:7%;font-size:22px;padding-top:8px">
                    <span class="cicle"></span><span>数据表格</span>
                </div>
                <div class="box_conent" style="height:93%">
                  <div class="inter_table" style="height:100%">
                    <div class="inter_table_header" style="font-size:20px">
                      <ul>
                      <!-- <li>手机号</li> -->
                      <li style="width:10%;text-align:center">运营商</li>
                      <li style="width:10%;">事件</li>
                      <li style="width:65%;text-align:center">事件详情</li>
                      <li style="width:10%;text-align:center">时间</li>
                      </ul>
                    </div>
                    <div class="inter_table_body">
                      <div :class="{anim: animate === true}">
                        <ul v-for="(item, index) in tableData" :key="index">
                          <!-- <li :title='item.real_msisdn'>{{item.user_msisdn}}</li> -->
                          <li class="BLUE" style="width:10%;text-align:center">{{item.user_comcode}}</li>
                          <li class="ORANGE" style="width:10%;">{{item.charac_subcategory}}</li>
                          <li style="width:65%;" :title='item.charac_category_detail'>{{item.charac_category_detail | substr(33,'...')}}</li>
                          <li style="width:10%;text-align:center" :title='item.commit_time' class="YELLOW">{{item.commit_time | substr(8,'')}}</li>
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
      tableData: [],
      title: '诈骗短消息分析'
    }
  },
  filters: {
    substr: function (value, length, str) {
      if (!value) return ''
      const le = value.length
      return value.substr(0, length) + (length < le ? str : '')
    }
  },
  mounted () {
    this.category()
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
      axios.get('interbigscreen/getcategory')
        .then((res) => {
          if (res.code === 200) {
            this.tableData = res.data
          }
        })
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
  /* 提示信息 css */
  .des {
    height: 30px;
    width: 30px;
    background: #fff;
    position: absolute;
    color: #000;
    font-size: 20px;
    top: 0;
    right: 0;
    text-align: center;
    border-radius: 50%;
    font-weight: bold;
    cursor: pointer;
  }
  .des_content {
    position: absolute;
    background: #638aa9;
    width: 822px;
    min-height: 30px;
    right: 0;
    top: 0;
    color: #eee;
    padding: 10px 15px;
    font-size: 16px;
    border-radius: 5px;
    display: none;
    text-align: left;
    z-index: 1;
  }
  .des:hover .des_content{
    /*  */
    display: block;
  }
</style>
