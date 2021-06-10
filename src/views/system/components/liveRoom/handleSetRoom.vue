<!--
   设置直播间人数
-->
<template>
  <div class="dialog">
    <el-dialog title="设置直播间人数" :width="width" :visible.sync="dialogVisible" @closed="handleClosed">
      <el-form :model="formData" :rules="rules" ref="formRef">
        <el-form-item label="直播间id" prop="anchorId" label-width="200px">
          <el-input v-model="formData.anchorId" clearable placeholder="请输入直播间ID"></el-input>
        </el-form-item>
        <el-form-item label="设置直播间显示人数" prop="num" label-width="200px">
          <el-input-number
            v-model="formData.num"
            controls-position="right"
            :min="1"
            step-strictly
            placeholder="请输入直播间人数"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { setRoomNumber } from '@/api/system'
export default {
  name: '',
  data() {
    return {
      formData: {
        anchorId: '',
        num: ''
      },
      rules: {
        anchorId: [{ required: true, message: '请输入直播房间号', trigger: 'blur' }],
        num: [{ required: true, message: '请输入人数', trigger: 'blur' }]
      }
    }
  },
  props: {
    width: {
      type: String,
      default: '700px'
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
  components: {},
  created() {},
  mounted() {},
  methods: {
    handleClosed() {
      console.log('关闭dialog')
      this.$refs.formRef.resetFields()
    },
    onConfirm() {
      console.log('请求接口')
      this.$refs.formRef.validate(valid => {
        if (!valid) return false
        console.log('开始请求接口', this.formData)
        setRoomNumber(this.formData).then(res => {
          console.log('-res-', res)
          this.dialogVisible = false
          this.$message({
            message: '添加成功',
            type: 'success'
          })
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
.el-input {
  width: 220px;
}
</style>
