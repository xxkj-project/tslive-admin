<!--
  添加/修改banner
-->
<template>
  <div class="addVideo">
    <el-dialog
      title="上传视频"
      width="600px"
      center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogVisiable"
      @closed="handleClosed"
    >
      <div class="content">
        <el-form :model="infoData" :rules="rules" ref="formRef" label-width="120px">
          <el-form-item label="ID" prop="userId">
            <el-input v-model="infoData.userId" maxlength="100" placeholder="请输入ID"></el-input>
          </el-form-item>
          <el-form-item label="标题" prop="word">
            <el-input v-model="infoData.word" maxlength="100" placeholder="请输入标题"></el-input>
          </el-form-item>

          <el-form-item label="短视频主题" prop="categoryName">
            <el-input
              v-model="infoData.categoryName"
              :disabled="true"
              maxlength="100"
              placeholder="请选择短视频主题"
            ></el-input>
            <div class="tagWrap">
              <template v-if="isHaveTagList">
                <div class="tagBox">
                  <el-tag v-for="(tag, index) in tagList" :key="index" :type="tag.type" @click="onSelect(tag)">{{
                    tag.name
                  }}</el-tag>
                </div>
              </template>
              <template v-else>
                <div class="no-list-box">
                  <p class="tipsTxt">没有可选的主题，请先去配置</p>
                </div>
              </template>
            </div>
          </el-form-item>
          <el-form-item label="视频封面" prop="photo">
            <imgUpload ref="imgUploadRef" v-model="infoData.photo" :limit="1" @success="handleImgUploadSuccess" />
          </el-form-item>
          <el-form-item label="上传视频" prop="url">
            <videoUpload
              ref="videoUploadRef"
              v-model="infoData.url"
              :limit="1"
              :size="204800"
              :httpRequest="handleHttpRequest"
            />
            <el-progress :percentage="uploadProgressVal" v-if="isShowProgress"></el-progress>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click.stop="onCancel">取 消</el-button>
        <el-button type="primary" @click="onComfirm">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import imgUpload from '@/components/imgUpload'
import videoUpload from '@/components/videoUpload'
import { insertShortVideo } from '@/api/shortVideo'
import { largeFileUpload } from '@/utils/wcsUpload'
import { resourceUrl } from '@/const/global'
export default {
  name: '',
  data() {
    return {
      uploadObj: null, // 上传实例
      // 是否显示进度条
      isShowProgress: false,
      // 视频上传进度条
      uploadProgressVal: 0,
      infoData: {
        userId: '',
        word: '',
        categoryId: '',
        categoryName: '',
        photo: [],
        url: []
      },
      rules: {
        userId: [{ required: true, message: '请输入用户ID', trigger: 'blur' }],
        word: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        categoryName: [{ required: true, message: '请选择短视频主题', trigger: 'change' }],
        photo: [{ required: true, message: '请上传图片', trigger: 'change' }],
        url: [{ required: true, message: '请上传视频', trigger: 'change' }]
      }
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    tagList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  computed: {
    dialogVisiable: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    },
    isHaveTagList() {
      return this.tagList.length > 0
    }
  },
  components: { imgUpload, videoUpload },
  mounted() {},
  methods: {
    handleClosed() {
      this.isShowProgress = false
      this.uploadProgressVal = 0
      this.infoData = {
        userId: '',
        word: '',
        categoryId: '',
        categoryName: '',
        photo: [],
        url: []
      }
      this.$refs.formRef.resetFields()
      // this.$refs.formRef.clearValidate()
      this.$refs.imgUploadRef.syncElUpload([])
      this.$refs.videoUploadRef.syncVideoList([])
    },
    handleImgUploadSuccess() {
      this.$refs.formRef.clearValidate('photo')
    },
    // 取消
    onCancel() {
      this.dialogVisiable = false
    },
    onSelect(data) {
      // console.log('-sel-tag-', data)
      const { id, name } = data
      this.infoData.categoryName = name
      this.infoData.categoryId = id
    },
    // 确认提交
    onComfirm() {
      this.$refs.formRef.validate(valid => {
        if (!valid) return false
        let params = { ...this.infoData }
        params.photo = params.photo[0]
        const midArr = this.infoData.url[0].split('/')
        params.url = midArr[midArr.length - 1]
        delete params.categoryName
        // console.log('-params-', params)
        insertShortVideo(params)
          .then(res => {
            this.$message({ type: 'success', message: '上传成功！' })
            this.dialogVisiable = false
            this.$emit('success')
          })
          .catch(err => {
            this.$message({ type: 'error', message: err.msg })
          })
      })
    },
    // 视频上传 -- 自定义上传
    handleHttpRequest(a) {
      largeFileUpload(a.file).then(res => {
        this.uploadProgressVal = 0
        this.isShowProgress = true
        this.uploadObj = res
        this.uploadObj.uploadProgress = this.handleProgress
        this.uploadObj.onComplete = this.handleComplete
        this.uploadObj.onError = this.handleError
      })
    },
    handleProgress(progress) {
      // console.log('-progress-', progress)
      this.uploadProgressVal = Math.floor(progress.total.percent)
      // console.log('-已经完成-', this.uploadProgressVal + '%')
    },
    handleComplete(res) {
      console.log('-res-', res)
      this.isShowProgress = false
      this.uploadProgressVal = 0
      this.$refs.videoUploadRef.isUploading = false // 关闭上传状态
      if (res.data.code) {
        // callback('error')
        return
      }
      this.$message({ message: '上传成功!', type: 'success' })
      this.infoData.url = [`${resourceUrl}/${this.uploadObj.file.name}`]
      this.$refs.formRef.clearValidate('url')
      console.log('-video-url-', this.infoData.url)
    },
    handleError(error) {
      // {code: 401, message: "客户端认证授权失败。请重试或提交反馈。", isRequestError: true}
      this.$message({ type: 'error', message: error.message })
      this.isShowProgress = false
      this.uploadProgressVal = 0
      this.$refs.videoUploadRef.isUploading = false
      this.$refs.videoUploadRef.syncVideoList()
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类

.tagWrap {
  padding-top: 22px;
  .tagBox {
    display: flex;
    flex-wrap: wrap;

    .el-tag {
      margin-right: 10px;
      margin-bottom: 12px;
      cursor: pointer;
    }
  }
}

/deep/ .el-input {
  width: 200px;
}

/deep/ .el-input.is-disabled .el-input__inner {
  color: #606266;
}

.no-list-box {
  line-height: 32px;
  color: red;
  padding-bottom: 12px;
}
</style>
