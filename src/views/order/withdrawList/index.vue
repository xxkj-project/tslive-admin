<!--
 * @Author: wangshengxian
 * @Date: 2020-08-19 09:57:01
 * @LastEditors: wangshengxian
 * @LastEditTime: 2020-10-26 10:25:16
 * @Desc: 订单管理 - 提现管理
-->
<template>
  <div class="withdrawList">
    <div class="dataCard">
      <h4 class="welcome">当前手续费</h4>
      <div class="cardMain">
        <ul>
          <!-- <li class="cardItem">
            <div class="title">TST最小提现数量：</div>
            <div class="number">{{ withdrawFeeData.tstMinNumDate }}</div>
          </li>
          <li class="cardItem">
            <div class="title">TST手续费比例：</div>
            <div class="number">{{ withdrawFeeData.tstMinRateDate }}%</div>
          </li>
          <li class="cardItem">
            <div class="title">TF最小提现数量：</div>
            <div class="number">{{ withdrawFeeData.tfMinNumDate }}</div>
          </li>
          <li class="cardItem">
            <div class="title">TF手续费比例：</div>
            <div class="number">{{ withdrawFeeData.tfMinRateDate }}%</div>
          </li> -->
          <li class="cardItem">
            <div class="title">TST手续费：</div>
            <div class="number">{{ withdrawFeeData.tstMinFeeDate }}</div>
          </li>
          <li class="cardItem">
            <div class="title">TF手续费：</div>
            <div class="number">{{ withdrawFeeData.tfMinFeeDate }}</div>
          </li>
        </ul>
        <div class="btnBox">
          <el-button type="primary" size="small" icon="el-icon-setting" @click="onWithdraw">提现设置</el-button>
        </div>
      </div>
    </div>
    <searchForm :formOptions="formOptions" :btnItems="btnItems" @onSearch="handleSearch" @onExport="handleExport" />
    <div class="listBox">
      <div class="tableBox">
        <el-table :data="tableData" tooltip-effect="dark" style="width: 100%">
          <el-table-column prop="userId" width="120" label="ID" min-width="100"></el-table-column>
          <el-table-column prop="myname" label="昵称" min-width="100"></el-table-column>
          <el-table-column prop="currency" label="提现币种" min-width="80"></el-table-column>
          <el-table-column prop="realCashNum" label="提现数量" min-width="100"></el-table-column>
          <el-table-column prop="cashNum" label="总计数量" min-width="100"></el-table-column>
          <el-table-column prop="fee" label="手续费" min-width="80"></el-table-column>
          <el-table-column prop="status" label="状态" min-width="80">
            <template slot-scope="scope">
              <span :class="scope.row.statusClassName">
                {{ scope.row.statusTxt }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="提现地址" min-width="280"></el-table-column>
          <el-table-column prop="orderNum" label="订单号" min-width="280"></el-table-column>
          <el-table-column prop="createTime" label="时间" min-width="160"></el-table-column>
          <el-table-column label="操作" min-width="150" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="success" :disabled="scope.row.status != 1" @click="onPass(scope.row)"
                >通过</el-button
              >
              <el-button size="mini" type="danger" :disabled="scope.row.status != 1" @click="onNotPass(scope.row)"
                >不通过</el-button
              >
            </template>
          </el-table-column>
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

    <withdrawSet :visible.sync="isShowDialog" :formData="withdrawFeeData" @uploadData="handleConfirm"></withdrawSet>

    <auditDialog
      :visible.sync="isNoPass"
      :isLoading="isLoading"
      :reasonList="reasonList"
      @success="handleAuditSuccess"
    />
  </div>
</template>

<script>
import searchForm from '@/components/searchForm'
import pagination from '@/components/pagination'
import auditDialog from '@/components/auditDialog'
import withdrawSet from '@/views/order/components/withdraw/withdrawSetDialog'
import { getWithdrawStatus } from '@/filters/transform'
import { withdrawAuditTemplate } from '@/filters/auditTemplate'
import { getWithdrawList, getWithdrawCost, operatWithdrawAudit } from '@/api/order'
import { exportExcel } from '@/api/common'
import tools from '@/utils/tools'

export default {
  name: '',
  data() {
    return {
      btnItems: 'search,export',
      searchData: {
        infoSearch: '',
        address: '',
        status: '',
        orderNum: '',
        startTime: '',
        endTime: ''
      },
      tableData: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      isShowDialog: false,
      withdrawFeeData: {}, // 当前手续费
      initTimes: tools.getLatelyDays(7, '{y}-{m}-{d} {h}:{i}:{s}'),
      // 审核不通过相关
      isNoPass: false,
      isLoading: false,
      selectData: {}
    }
  },
  computed: {
    reasonList() {
      return withdrawAuditTemplate()
    },
    statusObj() {
      // 状态 ==》 1审核中  2已通过 3已成功 4未通过 5已取消 6提现失败
      return {
        1: { statusTxt: '审核中', statusClassName: 'underReview' },
        2: { statusTxt: '已通过', statusClassName: 'pass' },
        3: { statusTxt: '已成功', statusClassName: 'pass' },
        4: { statusTxt: '未通过', statusClassName: 'notPass' },
        5: { statusTxt: '已取消', statusClassName: 'notPass' },
        6: { statusTxt: '已失败', statusClassName: 'notPass' }
      }
    },
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
          label: '提现地址',
          prop: 'address',
          element: 'el-input',
          initValue: '',
          placeholder: '请输入提现地址'
        },
        {
          label: '状态',
          prop: 'status',
          element: 'el-select',
          options: getWithdrawStatus(),
          initValue: '全部'
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
  components: { searchForm, pagination, auditDialog, withdrawSet },
  created() {
    this.searchData.startTime = this.initTimes[0]
    this.searchData.endTime = this.initTimes[1]
    this.getWithdrawSetData()
    this.getData()
  },
  methods: {
    getInitData(pageNum = 1, pageSize = 10) {
      this.pagination.currentPage = pageNum
      this.pagination.pageSize = pageSize
      this.getData()
    },
    onWithdraw() {
      this.isShowDialog = true
    },
    handleConfirm(data) {
      this.getWithdrawSetData()
    },
    handleAuditSuccess(data) {
      // console.log('-audit-', data, '-select-data-', this.selectData)
      const content = typeof data === 'number' ? withdrawAuditTemplate(data) : data
      const params = { content, status: 4, id: this.selectData.id }
      this.operateAudit(params)
    },
    // 搜索
    handleSearch(data) {
      const { status, times, ...otherObj } = data
      this.searchData = otherObj
      this.searchData.status = status === '全部' ? '' : status
      this.searchData.startTime = times ? times[0] : ''
      this.searchData.endTime = times ? times[1] : ''
      this.getInitData()
    },
    handleExport() {
      exportExcel('withdrawList', this.searchData)
    },
    currentChange(pageNo) {
      this.getInitData(pageNo, this.pagination.pageSize)
    },
    sizeChange(pageSize) {
      this.getInitData(1, pageSize)
    },
    onPass(row) {
      // console.log("-pass-",row)
      this.$confirm('通过该提现申请', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const params = { id: row.id, status: 2 }
          this.operateAudit(params)
        })
        .catch(() => {})
    },
    onNotPass(row) {
      // console.log('-not-pass-', row)
      this.isNoPass = true
      this.selectData = row
    },
    // 按钮操作
    operateAudit(params) {
      console.log('-params-', params)
      this.isLoading = true
      operatWithdrawAudit(params)
        .then(res => {
          console.log(res)
          this.isLoading = false
          this.isNoPass = false
          this.$message({
            type: 'success',
            message: '申请成功!',
            duration: 1500,
            onClose: () => {
              this.getData()
            }
          })
        })
        .catch(() => {
          this.isLoading = false
          this.$message({
            type: 'error',
            message: '申请失败!'
          })
        })
    },
    // 获取手续费
    getWithdrawSetData() {
      getWithdrawCost().then(res => {
        // console.log('-fee-res-', res.data)
        const { data } = res
        data.tfMinFeeDate = data.tfMinFeeDate || '4.1176'
        data.tstMinFeeDate = data.tstMinFeeDate || '0.5833'
        this.withdrawFeeData = data
      })
    },
    async getData() {
      const params = { pageSize: this.pagination.pageSize, pageNum: this.pagination.currentPage, ...this.searchData }
      const res = await getWithdrawList(params)
      const { totalCount, result } = res.data.page
      this.pagination.total = totalCount
      if (!result || result.length === 0) {
        this.tableData = []
        return
      }
      this.tableData = result.map(val => ({ ...val, ...this.statusObj[val.status] }))
      // console.log('-table-list-', this.tableData)
    }
  }
}
</script>

<style lang="less" scoped>
.withdrawList {
  background: rgba(242, 242, 242, 1);

  .dataCard {
    background: #fff;
    padding: 20px 40px 5px;
    margin-bottom: 20px;

    .welcome {
      font-size: 18px;
      font-weight: 600;
      padding-bottom: 10px;
    }

    .cardMain {
      display: flex;
      justify-content: space-between;
      align-items: center;

      ul {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        text-align: center;

        .cardItem {
          display: flex;
          align-items: center;
          color: #333;
          margin-right: 40px;
          padding: 10px 10px 10px 0;

          &:hover {
            transition: transform 0.1s ease;
            transform: scale(1.1);
          }
        }
      }
    }
  }

  .tableBox {
    .underReview {
      color: #800080;
    }

    .pass {
      color: rgb(27, 221, 27);
    }

    .notPass {
      color: red;
    }
  }
}
</style>
