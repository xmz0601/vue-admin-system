<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>Home</el-breadcrumb-item>
      <el-breadcrumb-item>Category</el-breadcrumb-item>
      <el-breadcrumb-item>Category List</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog()">Add New Category</el-button>
        </el-col>
      </el-row>
      <!-- table -->
      <tree-table :data="cateList" :columns="colConfig" :selection-type="false" :expand-type="false" show-index index-text="#" border :show-row-hover="false">
        <template slot="level" slot-scope="scope">
          <el-tag v-if="scope.row.cate_level === 0" size="mini">Tier 1</el-tag>
          <el-tag type="success" v-else-if="scope.row.cate_level === 1" size="mini">Tier 2</el-tag>
          <el-tag type="warning" v-else size="mini">Tier 3</el-tag>
        </template>
        <template slot="operation" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditCateForm(scope.row._id)">Edit</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteCate(scope.row._id)">Delete</el-button>
        </template>
      </tree-table>
      <!-- pagination -->
      <div class="page-block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[2, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </el-card>

    <!-- dialog for adding new category -->
    <el-dialog title="Add New Category" :visible.sync="addCateFormVisible" width="50%" @close="addCateDialogClose()">
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="130px" status-icon>
        <el-form-item label="Category Name" prop="cate_name">
          <el-input v-model="addCateForm.cate_name"></el-input>
        </el-form-item>
        <el-form-item label="Parent Category">
          <el-cascader :options="parentCateList" :props="cascProps" v-model="selectedKeys" @change="parentCateChange()" clearable ref="cascaderRef"></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCateFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submitAddCateForm()">Add</el-button>
      </div>
    </el-dialog>

    <!-- dialog for editing category -->
    <el-dialog title="Edit Category" :visible.sync="editCateFormVisible" width="50%" @close="resetEditCateForm()">
      <el-form :model="editCateForm" :rules="editCateFormRules" ref="editCateFormRef" label-width="130px" status-icon>
        <el-form-item label="Category Name" prop="cate_name">
          <el-input v-model="editCateForm.cate_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editCateFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submitEditCateForm()">Submit</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: {
        level: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      cateList: [],
      colConfig: [{
        label: 'Category Name',
        prop: 'cate_name'
      }, {
        label: 'Category Level',
        type: 'template',
        template: 'level'
      }, {
        label: 'Operations',
        type: 'template',
        template: 'operation'
      }],
      parentCateList: [],
      cascProps: {
        expandTrigger: 'hover',
        value: '_id',
        label: 'cate_name',
        children: 'children',
        checkStrictly: true
      },
      // id of selected parent category
      selectedKeys: [],
      addCateFormVisible: false,
      addCateForm: {
        cate_name: '',
        cate_pid: 0,
        cate_level: 0
      },
      addCateFormRules: {
        cate_name: [
          { required: true, message: 'please input category name', trigger: 'blur' }
        ]
      },
      editCateFormVisible: false,
      editCateForm: {},
      editCateFormRules: {
        cate_name: [
          { required: true, message: 'please input category name', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      var { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      console.log(res.data)
      if (res.meta.status === 200) {
        this.cateList = res.data.cates
        this.total = res.data.totalCount
      } else {
        this.$message.error(res.meta.msg)
      }
    },
    // call this function when pagesize changes
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // call this function when current page changes
    handleCurrentChange(newCurrentPage) {
      this.queryInfo.pagenum = newCurrentPage
      this.getCateList()
    },
    // get parent cate list to render cascader
    async getParentCateList() {
      var { data: res } = await this.$http.get('categories', { params: { level: 2 } })
      console.log(res.data)
      if (res.meta.status === 200) {
        this.parentCateList = res.data
      } else {
        this.$message.error(res.meta.msg)
      }
    },
    showAddCateDialog() {
      this.getParentCateList()
      this.addCateFormVisible = true
    },
    // call this function when selected parent category changes
    parentCateChange() {
      console.log(this.selectedKeys)
      // hide dropdown menu when selected
      this.$refs.cascaderRef.dropDownVisible = false
      // update addCateForm
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cate_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateForm.cate_level = this.selectedKeys.length
      } else {
        this.addCateForm.cate_pid = 0
        this.addCateForm.cate_level = 0
      }
    },
    addCateDialogClose() {
      // console.log(this)
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cate_pid = 0
      this.addCateForm.cate_level = 0
    },
    submitAddCateForm() {
      // console.log(this.addCateForm)
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) {
          return
        }
        var { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status === 201) {
          this.addCateFormVisible = false
          this.$message.success('add new category successfully')
          this.getCateList()
        } else {
          this.$message.error(res.meta.msg)
        }
      })
    },
    async showEditCateForm(id) {
      // query category by id and render
      var { data: res } = await this.$http.get('categories/' + id)
      if (res.meta.status === 200) {
        this.editCateForm = res.data
        this.editCateFormVisible = true
      } else {
        this.$message.error(res.meta.msg)
      }
    },
    resetEditCateForm() {
      this.$refs.editCateFormRef.resetFields()
    },
    submitEditCateForm() {
      this.$refs.editCateFormRef.validate(async (valid) => {
        if (!valid) {
          return
        }
        var { data: res } = await this.$http.put('categories/' + this.editCateForm._id, {
          cate_name: this.editCateForm.cate_name
        })
        if (res.meta.status === 200) {
          this.editCateFormVisible = false
          this.$message.success('update category successfully')
          this.getCateList()
        } else {
          this.$message.error(res.meta.msg)
        }
      })
    },
    async deleteCate(id) {
      var confirmRes = await this.$confirm('Are you sure you want to delete this category permanently?', 'Alert:', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).catch(err => err)
      // console.log(res)
      if (confirmRes === 'confirm') {
        var { data: res } = await this.$http.delete('categories/' + id)
        if (res.meta.status === 200) {
          this.$message.success('delete category successfully')
          this.getCateList()
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
.zk-table {
  margin: 20px 0;
}

.el-cascader {
  width: 100%;
}
</style>
