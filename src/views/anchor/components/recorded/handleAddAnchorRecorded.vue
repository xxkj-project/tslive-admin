<!--
 * @Author: wangshengxian
 * @Date: 2020-10-14 16:41:48
 * @LastEditors: wangshengxian
 * @LastEditTime: 2021-01-20 10:36:52
 * @Desc: 录播列表 - 添加录播主播
-->
<template>
  <div class="">
    <el-dialog
      :title="(type === 'add' ? '添加' : '编辑') + '主播房间'"
      :width="width"
      :top="top"
      :center="isCenter"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      :visible.sync="dialogVisible"
      @closed="handleClosed"
    >
      <el-form :model="formData" ref="formRef" :rules="rules">
        <el-form-item label="主播ID:" prop="anchorId">
          <el-input v-model="formData.anchorId" clearable maxlength="8" placeholder="请输入主播ID"></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button @click="onReset">重置</el-button>
        <el-button type="primary" :loading="isLoading" @click="onConfirm">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { operateAnchorRoom } from '@/api/anchor'
export default {
  name: '',
  data() {
    return {
      isLoading: false,
      formData: {
        anchorId: ''
      },
      rules: {
        anchorId: [{ required: true, message: '请输入主播ID', trigger: 'blur' }]
      }
    }
  },
  props: {
    type: {
      type: String,
      default: 'add'
    },
    width: {
      type: String,
      default: '600px'
    },
    top: {
      type: String,
      default: '30vh'
    },
    isCenter: {
      type: Boolean,
      default: true
    },
    visible: {
      type: Boolean,
      default: false
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
  created() {},
  mounted() {},
  methods: {
    handleClosed() {
      this.onReset()
    },
    onReset() {
      this.$refs.formRef.resetFields()
    },
    onConfirm() {
      this.validateFunc(() => {
        this.isLoading = true
        const params = { type: 1, ...this.formData }
        // console.log('-params-', params)
        operateAnchorRoom(params)
          .then(res => {
            this.$message({
              message: '添加主播房间成功！',
              type: 'success'
            })
            this.isLoading = false
            this.dialogVisible = false
            this.$emit('success')
          })
          .catch(() => {
            this.isLoading = false
          })
      })
    },
    validateFunc(callback) {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          callback()
          return
        }
        return false
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

  .el-input {
    width: 220px;
  }
}
</style>
