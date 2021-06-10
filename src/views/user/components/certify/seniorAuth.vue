<!--
 * @Author: wangshengxian
 * @Date: 2020-09-27 18:25:59
 * @LastEditors: wangshengxian
 * @LastEditTime: 2020-09-29 15:14:43
 * @Desc: 实名认证 - 身份认证list
-->
<template>
  <div class="identity-auth">
    <el-table :data="list" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelChange">
      <el-table-column type="selection" min-width="60"></el-table-column>
      <el-table-column prop="userId" label="ID" min-width="100"></el-table-column>
      <el-table-column prop="myname" label="昵称" min-width="120"></el-table-column>

      <el-table-column prop="mobile" label="证件类型" min-width="80" :formatter="certificateFormatter">
      </el-table-column>
      <el-table-column :key="Math.random()" prop="photoPositive" label="证件照" min-width="120">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-view" @click="findIdCard(scope.row)">查看</el-button>
        </template>
      </el-table-column>

      <el-table-column prop="status" label="状态" min-width="80" :formatter="statusFormatter"> </el-table-column>
      <el-table-column prop="createTime" label="时间" min-width="160"></el-table-column>
      <el-table-column label="操作" min-width="180" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="success"
            icon="el-icon-check"
            :disabled="scope.row.status != 0"
            @click="onAuthBtn(1, scope.row)"
            >通过</el-button
          >
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-close"
            :disabled="scope.row.status != 0"
            @click="onAuthBtn(2, scope.row)"
            >不通过</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <div class="operateBtnBox" style="margin-top: 20px">
      <el-button type="success" icon="el-icon-check" @click="onOperateBtn('pass')">批量通过</el-button>
      <el-button type="danger" icon="el-icon-close" @click="onOperateBtn('notPass')" v-if="env === 'development'"
        >批量不通过</el-button
      >
    </div>
  </div>
</template>

<script>
import { getCertificateType, getAuditStatus } from '@/filters/global'
export default {
  name: '',
  data() {
    return {
      env: process.env.NODE_ENV,
      multipleSelList: []
    }
  },
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    },
    // 是否批量操作完成
    isFinished: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    isFinished(val) {
      console.log('-init-multiple-list-')
      this.multipleSelList = []
    }
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    certificateFormatter(row) {
      return getCertificateType(row.type)
    },
    statusFormatter(row) {
      return getAuditStatus(row.status)
    },
    // 查看身份证
    findIdCard(row) {
      console.log('-查看证件照-', row)
      this.$emit('checkPic', row)
    },
    onAuthBtn(type, row) {
      this.$emit('authEvent', [type, row])
    },
    handleSelChange(val) {
      console.log('-多选-', val)
      this.multipleSelList = val
    },
    onOperateBtn(type) {
      this.$emit('batchOperate', [type, this.multipleSelList])
    }
  },
  components: {}
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
</style>
