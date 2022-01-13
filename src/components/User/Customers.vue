<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>Home</el-breadcrumb-item>
      <el-breadcrumb-item>User</el-breadcrumb-item>
      <el-breadcrumb-item>Customer List</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="please input search keyword" v-model="queryInfo.query" clearable>
            <el-button slot="append" icon="el-icon-search" @click="searchUsername()"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- table -->
      <el-table :data="userList" stripe border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="Username"></el-table-column>
        <el-table-column prop="email" label="Email"></el-table-column>
        <el-table-column label="State">
          <template slot-scope="scope">
            <!-- scope.row: data for this row -->
            <!-- pass data to switch through slot-scope, or switch cannot get the data -->
            <el-switch v-model="scope.row.state" @change="changeState(scope.row)" :active-value=1 :inactive-value=0></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="post_code" label="Post_code"></el-table-column>
        <el-table-column prop="address" label="Address"></el-table-column>
        <el-table-column prop="town_city" label="Town_city"></el-table-column>
        <el-table-column label="Operations" width="200">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditUserForm(scope.row._id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row._id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- pagination -->
      <div class="page-block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[2, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </el-card>

    <!-- dialog for editing customer -->
    <el-dialog title="Edit Customer Information" :visible.sync="editUserFormVisible" width="50%" @close="resetEditUserForm()">
      <el-form :model="editUserForm" :rules="editUserFormRules" ref="editUserFormRef" label-width="100px" status-icon>
        <el-form-item label="Email">
          <el-input v-model="editUserForm.email" disabled></el-input>
        </el-form-item>
        <el-form-item label="Username" prop="username">
          <el-input v-model="editUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="Post_code" prop="post_code">
          <el-input v-model="editUserForm.post_code"></el-input>
        </el-form-item>
        <el-form-item label="Address" prop="address">
          <el-input v-model="editUserForm.address"></el-input>
        </el-form-item>
        <el-form-item label="Town_city" prop="town_city">
          <el-input v-model="editUserForm.town_city"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editUserFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submitEditUserForm()">Submit</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // post_code reg
    var checkPost = (rule, value, callback) => {
      const regPost = /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/
      if (regPost.test(value)) {
        return callback()
      } else {
        return callback(new Error('post_code is invalid'))
      }
    }

    return {
      // pass queryInfo as parameter when get user list
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      userList: [],
      editUserFormVisible: false,
      editUserForm: {},
      editUserFormRules: {
        username: [
          { required: true, message: 'please input username', trigger: 'blur' },
          { min: 2, max: 10, message: 'the length of username is between 2 and 10', trigger: 'blur' }
        ],
        post_code: [
          { required: true, message: 'please input post_code', trigger: 'blur' },
          { validator: checkPost, trigger: 'blur' }
        ],
        address: [
          { required: true, message: 'please input address', trigger: 'blur' }
        ],
        town_city: [
          { required: true, message: 'please input town_city', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      var { data: res } = await this.$http.get('customers', { params: this.queryInfo })
      // console.log(res)
      if (res.meta.status === 200) {
        this.userList = res.data.users
        this.total = res.data.totalCount
      } else {
        this.$message.error(res.meta.msg)
      }
    },
    // call this function when pagesize changes
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // call this function when current page changes
    handleCurrentChange(newCurrentPage) {
      // console.log(newCurrentPage)
      this.queryInfo.pagenum = newCurrentPage
      this.getUserList()
    },
    searchUsername() {
      this.queryInfo.pagenum = 1
      this.getUserList()
    },
    async changeState(info) {
      // console.log(info)
      // call API, save new state
      var { data: res } = await this.$http.put(`customers/${info._id}/state/${info.state}`)
      // console.log(res)
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
        // remember to change the switch back
        info.state = info.state === 0 ? 1 : 0
      } else {
        this.$message.success('change customer state successfully')
      }
    },
    async showEditUserForm(id) {
      // query user by id and render
      var { data: res } = await this.$http.get('customers/' + id)
      if (res.meta.status === 200) {
        this.editUserForm = res.data
        this.editUserFormVisible = true
      } else {
        this.$message.error(res.meta.msg)
      }
    },
    resetEditUserForm() {
      // this: the instance of current component
      this.$refs.editUserFormRef.resetFields()
    },
    submitEditUserForm() {
      this.$refs.editUserFormRef.validate(async (valid) => {
        if (!valid) {
          return
        }
        var { data: res } = await this.$http.put('customers/' + this.editUserForm._id, {
          username: this.editUserForm.username,
          post_code: this.editUserForm.post_code,
          address: this.editUserForm.address,
          town_city: this.editUserForm.town_city
        })
        if (res.meta.status === 200) {
          this.editUserFormVisible = false
          this.$message.success('update customer information successfully')
          this.getUserList()
        } else {
          this.$message.error(res.meta.msg)
        }
      })
    },
    async deleteUser(id) {
      var confirmRes = await this.$confirm('Are you sure you want to delete this customer permanently?', 'Alert:', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).catch(err => err)
      // console.log(res)
      if (confirmRes === 'confirm') {
        var { data: res } = await this.$http.delete('customers/' + id)
        if (res.meta.status === 200) {
          this.$message.success('delete customer successfully')
          this.getUserList()
        } else {
          this.$message.error(res.meta.msg)
        }
      } else {
        this.$message.info('deletion has been cancelled')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.page-block {
  margin-top: 20px;
}
</style>
