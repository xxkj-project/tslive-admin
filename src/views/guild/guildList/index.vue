<!--
  公会列表
-->
<template>
  <div class="userList">
    <div class="searchDiv">
      <span
        >公会名称：<el-input
          v-model="formdata.guildName"
          size="mini"
          style="width:120px"
          placeholder="请输入公会名称"
        ></el-input
      ></span>
      <span
        >负责人：<el-input
          v-model="formdata.name"
          size="mini"
          style="width:120px"
          placeholder="请输入负责人名字"
        ></el-input
      ></span>
      <span
        >手机号：<el-input
          v-model="formdata.phone"
          size="mini"
          style="width:120px"
          placeholder="请输入手机号"
        ></el-input
      ></span>
      <span
        >状态：<el-select v-model="formdata.status" clearable size="mini" style="width:120px" placeholder="请选择">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option> </el-select
      ></span>

      <span>
        时间：<el-date-picker
          size="mini"
          v-model="rangeTime"
          @change="dateTimeHandle"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </span>
      <el-button size="mini" type="primary" icon="el-icon-search" class="btn-search" @click="handleSearch"
        >搜索</el-button
      >
      <el-button size="mini" type="primary" icon="el-icon-plus" class="btn-search" @click="addGuild"
        >创建公会</el-button
      >
    </div>
    <div class="listBox">
      <div class="tableBox">
        <el-table :data="tableData" tooltip-effect="dark" style="width: 100%">
          <el-table-column prop="guildName" label="公会名称"></el-table-column>
          <el-table-column prop="name" label="负责人"></el-table-column>
          <el-table-column prop="id" width="100" label="ID"></el-table-column>
          <el-table-column prop="phone" label="手机号"></el-table-column>
          <el-table-column prop="certificateNo" label="证件号码"></el-table-column>
          <el-table-column prop="startTime" width="160" label="开始时间"></el-table-column>
          <el-table-column prop="endTime" width="160" label="结束时间"></el-table-column>
          <el-table-column label="操作" fixed="right">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-circle-check"
                @click="handleEffectiveInvalid(scope.row, 0)"
                v-if="scope.row.status === 1"
                >有效</el-button
              >
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-circle-close"
                @click="handleEffectiveInvalid(scope.row, 1)"
                v-else
                >无效</el-button
              >
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-pagination
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="currentChange"
        :current-page="formdata.pageNum"
        layout="total, sizes, prev, pager, next"
        :total="pagination.total"
      >
      </el-pagination>
    </div>
    <el-dialog title="创建公会" width="600px" center="" :visible.sync="ifAdd">
      <div class="content">
        <el-row class="row">
          <el-col :span="5"><span class="redIcon">*</span>公会名称:</el-col>
          <el-col :span="19">
            <el-input v-model="addFormdata.guildName" placeholder="请输入公会名称"></el-input>
          </el-col>
        </el-row>
        <el-row class="row">
          <el-col :span="5"><span class="redIcon">*</span>负责人:</el-col>
          <el-col :span="19">
            <el-input v-model="addFormdata.name" placeholder="请输入负责人"></el-input>
          </el-col>
        </el-row>
        <el-row class="row">
          <el-col :span="5"><span class="redIcon">*</span>用户名:</el-col>
          <el-col :span="19">
            <el-input v-model="addFormdata.account" placeholder="请输入用户名"></el-input>
          </el-col>
        </el-row>
        <el-row class="row">
          <el-col :span="5"><span class="redIcon">*</span>密码:</el-col>
          <el-col :span="19">
            <el-input v-model="addFormdata.password" placeholder="请输入密码"></el-input>
          </el-col>
        </el-row>
        <el-row class="row">
          <el-col :span="5"><span class="redIcon">*</span>手机号:</el-col>
          <el-col :span="19">
            <el-input v-model="addFormdata.phone" maxlength="11" placeholder="请输入手机号"></el-input>
          </el-col>
        </el-row>
        <el-row class="row">
          <el-col :span="5"><span class="redIcon">*</span>证件号码:</el-col>
          <el-col :span="19">
            <el-input v-model="addFormdata.certificateNo" maxlength="18" placeholder="请输入身份证号"></el-input>
          </el-col>
        </el-row>
        <el-row class="row">
          <el-col :span="5"><span class="redIcon">*</span>合作时间:</el-col>
          <el-col :span="19">
            <el-date-picker
              style="width:372px"
              v-model="rangeVal"
              @change="dateTimeHandle"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="ifAdd = false">取 消</el-button> -->
        <el-button type="primary" @click="sureHandle">创建</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import checkIdCard from '@/utils/idCardCheck'
import { getGuildList, addGuild, editGuild, updateGuildStatus } from '@/api/guild'
export default {
  name: '',
  data() {
    return {
      ifAdd: false,
      anchorId: '',
      name: '',
      idcard: '',
      dateVal: '',
      tableData: [],
      rangeTime: [],
      rangeVal: [],
      addFormdata: {
        guildName: '',
        name: '',
        phone: '',
        startTime: '',
        password: '',
        endTime: '',
        certificateNo: '',
        account: ''
      },
      statusOptions: [
        { value: '', label: '全部' },
        { value: 0, label: '有效' },
        { value: 1, label: '无效' }
      ],
      pagination: {
        total: 0
      },
      formdata: {
        guildName: '',
        name: '',
        phone: '',
        startTime: '',
        status: '',
        endTime: '',
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  created() {
    this.getData()
  },
  mounted() {},
  computed: {},
  methods: {
    // 选择时间
    dateTimeHandle() {
      console.log(this.rangeTime)
      if (this.rangeTime) {
        this.formdata.startTime = this.rangeTime[0]
        this.formdata.endTime = this.rangeTime[1]
      } else {
        this.formdata.startTime = ''
        this.formdata.endTime = ''
      }
      if (this.rangeVal) {
        this.addFormdata.startTime = this.rangeVal[0]
        this.addFormdata.endTime = this.rangeVal[1]
      } else {
        this.addFormdata.startTime = ''
        this.addFormdata.endTime = ''
      }
    },
    // 搜索
    handleSearch(data) {
      this.formdata.pageNum = 1
      this.getData()
    },
    currentChange(pageNo) {
      this.formdata.pageNum = pageNo
      this.getData()
    },
    handleSizeChange(pageSize) {
      this.formdata.pageNum = 1
      this.formdata.pageSize = pageSize
      this.getData()
    },
    addGuild() {
      this.initAddAnchor()
      this.ifAdd = true
    },
    // 有效无效点击
    handleEffectiveInvalid(row, val) {
      const infoVal = val === 1 ? '确定与当前公会恢复合作' : '确定与当前公会终止合作'
      this.$confirm(infoVal, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        center: 'true'
      })
        .then(() => {
          // alert(1)
          console.log(row)
          const data = {
            id: row.id,
            status: val
          }
          updateGuildStatus(data)
            .then(res => {
              console.log(res)
              console.log('----')
              if (res.code === 200) {
                this.$message({
                  type: 'success',
                  message: '修改成功!'
                })
                this.getData()
              }
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 编辑
    handleEdit(row) {
      console.log(row)
      this.ifAdd = true
      this.rangeVal = [row.startTime, row.endTime]
      // this.addFormdata = row
      this.addFormdata.guildName = row.guildName
      this.addFormdata.name = row.name
      this.addFormdata.phone = row.phone
      this.addFormdata.startTime = row.startTime
      this.addFormdata.password = row.password
      this.addFormdata.endTime = row.endTime
      this.addFormdata.certificateNo = row.certificateNo
      this.addFormdata.account = row.account
      this.addFormdata.id = row.id
    },
    // 初始化主播添加
    initAddAnchor() {
      this.addFormdata = {
        guildName: '',
        name: '',
        phone: '',
        startTime: '',
        password: '',
        endTime: '',
        certificateNo: '',
        account: ''
      }
      this.rangeVal = []
    },
    // 确认添加
    sureHandle() {
      if (!this.addFormdata.guildName) {
        this.$message({
          type: 'warning',
          message: '公会名称不能为空！'
        })
        return
      }
      if (!this.addFormdata.name) {
        this.$message({
          type: 'warning',
          message: '负责人不能为空！'
        })
        return
      }

      if (!this.addFormdata.account) {
        this.$message({
          type: 'warning',
          message: '用户名不能为空！'
        })
        return
      }
      if (!this.addFormdata.password) {
        this.$message({
          type: 'warning',
          message: '密码不能为空！'
        })
        return
      }
      if (!this.addFormdata.phone) {
        this.$message({
          type: 'warning',
          message: '手机号不能为空！'
        })
        return
      }
      if (!this.addFormdata.certificateNo) {
        this.$message({
          type: 'warning',
          message: '证件号不能为空！'
        })
        return
      }
      if (!this.addFormdata.startTime) {
        this.$message({
          type: 'warning',
          message: '合作时间不能为空！'
        })
        return
      }
      if (this.addFormdata.id) {
        editGuild(this.addFormdata)
          .then(res => {
            console.log(res)
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '编辑成功！'
              })
              this.ifAdd = false
              this.getData()
            }
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        addGuild(this.addFormdata)
          .then(res => {
            console.log(res)
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '添加成功！'
              })
              this.ifAdd = false
              this.getData()
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    // 数据请求
    getData() {
      getGuildList(this.formdata)
        .then(res => {
          console.log(res)
          console.log('----')
          this.pagination.total = res.data.page.totalCount
          this.tableData = res.data.page.result
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.el-image {
  width: 100px;
  height: 100px;
}
.pagination {
  padding-top: 15px;
  text-align: center;
}
.el-table {
  /deep/ .cell {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  /deep/ th,
  td {
    text-align: center !important;
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
.searchDiv {
  margin-bottom: 20px;
  line-height: 40px;
  span {
    margin-left: 7px;
  }
  .btn-search {
    margin-left: 10px;
  }
}
</style>
