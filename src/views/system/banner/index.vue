<!--
 * @Author: wangshengxian
 * @Date: 2020-08-19 09:57:01
 * @LastEditors: wangshengxian
 * @LastEditTime: 2020-11-19 15:19:59
 * @Desc: 系统设置 - 轮播
-->
<template>
  <div class="homeBanner">
    <el-button type="primary" class="btn" size="mini" icon="el-icon-plus" @click="onAdd">新建轮播/启动页</el-button>

    <div class="listBox">
      <div class="tableBox">
        <el-table :data="tableData" tooltip-effect="dark" style="width: 100%">
          <el-table-column prop="imgUrl" label="图片" min-width="260">
            <template slot-scope="scope">
              <img class="img" :src="scope.row.imageurl" alt="" />
            </template>
          </el-table-column>

          <el-table-column prop="link" label="链接" :formatter="formatterLink" min-width="300"> </el-table-column>

          <!-- type = 0/3 开启；2/4 关闭 -->
          <el-table-column prop="type" label="状态" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.type == 0 || scope.row.type == 3">开启</span>
              <span v-if="scope.row.type == 2 || scope.row.type == 4">关闭</span>
            </template>
          </el-table-column>

          <!-- type = 0/2 轮播图；3/4 启动页 -->
          <el-table-column prop="type" label="类型" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.type == 0 || scope.row.type == 2">轮播图</span>
              <span v-if="scope.row.type == 3 || scope.row.type == 4">启动页</span>
            </template>
          </el-table-column>

          <el-table-column prop="addtime" label="时间" min-width="160"> </el-table-column>

          <el-table-column label="操作" fixed="right" min-width="160">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="onEdit(scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="onDelete(scope.row)">删除</el-button>
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

    <addBanner
      :type="dialogType"
      :infoData="infoData"
      :visible.sync="isBanner"
      @success="handleAddBannerSuccess"
      @init="handleInit"
    />
  </div>
</template>

<script>
import pagination from '@/components/pagination'
import addBanner from '@/views/system/components/banner/handleAddBanner'
import { findAllLiveAdspots, delLiveAdspotsByid } from '@/api/system'
import tools from '@/utils/tools'
import { resourceUrl } from '@/const/global'
export default {
  name: '',
  data() {
    return {
      dialogType: 'add',
      isBanner: false,
      infoData: {
        imageUrl: [],
        link: '',
        mold: 0,
        type: 2
      },
      tableData: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  components: { pagination, addBanner },
  created() {
    this.getData()
  },
  mounted() {},
  computed: {},
  methods: {
    // 格式化table link内容显示
    formatterLink(row) {
      // console.log(row)
      return row.link ? row.link : '无'
    },
    getInitData(pageNum = 1, pageSize = 10) {
      this.pagination.currentPage = pageNum
      this.pagination.pageSize = pageSize
      this.getData()
    },
    currentChange(pageNum) {
      this.getInitData(pageNum, this.pagination.pageSize)
    },
    sizeChange(pageSize) {
      this.getInitData(1, pageSize)
    },
    handleInit() {
      this.infoData = {
        imageUrl: [],
        link: '',
        mold: 0,
        type: 2
      }
    },
    handleAddBannerSuccess() {
      this.getInitData()
    },
    onAdd() {
      this.dialogType = 'add'
      this.isBanner = true
    },
    // 编辑处理
    onEdit(row) {
      console.log('-edit-', row)
      this.dialogType = 'edit'
      this.isBanner = true
      this.infoData.id = row.id
      this.infoData.link = row.link
      this.infoData.imageUrl = [row.imageurl]
      if (row.type === 0) {
        // 轮播 开启
        this.infoData.mold = 0
        this.infoData.type = 0
        return
      }
      if (row.type === 2) {
        // 轮播 关闭
        this.infoData.mold = 0
        this.infoData.type = 2
        return
      }
      if (row.type === 3) {
        // 启动页 开启
        this.infoData.mold = 1
        this.infoData.type = 0
        return
      }
      if (row.type === 4) {
        // 启动页关闭
        this.infoData.mold = 1
        this.infoData.type = 2
      }
    },
    // 删除处理
    onDelete(row) {
      this.$confirm('确认删除该轮播?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: 'true'
      })
        .then(() => {
          const params = { ids: row.id }
          delLiveAdspotsByid(params).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getData()
          })
        })
        .catch(() => {})
    },
    // 数据请求
    getData() {
      const params = { pageSize: this.pagination.pageSize, pageNum: this.pagination.currentPage }
      // console.log('-params-', params)
      findAllLiveAdspots(params).then(res => {
        console.log('--res--', res)
        const { totalCount, result } = res.data.page
        this.pagination.total = totalCount
        this.tableData = result.map(val => {
          val.imageurl = `${resourceUrl}${tools.domainFilter(val.imageurl)}`
          return val
        })
        console.log('-table-list-', this.tableData)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-image {
  // width: 100px;
  // height: 100px;
}
.btn {
  margin-bottom: 20px;
}

.img {
  width: 240px;
  height: 80px;
}
</style>
