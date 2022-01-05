<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>Home</el-breadcrumb-item>
      <el-breadcrumb-item>Goods</el-breadcrumb-item>
      <el-breadcrumb-item>Add Goods</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-alert title="Add New Goods" type="info" show-icon center :closable="false"></el-alert>
      <!-- step bar -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="Basic Information"></el-step>
        <el-step title="Goods Picture"></el-step>
        <el-step title="Goods Description"></el-step>
        <el-step title="Goods Ingredients"></el-step>
        <el-step title="Goods Storage"></el-step>
      </el-steps>
      <!-- tag page -->
      <el-form :model="addGoodsForm" :rules="addGoodsFormRules" label-position="top" ref="addGoodsFormRef" status-icon>
        <el-tabs v-model="activeIndex" tab-position="left" :before-leave="beforeTabLeave">
          <el-tab-pane label="Basic Information" name="0">
            <el-form-item label="Goods Name" prop="name">
              <el-input v-model="addGoodsForm.name"></el-input>
            </el-form-item>
            <el-form-item label="Goods Weight" prop="weight">
              <el-input v-model="addGoodsForm.weight" type="number" onkeydown="return event.keyCode !== 69"></el-input>
            </el-form-item>
            <el-form-item label="Goods Price" prop="price">
              <el-input v-model="addGoodsForm.price" type="number" onkeydown="return event.keyCode !== 69"></el-input>
            </el-form-item>
            <el-form-item label="Goods Category (choose Tier 3 category)" required>
              <el-cascader :options="cateList" :props="cascProps" v-model="addGoodsForm.cate" @change="selectedCateChange()" ref="cascaderRef"></el-cascader>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="Goods Picture" name="1">
            <!-- action: complete URL of uploading picture -->
            <el-upload :action="uploadURL" list-type="picture-card" :on-preview="handlePicPreview" :on-remove="handlePicRemove" :headers="headerObj" :on-success="uploadSuccess" :limit="1" :class="{ disabled: hideUpload}">
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-tab-pane>

          <el-tab-pane label="Goods Description" name="2">
            <quill-editor v-model="addGoodsForm.description"/>
          </el-tab-pane>

          <el-tab-pane label="Goods Ingredients" name="3">
            <quill-editor v-model="addGoodsForm.ingredients"/>
          </el-tab-pane>

          <el-tab-pane label="Goods Storage" name="4">
            <quill-editor v-model="addGoodsForm.storage"/>
            <el-button type="primary" class="add-btn" @click="submitAddForm">Submit</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- dialog for previewing picture -->
    <el-dialog title="Preview Picture" :visible.sync="previewDialogVisible" width="50%">
      <img :src="previewPath" class="preview-img">
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: '0',
      addGoodsForm: {
        name: '',
        // weight & price should be number
        weight: '',
        price: '',
        // array of selected category's id
        cate: [],
        // tmp path of picture
        pic: '',
        description: '',
        ingredients: '',
        storage: ''
      },
      addGoodsFormRules: {
        name: [
          { required: true, message: 'please input goods name', trigger: 'blur' }
        ],
        weight: [
          { required: true, message: 'please input goods weight', trigger: 'blur' }
        ],
        price: [
          { required: true, message: 'please input goods price', trigger: 'blur' }
        ]
      },
      cateList: [],
      cascProps: {
        expandTrigger: 'hover',
        value: '_id',
        label: 'cate_name',
        children: 'children'
      },
      uploadURL: 'http://127.0.0.1:3000/upload',
      // upload doesn't call axios, which means no token in header, so we need to add token manually
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewDialogVisible: false,
      previewPath: '',
      hideUpload: false
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      var { data: res } = await this.$http.get('categories')
      // console.log(res.data)
      if (res.meta.status === 200) {
        this.cateList = res.data
      } else {
        this.$message.error(res.meta.msg)
      }
    },
    selectedCateChange() {
      console.log(this.addGoodsForm.cate)
      // must choose tier 3 category
      if (this.addGoodsForm.cate.length < 3) {
        this.addGoodsForm.cate = []
      }
    },
    beforeTabLeave(activeName, oldActiveName) {
      // console.log(activeName)
      // console.log(oldActiveName)
      // return false
      if (oldActiveName === '0') {
        // check if the basic information has been completed
        if (this.addGoodsForm.cate.length < 3) {
          this.$message.error('please choose goods category')
          return false
        }
        if (!(this.addGoodsForm.name && this.addGoodsForm.weight && this.addGoodsForm.price)) {
          this.$message.error('please complete basic information')
          return false
        }
      }
    },
    uploadSuccess(res, file, fileList) {
      // console.log(res)
      // console.log(file)
      // console.log(fileList)
      if (res.meta.status === 200) {
        // picture has been saved in server, then add related information to form
        this.hideUpload = true
        this.addGoodsForm.pic = res.data.img_path
      }
    },
    handlePicRemove(file) {
      this.addGoodsForm.pic = ''
      this.hideUpload = false
    },
    handlePicPreview(file) {
      console.log(file)
      this.previewPath = file.response.data.url
      this.previewDialogVisible = true
    },
    async submitAddForm() {
      // console.log(this.addGoodsForm)
      var newForm = {}
      newForm.name = this.addGoodsForm.name
      newForm.weight = this.addGoodsForm.weight - 0
      newForm.price = this.addGoodsForm.price - 0
      newForm.cate_one_id = this.addGoodsForm.cate[0]
      newForm.cate_two_id = this.addGoodsForm.cate[1]
      newForm.cate_three_id = this.addGoodsForm.cate[2]
      newForm.pic = this.addGoodsForm.pic
      newForm.description = this.addGoodsForm.description
      newForm.ingredients = this.addGoodsForm.ingredients
      newForm.storage = this.addGoodsForm.storage
      console.log(newForm)

      var { data: res } = await this.$http.post('goods', newForm)
      if (res.meta.status === 201) {
        this.$message.success('add new goods successfully')
        this.$router.push('/admin/goods')
      } else {
        this.$message.error(res.meta.msg)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-steps {
  margin: 20px 0;
}

.el-step__title {
  font-size: 16px;
}

.preview-img {
  width: 100%;
}

.add-btn {
  margin-top: 15px;
}
</style>
