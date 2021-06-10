<!--
 * @Author: wangshengxian
 * @Date: 2020-12-14 12:38:49
 * @LastEditors: wangshengxian
 * @LastEditTime: 2021-02-01 12:30:27
 * @Desc: 2021 - 新年活动
-->
<template>
  <div class="newyear-active-page">
    <div class="activeSet">
      <h2>活动设置</h2>
      <div class="container">
        <table class="tableBox" border="0" cellspacing="0" cellpadding="0">
          <thead class="tableHead">
            <tr>
              <th>活动时间</th>
              <th>集齐人数</th>
              <th>实际集齐人数</th>
              <th>总集齐人数</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody class="tableBody">
            <tr>
              <td>{{ activitySetObj.startTime }}-{{ activitySetObj.endTime }}</td>
              <td>{{ activitySetObj.number }}</td>
              <td>{{ activitySetObj.realityNumber }}</td>
              <td>{{ activitySetObj.totalNumber }}</td>
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

    <searchForm :formOptions="formOptions" @onSearch="handleSearch">
      <!-- <searchForm btnItems="search,export" :formOptions="formOptions" @onSearch="handleSearch" @onExport="handleExport"> -->
    </searchForm>
    <div class="main">
      <div class="listBox">
        <el-table :data="tableList" tooltip-effect="dark" style="width: 100%">
          <el-table-column prop="userId" label="用户ID" min-width="120"></el-table-column>
          <el-table-column prop="nickName" label="昵称" min-width="140"></el-table-column>
          <el-table-column prop="niu" label="牛字卡" min-width="80"></el-table-column>
          <el-table-column prop="nian" label="年字卡" min-width="80"></el-table-column>
          <el-table-column prop="tian" label="添字卡" min-width="80"></el-table-column>
          <el-table-column prop="fu" label="福字卡" min-width="80"></el-table-column>
          <el-table-column prop="qi" label="气字卡" min-width="80"></el-table-column>
          <el-table-column prop="tang" label="唐字卡" min-width="80"></el-table-column>
          <el-table-column prop="seng" label="僧字卡" min-width="80"></el-table-column>
          <el-table-column prop="fen" label="奋字卡" min-width="80"></el-table-column>
          <el-table-column prop="xiong" label="雄字卡" min-width="80"></el-table-column>
          <el-table-column prop="cheng" label="程字卡" min-width="80"></el-table-column>
          <el-table-column
            prop="collect"
            label="是否合成"
            :formatter="collectFormatter"
            min-width="100"
          ></el-table-column>
          <el-table-column prop="tf" label="开奖获取的TF" :formatter="tfFormatter" min-width="120"></el-table-column>
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

    <actSet :formData="formData" :visible.sync="isActSet" @success="handleSetSuccess" />
  </div>
</template>

<script>
import searchForm from '@/components/searchForm'
import pagination from '@/components/pagination'
import actSet from '@/views/activity/components/newYear/handleActSet'
import { getCollectInfoList, getCollectNum } from '@/api/activity'
import jsPrecision from '@/utils/jsPrecision'
import { formExportExcel } from '@/api/common'
import { getCollectStatus } from '@/filters/transform'
export default {
  name: '',
  data() {
    return {
      isActSet: false,
      formData: {
        number: ''
      },
      activitySetObj: {
        startTime: '2021-02-03 00:00:00',
        endTime: '2021-02-13 00:00:00',
        number: '',
        realityNumber: '',
        totalNumber: ''
      },
      searchData: {
        infoSearch: '',
        collect: ''
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
          label: '是否合成',
          prop: 'collect',
          element: 'el-select',
          options: getCollectStatus(),
          initValue: '',
          placeholder: '全部'
        }

        // {
        //   label: '时间',
        //   prop: 'times',
        //   element: 'el-date-picker',
        //   initValue: '',
        //   placeholder: ''
        // }
      ]
    }
  },
  computed: {},
  created() {
    this.getCollectCount()
    this.getData()
  },
  mounted() {},
  methods: {
    collectFormatter(row) {
      return row.collect ? '是' : '否'
    },
    tfFormatter(row) {
      return row.tf || '/'
    },
    onOpenActiveSet() {
      this.isActSet = true
      this.formData.number = this.activitySetObj.number
    },
    handleSetSuccess() {
      this.getCollectCount()
    },
    getInitData(pageNum = 1, pageSize = 10) {
      this.pagination.currentPage = pageNum
      this.pagination.pageSize = pageSize
      this.getData()
    },
    handleSearch(data) {
      // console.log('-search-data-', data)
      this.searchData = data
      this.getInitData()
    },
    handleExport(data) {
      // console.log('-export-data-', data)
      const { times, ...otherObj } = data
      let params = otherObj
      params.startTime = times ? times[0] : ''
      params.endTime = times ? times[1] : ''
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
      getCollectInfoList(params).then(res => {
        const { totalCount, result } = res.data
        this.pagination.total = totalCount
        this.tableList = result
        // console.log('-list-', this.tableList)
      })
    },
    // 获取2021新年活动集齐人数
    getCollectCount() {
      getCollectNum().then(res => {
        // console.log('-count-res-', res)
        const data = res.data
        this.activitySetObj.number = data[0]
        this.activitySetObj.realityNumber = data[1]
        this.activitySetObj.totalNumber = jsPrecision.add(data[0], data[1])
      })
    }
  },
  components: { searchForm, pagination, actSet }
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
    .tableHead {
      tr:first-child {
        th:first-child {
          min-width: 300px;
        }
      }
    }
    .tableBody {
      tr:first-child {
        td:first-child {
          min-width: 300px;
        }
      }
    }
  }
}
</style>
