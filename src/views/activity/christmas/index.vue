<!--
 * @Author: wangshengxian
 * @Date: 2020-12-14 12:38:49
 * @LastEditors: wangshengxian
 * @LastEditTime: 2021-01-26 15:57:26
 * @Desc: 2020 - 圣诞节活动
-->
<template>
  <div class="christmas-active-page">
    <div class="activeSet">
      <h2>活动设置</h2>
      <div class="container">
        <table class="tableBox" border="0" cellspacing="0" cellpadding="0">
          <thead class="tableHead">
            <tr>
              <th>活动时间</th>
              <th>活动状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody class="tableBody">
            <tr>
              <td>{{ activitySetObj.startTime }}-{{ activitySetObj.endTime }}</td>
              <td>{{ activitySetObj.status }}</td>
              <td>
                <el-button type="primary" size="mini" icon="el-icon-setting" @click="onOpenActiveSet"
                  >活动设置</el-button
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <searchForm btnItems="search,export" :formOptions="formOptions" @onSearch="handleSearch" @onExport="handleExport">
    </searchForm>
    <div class="main">
      <div class="listBox">
        <el-table :data="tableList" tooltip-effect="dark" style="width: 100%">
          <el-table-column prop="id" label="序号" min-width="80"></el-table-column>
          <el-table-column prop="userId" label="ID" min-width="120"></el-table-column>
          <el-table-column prop="nickName" label="昵称" min-width="140"></el-table-column>
          <el-table-column
            prop="type"
            label="礼物类型"
            :formatter="giftTypeFormatter"
            min-width="120"
          ></el-table-column>
          <el-table-column prop="lotteryName" label="奖品名称" min-width="120"></el-table-column>
          <el-table-column prop="name" label="姓名" :formatter="nameFormatter" min-width="140"></el-table-column>
          <el-table-column prop="mobile" label="手机号" :formatter="mobileFormatter" min-width="160"></el-table-column>
          <el-table-column
            prop="address"
            label="收货地址"
            :formatter="addressFormatter"
            min-width="200"
          ></el-table-column>
          <el-table-column prop="createTime" label="时间" min-width="180"></el-table-column>
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

    <activitiesSet :formData="formData" :visible.sync="isActSet" @success="handleSetSuccess" />
  </div>
</template>

<script>
import searchForm from '@/components/searchForm'
import pagination from '@/components/pagination'
import activitiesSet from '@/views/activity/components/christmas/activitiesSet'
import { getChristmasList, getChristmasConfig } from '@/api/activity'
import { formExportExcel } from '@/api/common'
import { getGiftType } from '@/filters/transform'
import tools from '@/utils/tools'
export default {
  name: '',
  data() {
    return {
      isActSet: false,
      formData: {
        times: [],
        list: []
      },
      activitySetObj: {
        startTime: '',
        endTime: '',
        status: '关闭'
      },
      searchData: {
        infoSearch: '',
        type: '',
        startTime: '',
        endTime: ''
      },
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      tableList: [],
      formOptions: [
        {
          label: 'ID/昵称',
          prop: 'infoSearch',
          element: 'el-input',
          initValue: '',
          placeholder: '请输入ID/昵称'
        },
        {
          label: '奖品类型',
          prop: 'type',
          element: 'el-select',
          options: getGiftType(),
          initValue: '',
          placeholder: '全部'
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
  computed: {},
  created() {
    this.getChristmasData()
    this.getData()
  },
  mounted() {},
  methods: {
    giftTypeFormatter(row) {
      return getGiftType(row.type)
    },
    nameFormatter(row) {
      return row.name || '/'
    },
    mobileFormatter(row) {
      return row.mobile || '/'
    },
    addressFormatter(row) {
      return row.address || '/'
    },
    onOpenActiveSet() {
      this.isActSet = true
    },
    handleSetSuccess() {
      this.getChristmasData()
    },
    getInitData(pageNum = 1, pageSize = 10) {
      this.pagination.currentPage = pageNum
      this.pagination.pageSize = pageSize
      this.getData()
    },
    handleSearch(data) {
      // console.log('-search-data-', data)
      const { times, ...otherObj } = data
      this.searchData = otherObj
      this.searchData.startTime = times ? times[0] : ''
      this.searchData.endTime = times ? times[1] : ''
      this.getInitData()
    },
    handleExport(data) {
      // console.log('-export-data-', data)
      const { times, ...otherObj } = data
      let params = otherObj
      params.startTime = times ? times[0] : ''
      params.endTime = times ? times[1] : ''
      // console.log('-params-', params)
      formExportExcel('christmasList', params)
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
      getChristmasList(params).then(res => {
        const { totalCount, result } = res.data
        this.pagination.total = totalCount
        this.tableList = result
        // console.log('-list-', this.tableList)
      })
    },
    // 获取圣诞活动配置
    getChristmasData() {
      getChristmasConfig().then(res => {
        const { startTime, endTime, list } = res.data
        let surplus = tools.getTimestamp(endTime) - new Date().getTime()
        let status = surplus > 0 ? '开启' : '关闭'
        this.activitySetObj = { startTime, endTime, status }
        this.formData.times = [startTime, endTime]
        this.formData.list = list
      })
    }
  },
  components: { searchForm, pagination, activitiesSet }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类

.activeSet {
  h2 {
    font-weight: 600;
    line-height: 36px;
  }

  .container {
    padding: 12px 0;
  }

  .tableBox {
    width: 100%;
    line-height: 42px;
    border: 1px solid #000;

    .tableHead {
      line-height: 36px;
    }

    tr {
      display: flex;

      th,
      td {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        border-right: 1px solid #000;
        border-bottom: 1px solid #000;

        &:last-child {
          border-right: none;
        }
      }
    }

    .tableBody {
      tr {
        &:last-child {
          td {
            border-bottom: none;
          }
        }
      }
    }
  }
}
</style>
