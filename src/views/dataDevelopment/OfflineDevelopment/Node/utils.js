import dataTransfer from './dataTransfer.vue'
import sqlNode from './sqlNode.vue'
import shellNode from './shellNode.vue'
import { register, getTeleport } from '@antv/x6-vue-shape'
import { Graph, Shape, Color, Path, Cell, Edge } from '@antv/x6'

export function NodeRegister() {
  register({
    shape: 'dataTransfer',
    width: 216,
    height: 40,
    component: dataTransfer,
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
    shape: 'shellNode',
    width: 216,
    height: 40,
    component: shellNode,
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
    shape: 'sqlNode',
    width: 216,
    height: 40,
    component: sqlNode,
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
