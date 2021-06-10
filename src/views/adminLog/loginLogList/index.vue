<!--
   登录日志列表
-->
<template>
  <div class="logList">
    <searchForm :formOptions="formOptions" @onSearch="handleSearch" />

    <div class="listWrap">
      <div class="listBox">
        <el-table :data="tableList" tooltip-effect="dark" style="width: 100%">
          <el-table-column label="ID" prop="userId" min-width="120"></el-table-column>
          <el-table-column label="昵称" prop="nickName" min-width="140"></el-table-column>
          <el-table-column label="登录类型" prop="type" :formatter="typeFormatter" min-width="120"></el-table-column>
          <el-table-column label="登录类型说明" prop="typeStr" min-width="120"></el-table-column>
          <el-table-column label="时间" prop="createTime" min-width="128"></el-table-column>
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
import { getLoginLogList } from '@/api/adminLog'
import { getLoginType } from '@/filters/transform'
export default {
  name: '',
  data() {
    return {
      searchData: {
        infoSearch: '',
        startTime: '',
        endTime: ''
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
          label: 'ID/昵称',
          prop: 'infoSearch',
          element: 'el-input',
          initValue: '',
          placeholder: '请输入ID/昵称'
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
  components: { searchForm, pagination },
  created() {
    this.getData()
  },
  mounted() {},
  methods: {
    typeFormatter(row) {
      return getLoginType(row.type)
    },
    getInitData(pageNum = 1, pageSize = 10) {
      this.pagination.currentPage = pageNum
      this.pagination.pageSize = pageSize
      this.getData()
    },
    handleSearch(data) {
      // console.log('-search-', data)
      const { times, ...otherObj } = data
      this.searchData = otherObj
      this.searchData.startTime = times ? times[0] : ''
      this.searchData.endTime = times ? times[1] : ''
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
      getLoginLogList(params).then(res => {
        const { totalCount, result } = res.data
        this.pagination.total = totalCount
        this.tableList = result
      })
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
</style>
