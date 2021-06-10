/**
 * 日期时间格式化
 * @param {date} time js的date类型或时间戳(时间戳单位：s/ms)
 * @param {string} format 自定义时间格式，选填，默认为'{y}-{m}-{d} {h}:{i}:{s}'
 * @return {string} 默认格式 2018-09-01 10:55:00
 */
function formatDate(time, format) {
  time = time || new Date()
  format = format || '{y}-{m}-{d} {h}:{i}:{s}'
  let date = time
  if (typeof time !== 'object') {
    if (('' + time).length === 10) time = +time * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  // console.log(formatObj)
  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return timeStr
}

/**
 * 获取日期范围内的所有日期项
 * @param {string} type 'day'按天 'month'按月
 * @param {array} range 日期范围，第一项为开始日期，第二项为结束日期（可选，不传时默认30天或者12个月）
 * @return {array} 该范围内的所有日期项数组
 */
function getDateRangeItems(type, range) {
  let arr = []
  let start, end, times
  if (type === 'day') {
    // 按天
    if (!range || range.length === 0) {
      start = new Date()
      end = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 29)
    } else {
      start = new Date(range[0])
      end = new Date(range[1])
    }
    times = (end.getFullYear() - start.getFullYear() + 1) * 366
    for (let i = 0; i < times; i++) {
      arr.push(formatDate(start, '{y}-{m}-{d}'))
      if (formatDate(start, '{y}-{m}-{d}') === formatDate(end, '{y}-{m}-{d}')) {
        break
      }
      start.setTime(start.getTime() + 3600 * 1000 * 24)
    }
  } else if (type === 'month') {
    // 按月
    if (!range || range.length === 0) {
      start = new Date()
      end = new Date()
      start.setMonth(start.getMonth() - 11)
    } else {
      start = new Date(range[0])
      end = new Date(range[1])
    }
    times = (end.getFullYear() - start.getFullYear() + 1) * 12
    for (let i = 0; i < times; i++) {
      arr.push(formatDate(start, '{y}-{m}'))
      if (formatDate(start, '{y}-{m}') === formatDate(end, '{y}-{m}')) {
        break
      }
      start.setMonth(start.getMonth() + 1)
    }
  }
  return arr
}

export default {
  // 获取日期范围内所有的日期选项
  getDateRangeItems
}
