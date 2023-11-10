export function deleteAddByIdArr({ controller = null, idKey = null, oldDataList = null, newDataList = null }) {
  if (controller && idKey && oldDataList && newDataList) {
    const deleteArr = oldDataList.filter((e) => !newDataList.some((f) => f[idKey] === e[idKey]))
    const addArr = newDataList.filter((f) => !oldDataList.some((e) => e[idKey] === f[idKey]))

    console.log('deleteArr = ', deleteArr)
    console.log('addArr = ', addArr)
    const pArr = [
      controller.$someOptFun(
        deleteArr,
        (row) => {
          return controller.delete(row)
        },
        5
      ),
      controller.$someOptFun(
        addArr,
        (row) => {
          return controller.add(row)
        },
        5
      ),
    ]

    return Promise.all(pArr)
  } else {
    throw new Error('deleteAddByIdArr: 参数传入错误，存在空值')
  }
}
