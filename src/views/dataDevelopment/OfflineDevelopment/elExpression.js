class cell {
  constructor(shape, id) {
    this.id = id
    this.shape = shape
    this.parent = []
    this.children = []
    this.flag = 0
  }
  addParent(parent) {
    this.parent.push(parent)
    this.flag += 1
  }
  addChild(child) {
    this.children.push(child)
  }
}
class Node {
  constructor(type) {
    this.type = type || 'THEN'
    this.params = []
    this.next = null
  }
  toString() {
    // debugger
    if (this.params.length === 0) return ''
    // if (this.type === 'subprocess') {
    //   const cells = layerMap.get(this.params[0])
    //   if (cells && cells.cells.length > 0) {
    //     return cellsInit(layerMap.get(this.params[0]).cells)
    //   } else {
    //     return null
    //   }
    // }

    if (this.params.length === 1) return this.type + '.tag("' + this.params[0].toString() + '")'

    let str = ''
    if (this.type !== 'WHEN') {
      str = 'THEN('
    } else {
      str = 'WHEN('
    }
    // str = this.type + '('
    let i = 0,
      n = this.params.length - 1
    if (this.type === 'switch') {
      str += this.params[0] + ').To('
      i += 1
    }
    for (; i < n; i++) {
      if (typeof this.params[i] === 'string') {
        str += this.type + '.tag("' + this.params[i] + '"), '
      } else {
        str += this.params[i].toString() + ', '
      }
    }
    if (typeof this.params[n] === 'string') {
      str += this.params[n] + ')'
    } else {
      str += this.params[n].toString() + ')'
    }
    return str
  }
}

let cellsMap = null
let layerMap = null
function cellsInit(cells, layerM) {
  console.log('cells', cells)
  if (cells.length === 0) {
    return ``
  }
  if (cells.length === 1) {
    return `THEN(${cells[0].shape}.tag("${cells[0].id}"));`
  }
  cellsMap = new Map()
  // debugger
  if (layerM) layerMap = layerM
  for (let i = 0; i < cells.length; i++) {
    const element = cells[i]
    if (element.shape !== 'data-processing-curve') {
      cellsMap.set(element.id, new cell(element.shape, element.id))
    } else {
      const parent = cellsMap.get(element.source.cell)
      const child = cellsMap.get(element.target.cell)
      parent.addChild(child)
      child.addParent(parent)
    }
  }
  const startCell = new cell('THEN', 'start')
  const endCell = new cell('THEN', 'end')

  cellsMap.forEach((cell) => {
    if (cell.parent.length === 0) {
      startCell.addChild(cell)
      cell.addParent(startCell)
    }
    if (cell.children.length === 0) {
      endCell.addParent(cell)
      cell.addChild(endCell)
    }
  })

  cellsMap.set('start', startCell)
  cellsMap.set('end', endCell)
  startCell.flag = 1
  if (startCell.children.length === 0) {
    throw new Error('存在闭环')
  }
  judgingNodeLegitimacy(startCell)
  // console.log(startCell)
  let tree = createNode(startCell).node

  node2NodeTree(tree)

  // console.log(tree)
  //删除虚拟的start节点和end节点
  if (tree.params.length === 3) {
    tree = tree.params[1]
  } else {
    tree.params.shift()
    tree.params.pop()
  }
  // console.log(tree.toString())

  return tree.toString() + ';'
}

function createNode(cell) {
  // debugger
  cell.flag -= 1
  if (cell.flag !== 0) {
    return { node: null, returnId: cell.id }
  }
  let node = new Node(cell.shape)
  node.params.push(cell.id)

  if (cell.children.length === 1) {
    let res = createNode(cell.children[0])
    node.next = res.node
    return { node, returnId: res.returnId }
  }
  if (cell.children.length === 0) {
    return { node, returnId: cell.id }
  }

  let reID = null
  let nextNode = null
  //同一节点还是WHEN节点
  if (cell.shape === 'if' || cell.shape === 'switch') {
    // debugger
    nextNode = node
  } else {
    nextNode = new Node('WHEN')
    node.next = nextNode
  }

  for (let i = 0; i < cell.children.length; i++) {
    let element = cell.children[i]
    let res = createNode(element)
    if (res.node === null) continue
    //如果出现WHEN中第一个节点就是非THEN的情况，就手动增加一个空的THEN节点
    if (res.node.type === 'WHEN') {
      let tmp = new Node('THEN')
      tmp.next = res.node
      res.node = tmp
    }
    //不等于回退标识id就加入到params中
    if (res.node.params[0] !== reID) nextNode.params.push(res.node)
    //不是最后一个节点就保存回退标识id，是的话就找到回退的节点，并把next指向该节点。然后返回
    if (i < cell.children.length - 1) {
      reID = res.returnId
    } else {
      let stepNode = res.node
      while (stepNode && stepNode.params[0] !== reID) {
        stepNode = stepNode.next
      }
      nextNode.next = stepNode
      return { node, returnId: res.returnId }
    }
  }
}

function node2NodeTree(node, parentNext) {
  // debugger
  if (node.params.length <= 1 && node.type !== 'WHEN') {
    let next = node.next
    while (next) {
      if (next.type === 'WHEN') {
        node2NodeTree(next)
      }
      if (next !== parentNext) {
        node.params.push(next)
        next = next.next
      } else {
        return
      }
    }
  } else {
    node.params.forEach((element) => {
      // if element is Node class
      if (element instanceof Node) {
        node2NodeTree(element, node.next)
      }
    })
  }
}

function judgingNodeLegitimacy(cell) {
  /**
   * 1.判断节点中是否存在闭环，存在不合法
   * 2.分出n个节点，但是其中n-j个节点先合并，这种情况el表达式书写不出来。不合法
   * 3.判断每个switch和if节点是否都至少有两个子节点，少于两个不合法
   */
  // debugger

  function findIntersectionPoint(cells) {
    // debugger
    let m = {}
    for (let i = 0; i < cells.length; i++) {
      let element = cells[i]
      while (element) {
        if (m[element.id]) {
          m[element.id] += 1
          if (m[element.id] <= i) {
            // console.log(element.id)
            throw new Error('存在n-j个节点先合并的情况')
          }
        } else {
          m[element.id] = 1
        }
        element = element.children[0]
      }
    }
    for (const key in m) {
      if (m[key] > 1 && m[key] < cells.length) {
        throw new Error('存在n-j个节点先合并的情况')
      }
    }
  }
  let set = new Set()
  function dfs(cell) {
    if (set.has(cell.id)) {
      throw new Error('存在闭环')
    }
    if (cell.shape === 'switch' || cell.shape === 'if') {
      if (cell.children.length < 2) {
        throw new Error('switch或者if节点至少有两个子节点')
      }
    }
    if (cell.children.length > 2) {
      findIntersectionPoint(cell.children)
    }
    set.add(cell.id)
    cell.children.forEach((element) => {
      dfs(element)
    })
    set.delete(cell.id)
  }
  dfs(cell)
}
export { cellsInit }
