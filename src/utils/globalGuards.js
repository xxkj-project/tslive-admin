/*
 * @Author: wangshengxian
 * @Date: 2020-09-22 17:19:22
 * @LastEditors: wangshengxian
 * @LastEditTime: 2020-09-22 17:21:59
 * @Desc: 全局守卫
 */
import defaultSettings from '@/settings'

function setTitle(to) {
  const title = defaultSettings.title
  document.title = to.meta.title ? to.meta.title + ' - ' + title : title
}

export default {
  setTitle
}
