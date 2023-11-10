import { Graph, Node, Path, Edge, Platform, StringExt } from '@antv/x6'
import { DagreLayout } from '@antv/layout'
/**
 * 根据起点初始下游节点的位置信息
 * @param node 起始节点
 * @param graph
 * @returns
 */
const getDownstreamNodePosition = (node, graph, dx = 250, dy = 100) => {
  // 找出画布中以该起始节点为起点的相关边的终点id集合
  const downstreamNodeIdList = []
  graph.getEdges().forEach((edge) => {
    const originEdge = edge.toJSON()?.data
    if (originEdge.source === node.id) {
      downstreamNodeIdList.push(originEdge.target)
    }
  })
  // 获取起点的位置信息
  const position = node.getPosition()
  let minX = Infinity
  let maxY = -Infinity
  graph.getNodes().forEach((graphNode) => {
    if (downstreamNodeIdList.indexOf(graphNode.id) > -1) {
      const nodePosition = graphNode.getPosition()
      // 找到所有节点中最左侧的节点的x坐标
      if (nodePosition.x < minX) {
        minX = nodePosition.x
      }
      // 找到所有节点中最x下方的节点的y坐标
      if (nodePosition.y > maxY) {
        maxY = nodePosition.y
      }
    }
  })
  return {
    x: minX !== Infinity ? minX : position.x + dx,
    y: maxY !== -Infinity ? maxY + dy : position.y,
  }
}

/**
 * 创建节点并添加到画布
 * @param type 节点类型
 * @param graph
 * @param position 节点位置
 * @returns
 */
const createNode = (type, graph, position, data) => {
  if (!graph) {
    return {}
  }
  let newNode = {}
  const id = StringExt.uuid()
  const node = {
    id,
    shape: type,
    x: position?.x,
    y: position?.y,
    ports: {
      items: [
        {
          id: 'in',
          group: 'in',
        },
        {
          id: 'out',
          group: 'out',
        },
      ],
    },
  }
  if (data) {
    node.data = data
  }
  newNode = graph.addNode(node)
  return newNode
}
/**
 * 创建边并添加到画布
 * @param source
 * @param target
 * @param graph
 */
const createEdge = (source, target, graph) => {
  const edge = {
    id: StringExt.uuid(),
    shape: 'data-processing-curve',
    source: {
      cell: source,
      port: `out`,
    },
    target: {
      cell: target,
      port: `in`,
    },
    zIndex: -1,
    data: {
      source,
      target,
    },
  }
  if (graph) {
    graph.addEdge(edge)
  }
}

// 创建下游的节点和边
export const createDownstream = (node, type, data) => {
  const { graph } = node.model || {}
  if (graph) {
    // 获取下游节点的初始位置信息
    const position = getDownstreamNodePosition(node, graph)
    // 创建下游节点
    const newNode = createNode(type, graph, position, data)
    const source = node.id
    const target = newNode.id
    // 创建该节点出发到下游节点的边
    createEdge(source, target, graph)
    return newNode
  }
}

class Cell {
  constructor(id, shape) {
    this.id = id
    this.shape = shape
    this.parent = []
    this.children = []
    this.name = null
  }
  addParent(parent) {
    this.parent.push(parent)
  }
  addChild(child) {
    this.children.push(child)
  }
}
const cellsMap = new Map()
export function dataTree(graph) {
  cellsMap.clear()
  const { cells } = graph.toJSON()
  //找所有节点
  for (let i = 0; i < cells.length; i++) {
    const element = cells[i]
    if (element.shape !== 'data-processing-curve') {
      let cell = new Cell(element.id, element.shape)
      cell.name =
        element.data.classificationName ||
        element.data.themeName ||
        element.data.processName ||
        element.data.project?.projectName
      cellsMap.set(element.id, cell)
    }
  }
  //所有线
  for (let i = 0; i < cells.length; i++) {
    const element = cells[i]
    if (element.shape == 'data-processing-curve') {
      const parent = cellsMap.get(element.source.cell)
      const child = cellsMap.get(element.target.cell)
      parent.addChild(child)
      child.addParent(parent)
    }
  }
  //找根节点
  const root = []
  for (const [key, value] of cellsMap) {
    if (value.parent.length == 0) {
      root.push(value)
    }
  }

  //绑定层级
  function def(nodes, level) {
    nodes.forEach((item) => {
      item.level = level
      if (item.children) def(item.children, level + 1)
    })
  }
  def(root, 0)
  return root
}

const dagreLayout = new DagreLayout({
  type: 'dagre',
  rankdir: 'LR',
  align: 'UL',
  ranksep: 30,
  nodesep: 15,
  controlPoints: true,
})

export function formatNodeTree(graph) {
  const model = {
    nodes: [],
    edges: [],
  }
  graph.toJSON().cells.forEach((item) => {
    if (item.shape === 'data-processing-curve') {
      model.edges.push(item)
    } else {
      model.nodes.push(item)
    }
  })
  const newModel = dagreLayout.layout(model)

  newModel.nodes.forEach((node) => {
    graph.getCellById(node.id).position(node.x, node.y)
  })
  // graph.fromJSON(newModel)

  // graph.centerContent()
}

export function removeNodeTree(graph, id) {
  let cell = cellsMap.get(id)
  cell.children.forEach((item) => {
    removeNodeTree(graph, item.id)
  })
  graph.removeCell(id)
  graph.parentProxy.getIndexTree()
}

export function clearCellMap() {
  cellsMap.clear()
}

export function canDel(nodeId) {
  let cell = cellsMap.get(nodeId)
  if (cell.children.length > 0) {
    return false
  }
  return true
}
