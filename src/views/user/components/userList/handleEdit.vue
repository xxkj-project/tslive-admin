<template>
  <div class="dialog">
    <el-dialog title="编辑用户信息" width="600px" center :visible.sync="dialogVisible" @closed="handleClosed">
      <el-form :model="formData" ref="formRef" :rules="rules">
        <el-form-item label="新密码:" prop="newPass">
          <el-input
            type="password"
            placeholder="请输入新的密码"
            v-model="formData.newPass"
            clearable
            maxlength="18"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="注意:" prop="">
          <p>此处为修改大V后台用户密码</p>
        </el-form-item>
      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button type="primary" @click="onConfirm">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import md5 from 'js-md5'
import { editChangePwd } from '@/api/user'
export default {
  name: '',
  data() {
    return {
      rules: {
        newPass: [
          { required: true, message: '新密码不能为空', trigger: 'blur' },
          { min: 6, max: 16, message: '密码长度必须在6到16位之间', trigger: 'blur' }
        ]
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
    handleClosed() {
      this.$refs.formRef.clearValidate()
    },
    onConfirm() {
      this.$refs.formRef.validate(valid => {
        console.log(valid)
        if (!valid) {
          return false
        }
        const { newPass, userId } = this.formData
        const params = { id: userId, pwd: md5.hex(newPass) }
        // console.log('-params-', params)
        editChangePwd(params).then(res => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.dialogVisible = false
          this.$emit('success')
        })
      })
    }
  },
  components: {}
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
.el-input {
  width: 280px;
}
.el-form-item {
  display: flex;
  justify-content: center;

  /deep/ .el-form-item__label {
    width: 100px;
  }
}
</style>
