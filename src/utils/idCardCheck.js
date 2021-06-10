import { Message } from 'element-ui'
/**
 * 身份证校验
 */
function checkIdCard(idNumber) {
  if (idNumber !== '') {
    var p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9xX]$/
    if (!p.test(idNumber)) {
      Message({
        message: '请输⼊正确身份证号！',
        type: 'warning'
      })
    } else if (p.test(idNumber)) {
      var istst = idNumber.split('')
      var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
      var parity = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
      var sum = 0
      var ai = 0
      var wi = 0
      for (var i = 0; i < 17; i++) {
        ai = istst[i]
        wi = factor[i]
        sum += ai * wi
      }
      if (parity[sum % 11].toString() !== istst[17]) {
        Message({
          message: '请输⼊正确身份证号！',
          type: 'warning'
        })
      } else {
        return true
      }
    }
  } else {
    Message({
      message: '请输⼊身份证号!',
      type: 'warning'
    })
  }
}
export default checkIdCard
