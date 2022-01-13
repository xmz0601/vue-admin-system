<template>
  <el-container class="home-box">
    <el-header>
      <span>Acodo Admin System</span>
      <el-button type="info" @click="logout()">Log out</el-button>
    </el-header>
    <el-container>
      <!-- left menu -->
      <el-aside :width="collapseFlag ? '64px' : '200px'">
        <div class="toggle-btn" @click="collapseMenu()">| | |</div>
        <!-- default-active: index of active menu -->
        <!-- route path: index -->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409eff" unique-opened :collapse="collapseFlag" :collapse-transition="false" router :default-active="activeMenu">
          <!-- tier 1 menu -->
          <!-- every submenu should have its own index, or tier 1 menus will be unfolded at the same time -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- tier 2 menu -->
            <el-menu-item :index="'/admin/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="storeActive(subItem.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      iconObj: {
        100: 'iconfont icon-users',
        200: 'iconfont icon-tijikongjian',
        300: 'iconfont icon-shangpin',
        400: 'iconfont icon-baobiao'
      },
      collapseFlag: false,
      activeMenu: ''
    }
  },
  created() {
    this.getMenuList()
    this.activeMenu = window.sessionStorage.getItem('activeMenu')
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/admin/login')
    },
    async getMenuList() {
      var { data: res } = await this.$http.get('menus')
      console.log(res)
      if (res.meta.status === 200) {
        this.menuList = res.data
      } else {
        this.$message.error(res.meta.msg)
      }
    },
    collapseMenu() {
      this.collapseFlag = !this.collapseFlag
    },
    storeActive(menu) {
      // do not save the active menu item in data, or it will lose after refreshing
      // save it in sessionStorage, and take it out from sessionStorage after refreshing
      window.sessionStorage.setItem('activeMenu', '/admin/' + menu)
      this.activeMenu = '/admin/' + menu
    }
  }
}
</script>

<style lang="less" scoped>
.home-box {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  padding: 2px 20px 2px 0;
  span {
    color: #fff;
    font-size: 26px;
    float: left;
    margin: 11px 0 11px 15px;
  }
  .el-button {
    float: right;
    margin-top: 8px;
  }
}

.el-aside {
  background-color: #333744;
  i {
    margin-right: 20px;
  }
}

.toggle-btn {
  background-color: #4a5064;
  color: #fff;
  text-align: center;
  font-size: 10px;
  height: 25px;
  line-height: 25px;
  cursor: pointer;
}

.el-menu {
  border-right: none;
}

.el-main {
  background-color: #eaedf1;
}
</style>
