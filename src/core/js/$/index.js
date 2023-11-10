import md5 from 'js-md5'

export function numberFormat(value, digit = 0, defaultValue = 0) {
  const v = value !== undefined && value !== null ? value : defaultValue
  if (digit) {
    return Number(Number(v).toFixed(digit))
  } else {
    return Math.round(Number(v))
  }
}

export function createMd5Id(sstr = '') {
  const str = `${new Date().getTime()}-${parseInt(Math.random() * 10000)}-${Math.random()}` + sstr
  const res = md5(str)
  return res
}
export function isLeapYear(date) {
  const year = date.getFullYear()

  if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
    return true // 是闰年
  } else {
    return false // 不是闰年
  }
}
/**
 *  随机生成num位的数
 * @param num 随机生成几位数
 * @return random 随机生成的数
 */
export function getRandomString(num) {
  const random = Math.floor((Math.random() + Math.floor(Math.random() * 9 + 1)) * Math.pow(10, num - 1))
  /* eslint-disable */
  return String(BigInt(random))
}

/**
 * 把树状对象平铺
 * @param {*} tree
 * @param {*} parentIdKey
 * @param {*} childrenKey
 * @param {*} idKey
 * @returns
 */
export function flattenTree(tree, parentIdKey = 'parentId', childrenKey = 'children', idKey = 'id') {
  const flattenedTree = []

  function flatten(node, parentId = null) {
    const flattenedNode = { ...node }
    flattenedNode[parentIdKey] = parentId

    delete flattenedNode[childrenKey]

    flattenedTree.push(flattenedNode)

    if (node[childrenKey]) {
      for (const child of node[childrenKey]) {
        flatten(child, node[idKey])
      }
    }
  }

  for (const node of tree) {
    flatten(node)
  }

  return flattenedTree
}

/**
 * 获取节点的所有父节点对象
 * @param {*} tree
 * @param {*} node
 * @param {*} parentIdKey
 * @param {*} idKey
 * @returns
 */
export function getAncestors(tree, node, parentIdKey = 'parentId', childrenKey = 'children', idKey = 'id') {
  let flattenTree = (tree, parentIdKey = 'parentId', childrenKey = 'children', idKey = 'id') => {
    const flattenedTree = []

    function flatten(node, parentId = null) {
      const flattenedNode = { ...node }
      flattenedNode[parentIdKey] = parentId

      delete flattenedNode[childrenKey]

      flattenedTree.push(flattenedNode)

      if (node[childrenKey]) {
        for (const child of node[childrenKey]) {
          flatten(child, node[idKey])
        }
      }
    }

    for (const node of tree) {
      flatten(node)
    }

    return flattenedTree
  }
  let flattenTreeData = flattenTree(tree, parentIdKey, childrenKey, idKey)
  const ancestors = []
  console.log('flattenTreeData', flattenTreeData)
  function findParentNode(currentNode) {
    if (currentNode[parentIdKey]) {
      const parentNode = flattenTreeData.find((item) => item[idKey] === currentNode[parentIdKey])
      if (parentNode) {
        ancestors.push(parentNode)
        findParentNode(parentNode)
      }
    }
  }

  findParentNode(node)
  return ancestors
}

export function dateFtt(fmt, date) {
  if (fmt && !date && fmt instanceof Date) {
    date = fmt
    fmt = 'yyyy-MM-dd'
  } else {
    switch (fmt) {
      case 'date':
        fmt = 'yyyy-MM-dd'
        break
      case 'datetime':
        fmt = 'yyyy-MM-dd hh:mm:ss'
        break
    }
  }
  // author: meizz
  var o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds(), // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
    }
  }
  return fmt
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'shallowClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach((keys) => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 *  深层合并两个对象
 * @param obj1 obj2 两个object，不限制对象层级
 * @return newObject 深层合并后的新对象
 */
export function deepMerge(obj1, obj2) {
  for (var key in obj2) {
    obj1[key] =
      obj1[key] && Object.prototype.toString.call(obj1[key]) === '[object Object]'
        ? deepMerge(obj1[key], obj2[key])
        : obj2[key]
  }
  return obj1
}

export function selectFile(options = {}) {
  return new Promise((resolve) => {
    const refFiles = document.createElement('input')
    refFiles.setAttribute('type', options.type || 'file')
    options.multiple && refFiles.setAttribute('multiple', '')
    refFiles.setAttribute(
      'accept',
      options.accept ||
        'application/*,' +
          'image/x-png,image/gif,image/jpeg,image/bmp,aplication/zip,application/vnd.ms-excel,application/vnd.ms-powerpoint,application/vnd.ms-works,application/pdf,application/msword,' +
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,' +
          'application/vnd.openxmlformats-officedocument.presentationml.presentation,' +
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document,' +
          'application/x-rar,' +
          'text/plain,'
    )
    refFiles.style.display = 'none'
    refFiles.addEventListener('change', (e) => {
      resolve(refFiles.files)
    })
    refFiles.click()
  })
}

export function someOptFun(dataArr, pFun, SOME_NUM = 64) {
  let pStart = Promise.resolve()

  let index = 0
  while (index < dataArr.length) {
    let ii = index
    pStart = pStart.then(() => {
      const pArr = []
      for (let i = 0; i < SOME_NUM; i++) {
        if (ii >= dataArr.length) {
          break
        }
        const item = dataArr[ii]
        pArr.push(pFun(item))
        ii++
      }
      // this.loadingText = Math.round((ii / dataArr.length) * 100) + '%'
      // console.log('this.loadingText', this.loadingText)
      return Promise.all(pArr)
    })
    index += SOME_NUM
  }

  return pStart
}

import JSONbig from 'json-bigint'
const JSONbigString = new JSONbig({ storeAsString: true })

export function xhrGet(url, params, header = null, onFun) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    const strs = []
    Object.keys(params).forEach((key) => {
      strs.push(`${key}=${params[key]}`)
    })
    let str = url
    if (strs.length) {
      str += '?' + strs.join('&')
    }

    xhr.open('get', str)
    onFun?.(xhr)
    if (header) {
      Object.keys(header).forEach((key) => {
        xhr.setRequestHeader(key, header[key])
      })
    }

    xhr.send()
    xhr.onload = (res) => {
      // console.log('res ######: ', res)
      // console.log('xhr ######: ', xhr)
      const response = {
        code: 200,
      }
      Object.assign(
        response,
        res.target.response
          ? JSONbigString.parse(res.target.response)
          : {
              code: 400,
            }
      )

      if (response.code === 200) {
        resolve(response)
      } else {
        reject(response)
      }
    }
  })
}

/**
 *  从数组中找到id对应的label
 * @param arr 总的数组
 * @param rowKeyData 要拿到name的对应value
 * @param valueKey
 * @param labelKey
 * @return arr中陪陪到的对象的lable
 */
export function getNameFromArr(arr, rowKeyData, valueKey = 'deptId', labelKey = 'label') {
  const find = arr.find((res) => res[valueKey] === rowKeyData)
  if (find) {
    return find[labelKey]
  }
  return ''
}

/**
 *  对象数组去重
 * @param arr 待去重的对象
 * @param uniId 对象中通过这个属性查找重的
 * @return 已去重的对象
 */
export function uniqueFunc(arr, uniId) {
  const res = new Map()
  return arr.filter((item) => !res.has(item[uniId]) && res.set(item[uniId], 1))
}

/**
 *  对象数组去重
 * @param arr 待去重的对象
 * @param uniId 对象中通过这个属性查找重的
 * @return 已去重的对象
 */
export function medianofArr(arr1) {
  let concat = arr1
  concat = concat.sort(function (a, b) {
    return a - b
  })
  console.log(concat)
  let length = concat.length
  if (length % 2 == 1) {
    // 如果长度是奇数
    return concat[length / 2 - 0.5]
  } else {
    // 如果长度是偶数
    return (concat[length / 2] + concat[length / 2 - 1]) / 2
  }
}

/**
 *  求数组中的平均数
 * @param arr 要求平均数的数组
 * @return 平均数
 */
export function averageArr(arr) {
  let average = arr.reduce((num, item, index) => {
    if (index != arr.length - 1) {
      return num + item
    } else {
      return (num + item) / arr.length
    }
  })
  return average
}

export default {
  $deepMerge: deepMerge,
  $getNameFromArr: getNameFromArr,
  $uniqueFunc: uniqueFunc,
  $deepClone: deepClone,
  $createMd5Id: createMd5Id,
  $numberFormat: numberFormat,
  $dateFtt: dateFtt,
  $selectFile: selectFile,
  $someOptFun: someOptFun,
  $xhrGet: xhrGet,
  $getRandomString: getRandomString,
  $medianofArr: medianofArr,
  $averageArr: averageArr,
}
