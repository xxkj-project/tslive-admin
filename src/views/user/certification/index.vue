<!--
  用户管理 - 实名认证
-->
<template>
  <div class="certification">
    <searchForm :formOptions="formOptions" @onSearch="handleOnSearch" />

    <div class="main">
      <el-tabs type="card" v-model="tabPosition" @tab-click="onTabClick">
        <el-tab-pane label="身份认证" name="identity">
          <identityAuth
            :list="tableData"
            :isFinished="isFinished"
            @authEvent="handleAuthEvent"
            @batchOperate="handleBatchOperate"
          />
        </el-tab-pane>
        <el-tab-pane label="高级认证" name="senior">
          <seniorAuth
            :list="tableData"
            :isFinished="isFinished"
            @checkPic="handleCheckPic"
            @authEvent="handleAuthEvent"
            @batchOperate="handleBatchOperate"
          />
        </el-tab-pane>
        <el-tab-pane label="视频认证" name="video">
          <videoAuth
            :list="tableData"
            :isFinished="isFinished"
            @checkPic="handleCheckPic"
            @checkVideo="handleCheckVideo"
            @authEvent="handleAuthEvent"
            @batchOperate="handleBatchOperate"
          />
        </el-tab-pane>
      </el-tabs>

      <pagination
        :currentPage.sync="pagination.currentPage"
        :pageSize.sync="pagination.pageSize"
        :total="pagination.total"
        @currentChange="currentChange"
        @sizeChange="sizeChange"
      />
    </div>

    <idPhoto :infoData="certifyInfoData" :dialogVis.sync="isIdCardDialog" />

    <videoPlayDialog
      :dialogVisible.sync="isVideoPlay"
      title="视频"
      width="300px"
      :isAutoPlay="true"
      :videoUrl="videoUrl"
    />

    <auditDialog
      :visible.sync="isNotPass"
      :reasonList="reasonList"
      :isLoading="isLoading"
      @success="handleAuditSuccess"
    />
  </div>
</template>

<script>
import searchForm from '@/components/searchForm'
import pagination from '@/components/pagination'
import auditDialog from '@/components/auditDialog'
import identityAuth from '@/views/user/components/certify/identityAuth'
import seniorAuth from '@/views/user/components/certify/seniorAuth'
import videoAuth from '@/views/user/components/certify/videoAuth'
import idPhoto from '@/views/user/components/certify/idPhoto'
import videoPlayDialog from '@/components/videoPlayDialog'

import { getCertificateType, getAuditStatus } from '@/filters/global'
import { realNameAuditTemplate } from '@/filters/auditTemplate'
import { getCertificationList, updateStatus, updateByIds } from '@/api/user'
export default {
  name: '',
  data() {
    return {
      isFinished: false,
      tabPosition: 'identity',
      initFormData: {},
      searchData: {
        infoSearch: '',
        region: '',
        type: '',
        name: '',
        certificateNo: '',
        status: '',
        startDate: '',
        endDate: ''
      },
      // multipleSelList: [], // 多选list
      tableData: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      isIdCardDialog: false,
      // 证件照dialog -- infoData
      certifyInfoData: {
        title: '身份证',
        list: []
      },
      // 视频查看
      isVideoPlay: false,
      videoUrl: '',
      // 审核不通过相关
      isNotPass: false,
      isLoading: false,
      auditFormData: {}
    }
  },
  components: { searchForm, pagination, auditDialog, identityAuth, seniorAuth, videoAuth, idPhoto, videoPlayDialog },
  created() {
    this.getData()
  },
  mounted() {},
  computed: {
    reasonList() {
      return realNameAuditTemplate()
    },
    formOptions() {
      let options = this.tabPosition === 'identity' ? [...this.idCardOptions] : [...this.otherOptions]
      // console.log('-form-options-', options)
      return options
    },
    idCardOptions() {
      let options = [
        {
          label: 'ID/昵称',
          prop: 'infoSearch',
          element: 'el-input',
          initValue: '',
          placeholder: '请输入ID/昵称'
        },
        {
          label: '地区',
          prop: 'region',
          element: 'el-input',
          initValue: '',
          placeholder: '请输入地区'
        },
        {
          label: '证件类型',
          prop: 'type',
          element: 'el-select',
          initValue: '',
          placeholder: '全部',
          options: getCertificateType()
        },
        {
          label: '姓名',
          prop: 'name',
          element: 'el-input',
          initValue: '',
          placeholder: '请输入姓名'
        },
        {
          label: '证件号',
          prop: 'certificateNo',
          element: 'el-input',
          initValue: '',
          placeholder: '请输入证件号'
        },
        {
          label: '状态',
          prop: 'status',
          element: 'el-select',
          initValue: '',
          placeholder: '全部',
          options: getAuditStatus()
        },
        {
          label: '时间',
          prop: 'times',
          element: 'el-date-picker',
          initValue: '',
          placeholder: ''
        }
      ]
      return options
    },
    otherOptions() {
      let options = [
        {
          label: 'ID/昵称',
          prop: 'infoSearch',
          element: 'el-input',
          initValue: '',
          placeholder: '请输入ID/昵称'
        },

        {
          label: '证件类型',
          prop: 'type',
          element: 'el-select',
          initValue: '',
          placeholder: '全部',
          options: getCertificateType()
        },

        {
          label: '状态',
          prop: 'status',
          element: 'el-select',
          initValue: '',
          placeholder: '全部',
          options: getAuditStatus()
        },
        {
          label: '时间',
          prop: 'times',
          element: 'el-date-picker',
          initValue: '',
          placeholder: ''
        }
      ]
      return options
    }
  },
  watch: {},
  methods: {
    getInitData(pageNum = 1, pageSize = 10) {
      this.pagination.currentPage = pageNum
      this.pagination.pageSize = pageSize
      this.getData()
    },
    onTabClick() {
      this.searchData = this.initSearchFD()
      // console.log('-search-form-', this.searchData)
      this.getInitData()
    },
    initSearchFD() {
      let fd = { infoSearch: '', type: '', status: '', times: '' }
      if (this.tabPosition === 'identity') {
        fd = { ...fd, region: '', name: '', certificateNo: '' }
      }
      return fd
    },
    // 搜索
    handleOnSearch(data) {
      // console.log('-search-data-', data)
      const { times, ...otherObj } = data
      this.searchData = otherObj
      this.searchData.startDate = times ? times[0] : ''
      this.searchData.endDate = times ? times[1] : ''
      this.getInitData()
    },
    // 翻页
    currentChange(pageNo) {
      this.getInitData(pageNo, this.pagination.pageSize)
    },
    sizeChange(pageSize) {
      this.getInitData(1, pageSize)
    },
    // 查看身份证件照
    handleCheckPic(row) {
      console.log('-check-', row)
      // type = 1 身份证；2 护照
      const { photoPositive, photoSide, idCard, type } = row
      // console.log('-证件-type-', type)
      // console.log('-证件照正面-url-', photoPositive, '-证件照反面-url-', photoSide, '-证件类型为身份证-url-', idCard)
      this.certifyInfoData.list = [photoPositive, photoSide]
      if (type === 1) {
        this.certifyInfoData.title = '身份证'
        this.certifyInfoData.list.push(idCard)
      } else {
        this.certifyInfoData.title = '护照'
      }
      this.isIdCardDialog = true
    },
    handleCheckVideo(row) {
      console.log('-look-video-', row)
      this.isVideoPlay = true
      this.videoUrl = row.videoUrl
    },

    handleBatchOperate(data) {
      // console.log('-批量操作-', data)
      let type = data[0]
      let list = data[1]
      if (list.length === 0) {
        this.msgTipsFunc({ message: '请先选择需要操作的选项', type: 'warning' })
        return
      }
      let ids = this.setIdsVal(list, true)
      if (ids === '') {
        this.msgTipsFunc({ message: '当前页没有可以审核的选项', type: 'warning', duration: 2000 })
        return
      }

      // status = 1 通过 2 未通过
      let status, msgType
      if (type === 'pass') {
        status = 1
        msgType = 'confirm'
      } else {
        status = 2
        msgType = 'prompt'
      }

      this.msgBoxFunc(msgType, val => {
        let params = { status, ids }
        val && (params.content = val)
        // console.log('-批量审核-params-', params, '-url-key-', this.tabPosition)
        updateByIds(params, this.tabPosition).then(res => {
          // console.log('-批量审核-', res)
          const { msg = '批量审核完成' } = res
          this.msgTipsFunc({ message: msg }, () => {
            this.isFinished = true
            this.getData()
          })
        })
      })
    },
    // isFilter是否过滤多选的list,默认为false不过滤
    setIdsVal(list, isFilter = false, filterAttr = 'status', filterAttrVal = 0) {
      let result = []
      list.map(val => {
        if (!isFilter) {
          result.push(val.id)
        } else {
          if (val[filterAttr] === filterAttrVal) {
            result.push(val.id)
          }
        }
      })
      return result.toString()
    },

    // 认证(通过/不通过)
    handleAuthEvent(data) {
      // console.log('-认证-', data)
      let status = data[0]
      let row = data[1]
      let params = { status, id: row.id }
      if (status === 1) {
        this.auditPass(params)
        return
      }
      // 审核不通过
      this.auditNoPass(params)
    },
    // 审核通过
    auditPass(params) {
      this.$confirm('审核通过', '提示', {
        type: 'warning',
        center: true
      })
        .then(() => {
          this.auditReq(params)
        })
        .catch(() => {})
    },
    // 审核不通过
    auditNoPass(params) {
      // console.log('-not-pass-', params)
      this.isNotPass = true
      this.auditFormData = params
    },
    handleAuditSuccess(data) {
      const content = typeof data === 'number' ? realNameAuditTemplate(data) : data
      const params = { content, ...this.auditFormData }
      this.auditReq(params)
    },
    auditReq(params) {
      // console.log('-params-', params, '-url-key-', this.tabPosition)
      this.isLoading = true
      updateStatus(params, this.tabPosition)
        .then(res => {
          this.msgTipsFunc({ message: '操作成功' })
          this.isLoading = false
          this.isNotPass = false
          this.getData()
        })
        .catch(() => {
          this.isLoading = false
        })
    },
    msgTipsFunc({ message, type = 'success', duration = 1500 }, callback) {
      callback = callback || (() => {})
      this.$message({
        message,
        type,
        duration,
        onClose: callback
      })
    },
    // type = confirm/prompt
    msgBoxFunc(type, callback) {
      callback = callback || (() => {})
      if (type === 'confirm') {
        this.$confirm('批量审核通过', '提示', {
          type: 'warning',
          center: true
        })
          .then(() => {
            callback()
          })
          .catch(() => {})
      } else {
        this.$prompt('批量审核不通过', '提示', {
          inputType: 'textarea',
          inputPlaceholder: '请输入不通过的原因',
          inputErrorMessage: '不通过原因不能为空',
          inputValidator(value) {
            if (!value) return false
          }
        })
          .then(({ value }) => {
            callback(value)
          })
          .catch(() => {})
      }
    },
    // 数据请求
    getData() {
      let params = {
        pageSize: this.pagination.pageSize,
        pageNum: this.pagination.currentPage,
        ...this.searchData
      }
      // console.log('-params-', params, '-url-key-', this.tabPosition)
      getCertificationList(params, this.tabPosition).then(res => {
        const { totalCount, result } = res.data.page
        this.pagination.total = totalCount
        this.tableData = result
        // console.log('-table-data-', this.tableData, '-total-', this.pagination.total)
      })
    }
  }
}
</script>
<style lang="less" scoped></style>
