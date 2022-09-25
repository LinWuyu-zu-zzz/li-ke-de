/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim())
}

// 封装账号的验证  6-9位任意数字大小写字母和'_'组成的6-9位字符串
export function validMobile(str) {
  return /^[0-9A-Z_a-z]{5,10}$/.test(str.trim())
}
