<!--
 * @Author: wangshengxian
 * @Date: 2020-08-27 18:26:14
 * @LastEditors: wangshengxian
 * @LastEditTime: 2020-10-23 18:25:14
 * @Desc: 当前页面作废 - 后面新的需求再做修改
-->
<template>
  <div class="userList">
    <searchForm :formOptions="formOptions" @onSearch="handleSearch">
      <el-button slot="button" type="primary" size="mini" @click="addAnchor">添加主播</el-button>
    </searchForm>

    <div class="listBox">
      <div class="tableBox">
        <el-table :data="tableData" tooltip-effect="dark" style="width: 100%">
          <el-table-column prop="userId" label="id" min-width="100"></el-table-column>
          <el-table-column prop="myname" label="昵称" min-width="140"></el-table-column>
          <el-table-column prop="username" label="姓名" min-width="100"></el-table-column>
          <el-table-column prop="mobile" label="手机号" min-width="140"></el-table-column>
          <el-table-column prop="mobile" label="证件类型" min-width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 1">身份证</span>
              <span v-else>护照</span>
            </template>
          </el-table-column>
          <el-table-column prop="idcard" label="证件号" min-width="180"></el-table-column>
          <el-table-column label="简介" min-width="80">
            <template slot-scope="scope">
              <el-popover placement="bottom-start" width="120" trigger="hover" :content="content">
                <span slot="reference">{{ scope.row.userId }}</span>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="guildName" label="加入的公会" min-width="100"></el-table-column>
          <el-table-column label="状态" prop="status" min-width="80">
            <template slot-scope="scope">
              <span :class="scope.row.status === 1 ? 'fz-success-status' : 'fz-danger-status'">{{
                scope.row.status | filterStatus
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="ndate" label="时间" min-width="160"></el-table-column>
          <el-table-column label="操作" fixed="right" min-width="160">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="handleEliminate(scope.row)">通过</el-button>
              <el-button size="mini" type="danger" @click="handleEliminate(scope.row)">不通过</el-button>
            </template>
          </el-table-column>
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

    <handleAdd type="add" :formData="addFormData" :visible.sync="isAdd" @confirm="handleAddConfirm" />
  </div>
</template>

<script>
import searchForm from '@/components/searchForm'
import pagination from '@/components/pagination'
import handleAdd from '@/views/guild/components/member/handleAdd'
import { findAllRoomHotrank, delRoomHotrankbyidx } from '@/api/anchor'
import { getGuildApplyStatus } from '@/filters/transform'
export default {
  name: '',
  data() {
    return {
      isAdd: false,

      content: '才比我菜农恩科除了你等了快才能施蒂利克成都市查克拉的生命力考农村',
      formOptions: [
        {
          label: 'ID/昵称',
          prop: 'title',
          element: 'el-input',
          initValue: '',
          placeholder: '请输入ID/昵称'
        },
        {
          label: '手机号',
          prop: 'phone',
          element: 'el-input',
          initValue: '',
          placeholder: '请输入手机号'
        },
        {
          label: '状态',
          prop: 'status',
          element: 'el-select',
          options: getGuildApplyStatus(),
          initValue: '全部'
        },
        {
          label: '时间',
          prop: 'times',
          element: 'el-date-picker',
          initValue: '',
          placeholder: ''
        }
      ],
      tableData: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      searchData: {
        infoSearch: '',
        phone: '',
        startTime: '',
        endTime: ''
      },
      addFormData: {
        anchorId: '',
        name: '',
        idcard: ''
      }
    }
  },
  components: { searchForm, pagination, handleAdd },
  created() {
    this.getData()
  },
  mounted() {},
  computed: {},
  filters: {
    filterStatus(val) {
      return getGuildApplyStatus(val)
    }
  },
  methods: {
    getInitData(pageNum = 1, pageSize = 10) {
      this.pagination.currentPage = pageNum
      this.pagination.pageSize = pageSize
      this.getData()
    },
    // 搜索
    handleSearch(data) {
      this.searchData.infoSearch = data.title
      this.searchData.phone = data.phone
      this.searchData.status = data.status === '全部' ? '' : data.status
      this.searchData.startTime = data.times ? data.times[0] : ''
      this.searchData.endTime = data.times ? data.times[1] : ''
      this.getInitData()
    },
    currentChange(pageNo) {
      this.getInitData(pageNo, this.pagination.pageSize)
    },
    sizeChange(pageSize) {
      this.getInitData(1, pageSize)
    },
    // 操作审核(TODO 没有调试，当前界面暂时没有上线)
    handleEliminate(row) {
      console.log(row)
      const data = {
        idx: row.idx
      }
      delRoomHotrankbyidx(data).then(res => {
        this.$message({
          type: 'success',
          message: res.msg
        })
        this.getData()
      })
    },
    // 添加主播
    addAnchor() {
      this.isAdd = true
    },
    // 确认添加
    handleAddConfirm() {
      console.log('-confirm-')
      this.isAdd = false
      this.addFormData = { anchorId: '', name: '', idcard: '' }
      this.getData()
    },
    // 数据请求
    getData() {
      const params = { pageNum: this.pagination.currentPage, pageSize: this.pagination.pageSize, ...this.searchData }
      console.log('-params-', params)
      findAllRoomHotrank(params).then(res => {
        console.log('--res--', res)
        this.pagination.total = res.data.page.totalCount
        let list = res.data.page.result
        let result = []
        list.map((val, index) => {
          // TODO 本地测试使用
          let status = index % 2 === 1 ? 1 : 2
          result.push({ status, guildName: '炫彩公会', ...val })
        })
        this.tableData = result
        console.log(this.tableData)
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
