// 想要只在vuex里面修改state的值, 而不是在外面也能修改, 那么开启严格模式 use strict
import { loginAPI, identifyCodeAPI } from '@/api/login'
export default {
  namespaced: true,
  state: {
    token: null,
    name: '1111', // 做个优化,不持久化name,只持久化token(写在store的index.js中)
    clientToken: null
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
    },
    SET_CLIENT_TOKEN(state, clientToken) {
      state.token = clientToken
    }
  },
  actions: {
    // loginAction:自己取的函数名  loginData:后端要求传的参数
    async loginAction({ commit }, loginData) {
      // 发送请求 双重解构
      const { data: { data }} = await loginAPI(loginData)
      // console.log(data) // token
      commit('SET_TOKEN', data)
    },

    async identifyCode({ commit }, clientToken) {
      const { data: { data }} = await identifyCodeAPI(clientToken)
      console.log(data)
      commit('SET_CLIENT_TOKEN', data)
    }
  }
}
