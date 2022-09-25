<template>
  <div class="login-container">
    <div class="form-background">
      <el-form
        ref="loginForm"
        class="login-form"
        auto-complete="on"
        label-position="left"
        :model="loginForm"
        :rules="rules"
      >
        <div class="title-container">
          <h3 class="title">
            <img src="@/assets/common/logo.png" alt="" style="width:96px;height:96px">
          </h3>
        </div>

        <!-- 账号input框和字体图标 (使用icon) -->
        <el-form-item prop="loginName">
          <span
            class="svg-container el-icon-user-solid"
          />
          <el-input v-model="loginForm.loginName" placeholder="请输入账号" />
        </el-form-item>

        <!-- 密码输入框,字体图标,小眼睛图片 (使用svg图片) -->
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>

          <el-input ref="pwd" v-model="loginForm.password" :type="passwordType" />

          <span class="svg-container" @click="showPwd">
            <svg-icon :icon-class="passwordType==='password'?'eye':'eye-open'" />
          </span>
        </el-form-item>

        <!-- 验证码input框 -->
        <el-form-item prop="code">
          <el-row :span="24" style="display:flex">
            <el-col :span="13" :offset="0" style="flex:3">
              <span
                class="svg-container el-icon-s-claim"
                style="font-size:16px;"
              />
              <el-input
                v-model="loginForm.code"
                class="verify_css"
                auto-complete="off"
                placeholder="请输入验证码"
              />
            </el-col>

            <el-col :soan="11" :offset="0" style="flex:1">
              <div class="login-code" width="100%" @click="refreshCode">
                <!-- 验证码组件 -->
                <s-identify :identify-code="identifyCode" />
              </div>
            </el-col>
          </el-row>
        </el-form-item>

        <el-button class="loginBtn" :loading="loading" @click="login">登录</el-button>

      </el-form>
    </div>
  </div>
  <!-- 环境变量的作用
  1. 正常公司中 有几个环境 4 开发 dev 测试 test 预发 uat 线上 pro
  2. 在项目里如何配置这几个环境  通过 .env 配置 base api
  开发环境的接口前缀 /api
  线上环境的接口前缀 /prod-api
   -->
</template>

<script>
/* 正常公司中有几个环境?  1.开发环境dev  2.测试环境test  3.预发uat  4.线上prod
   在项目里如何配置这几个环境?  - 通过 .env配置 baseURL (base api
     - 开发环境的接口前缀: /api
     - 线上环境的接口前缀: /prod-api */

import { validMobile } from '@/utils/validate'
// import { GVerify } from './js/verifyCode'
// import LoginVerify from './components/LoginVerify.vue'
import SIdentify from './components/SIdentify.vue'
export default {
  name: 'Login',
  components: { SIdentify },
  data() {
    const phoneValid = (rule, value, callback) => {
      if (!validMobile(value)) { // utiles文件夹里封装的validMobile函数
        callback(new Error('账号格式不正确')) // 如果没成功
      } else {
        callback()
      }
    }

    return {
      // 步骤: 1.绑定type  2.小眼睛三元表达式  3.小眼睛click修改type属性是否是password,聚焦
      // 4.绑定input框的值v-model='AA.aa'
      passwordType: 'password', // 让input框先默认password
      loginForm: { // 表单提交内容
        loginName: 'admin', // 后端格式是这样
        password: 'admin',
        code: null
      },
      identifyCodes: '1234567890abcdefjhijklinopqrsduvwxyz', // 随机串内容
      identifyCode: '', // 用户输入的验证码(用于校验)
      rules: { // 规则是对象,每一条规则是一个数组
        loginName: [
          { required: true, message: '账号必填', trigger: 'blur' },
          {
            validator: phoneValid, trigger: 'blur' // phoneValid:指data里面const phoneValid函数
          }
        ],
        password: [
          { required: true, message: '密码必填', trigger: 'blur' },
          { min: 5, max: 10, message: '密码格式不正确', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  mounted() {
  // 初始化验证码,挂载时就默认四位字母数字
    this.identifyCode = ''
    this.makeCode(this.identifyCodes, 4)
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
        // 如果用户输入的验证码 不等于 验证码的随机数
        if (this.loginForm.code.toLowerCase() !== this.identifyCode.toLowerCase()) {
          this.$message.error('验证码输入错误')
          this.refreshCode() // 重置验证码
          return
        }

        await this.$refs.loginForm.validate() // 整个表单校验,点击登录按钮,发送请求之前的加载中
        this.loading = true
        // 发送请求  token比较重要,全局,存储在vuex中
        await this.$store.dispatch('user/loginAction', this.loginForm) // 用户输入的账号密码提交给后端
        await this.$store.dispatch('user/identifyCode', this.identifyCode)
      } finally {
        this.loading = false // 把加载中,属性复原
      }
    },

    // 重置验证码
    refreshCode() {
      this.identifyCode = ''
      this.makeCode(this.identifyCodes, 4) // 制作验证码,在identifyCodes字符串中选四位
    },

    // 制作验证码的四位字母数字
    makeCode(o, l) {
      for (let i = 0; i < l; i++) { // 最小值0, 最大值是identifyCodes中0-9a-z字符串的长度
        this.identifyCode += this.identifyCodes[this.randomNum(0, this.identifyCodes.length)]
      }
    },
    // 封装随机数
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min) // 在min和max之间的随机数
    }

  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */
/* 在修改element ui 组件的样式的时候 style 不许加scoped */

$bg:#d4e3ff;
$light_gray:#999999;
$cursor: #889aa4;

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
    width: 80%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill { // 自动填充时的样式
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .elInput{
    width: 85%;
  }
.s-canvas{
  display: flex;
  align-content: center;
  justify-content: center;
}
  .el-form-item {
    border: 1px solid #e2e2e2;
    // background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #999999;
    background: #fff; // 输入登录表单的背景色
    }
  }
  .el-form-item__error {
    color: #fff
  }
  .loginBtn {
  background: #407ffe;
  height: 64px;
  line-height: 32px;
  font-size: 24px;
  width:100%;
  margin-bottom:30px;
  border:none;
  color:#fff
}

</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  position: relative;
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
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

// .form-background{  // 线上的样式,白色背景
//     position: absolute;
//     width: 518px;
//     height: 388px;
//     top: 50%;
//     left: 50%;
//     margin-top: -194px;
//     margin-left: -259px;
//     padding: 76px 35px 0;
//     background: #fff;
//     box-shadow: 0 3px 70px 0 rgb(30 111 72 / 35%);
//     border-radius: 10px;
//   }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
