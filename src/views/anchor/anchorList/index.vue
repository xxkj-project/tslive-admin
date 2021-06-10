<!--
 * @Author: wangshengxian
 * @Date: 2020-08-19 09:57:01
 * @LastEditors: wangshengxian
 * @LastEditTime: 2021-01-20 10:22:04
 * @Desc: 主播管理 - 主播列表
-->
<template>
  <div class="userList">
    <searchForm :formOptions="formOptions" @onSearch="handleSearch">
      <el-button slot="button" type="primary" size="mini" icon="el-icon-plus" @click="onAddAnchor">添加主播</el-button>
    </searchForm>

    <div class="listBox">
      <div class="tableBox">
        <el-table :data="tableList" tooltip-effect="dark" style="width: 100%">
          <el-table-column prop="userId" label="ID" min-width="90"></el-table-column>
          <el-table-column prop="myname" label="昵称" min-width="120"></el-table-column>
          <el-table-column prop="username" label="姓名" min-width="120"></el-table-column>
          <el-table-column
            prop="guildName"
            label="所属公会"
            :formatter="guildFormatter"
            min-width="120"
          ></el-table-column>
          <!-- <el-table-column prop="guildId" label="工会ID" :formatter min-width="120"></el-table-column> -->
          <el-table-column prop="mobile" label="手机号" min-width="140"></el-table-column>
          <el-table-column prop="idcard" label="身份证号" min-width="180"></el-table-column>
          <el-table-column label="排序号" min-width="110">
            <template slot-scope="scope">
              <div class="sortCol">
                <p>{{ scope.row.weight || '/' }}</p>
                <p>{{ scope.row.endTime | surplusTime(scope.row.startTime) }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="roomOnline"
            label="状态"
            min-width="70"
            :formatter="roomOnlineFormatter"
          ></el-table-column>
          <el-table-column prop="ndate" label="时间" min-width="160"></el-table-column>

          <el-table-column class-name="btnWrap" label="操作" fixed="right" min-width="330">
            <template slot-scope="scope">
              <div class="btnBox">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-delete"
                  :disabled="!scope.row.roomOnline"
                  @click="onClearRoom(scope.row)"
                  >清除直播间</el-button
                >
                <el-button
                  :type="scope.row.guildId ? 'danger' : 'primary'"
                  size="mini"
                  :icon="scope.row.guildId ? 'el-icon-edit' : 'el-icon-plus'"
                  @click="onSetGuild(scope.row)"
                  >{{ scope.row.guildId ? '修改公会' : '添加公会' }}</el-button
                >
                <el-button size="mini" type="primary" icon="el-icon-remove" @click="onWeedOut(scope.row)"
                  >淘汰</el-button
                >
              </div>
              <div>
                <el-button size="mini" type="primary" icon="el-icon-plus" @click="onAddSort(scope.row)"
                  >添加排序号</el-button
                >
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="onDelSort(scope.row)"
                  >删除排序号</el-button
                >
              </div>
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

    <addAnchor :visible.sync="isAddAnchor" @success="handleAddAnchor" />

    <setGuild :formData="guildFormData" :visible.sync="isSetGuild" @success="handleSetGuild" />

    <serialSort :formData="sortFormData" :visible.sync="isSerialSort" @success="handleSerialSort" />
  </div>
</template>

<script>
import searchForm from '@/components/searchForm'
import pagination from '@/components/pagination'
import addAnchor from '@/views/anchor/components/anchorList/handleAddAnchor'
import setGuild from '@/views/anchor/components/anchorList/handleSetGuild'
import serialSort from '@/views/anchor/components/anchorList/handleSerialSort'
import { findAllRoomHotrank, delRoomHotrankbyidx, delSortOrder, operateAnchorRoom } from '@/api/anchor'
import { getAllGuild } from '@/api/guild'
import tools from '@/utils/tools'
import { getAnchorListType } from '@/filters/transform'
export default {
  name: '',
  data() {
    return {
      isAddAnchor: false,
      isSetGuild: false,
      guildFormData: {},
      guildList: [],
      isSerialSort: false,
      sortFormData: {
        num: 1,
        startTime: tools.formatDate(),
        endTime: ''
      },
      searchData: {
        infoSearch: '',
        phone: '',
        guildId: '',
        startDate: '',
        endDate: ''
      },
      tableList: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      formOptions: [
        {
          label: 'ID/昵称',
          prop: 'infoSearch',
          element: 'el-input',
          initValue: '',
          placeholder: '请输入ID/昵称'
        },
        {
          label: '主播状态',
          prop: 'roomOnline',
          element: 'el-select',
          initValue: '',
          options: getAnchorListType()
        },
        {
          label: '手机号',
          prop: 'phone',
          element: 'el-input',
          initValue: '',
          placeholder: '请输入手机号'
        },
        {
          label: '公会ID',
          prop: 'guildId',
          element: 'el-input',
          initValue: '',
          placeholder: '请输入工会ID'
        },
        {
          label: '时间',
          prop: 'times',
          element: 'el-date-picker',
          initValue: '',
          placeholder: ''
        }
      ]
    }
  },
  components: { searchForm, pagination, addAnchor, setGuild, serialSort },
  watch: {},
  computed: {},
  filters: {
    surplusTime(endTime, startTime) {
      // console.log('-start-', startTime, '-end-', endTime)
      let result = endTime ? tools.getSurplusTime(endTime, startTime) : '/'
      return result
    }
  },
  created() {
    this.getData()
    this.getGuildList()
  },
  mounted() {},
  methods: {
    roomOnlineFormatter(row) {
      return row.roomOnline ? '直播中' : '未直播'
    },
    guildFormatter(row) {
      return row.guildName || '/'
    },
    getInitData(pageNum = 1, pageSize = 10) {
      this.pagination.currentPage = pageNum
      this.pagination.pageSize = pageSize
      this.getData()
    },
    // 搜索
    handleSearch(data) {
      console.log('-search-data-', data)
      const { times, guildId, ...other } = data
      this.searchData = { ...other }
      this.searchData.guildId = guildId ? +guildId : guildId
      this.searchData.startDate = times ? times[0] : ''
      this.searchData.endDate = times ? times[1] : ''
      this.getInitData()
    },
    currentChange(pageNo) {
      this.getInitData(pageNo, this.pagination.pageSize)
    },
    sizeChange(pageSize) {
      this.getInitData(1, pageSize)
    },
    onAddAnchor() {
      this.isAddAnchor = true
    },
    onSetGuild(row) {
      // console.log('-row-', row)
      this.guildFormData = { userId: row.userId, guildId: row.guildId, guildList: this.guildList }
      this.isSetGuild = true
    },
    // 淘汰
    onWeedOut(row) {
      // console.log('-淘汰-', row)
      this.confirmFunc('确认淘汰该主播，是否继续？', (instance, done) => {
        const params = { idx: row.idx }
        delRoomHotrankbyidx(params)
          .then(res => {
            instance.confirmButtonLoading = false
            done()
            this.$message({
              type: 'success',
              message: res.msg
            })
          })
          .catch(er => {
            instance.confirmButtonLoading = false
            done()
          })
      })
    },
    // 清除直播间
    onClearRoom(row) {
      console.log(row)
      this.confirmFunc('确认清除该直播间?', (instance, done) => {
        const { userId } = row
        const params = { anchorId: userId, type: 2 }
        operateAnchorRoom(params)
          .then(res => {
            console.log(res)
            instance.confirmButtonLoading = false
            done()
            this.$message({
              type: 'success',
              message: '操作成功'
            })
          })
          .catch(err => {
            console.log(err)
            instance.confirmButtonLoading = false
            done()
          })
      })
    },
    // 添加排序号
    onAddSort(row) {
      console.log('-add-', row)
      this.sortFormData = {
        num: row.weight,
        startTime: row.startTime,
        endTime: row.endTime,
        anchorId: row.userId
      }
      this.isSerialSort = true
    },
    // 删除排序号
    onDelSort(row) {
      // console.log('-del-', row)
      this.confirmFunc('删除排序号！', (instance, done) => {
        const params = { anchorId: row.userId }
        delSortOrder(params)
          .then(res => {
            instance.confirmButtonLoading = false
            done()
            this.$message({
              type: 'success',
              message: '排序号删除成功！'
            })
          })
          .catch(er => {
            instance.confirmButtonLoading = false
            done()
          })
      })
    },
    // 添加主播
    handleAddAnchor() {
      this.getInitData()
    },
    // 设置公会
    handleSetGuild() {
      this.getData()
    },
    // 添加排序号
    handleSerialSort() {
      this.getInitData()
    },
    getData() {
      let params = { pageSize: this.pagination.pageSize, pageNum: this.pagination.currentPage, ...this.searchData }
      // console.log('-params-', params)
      findAllRoomHotrank(params).then(res => {
        // console.log('--主播列表--', res)
        const { totalCount, result } = res.data.page
        this.pagination.total = totalCount
        this.tableList = result
        console.log('-list-', this.tableList, '-total-', this.pagination.total)
      })
    },
    getGuildList() {
      getAllGuild().then(res => {
        const list = res.data
        if (!list || list.length === 0) return
        this.guildList = list.map((val, index) => ({ idx: index, value: val.id, label: val.guildName }))
      })
    },
    confirmFunc(text, callback) {
      this.$confirm(text, '提示', {
        center: true,
        type: 'warning',
        beforeClose(action, instance, done) {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '加载中...'
            callback(instance, done)
          } else {
            done()
          }
        }
      })
        .then(action => {
          this.getData()
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .el-table {
  tbody {
    tr {
      .btnWrap {
        .cell {
          flex-direction: column;
          align-items: flex-start;
        }

        .btnBox {
          margin-bottom: 10px;
        }
      }
    }
  }
}

.content {
  padding: 0px 40px;
  .redIcon {
    color: red;
  }
  .row {
    line-height: 60px;
  }
}
.sortCol {
  text-align: center;
}
</style>
