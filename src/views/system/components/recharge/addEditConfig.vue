<!--
 * @Author: wangshengxian
 * @Date: 2020-10-13 15:13:20
 * @LastEditors: wangshengxian
 * @LastEditTime: 2021-01-25 16:11:14
 * @Desc:
-->
<template>
  <div class="dialog">
    <el-dialog
      :title="(type === 'add' ? '添加' : '编辑') + '充值配置'"
      :width="width"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      :visible.sync="dialogVisible"
      :before-close="handleBeforeClose"
      @closed="handleClosed"
    >
      <el-form :model="formData" ref="formRef" :rules="rules">
        <el-form-item label="出售数量:" prop="number">
          <el-input-number
            v-model="formData.number"
            controls-position="right"
            :min="0"
            :step="1"
            step-strictly
            @change="onChange"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="奖励数量:" prop="reward">
          <el-input-number
            v-model="formData.reward"
            controls-position="right"
            :min="0"
            :step="1"
            step-strictly
            @change="onChange"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <div class="dialog-fotter" slot="footer">
        <el-button type="primary" size="small" :loading="isLoading" @click="onConfirm">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addPayConfig, editPayConfig } from '@/api/system'
export default {
  name: '',
  data() {
    return {
      surplusNum: 0,
      isLoading: false,
      rules: {
        number: [{ required: true, message: '请输入出售数量', trigger: 'blur' }],
        reward: [{ required: true, message: '请输入奖励数量', trigger: 'blur' }]
      }
    }
  },
  props: {
    dialogVis: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'add'
    },
    width: {
      type: String,
      default: '50%'
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
        return this.dialogVis
      },
      set(val) {
        this.$emit('update:dialogVis', val)
      }
    }
  },
  watch: {
    formData: {
      handler(val) {
        // console.log('-watch-', val)
      },
      deep: true
    }
  },
  created() {},
  mounted() {},
  methods: {
    onChange(val) {
      // console.log('-change-val-', val)
    },
    onConfirm() {
      this.valideFunc(() => {
        console.log('正在请求...')
        if (!this.formData.number) {
          this.$message({
            message: '出售数量不能为0！',
            type: 'warning'
          })
          return
        }
        const params = this.formData
        console.log('-params-', params)
        this.type === 'add' ? this.addReqFunc(params) : this.editReqFunc(params)
      })
    },
    addReqFunc(data) {
      addPayConfig(data).then(res => {
        console.log('-res-', res)
        this.$message({
          message: '添加成功!',
          type: 'success'
        })
        this.dialogVisible = false
        this.$emit('success')
      })
    },
    editReqFunc(data) {
      editPayConfig(data).then(res => {
        console.log('-res-', res)
        this.$message({
          message: '编辑成功!',
          type: 'success'
        })
        this.dialogVisible = false
        this.$emit('success')
      })
    },
    handleBeforeClose(done) {
      console.log('关闭图标关闭dialog')
      this.resetForm()
      done()
    },
    handleClosed() {
      console.log('-按钮关闭dialog-')
    },
    resetForm() {
      console.log('重置')
      this.$refs.formRef.resetFields()
    },
    valideFunc(callback) {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          callback()
        } else {
          return false
        }
      })
    }
  },
  components: {}
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
.el-form-item {
  display: flex;
  justify-content: center;

  /deep/ .el-form-item__label {
    width: 100px;
  }
  .el-input-number {
    margin-right: 6px;
  }
}

.el-input-number {
  width: 140px;
}
</style>
