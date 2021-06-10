<!--
   限时封禁组件
-->
<template>
  <div class="dialog">
    <el-dialog
      class="el_dialog"
      :center="true"
      title="限时封禁该用户账号"
      :visible.sync="dialogVisible"
      width="540px"
      @closed="handleClosed"
    >
      <el-form :model="formData" ref="formRef" label-width="70px">
        <el-form-item label="封禁时长">
          <el-date-picker
            v-model="formData.startTime"
            size="mini"
            disabled
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          >
          </el-date-picker>
          <span>--</span>
          <el-date-picker
            v-model="formData.endTime"
            size="mini"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptionsRange"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="封禁原因">
          <el-input
            v-model="formData.reason"
            type="textarea"
            :row="2"
            :maxlength="50"
            placeholder="请输入封禁原因"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <span>封禁时长内，用户只能看直播，禁止其他操作</span>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click.stop="onCancel">取 消</el-button>
        <el-button type="primary" @click="onConfirm">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { liveUserBan } from '@/api/user'
export default {
  name: '',
  data() {
    return {
      pickerOptionsRange: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  components: {},
  created() {},
  mounted() {},
  methods: {
    handleClosed() {},
    onCancel() {
      this.dialogVisible = false
    },
    onConfirm() {
      if (!this.formData.endTime) {
        this.$message({
          type: 'warning',
          message: '请选择结束时间!'
        })
        return
      }
      if (!this.formData.reason) {
        this.$message({
          type: 'warning',
          message: '请输入封禁原因!'
        })
        return
      }
      // console.log(this.formData)
      const { startTime, ...otherObj } = this.formData
      const params = { ...otherObj }
      // console.log('-params-', params)
      liveUserBan(params).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.dialogVisible = false
        this.$emit('success')
      })
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
/deep/ .el-form-item {
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
