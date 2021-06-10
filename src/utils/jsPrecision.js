/*
 * @Author: wangshengxian
 * @Date: 2020-08-13 15:33:38
 * @LastEditors: wangshengxian
 * @LastEditTime: 2020-12-17 15:03:10
 * @Desc: js四则运算精度处理模块
 */

// 0.1 + 0.2 = 0.30000000000000004
// 4.44 + 2.22;
// 8.88 + 2.22
// 13.32 + 2.22;

// function baseFunc(num1, num2, symbol) {}

/**
 * 加法
 */
function add(num1, num2) {
  let num1Digits, num2Digits, maxDigits
  try {
    num1Digits = num1.toString().split('.')[1].length
  } catch (e) {
    num1Digits = 0
  }
  try {
    num2Digits = num2.toString().split('.')[1].length
  } catch (e) {
    num2Digits = 0
  }
  maxDigits = Math.pow(10, Math.max(num1Digits, num2Digits))
  return (Math.round(num1 * maxDigits) + Math.round(num2 * maxDigits)) / maxDigits
}

/**
 * 减法
 */
function sub(num1, num2) {
  return add(num1, -num2)
}

/**
 * 乘法
 */
function mul(num1, num2) {
  let val1
  let val2
  let max = 0
  if (num1 && num1 != null) val1 = num1.toString()
  if (num2 && num2 != null) val2 = num2.toString()
  try {
    max += val1.split('.')[1].length
  } catch (e) {
    max = 0
  }
  try {
    max += val2.split('.')[1].length
  } catch (e) {
    max = 0
  }
  console.log(val1, val2, max)
  return (Number(val1.replace('.', '')) * Number(val2.replace('.', ''))) / Math.pow(10, max)
}

/**
 * 除法
 */
function div(num1, num2) {
  let len1, len2, val1, val2
  try {
    len1 = num1.toString().split('.')[1].length
  } catch (e) {
    len1 = 0
  }

  try {
    len2 = num2.toString().split('.')[1].length
  } catch (e) {
    len2 = 0
  }
  val1 = Number(num1.toString().replace('.', ''))
  val2 = Number(num2.toString().replace('.', ''))
  console.log(val1, val2, len1, len2)

  return (val1 / val2) * Math.pow(10, len2 - len1)
}

/**
 * arg以四舍五入的方式保留小数点后n位
 */
function toFixed(arg, n) {
  if (n === 0) {
    return Math.round(arg)
  }
  try {
    var d
    var carryD
    // var i
    var ds = arg.toString().split('.')
    var len = ds[1].length
    var b0 = ''
    var k = 0
    if (len > n) {
      while (k < n && ds[1].substring(0, ++k) === '0') {
        b0 += '0'
      }
      d = Number(ds[1].substring(0, n))
      carryD = Math.round(Number('0.' + ds[1].substring(n, len)))
      len = (d + carryD).toString().length
      if (len > n) {
        return Number(ds[0]) + 1
      } else if (len === n) {
        return Number(ds[0] + '.' + (d + carryD))
      }
      return Number(ds[0] + '.' + b0 + (d + carryD))
    }
  } catch (e) {}
  return arg
}

/**
 * 数组求和 (值为number/string)
 */
function sum(arr) {
  return arr.reduce((prevVal, currVal) => add(prevVal, currVal))
}

/**
 * 数组对象求和
 */
function arrObjSum(arr, attr) {
  return arr.reduce((total, item) => {
    // console.log(total, item, attr)
    return add(total, item[attr])
  }, 0)
}

export default {
  // 加法
  add,
  // 减法
  sub,
  // 乘法
  mul,
  // 除法
  div,
  // 保留n位小数
  toFixed,
  // 数组求和
  sum,
  // 数组对象求和
  arrObjSum
}
