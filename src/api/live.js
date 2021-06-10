/**
 * 登录页api
 */
import request from '@/utils/request'

// 获取直播时长列表
export function findAllLiveUserInfo(data) {
  return request({
    url: '/admin/userLiveRecord/findAllLiveUserInfo',
    method: 'get',
    data
  })
}
// // 导出直播时长列表
// export function exportExcel(data) {
//   return request({
//     url: '/admin/userLiveRecord/excel',
//     method: 'get',
//     data
//   })
// }
