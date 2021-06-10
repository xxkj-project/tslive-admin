<!--
 * @Author: wangshengxian
 * @Date: 2020-10-14 16:41:48
 * @LastEditors: wangshengxian
 * @LastEditTime: 2020-10-14 18:23:48
 * @Desc: 添加主播
-->
<template>
  <div class="">
    <el-dialog
      :title="(type === 'add' ? '添加' : '编辑') + '主播'"
      width="700px"
      center
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      :before-close="handleBeforeClose"
      :visible.sync="dialogVisible"
    >
      <el-form :model="formData" ref="formRef" :rules="rules">
        <el-form-item label="添加主播ID:" prop="anchorId">
          <el-input v-model="formData.anchorId" clearable maxlength="10" placeholder="请输入主播ID"></el-input>
        </el-form-item>
        <el-form-item label="姓名:" prop="name">
          <el-input v-model="formData.name" clearable maxlength="5" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="身份证号:" prop="idcard">
          <el-input v-model="formData.idcard" clearable maxlength="18" placeholder="请输入身份证号"></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button @click="onReset">重置</el-button>
        <el-button type="primary" @click="onConfirm">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { insertRoomHotrank } from '@/api/anchor'
export default {
  name: '',
  data() {
    return {
      rules: {
        anchorId: [{ required: true, message: '请输入主播ID', trigger: 'blur' }],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        idcard: [{ required: true, message: '请输入身份证号码', trigger: 'blur' }]
      }
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'add'
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
    handleBeforeClose(done) {
      done()
    },
    onReset() {
      this.$refs.formRef.resetFields()
    },
    onConfirm() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          // console.log('-formData-', this.formData)
          const params = {
            useridx: this.formData.anchorId,
            username: this.formData.name,
            idcard: this.formData.idcard
          }
          // console.log('-params-', params)
          insertRoomHotrank(params).then(res => {
            this.$emit('confirm')
            this.$message({
              message: '添加主播成功！'
            })
          })
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
