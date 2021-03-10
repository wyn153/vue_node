// 中间
<template>
  <div class="main">
    <div class="bread">

    </div>
    <div class="content">
      <router-view :key="+new Date()"></router-view>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeKey: ''
    }
  },
  components: {

  }
}
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  height: 100%;
  background-color: #fff;
  padding: 20px 25px;
  border-radius: 5px;
  transform: translateY(15px);
}
</style>
