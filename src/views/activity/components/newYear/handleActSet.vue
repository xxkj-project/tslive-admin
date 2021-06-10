<!--
 * @Author: wangshengxian
 * @Date: 2020-12-14 12:40:32
 * @LastEditors: wangshengxian
 * @LastEditTime: 2021-02-01 09:55:49
 * @Desc: 2021新年活动设置
-->
<template>
  <div class="activities-set-components">
    <el-dialog title="活动设置" width="800px" top="0" :visible.sync="dialogVisible">
      <el-form :model="formData" ref="formRef" :rules="rules" label-width="200px">
        <el-form-item label="集齐人数" prop="number">
          <el-input-number v-model="formData.number" :min="0" size="small" :controls="false"></el-input-number>
        </el-form-item>
      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button type="primary" size="large" :loading="isLoading" @click="onSave">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { setCollectNum } from '@/api/activity'
export default {
  name: '',
  data() {
    return {
      isLoading: false,
      rules: {
        number: [{ required: true, message: '请输入集齐人数', trigger: 'blur' }]
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
  created() {},
  mounted() {},
  methods: {
    onSave() {
      this.validateFunc(() => {
        console.log('-form-data-', this.formData)
        this.isLoading = true
        setCollectNum(this.formData)
          .then(res => {
            // console.log('-res-', res)
            this.$message({
              message: '设置成功!',
              type: 'success',
              duration: 2000
            })
            this.isLoading = false
            this.dialogVisible = false
            this.$emit('success')
          })
          .catch(err => {
            console.log(err)
            this.isLoading = false
          })
      })
    },

    validateFunc(callback) {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          callback()
        } else {
          return false
        }
      })
    },
    // 重置
    resetForm() {
      console.log('重置')
      this.$refs.formRef.resetFields()
    }
  },
  components: {}
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
.itemTitle {
  font-weight: 700;
  font-size: 18px;
  line-height: 18px;
  margin-bottom: 24px;
}

.el-dialog__wrapper {
  display: flex;
  justify-content: center;
  align-items: center;

  /deep/ .el-dialog__body {
    padding: 30px 50px 0;
  }
}

/deep/ .el-form {
  .el-form-item__label {
    padding-right: 16px;
  }
}

/deep/ .el-input-number {
  width: 180px;
}
</style>
