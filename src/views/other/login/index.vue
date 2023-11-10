<template>
  <div class="login-container">
    <div class="left">
      <div class="login-message">
        <div class="logo"></div>
        <div class="message">
          <div class="title">让数据产生更多价值</div>
          <div class="second-title">构建企业数字化转型的核心支撑平台</div>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="login-form">
        <div class="form-title">欢迎登录</div>
        <el-form
          ref="loginForm"
          class="form-data"
          label-position="left"
          size="large"
          :rules="state.rules"
          :model="state.userForm"
        >
          <el-form-item prop="username">
            <el-input v-model.trim="state.userForm.username" type="text" placeholder="请输入用户名">
              <template #prefix>
                <img src="/static/icons/user.svg" class="icon" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model.trim="state.userForm.password"
              type="password"
              placeholder="请输入密码"
              show-password
              @keyup.enter.native="submitForm"
            >
              <template #prefix>
                <img src="/static/icons/lock.svg" class="icon" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <div style="width: 100%">
              <div style="color: #333">登录即代表您已阅读并同意《<a style="color: #3246d2">隐私条款</a>》</div>
              <div class="login-button" @click="submitForm">登录</div>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="copy-right">Copyright © 2023 data_harness-fe. All Rights Reserved. 驭数轻云 版权所有</div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { encrypt } from '@/utils'
import { useRouter } from 'vue-router'

const router = useRouter()

const loginForm = ref(null)
const state = reactive({
  userForm: {
    username: '',
    password: '',
  },
  checked: true,
  rules: {
    username: [{ required: 'true', message: '账户不能为空', trigger: 'blur' }],
    password: [
      {
        required: 'true',
        validator: async (rule, value, callback) => {
          if (value) {
            if (value.length >= 6) {
              callback()
            } else {
              callback(new Error('密码长度必须大于6'))
            }
          } else {
            callback(new Error('密码不能为空'))
          }
        },
        trigger: 'blur',
      },
    ],
  },
})

import useUserStore from '@/store/modules/user'
const userStore = useUserStore()

const submitForm = async () => {
  loginForm.value.validate((valid) => {
    if (valid) {
      console.log('submit!!')
      console.log({
        username: state.userForm.username,
        password: encrypt(state.userForm.password),
      })
      userStore
        .login({
          username: state.userForm.username,
          password: encrypt(state.userForm.password),
        })
        .then((res) => {
          console.log('res', res)
          // window.location.href = '/'
          router.push('/')
        })
    } else {
      console.log('error submit!!')
      return false
    }
  })
}

const resetForm = () => {
  loginForm.value.resetFields()
}
</script>

<style scoped lang="scss">
.login-container {
  position: relative;
  height: 100vh;
  width: 100vw;

  .left {
    position: absolute;
    top: 0px;
    left: 0px;
    height: 100vh;
    width: 45%;
    // padding: 121px 0;
    display: flex;
    align-items: center;
    flex-direction: column;
    background-image: url(/static/imgs/login-bg.png);
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background-size: auto 100vh;

    .login-message {
      margin: 121px auto;
      width: 554px;

      // border: 1px solid red;
      .logo {
        width: 160px;
        height: 71px;
        background-image: url(/static/imgs/logo.svg);
        background-repeat: no-repeat;
        background-position: 50% 50%;
        background-size: 160px 71px;
      }

      .message {
        margin-top: 16px;

        .title {
          font-size: 40px;
          font-weight: 600;
          color: #000000;
        }

        .second-title {
          margin-top: 20px;
          font-size: 16px;
          font-weight: 400;
          color: #000000;
        }
      }
    }
  }

  .right {
    position: absolute;
    top: 0px;
    right: 0px;
    height: 100vh;
    width: calc(55% + 26px);
    border-top-left-radius: 26px;
    border-bottom-left-radius: 26px;
    background-color: white;

    .login-form {
      position: relative;
      height: 100vh;
      width: 388px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: center;

      .form-title {
        font-size: 32px;
        font-weight: bold;
        color: #333333;
      }

      .form-data {
        margin: 44px 0 22px;

        .login-button {
          height: 44px;
          line-height: 44px;
          background: #3246d2;
          font-size: 16px;
          font-weight: bold;
          color: #ffffff;
          text-align: center;
          border-radius: 4px;
        }
      }
    }

    .copy-right {
      font-size: 14px;
      font-weight: 400;
      width: 100%;
      color: #999999;
      position: absolute;
      bottom: 37px;
      text-align: center;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
</style>
