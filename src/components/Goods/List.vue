<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>Home</el-breadcrumb-item>
      <el-breadcrumb-item>Goods</el-breadcrumb-item>
      <el-breadcrumb-item>Goods List</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="please input search keyword" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="searchGoods()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="goAddPage()">Add New Goods</el-button>
        </el-col>
      </el-row>
      <!-- table -->
      <el-table :data="goodsList" stripe border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="name" label="Goods Name"></el-table-column>
        <el-table-column prop="weight" label="Goods Weight" width="110px"></el-table-column>
        <el-table-column prop="price" label="Goods Price" width="100px"></el-table-column>
        <el-table-column label="Create Time" width="140px">
          <template slot-scope="scope">
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="Operations" width="150px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="goEditPage(scope.row._id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteGoods(scope.row._id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- pagination -->
      <div class="page-block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      goodsList: []
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList() {
      var { data: res } = await this.$http.get('goods', { params: this.queryInfo })
      // console.log(res)
      if (res.meta.status === 200) {
        this.goodsList = res.data.goods
        this.total = res.data.totalCount
      } else {
        this.$message.error(res.meta.msg)
      }
    },
    // call this function when pagesize changes
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    // call this function when current page changes
    handleCurrentChange(newCurrentPage) {
      this.queryInfo.pagenum = newCurrentPage
      this.getGoodsList()
    },
    searchGoods() {
      this.queryInfo.pagenum = 1
      this.getGoodsList()
    },
    async deleteGoods(id) {
      var confirmRes = await this.$confirm('Are you sure you want to delete this goods permanently?', 'Alert:', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).catch(err => err)
      // console.log(res)
      if (confirmRes === 'confirm') {
        var { data: res } = await this.$http.delete('goods/' + id)
        if (res.meta.status === 200) {
          this.$message.success('delete goods successfully')
          this.getGoodsList()
        } else {
          this.$message.error(res.meta.msg)
        }
      } else {
        this.$message.info('deletion has been cancelled')
      }
    },
    goEditPage(id) {
      this.$router.push('/admin/goods/edit/' + id)
    },
    goAddPage() {
      this.$router.push('/admin/goods/add')
    }
  }
}
</script>

<style lang="less" scoped>
.page-block {
  margin-top: 20px;
}
</style>
