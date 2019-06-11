<template>
<div class="mask" v-show="showhide=='show'?true:false"></div>
</template>

<script>
export default {
  name: 'maskComponent',
  props: ['showhide'],
  created: function () {
    // console.log("进入login")
  },
  mounted: function () {
    // alert($("#abc").html())
  },
  destroyed: function () {
    // console.log("销毁login")
  }
}
</script>
