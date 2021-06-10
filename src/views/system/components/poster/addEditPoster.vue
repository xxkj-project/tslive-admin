<!--
   添加编辑海报
-->
<template>
  <div class="dialog">
    <el-dialog
      :title="(type === 'add' ? '添加' : '编辑') + '海报'"
      :width="width"
      :visible.sync="dialogVisible"
      @closed="handleClosed"
    >
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="formData.title" clearable></el-input>
        </el-form-item>
        <el-form-item label="链接" prop="link">
          <el-input v-model="formData.link" clearable></el-input>
        </el-form-item>
        <el-form-item label="海报图片" prop="photo">
          <imgUpload v-model="formData.photo" ref="imgRef" :limit="1" />
        </el-form-item>
      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button type="primary" :loading="isLoading" @click="onConfirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import imgUpload from '@/components/imgUpload'
import { addPoster, editPoster } from '@/api/system'
export default {
  name: '',
  data() {
    return {
      isLoading: false,
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        link: [{ required: true, message: '请输入访问链接', trigger: 'blur' }],
        photo: [{ type: 'array', required: true, message: '请上传图片', trigger: 'change' }]
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
      default: '800px'
    },
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
  components: { imgUpload },
  created() {},
  mounted() {},
  methods: {
    handleClosed() {
      this.onReset()
    },
    onConfirm() {
      this.validateFunc(() => {
        console.log('-type-', this.type)
        const { photo, ...other } = this.formData
        const params = { photo: photo[0], ...other }
        console.log('-params-', params)
        this.type === 'add' ? this.addPosterReq(params) : this.editPosterReq(params)
      })
    },
    addPosterReq(params) {
      this.isLoading = true
      addPoster(params)
        .then(res => {
          console.log('-res-', res)
          this.$message({
            message: '添加成功!',
            type: 'success'
          })
          this.isLoading = false
          this.dialogVisible = false
          this.$emit('success')
        })
        .catch(() => {
          this.isLoading = false
        })
    },
    editPosterReq(params) {
      this.isLoading = true
      editPoster(params)
        .then(res => {
          console.log('-res-', res)
          this.$message({
            message: '修改成功!',
            type: 'success'
          })
          this.isLoading = false
          this.dialogVisible = false
          this.$emit('success')
        })
        .catch(err => {
          console.log(err)
          this.isLoading = false
        })
    },
    onReset() {
      this.$refs.formRef.resetFields()
    },
    validateFunc(cb) {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          cb()
          return
        }
        return false
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
