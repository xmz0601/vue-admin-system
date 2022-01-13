<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>Home</el-breadcrumb-item>
      <el-breadcrumb-item>Goods</el-breadcrumb-item>
      <el-breadcrumb-item>Edit Goods</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-alert title="Edit Goods" type="info" show-icon center :closable="false"></el-alert>
      <!-- step bar -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="Basic Information"></el-step>
        <el-step title="Goods Description"></el-step>
        <el-step title="Goods Ingredients"></el-step>
        <el-step title="Goods Storage"></el-step>
      </el-steps>
      <!-- tag page -->
      <el-form :model="editGoodsForm" :rules="editGoodsFormRules" label-position="top" ref="editGoodsFormRef" status-icon>
        <el-tabs v-model="activeIndex" tab-position="left" :before-leave="beforeTabLeave">
          <el-tab-pane label="Basic Information" name="0">
            <el-form-item label="Goods Name" prop="name">
              <el-input v-model="editGoodsForm.name"></el-input>
            </el-form-item>
            <el-form-item label="Goods Weight" prop="weight">
              <el-input v-model="editGoodsForm.weight" type="number" onkeydown="return event.keyCode !== 69"></el-input>
            </el-form-item>
            <el-form-item label="Goods Price" prop="price">
              <el-input v-model="editGoodsForm.price" type="number" onkeydown="return event.keyCode !== 69"></el-input>
            </el-form-item>
            <el-form-item label="Goods Category">
              <el-input v-model="editGoodsForm.cate" disabled></el-input>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="Goods Description" name="1">
            <quill-editor v-model="editGoodsForm.description"/>
          </el-tab-pane>

          <el-tab-pane label="Goods Ingredients" name="2">
            <quill-editor v-model="editGoodsForm.ingredients"/>
          </el-tab-pane>

          <el-tab-pane label="Goods Storage" name="3">
            <quill-editor v-model="editGoodsForm.storage"/>
            <el-button type="primary" class="edit-btn" @click="submitEditForm">Submit</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: '0',
      editGoodsForm: {},
      editGoodsFormRules: {
        name: [
          { required: true, message: 'please input goods name', trigger: 'blur' }
        ],
        weight: [
          { required: true, message: 'please input goods weight', trigger: 'blur' }
        ],
        price: [
          { required: true, message: 'please input goods price', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getGoods()
  },
  methods: {
    async getGoods() {
      var { data: res } = await this.$http.get('goods/' + this.$route.params.gid)
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      var cateOne = await this.$http.get('categories/' + res.data.cate_one_id)
      var cateOneName = cateOne.data.data.cate_name
      var cateTwo = await this.$http.get('categories/' + res.data.cate_two_id)
      var cateTwoName = cateTwo.data.data.cate_name
      var cateThree = await this.$http.get('categories/' + res.data.cate_three_id)
      var cateThreeName = cateThree.data.data.cate_name
      res.data.cate = cateOneName + ' / ' + cateTwoName + ' / ' + cateThreeName
      this.editGoodsForm = res.data
      // console.log(this.editGoodsForm)
    },
    beforeTabLeave(activeName, oldActiveName) {
      // console.log(activeName)
      // console.log(oldActiveName)
      // return false
      if (oldActiveName === '0') {
        // check if the basic information has been completed
        if (!(this.editGoodsForm.name && this.editGoodsForm.weight && this.editGoodsForm.price)) {
          this.$message.error('please complete basic information')
          return false
        }
      }
    },
    async submitEditForm() {
      // console.log(this.addGoodsForm)
      var newForm = {}
      newForm.name = this.editGoodsForm.name
      newForm.weight = this.editGoodsForm.weight - 0
      newForm.price = this.editGoodsForm.price - 0
      newForm.pic = this.editGoodsForm.pic
      newForm.description = this.editGoodsForm.description
      newForm.ingredients = this.editGoodsForm.ingredients
      newForm.storage = this.editGoodsForm.storage
      console.log(newForm)

      var { data: res } = await this.$http.put('goods/' + this.$route.params.gid, newForm)
      if (res.meta.status === 200) {
        this.$message.success('update goods information successfully')
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

.edit-btn {
  margin-top: 15px;
}
</style>
