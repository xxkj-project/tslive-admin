<!--
 * @Author: wangshengxian
 * @Date: 2020-08-19 09:57:01
 * @LastEditors: wangshengxian
 * @LastEditTime: 2020-10-26 10:00:32
 * @Desc: 订单管理 - 充值管理
-->
<template>
  <div class="userList">
    <searchForm :formOptions="formOptions" :btnItems="btnItems" @onSearch="handleSearch" @onExport="handleExport" />
    <div class="listBox">
      <div class="tableBox">
        <el-table :data="tableData" tooltip-effect="dark" style="width: 100%">
          <el-table-column prop="userId" label="ID" min-width="100"></el-table-column>
          <el-table-column prop="name" label="昵称" min-width="120"></el-table-column>
          <el-table-column prop="currency" label="充值币种" min-width="80"></el-table-column>
          <el-table-column prop="amount" label="充值数量" min-width="100"></el-table-column>
          <el-table-column prop="utrate" label="汇率(充值币种/TST)" min-width="160"></el-table-column>
          <el-table-column prop="cash" label="TST到账" min-width="100"></el-table-column>
          <el-table-column prop="address" label="充值地址" min-width="280"></el-table-column>
          <el-table-column prop="orderNum" label="订单号" min-width="280"></el-table-column>
          <el-table-column prop="createTime" label="时间" min-width="160"></el-table-column>
        </el-table>
      </div>
    </div>

    <pagination
      :currentPage.sync="pagination.currentPage"
      :pageSize.sync="pagination.pageSize"
      :total="pagination.total"
      @currentChange="currentChange"
      @sizeChange="sizeChange"
    />
  </div>
</template>

<script>
import searchForm from '@/components/searchForm'
import pagination from '@/components/pagination'
import { getRechargeList } from '@/api/order'
import { exportExcel } from '@/api/common'
import tools from '@/utils/tools'
export default {
  name: '',
  data() {
    return {
      btnItems: 'search,export',
      formdata: {
        keyword: '',
        address: '',
        startTime: '',
        endTime: '',
        orderNum: ''
      },
      tableData: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      initTimes: tools.getLatelyDays(7, '{y}-{m}-{d} {h}:{i}:{s}')
    }
  },

  computed: {
    formOptions() {
      let options = [
        {
          label: 'ID/昵称',
          prop: 'keyword',
          element: 'el-input',
          initValue: '',
          placeholder: '请输入ID/昵称'
        },
        {
          label: '充值地址',
          prop: 'address',
          element: 'el-input',
          initValue: '',
          placeholder: '请输入充值地址'
        },
        {
          label: '订单号',
          prop: 'orderNum',
          element: 'el-input',
          initValue: '',
          placeholder: '请输入订单号'
        },
        {
          label: '时间',
          prop: 'times',
          element: 'el-date-picker',
          initValue: this.initTimes,
          placeholder: ''
        }
      ]
      return options
    }
  },
  created() {
    this.formdata.startTime = this.initTimes[0]
    this.formdata.endTime = this.initTimes[1]
    this.getData()
  },
  methods: {
    getInitData(pageNum = 1, pageSize = 10) {
      this.pagination.currentPage = pageNum
      this.pagination.pageSize = pageSize
      this.getData()
    },
    // 搜索
    handleSearch(data) {
      const { keyword, orderNum, address, times } = data
      let startTime = times ? times[0] : ''
      let endTime = times ? times[1] : ''
      this.formdata = { keyword, orderNum, address, startTime, endTime }
      this.getInitData()
    },
    handleExport() {
      console.log('-export-params-', this.formdata)
      exportExcel('rechargeList', this.formdata)
    },
    currentChange(pageNo) {
      this.getInitData(pageNo, this.pagination.pageSize)
    },
    sizeChange(pageSize) {
      this.getInitData(1, pageSize)
    },
    // 数据请求
    getData() {
      const params = { pageSize: this.pagination.pageSize, pageNum: this.pagination.currentPage, ...this.formdata }
      // console.log('-params-', params)
      getRechargeList(params).then(res => {
        console.log('-res-', res)
        const { totalCount, result } = res.data
        this.pagination.total = totalCount
        this.tableData = result
      })
    }
  },
  components: { searchForm, pagination }
}
</script>

<style lang="less" scoped></style>
