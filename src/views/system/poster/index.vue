<!--
   系统设置 - 海报配置
-->
<template>
  <div class="posterConfig">
    <el-button type="primary" icon="el-icon-plus" @click="onAdd">添加海报</el-button>
    <div class="main">
      <div class="listWrap">
        <div class="listBox">
          <el-table :data="tableList" tooltip-effect="dark" style="width: 100%">
            <el-table-column label="海报id" prop="id" min-width="100"></el-table-column>
            <el-table-column label="海报标题" prop="title" min-width="140"></el-table-column>
            <el-table-column label="海报图片" min-width="120">
              <template slot-scope="scope">
                <el-image
                  style="width: 80px"
                  :src="scope.row.photo"
                  :preview-src-list="scope.row.previewList"
                ></el-image>
              </template>
            </el-table-column>
            <el-table-column label="海报链接" prop="link" min-width="360"></el-table-column>
            <el-table-column label="创建时间" prop="createTime" min-width="180"></el-table-column>
            <el-table-column label="操作" min-width="180">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="onEdit(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="onDel(scope.row)">删除</el-button>
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
    </div>

    <poster :type="dialogType" :visible.sync="isPoster" :formData="formData" @success="handlePosterSuccess" />
  </div>
</template>

<script>
import pagination from '@/components/pagination'
import poster from '@/views/system/components/poster/addEditPoster'
import { getPosterList, delPoster } from '@/api/system'
import tools from '@/utils/tools'
import { resourceUrl } from '@/const/global'
export default {
  name: '',
  data() {
    return {
      dialogType: 'add',
      isPoster: false,
      formData: {},
      tableList: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  computed: {},
  components: { pagination, poster },
  created() {
    this.getData()
  },
  mounted() {},
  methods: {
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
    onAdd() {
      this.dialogType = 'add'
      this.isPoster = true
      this.formData = { title: '', link: '', photo: [] }
    },
    onEdit(row) {
      console.log('-edit-', row)
      this.dialogType = 'edit'
      this.isPoster = true
      const { id, title, photo, link } = row
      this.formData = { id, title, photo: [photo], link }
      console.log('-form-data-', this.formData)
    },
    onDel(row) {
      console.log('-del-', row)
      this.$confirm('确认删除该海报?', '提示', {
        type: 'warning',
        center: true
      })
        .then(() => {
          console.log('确定删除')
          const params = { id: row.id }
          delPoster(params).then(res => {
            this.$message({
              message: '删除成功!',
              type: 'success'
            })
            this.getData()
          })
        })
        .catch(() => {})
    },
    handlePosterSuccess() {
      this.dialogType === 'add' ? this.getInitData() : this.getData()
    },
    getData() {
      const params = { pageNum: this.pagination.currentPage, pageSize: this.pagination.pageSize }
      getPosterList(params).then(res => {
        console.log('-res-', res)
        const { totalCount, result } = res.data
        this.tableList = result.map(val => {
          val.photo = `${resourceUrl}${tools.domainFilter(val.photo)}`
          console.log(val.photo)
          return { previewList: [val.photo], ...val }
        })
        this.pagination.total = totalCount
        console.log('-list-', this.tableList)
      })
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
// /deep/ .el-image__inner {
//   width: 80px;
// }
</style>
