import sourceNode from './sourceNode.vue'
import targetNode from './targetNode.vue'
import fieldMapper from './fieldMapper.vue'
import copy from './copy.vue'
import replace from './replace.vue'
import split from './split.vue'
import sql from './sql.vue'
import { register, getTeleport } from '@antv/x6-vue-shape'
import { Graph, Shape, Color, Path, Cell, Edge } from '@antv/x6'
import { ElMessage } from 'element-plus'

export function NodeRegister() {
  register({
    shape: 'sourceNode',
    width: 216,
    height: 40,
    component: sourceNode,
    ports: {
      groups: {
        out: {
          position: 'bottom',
          attrs: {
            circle: {
              r: 6,
              magnet: true,
              strokeWidth: 1,
              fill: 'transparent',
              stroke: 'transparent',
            },
          },
        },
      },
    },
  })
  register({
    shape: 'targetNode',
    width: 216,
    height: 40,
    component: targetNode,
    ports: {
      groups: {
        in: {
          position: 'top',
          attrs: {
            circle: {
              r: 3,
              magnet: true,
              strokeWidth: 1,
              fill: 'transparent',
              stroke: 'transparent',
            },
          },
        },
      },
    },
  })
  register({
    shape: 'fieldMapper',
    width: 216,
    height: 40,
    component: fieldMapper,
    ports: {
      groups: {
        in: {
          position: 'top',
          attrs: {
            circle: {
              r: 3,
              magnet: true,
              strokeWidth: 1,
              fill: 'transparent',
              stroke: 'transparent',
            },
          },
        },
        out: {
          position: 'bottom',
          attrs: {
            circle: {
              r: 6,
              magnet: true,
              strokeWidth: 1,
              fill: 'transparent',
              stroke: 'transparent',
            },
          },
        },
      },
    },
  })

  register({
    shape: 'copy',
    width: 216,
    height: 40,
    component: copy,
    ports: {
      groups: {
        in: {
          position: 'top',
          attrs: {
            circle: {
              r: 3,
              magnet: true,
              strokeWidth: 1,
              fill: 'transparent',
              stroke: 'transparent',
            },
          },
        },
        out: {
          position: 'bottom',
          attrs: {
            circle: {
              r: 6,
              magnet: true,
              strokeWidth: 1,
              fill: 'transparent',
              stroke: 'transparent',
            },
          },
        },
      },
    },
  })
  register({
    shape: 'replace',
    width: 216,
    height: 40,
    component: replace,
    ports: {
      groups: {
        in: {
          position: 'top',
          attrs: {
            circle: {
              r: 3,
              magnet: true,
              strokeWidth: 1,
              fill: 'transparent',
              stroke: 'transparent',
            },
          },
        },
        out: {
          position: 'bottom',
          attrs: {
            circle: {
              r: 6,
              magnet: true,
              strokeWidth: 1,
              fill: 'transparent',
              stroke: 'transparent',
            },
          },
        },
      },
    },
  })
  register({
    shape: 'split',
    width: 216,
    height: 40,
    component: split,
    ports: {
      groups: {
        in: {
          position: 'top',
          attrs: {
            circle: {
              r: 3,
              magnet: true,
              strokeWidth: 1,
              fill: 'transparent',
              stroke: 'transparent',
            },
          },
        },
        out: {
          position: 'bottom',
          attrs: {
            circle: {
              r: 6,
              magnet: true,
              strokeWidth: 1,
              fill: 'transparent',
              stroke: 'transparent',
            },
          },
        },
      },
    },
  })
  register({
    shape: 'sql',
    width: 216,
    height: 40,
    component: sql,
    ports: {
      groups: {
        in: {
          position: 'top',
          attrs: {
            circle: {
              r: 3,
              magnet: true,
              strokeWidth: 1,
              fill: 'transparent',
              stroke: 'transparent',
            },
          },
        },
        out: {
          position: 'bottom',
          attrs: {
            circle: {
              r: 6,
              magnet: true,
              strokeWidth: 1,
              fill: 'transparent',
              stroke: 'transparent',
            },
          },
        },
      },
    },
  })
  // 注册连线
  Graph.registerConnector(
    'curveConnector',
    (sourcePoint, targetPoint) => {
      const hgap = Math.abs(targetPoint.y - sourcePoint.y)
      const path = new Path()
      path.appendSegment(Path.createSegment('M', sourcePoint.x, sourcePoint.y - 4))
      path.appendSegment(Path.createSegment('L', sourcePoint.x, sourcePoint.y + 12))
      // 水平三阶贝塞尔曲线
      path.appendSegment(
        Path.createSegment(
          'C',
          sourcePoint.x,
          sourcePoint.y < targetPoint.y ? sourcePoint.y + hgap / 2 : sourcePoint.y - hgap / 2,
          targetPoint.x,
          sourcePoint.y < targetPoint.y ? sourcePoint.y + hgap / 2 : sourcePoint.y - hgap / 2,
          targetPoint.x,
          targetPoint.y - 6
        )
      )
      path.appendSegment(Path.createSegment('L', targetPoint.x, targetPoint.y + 2))

      return path.serialize()
    },
    true
  )

  Edge.config({
    markup: [
      {
        tagName: 'path',
        selector: 'wrap',
        attrs: {
          fill: 'none',
          cursor: 'pointer',
          stroke: 'transparent',
          strokeLinecap: 'round',
        },
      },
      {
        tagName: 'path',
        selector: 'line',
        attrs: {
          fill: 'none',
          pointerEvents: 'none',
        },
      },
    ],
    connector: { name: 'curveConnector' },
    attrs: {
      wrap: {
        connection: true,
        strokeWidth: 10,
        strokeLinejoin: 'round',
      },
      line: {
        connection: true,
        stroke: '#A2B1C3',
        strokeWidth: 1,
        // targetMarker: {
        //     name: 'classic',
        //     size: 6,
        // },
      },
    },
  })

  Graph.registerEdge('data-processing-curve', Edge, true)
}
class Temp {
  constructor(shape, id) {
    this.id = id
    this.shape = shape
    this.parent = []
    this.children = []
  }
  addParent(parent) {
    this.parent.push(parent)
  }
  addChild(child) {
    this.children.push(child)
  }
}

export function getNodeGenealogyByNode(node) {
  const cellsMap = new Map()
  const cells = node.model.graph.getCells()
  for (let i = 0; i < cells.length; i++) {
    const element = cells[i]
    if (element.shape !== 'data-processing-curve') {
      cellsMap.set(element.id, new Temp(element, element.id))
    }
  }
  for (let i = 0; i < cells.length; i++) {
    const element = cells[i]
    if (element.shape === 'data-processing-curve') {
      const parent = cellsMap.get(element.source.cell)
      const child = cellsMap.get(element.target.cell)
      parent.addChild(child)
      child.addParent(parent)
    }
  }
  let startNodes = [],
    endNodes = []
  cells.forEach((cell) => {
    if (cell.shape === 'sourceNode') {
      startNodes.push(cell.getELData())
    } else if (cell.shape === 'targetNode') {
      endNodes.push(cell.getELData())
    }
  })
  let startNode = null,
    endNode = null

  const cell = cellsMap.get(node.id)
  let flag = cell
  while (flag.parent.length !== 0) {
    flag = flag.parent[0]
  }
  startNode = flag.shape.getELData(true)
  flag = cell
  while (flag.children.length !== 0) {
    flag = flag.children[0]
  }
  endNode = flag.shape.getELData(true)

  return {
    startNodes,
    endNodes,
    startNode,
    endNode,
  }
}

export function getNodeOrder(graph) {
  const cellsMap = new Map()
  const cells = graph.getCells()
  for (let i = 0; i < cells.length; i++) {
    const element = cells[i]
    if (element.shape !== 'data-processing-curve') {
      cellsMap.set(element.id, new Temp(element, element.id))
    }
  }
  for (let i = 0; i < cells.length; i++) {
    const element = cells[i]
    if (element.shape === 'data-processing-curve') {
      const parent = cellsMap.get(element.source.cell)
      const child = cellsMap.get(element.target.cell)
      parent.addChild(child)
      child.addParent(parent)
    }
  }
  cellsMap.forEach((cell) => {
    if (
      cell.shape.shape !== 'sourceNode' &&
      cell.shape.shape !== 'data-processing-curve' &&
      (cell.parent.length > 1 || cell.children.length > 1)
    ) {
      console.log(cell, cell.shape.shape)
      throw new Error('非数据源节点只能线性连接')
    }
  })

  const ans = []
  for (let i = 0; i < cells.length; i++) {
    const node = cells[i]
    if (node.shape !== 'data-processing-curve') {
      ans.push(node.getELData(true))
    }
  }

  return ans
}
