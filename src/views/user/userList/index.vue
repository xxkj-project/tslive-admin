<!--
  用户管理 - 用户列表
-->
<template>
  <div class="userList">
    <searchForm :formOptions="formOptions" @onSearch="handleSearch"> </searchForm>

    <div class="listBox">
      <div class="tableBox">
        <el-table :data="tableList" tooltip-effect="dark" style="width: 100%">
          <el-table-column prop="useridx" label="id" min-width="80"></el-table-column>
          <el-table-column prop="myname" label="昵称" min-width="120"></el-table-column>
          <el-table-column prop="mobile" label="手机号" min-width="140"></el-table-column>
          <el-table-column prop="largeV" label="是否大V" :formatter="largeVFormatter" min-width="80"></el-table-column>
          <el-table-column prop="status" label="状态" min-width="80">
            <template slot-scope="scope">
              <div v-if="scope.row.status == 0 && scope.row.type == 0">
                <p>正常</p>
              </div>
              <div v-else-if="scope.row.status == 1 && scope.row.type == 1">
                <p>限时封禁</p>
                <p>账号封禁</p>
              </div>
              <div class="statusTxt" v-else>
                <p>{{ scope.row.status ? '限时封禁' : '/' }}</p>
                <p>{{ scope.row.type ? '账号封禁' : '/' }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="endTime" label="封禁截止时间" min-width="210">
            <template slot-scope="scope">
              <div>
                <span v-if="scope.row.endTime">{{ scope.row.endTime }}</span>
                <span v-else>0000-00-00</span>
                <p>(封禁{{ scope.row.banday || 0 }}天，距离解封还有{{ scope.row.unsealday || 0 }}天)</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="addTime" label="时间" min-width="160"></el-table-column>
          <el-table-column label="操作" fixed="right" min-width="400">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                :disabled="!scope.row.largeV"
                @click="onEditUserInfo(scope.row)"
                >编辑</el-button
              >
              <el-button
                size="mini"
                :type="scope.row.largeV ? 'danger' : 'primary'"
                :icon="scope.row.largeV ? 'el-icon-close' : 'el-icon-setting'"
                @click="onSetLargeV(scope.row)"
                >{{ scope.row.largeV | filtersBtn('largeV') }}</el-button
              >

              <el-button
                size="mini"
                :type="scope.row.status ? 'danger' : 'primary'"
                :icon="scope.row.status ? 'el-icon-close' : 'el-icon-remove-outline'"
                @click="onTimeBanned(scope.row)"
                >{{ scope.row.status | filtersBtn('status') }}</el-button
              >
              <el-button
                size="mini"
                :type="scope.row.type ? 'danger' : 'primary'"
                :icon="scope.row.type ? 'el-icon-close' : 'el-icon-remove-outline'"
                @click="onAccountBanned(scope.row)"
                >{{ scope.row.type | filtersBtn('type') }}</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>

      <pagination
        :currentPage.sync="pagination.currentPage"
        :pageSize="pagination.pageSize"
        :total="pagination.total"
        @currentChange="currentChange"
        @sizeChange="sizeChange"
      />
    </div>

    <handleEdit :formData="editUserInfoData" :visible.sync="isEditUserInfo" @success="handleEditUserInfoSuccess" />

    <timeBanned :formData="bannedData" :visible.sync="isTimeBanned" @success="handleTimeBannedSuccess" />
  </div>
</template>

<script>
import searchForm from '@/components/searchForm'
import pagination from '@/components/pagination'
import handleEdit from '@/views/user/components/userList/handleEdit'
import timeBanned from '@/views/user/components/userList/handleTimeBanned'
import { getUserInfoList, userBan, liveUserBan, setCancelV } from '@/api/user'

const btnTxts = {
  largeV: { init: '设置大v', noInit: '取消大v' },
  status: { init: '限时封禁', noInit: '限时解封' },
  type: { init: '账号封禁', noInit: '账号解封' }
}

export default {
  name: '',
  data() {
    return {
      searchData: {
        infoSearch: '',
        phone: '',
        startTime: '',
        endTime: '',
        state: ''
      },
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      tableList: [],

      isTimeBanned: false,
      bannedData: {},

      isEditUserInfo: false,
      editUserInfoData: {}
    }
  },
  components: { searchForm, pagination, handleEdit, timeBanned },
  filters: {
    filtersBtn(val, type) {
      // console.log(btnTxts)
      return val ? btnTxts[type].noInit : btnTxts[type].init
    }
  },
  created() {
    this.getData()
  },
  mounted() {},
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
          label: '手机号',
          prop: 'phone',
          element: 'el-input',
          initValue: '',
          placeholder: '请输入手机号'
        },
        {
          label: '状态',
          prop: 'state',
          element: 'el-select',
          options: [
            { value: '', label: '全部' },
            { value: '1', label: '正常' },
            { value: '2', label: '封禁' }
          ],
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
  methods: {
    largeVFormatter(row) {
      return row.largeV ? '是' : '否'
    },
    getInitData(pageNo = 1, pageSize = 10) {
      this.pagination.currentPage = pageNo
      this.pagination.pageSize = pageSize
      this.getData()
    },
    // 搜索
    handleSearch(data) {
      // console.log('-search-', data)
      const { times, ...otherObj } = data
      this.searchData = { startTime: '', endTime: '', ...otherObj }
      this.searchData.startTime = times ? times[0] : ''
      this.searchData.endTime = times ? times[1] : ''
      this.getInitData()
    },
    currentChange(pageNo) {
      this.getInitData(pageNo, this.pagination.pageSize)
    },
    sizeChange(pageSize) {
      this.getInitData(1, pageSize)
    },
    // 编辑用户信息
    onEditUserInfo(row) {
      // console.log('-row-', row)
      this.editUserInfoData = { userId: row.useridx, newPass: '' }
      this.isEditUserInfo = true
    },
    // 设置大V，是否大V用户 largeV ==> true是 false否
    onSetLargeV(row) {
      // console.log('-row-', row)
      let text = row.largeV ? '确认将该用户取消大V用户' : '确认将该用户设置为大V用户'
      this.confirmFunc(text, () => {
        setCancelV({ userId: row.useridx }).then(res => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.getData()
        })
      })
    },
    // 限时封禁/解封，直播封禁状态 status ==> 0正常 1封禁
    onTimeBanned(row) {
      // console.log('-row-', row)
      let userIdx = row.useridx
      if (!row.status) {
        this.bannedData = {
          userIdx,
          startTime: new Date(),
          endTime: '',
          reason: ''
        }
        this.isTimeBanned = true
        return
      }
      let msg = '确认解封该账号?'
      this.confirmFunc(msg, () => {
        const params = {
          userIdx,
          reason: ''
        }
        liveUserBan(params).then(res => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.getData()
        })
      })
    },
    handleEditUserInfoSuccess() {
      this.getData()
    },
    handleTimeBannedSuccess() {
      this.getData()
    },
    // 账号封禁/解封，状态 type ==> 0正常1封禁
    onAccountBanned(row) {
      let text = row.type ? '确认解封该账号' : '确认封禁该账号'
      this.confirmFunc(text, () => {
        const params = { userIdx: row.useridx }
        userBan(params).then(res => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.getData()
        })
      })
    },
    getData() {
      const params = { pageNum: this.pagination.currentPage, pageSize: this.pagination.pageSize, ...this.searchData }
      // console.log('-params-', params)
      getUserInfoList(params).then(res => {
        // console.log('--res--', res)
        const { totalCount, result } = res.data.page
        this.pagination.total = totalCount
        this.tableList = result
        // console.log('-list-', this.tableList)
      })
    },
    confirmFunc(text, callback) {
      this.$confirm(text, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        center: 'true'
      })
        .then(() => {
          callback()
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="less" scoped>
.statusTxt {
  p {
    text-align: center;
  }
}
</style>
