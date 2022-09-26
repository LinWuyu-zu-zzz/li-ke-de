<template>
  <div class="login-container">
    <div class="login-form">
      <img src="@/assets/common/logo.png" alt="">
      <el-form ref="loginForm" :model="loginForm" :rules="rules">
        <!-- 账号 -->
        <el-form-item prop="loginName">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input v-model="loginForm.loginName" placeholder="请输入手机号码" />
        </el-form-item>

        <!-- 密码 -->
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input ref="pwdRef" v-model="loginForm.password" :type="passwordType==='password'?'password':'text'" placeholder="请输入密码" />
          <span class="svg-container" @click="showPwd">
            <svg-icon :icon-class="passwordType==='password'?'eye':'eye-open'" />
          </span>
        </el-form-item>

        <!-- 验证码 -->
        <el-form-item prop="code">
          <el-row justify="space-between">
            <el-col :span="17">
              <i class="el-icon-s-claim svg-container" />
              <el-input v-model="loginForm.code" placeholder="请输入验证码" />
            </el-col>
            <el-col :span="7">
              <img :src="codeImg" alt="" @click="getCode()">
            </el-col>

          </el-row>
        </el-form-item>
        <el-button :loading="loading" class="loginBtn" @click="login">登录</el-button>

      </el-form>
    </div>
  </div>
</template>
  <!-- 环境变量的作用
  1. 正常公司中 有几个环境 4 开发 dev 测试 test 预发 uat 线上 pro
  2. 在项目里如何配置这几个环境  通过 .env 配置 base api
  开发环境的接口前缀 /api
  线上环境的接口前缀 /prod-api
   -->

<script>
/* 正常公司中有几个环境?  1.开发环境dev  2.测试环境test  3.预发uat  4.线上prod
   在项目里如何配置这几个环境?  - 通过 .env配置 baseURL (base api
     - 开发环境的接口前缀: /api
     - 线上环境的接口前缀: /prod-api */

import { identifyCodeAPI } from '@/api/login'
export default {
  name: 'Login',
  data() {
    return {
      // 步骤: 1.绑定type  2.小眼睛三元表达式  3.小眼睛click修改type属性是否是password,聚焦
      // 4.绑定input框的值v-model='AA.aa'
      // wVEm8M4dalkTZneWQb9VF461LkxHbjbU
      passwordType: 'password', // 让input框先默认password
      loginForm: { // 表单提交内容
        loginName: 'admin',
        password: 'admin',
        loginType: 0, // 后端要求必带参数: 0:指后台  1指运营运维端   2指合作商后台
        code: '',
        clientToken: 0
      },
      rules: {
        loginName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigget: 'blur' },
          { min: 4, max: 6, message: '密码格式不正确', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigget: 'blur' },
          { min: 4, max: 4, message: '验证码格式不正确', trigger: 'blur' }
        ]
      },
      loading: false,
      codeImg: ''
    }
  },
  created() {
    this.getCode()
  },

  methods: {
    showPwd() {
      // 点击小眼睛,切换 eye 和 eye-open, 即type属性是否改password
      this.passwordType === 'password' ? this.passwordType = '' : this.passwordType = 'password'
      this.$nextTick(() => { // 点击小眼睛切换时,密码框聚焦
        this.$refs.pwd.focus() // DOM更新是异步的,$nextTick()把任务推向微任务/异步任务,不然拿不到input
      })
    },
    async login() {
      try {
        await this.$refs.loginForm.validate() // 整个表单校验,点击登录按钮,发送请求之前的加载中
        this.loading = true
        // 发送请求  token比较重要,全局,存储在vuex中
        await this.$store.dispatch('user/loginAction', this.loginForm) // 用户输入的账号密码提交给后端
        // await this.$store.dispatch('user/identifyCode', this.codeSrc)
      } finally {
        this.loading = false // 把加载中,属性复原
      }
    },

    // 点击验证码发起请求
    async getCode() {
      this.loginForm.clientToken = Math.random().toString().substring(3) // 取任意随机的四位数字
      const data = await identifyCodeAPI(this.loginForm.clientToken)
      console.log(data)
      this.codeImg = data.request.responseURL
    }

  }
}
</script>

<style lang="scss">
/* 在修改element ui 组件的样式的时候 style 不许加scoped */
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */
$bg:#d3e4ff;
$light_gray:#68b0fe;;
$cursor: #fff;
@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}
/* reset element-ui css */
.login-container {
    /* 如需要在样式表中使用@别名的时候，需要在@前面加上一个~符号，否则不识别 */
  background-image: url('~@/assets/common/background.png'); // 设置背景图片
  background-position: center; // 将图片位置设置为充满整个屏幕
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #999999;
      height: 47px;
      caret-color: #999999;
      &:-webkit-autofill { // 自动填充时的样式
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
  .el-form-item {
    width: 100%;
    height: 52px;
    margin-bottom: 24px;
    background: #fff; // 输入登录表单的背景色
    border: 1px solid #e2e2e2;
    border-radius: 4px;
  }
  .el-form-item__error {
    color: #f56c6c
  }
  .el-form-item__content{
    line-height: unset;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  .login-form {
    position: absolute;
    top: 50%;
    left:  50%;
    padding: 76px 35px 0;
    transform: translate(-50%,-50%);
    background-color: #fff;
    box-shadow: 0 3px 70px 0 rgb(30 111 72 / 35%);
    border-radius: 10px;
    width: 518px;
    height: 388px;
   > img{
      position: absolute;
      width: 96px;
      height: 96px;
      top: -46px;
      left: 50%;
      margin-left: -48px;
    }
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .loginBtn {
    width: 100%;
    height: 52px;
    background: linear-gradient(262deg,#2e50e1,#6878f0);
    opacity: .91;
    border-radius: 8px;
    color: #fff;
    text-shadow: 0 7px 22px #cfcfcf;
  }
}
</style>
