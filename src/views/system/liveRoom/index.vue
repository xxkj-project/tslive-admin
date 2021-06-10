<!--
   直播间配置
-->
<template>
  <div class="liveRoom">
    <el-button type="primary" size="mini" icon="el-icon-setting" @click="onSetRoomNumber">设置直播间人数</el-button>
    <setRoom :visible.sync="isSetRoom" />
  </div>
</template>

<script>
import setRoom from '@/views/system/components/liveRoom/handleSetRoom'
export default {
  name: '',
  data() {
    return {
      isSetRoom: false
    }
  },
  computed: {},
  components: { setRoom },
  created() {},
  mounted() {},
  methods: {
    onSetRoomNumber() {
      this.isSetRoom = true
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
</style>
