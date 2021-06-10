<!--
 * @Author: wangshengxian
 * @Date: 2020-10-13 11:20:59
 * @LastEditors: wangshengxian
 * @LastEditTime: 2021-01-25 16:10:45
 * @Desc: 系统设置 - 充值配置
-->
<template>
  <div class="rechargeConfig">
    <header class="headerBox">
      <h2>充值数量配置</h2>
      <el-button type="primary" size="mini" icon="el-icon-plus" @click="onAddConfig">添加配置</el-button>
    </header>
    <div class="tableMain">
      <table class="tableBox" border="0" cellspacing="0" cellpadding="0">
        <thead class="tableHeader">
          <tr>
            <th class="headerItem" v-for="(item, index) in tableTitles" :key="index">
              <p>{{ item }}</p>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in tableList" :key="index">
            <td>{{ item.sort }}</td>
            <td>{{ item.number }}</td>
            <td>{{ item.reward }}</td>
            <td>
              <el-button type="primary" size="mini" icon="el-icon-edit" @click="onEditConfig(item, index)"
                >编辑</el-button
              >
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="onDel(item, index)">删除</el-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <addEditConfig
      :type="dialogType"
      :formData="dialogFormData"
      :dialogVis.sync="isRechargeConfig"
      @success="handleSuccess"
    />
  </div>
</template>

<script>
import addEditConfig from '@/views/system/components/recharge/addEditConfig'
import { getPayConfigList, delPayConfig } from '@/api/system'
export default {
  name: '',
  data() {
    return {
      actIdx: -1,
      dialogType: '权重标准编辑',
      isRechargeConfig: false,
      tableTitles: ['序号', '出售数量', '奖励数量', '操作'],
      dialogFormData: {
        gift: 0,
        num: 0,
        time: 0
      },
      tableList: []
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getData()
  },
  mounted() {},
  methods: {
    onAddConfig() {
      console.log('-add-')
      this.dialogType = 'add'
      this.isRechargeConfig = true
      this.dialogFormData = { number: '', reward: '' }
    },
    onEditConfig(item, idx) {
      console.log('-edit-', item, idx)
      const { sort, ...otherObj } = item
      this.dialogType = 'edit'
      this.isRechargeConfig = true
      this.dialogFormData = { ...otherObj }
    },
    onDel(data, idx) {
      console.log('-del-', data, idx)
      this.$confirm('确认删除此配置', '提示', {
        type: 'warning',
        center: true
      })
        .then(() => {
          console.log('-data-', data)
          const params = { id: data.id }
          console.log('-params-', params)
          delPayConfig(params).then(res => {
            console.log('-res-', res)
            this.$message({
              message: '删除成功!',
              type: 'success'
            })
            this.getData()
          })
        })
        .catch(() => {})
    },
    handleSuccess(data) {
      console.log('-handle-rate-', data)
      this.getData()
    },
    getData() {
      getPayConfigList().then(res => {
        console.log('-res-', res)
        this.tableList = res.data
        console.log('-table-data-', this.tableList)
      })
    }
  },
  components: { addEditConfig }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类

.headerBox {
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;

  h2 {
    font-weight: 600;
  }
}

.tableMain {
  padding: 10px 20px;
}

.tableBox {
  width: 100%;
  border: 1px solid #000;

  tr {
    display: flex;
    th,
    td {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 25%;
      line-height: 50px;
      border-bottom: 1px solid #000;
      border-right: 1px solid #000;

      &:last-child {
        border-right: none;
      }
    }
  }
  tbody {
    tr {
      &:last-child {
        td {
          border-bottom: none;
        }
      }
    }
  }

  thead {
    width: 100%;
  }
}
</style>
