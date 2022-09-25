// 封装所有登录页面的接口
// 引入axios(导入的js文件只有写了一个封装,所以可以随便叫request)
import request from '@/utils/request'
export function loginAPI(data) {
  return request({
    url: '/user-service/user/login',
    method: 'POST',
    data
  })
}

// 封装图片验证码接口
export function identifyCodeAPI(clientToken) {
  return request({
    url: `/user-service/user/imageCode/${clientToken}`,
    method: 'GET'
  })
}
