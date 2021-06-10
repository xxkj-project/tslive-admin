<!--
 订单管理 - 提现管理
-->
<template>
  <div class="withdrawList">
    <cardBox :list="infoList" />
    <searchForm :formOptions="formOptions" :btnItems="btnItems" @onSearch="handleSearch" @onExport="handleExport" />
    <div class="listBox">
      <div class="tableBox">
        <el-table :data="tableData" tooltip-effect="dark" style="width: 100%">
          <el-table-column prop="userId" width="120" label="ID" min-width="100"></el-table-column>
          <el-table-column prop="nickName" label="昵称" min-width="100"></el-table-column>
          <el-table-column prop="number" label="购买数量(TST)" min-width="120"></el-table-column>
          <el-table-column prop="reward" label="奖励数量(TST)" min-width="120"></el-table-column>
          <el-table-column prop="cny" label="充值金额(元)" min-width="100"></el-table-column>
          <el-table-column prop="rate" label="购买单价(元/TST)" min-width="140"></el-table-column>
          <el-table-column prop="type" label="支付方式" :formatter="typeFormatter" min-width="100"></el-table-column>
          <el-table-column prop="orderNo" label="订单号" min-width="280"></el-table-column>
          <el-table-column prop="createTime" label="时间" min-width="160"></el-table-column>
        </el-table>
      </div>
    </div>

    <pagination
      :isBackground="true"
      :currentPage.sync="pagination.currentPage"
      :pageSize.sync="pagination.pageSize"
      :total="pagination.total"
      @currentChange="currentChange"
      @sizeChange="sizeChange"
    />
  </div>
</template>

<script>
import cardBox from '@/components/cardBox'
import searchForm from '@/components/searchForm'
import pagination from '@/components/pagination'
import { getPaymentType } from '@/filters/transform'
import { getBuyOrderList } from '@/api/order'
import { formExportExcel } from '@/api/common'
import tools from '@/utils/tools'
export default {
  name: '',
  data() {
    return {
      btnItems: 'search,export',
      searchData: {
        keyword: '',
        no: '',
        payType: '',
        startTime: '',
        endTime: ''
      },
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      infoList: [
        { txt: '充值金额 (元)', number: 0 },
        { txt: '购买人数', number: 0 }
      ],
      tableData: [],
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
          label: '订单号',
          prop: 'no',
          element: 'el-input',
          initValue: '',
          placeholder: '请输入订单号'
        },
        {
          label: '支付方式',
          prop: 'payType',
          element: 'el-select',
          options: getPaymentType(),
          initValue: ''
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
  components: { cardBox, searchForm, pagination },
  created() {
    this.getData()
  },
  methods: {
    typeFormatter(row) {
      return getPaymentType(row.type)
    },
    getInitData(pageNum = 1, pageSize = 10) {
      this.pagination.currentPage = pageNum
      this.pagination.pageSize = pageSize
      this.getData()
    },
    // 设置searchData
    setSearchData(data) {
      const { times, payType, ...otherObj } = data
      let obj = { ...otherObj }
      obj.payType = payType ? getPaymentType(payType) : ''
      obj.startTime = times ? tools.formatDate(times[0], '{y}-{m}-{d}') : ''
      obj.endTime = times ? tools.formatDate(times[1], '{y}-{m}-{d}') : ''
      // console.log('-obj-', obj)
      return obj
    },
    // 搜索
    handleSearch(data) {
      this.searchData = this.setSearchData(data)
      this.getInitData()
    },
    // 导出excel
    handleExport(data) {
      const params = this.setSearchData(data)
      formExportExcel('buyRecord', params)
    },
    currentChange(pageNo) {
      this.getInitData(pageNo, this.pagination.pageSize)
    },
    sizeChange(pageSize) {
      this.getInitData(1, pageSize)
    },
    getData() {
      const params = { pageSize: this.pagination.pageSize, pageNum: this.pagination.currentPage, ...this.searchData }
      console.log('-params-', params)
      getBuyOrderList(params).then(res => {
        // console.log('-res-', res.data)
        const {
          cny,
          number,
          page: { totalCount, result }
        } = res.data
        this.infoList[0].number = cny
        this.infoList[1].number = number
        this.pagination.total = totalCount
        if (!result || result.length === 0) {
          this.tableData = []
          return
        }
        this.tableData = result
        // console.log('-table-list-', this.tableData)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.withdrawList {
  background: rgba(242, 242, 242, 1);
}
</style>
