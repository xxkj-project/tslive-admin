<!--
 * @Author: wangshengxian
 * @Date: 2020-08-19 09:57:01
 * @LastEditors: wangshengxian
 * @LastEditTime: 2020-11-19 15:20:37
 * @Desc: 新增/修改banner - components
-->

<template>
  <div class="add-edit-components">
    <el-dialog
      :title="(type === 'add' ? '新增' : '编辑') + '轮播'"
      width="600px"
      center
      :visible.sync="dialogVisiable"
      @close="handleClose"
    >
      <div class="content">
        <el-row class="row">
          <el-col :span="23"
            ><span class="redIcon">*</span> 上传图片 （仅一张，支持jgeg/jpg/png/bmp/gif文件，不大于5M）</el-col
          >
        </el-row>
        <el-row class="row">
          <el-col :span="19" :offset="4">
            <img-upload v-model="infoData.imageUrl" ref="imgUpload" :limit="1" :size="5120"></img-upload>
          </el-col>
        </el-row>
        <el-row class="row">
          <el-col :span="4"><span class="redIcon"></span>类型</el-col>
          <el-col :span="19">
            <el-radio-group v-model="infoData.mold">
              <el-radio :label="0">轮播</el-radio>
              <el-radio :label="1">启动页</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row class="row">
          <el-col :span="4"><span class="redIcon"></span>添加链接</el-col>
          <el-col :span="19">
            <el-input v-model="infoData.link" maxlength="100" placeholder="请输入链接"></el-input>
          </el-col>
        </el-row>
        <el-row class="row">
          <el-col :span="4"><span class="redIcon"></span>状态</el-col>
          <el-col :span="19">
            <el-switch v-model="infoData.type" :active-value="0" :inactive-value="2"> </el-switch>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click.stop="handleCancel">取 消</el-button>
        <el-button type="primary" @click="sureHandle">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import imgUpload from '@/components/imgUpload'
import { updateLiveAdspotsByid, addLiveAdspots } from '@/api/system'
export default {
  name: '',
  data() {
    return {}
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
    infoData: {
      type: Object,
      dafualt: function() {
        return {}
      }
    }
  },
  mounted() {},
  computed: {
    dialogVisiable: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  methods: {
    setDialogViaiable() {
      this.dialogVisiable = false
      this.$refs.imgUpload.imgList = []
      this.$emit('init')
    },
    // 关闭dialog
    handleClose() {
      this.setDialogViaiable()
    },
    handleCancel() {
      this.setDialogViaiable()
    },
    sureHandle() {
      console.log('-comfirm-', this.infoData)
      if (this.infoData.imageUrl.length === 0) {
        this.$message.error('图片不能为空！')
        return
      }
      let params = { ...this.infoData }
      if (this.type === 'add') {
        params.imageUrl = params.imageUrl[0]
        this.addBannerReq(params)
        return
      }
      params.imageurl = params.imageUrl[0]
      delete params.imageUrl
      this.editBannerReq(params)
    },
    addBannerReq(data) {
      console.log('-add-params-', data)
      let msg = data.mold ? '新建启动页' : '新建轮播'
      this.confirmDialogFunc(msg, () => {
        addLiveAdspots(data)
          .then(res => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '新增成功!'
              })
              this.$emit('success')
              this.setDialogViaiable()
            }
          })
          .catch(err => {
            console.log(err)
          })
      })
    },
    editBannerReq(data) {
      console.log('-params-', data)
      let msg = data.mold ? '修改启动页' : '修改轮播'
      this.confirmDialogFunc(msg, () => {
        updateLiveAdspotsByid(data)
          .then(res => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '编辑成功!'
              })
              this.$emit('success')
              this.setDialogViaiable()
            }
          })
          .catch(err => {
            console.log(err)
          })
      })
    },
    confirmDialogFunc(msg, callback) {
      this.$confirm(`确定${msg}`, '', {
        center: true
      })
        .then(() => {
          callback()
        })
        .catch(() => {})
    }
  },
  components: { imgUpload }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
.content {
  padding: 0px 40px;
  .redIcon {
    color: red;
  }
  .row {
    line-height: 60px;
    .img {
      width: 80px;
      height: 80px;
    }
    .delete {
      padding: 3px 8px;
      border: 1px solid gray;
      border-radius: 4px;
      margin-bottom: 4px;
    }
  }
}
</style>
