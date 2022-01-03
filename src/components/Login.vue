<template>
  <div class="login-container">
    <div class="login-box">
      <div class="avatar-box">
        <img src="../assets/logo.png">
      </div>
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0" class="login-form">
        <el-form-item prop="email">
          <el-input type="email" v-model="loginForm.email" placeholder="Email" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" placeholder="Password" prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="fr" @click="submitLoginForm()">Log in</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    // email reg
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return callback()
      } else {
        return callback(new Error('email is invalid'))
      }
    }
    // password reg
    var checkPwd = (rule, value, callback) => {
      const regPwd = /^[a-zA-Z0-9]{6,30}$/
      if (regPwd.test(value)) {
        return callback()
      } else {
        return callback(new Error('password is invalid'))
      }
    }
    return {
      loginForm: {
        email: '',
        password: ''
      },
      loginFormRules: {
        email: [
          { required: true, message: 'please input your email', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'please input your password', trigger: 'blur' },
          { validator: checkPwd, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitLoginForm() {
      // verify data
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) {
          return
        }
        var { data: res } = await this.$http.post('slogin', this.loginForm)
        // console.log(res)
        if (res.meta.status === 200) {
          // this.$message.success('log in successfully')
          window.sessionStorage.setItem('token', res.data.token)
          this.$router.push('/admin/home')
        } else {
          this.$message.error('email or password is wrong')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  background-color: #2b4b6b;
  height: 100%;
}
.login-box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-225px, -150px);
}
.avatar-box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 160px;
  top: -65px;
  background-color: #fff;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
.login-form {
  margin: 120px 30px 20px 30px;
}
</style>
