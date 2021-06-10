<!--
   登录日志列表
-->
<template>
  <div class="logList">
    <searchForm :formOptions="formOptions" @onSearch="handleSearch" />

    <div class="listWrap">
      <div class="listBox">
        <el-table :data="tableList" tooltip-effect="dark" style="width: 100%">
          <el-table-column label="用户名" prop="account" min-width="120"></el-table-column>
          <el-table-column label="ip" prop="ip" min-width="120"></el-table-column>
          <el-table-column label="登录时间" prop="createTime" min-width="120"></el-table-column>
        </el-table>
      </div>

      <pagination
        :currentPage.sync="pagination.currentPage"
        :pageSize.sync="pagination.pageSize"
        :total="pagination.total"
        @currentChange="currentChange"
        @sizeChange="sizeChange"
      />
    </div>
  </div>
</template>

<script>
import searchForm from '@/components/searchForm'
import pagination from '@/components/pagination'
import { getAdminLoginLogList } from '@/api/adminLog'
export default {
  name: '',
  data() {
    return {
      searchData: {
        account: ''
      },
      tableList: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  computed: {
    formOptions() {
      let options = [
        {
          label: '用户名',
          prop: 'account',
          element: 'el-input',
          initValue: '',
          placeholder: '请输入用户名'
        }
      ]
      return options
    }
  },
  components: { searchForm, pagination },
  created() {
    this.getData()
  },
  mounted() {},
  methods: {
    getInitData(pageNum = 1, pageSize = 10) {
      this.pagination.currentPage = pageNum
      this.pagination.pageSize = pageSize
      this.getData()
    },
    handleSearch(data) {
      // console.log('-search-', data)
      this.searchData = data
      this.getInitData()
    },
    currentChange(pageNum) {
      this.getInitData(pageNum, this.pagination.pageSize)
    },
    sizeChange(pageSize) {
      this.getInitData(1, pageSize)
    },
    getData() {
      const params = { pageNum: this.pagination.currentPage, pageSize: this.pagination.pageSize, ...this.searchData }
      // console.log('-params-', params)
      getAdminLoginLogList(params).then(res => {
        const { totalCount, result } = res.data
        this.pagination.total = totalCount
        this.tableList = result.map(val => {
          val.ip = val.ipv4 || val.ipv6
          return val
        })
        console.log('-list-', this.tableList)
      })
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
</style>
