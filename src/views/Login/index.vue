<template>
  <div class="login">
    <el-card>
      <div class="avatar">
        <img src="@/assets/wallhaven-57jj71.png" alt />
      </div>
      <el-form class="el-form" :model="loginForm" :rules="rules" ref="loginForm">
        <el-form-item prop="userName">
          <el-input v-model="loginForm.userName">
            <template #prefix>
              <i class="icon el-icon-user-solid"></i>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input v-model="loginForm.password">
            <template #prefix>
              <i class="icon el-icon-lock"></i>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item class="btns">
          <el-button type="primary" @click="loginFn">登录</el-button>
          <el-button type="info" @click="resetFn">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { login } from '@/api/login'
export default {
  name: 'Login',
  created () { },
  data () {
    return {
      loginForm: {
        userName: 'admin',
        password: '123456'
      },
      rules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在3-8个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在3-8个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetFn () {
      this.$refs.loginForm.resetFields()
    },
    loginFn () {
      this.$refs.loginForm.validate(async (isOk) => {
        if (isOk) {
          console.log('校验成功')
          try {
            const { data } = await login({ username: this.loginForm.userName, password: this.loginForm.password })
            console.log(data)
            this.$store.commit('setToken', data.data.token)
            this.$message.success('登录成功')
            this.$router.push({ name: 'home' })
          } catch (err) {
            console.log(err)
            this.$message.error('登录失败，请重试')
          }
        } else {
          this.$message.error('输入格式不争取')
        }
      })
    }
  },
  computed: {},
  watch: {},
  filters: {},
  components: {}
}
</script>

<style scoped lang='less'>
.login {
  width: 100vw;
  height: 100vh;
  background-color: #2b4b6b;
  display: flex;
  justify-content: center;
  align-items: center;

  .el-card {
    overflow: unset;
  }
  :deep(.el-card__body) {
  position: relative;
    width: 450px;
    height: 300px;
  }
  :deep(.avatar) {
    position: absolute;
    z-index: 5;
    top: -50px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 100px;
    background-color: #fff;
    border-radius: 50%;
    box-shadow: 0 0 10px green;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
    }
  }

  :deep(.el-form) {
    margin-top: 60px;
    .btns {
      display: flex;
      justify-content: flex-end;
    }
    .icon {
      font-size: 16px;
    }
  }
}
</style>
