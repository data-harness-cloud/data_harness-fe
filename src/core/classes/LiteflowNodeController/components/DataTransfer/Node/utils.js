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

/**
 * 该已知bug
 * 1.如果使用字段映射节点，一定要映射主键id，不然会执行失败
 * 2.字段映射的非相同字段后，不能使用其他字段进行修改，为了防止这种情况发生，最好把字段映射放到底部
 */
export function GenerateSeaTunnelConfig(data) {
  console.log('data', data)
  let sourceIndex = 1
  const seaTunnelConfig = {}
  seaTunnelConfig.env = data.env
  seaTunnelConfig.source = []
  seaTunnelConfig.transform = []
  seaTunnelConfig.sink = []

  const nodes = []

  data.nodeData.forEach((node) => {
    nodes.push({ type: node.nodeId, id: node.nodeTag, nodeData: node, parent: [], children: [] })
  })

  const sourceNodes = nodes.filter((node) => node.type === 'source')

  data.graphData.cells.forEach((edge) => {
    if (edge.shape === 'data-processing-curve') {
      const source = nodes.find((node) => node.id === edge.source.cell)
      const target = nodes.find((node) => node.id === edge.target.cell)
      source.children.push(target)
      target.parent.push(source)
    }
  })

  function transformNode(node, sourceFields = [], sinkFields = [], result_table_name) {
    const sourceFieldsSet = new Set(sourceFields)
    const sinkFieldsSet = new Set(sinkFields)
    let transform = null
    if (node.type === 'sink') {
      const sink = node.nodeData
      sink.primary_keys.forEach((key) => {
        if (sinkFields.find((field) => field === key) === undefined) {
          sinkFields.push(key)
          sourceFields.push(key)
        }
      })

      seaTunnelConfig.sink.push({
        plugin_name: 'Jdbc',
        url: sink.url,
        driver: sink.driver,
        connection_check_timeout_sec: sink.connection_check_timeout_sec,
        database: sink.databaseName,
        user: sink.username,
        password: sink.password,
        // generate_sink_sql: true,
        query: generateInsertSQL(sink.tableName, sinkFields),
        table: sink.tableName,
        primary_keys: sink.primary_keys,
        source_table_name: result_table_name,
      })
      return {
        sourceFields,
      }
    } else if (node.type === 'FieldMapper') {
      // debugger
      let field_mapper = Object.assign({}, node.nodeData.field_mapper)
      const set = new Set()
      for (const key in field_mapper) {
        set.add(key)
      }
      let tempMapper = {}
      sinkFields.forEach((field) => {
        tempMapper[field] = field
        set.add(field)
      })
      for (const key in field_mapper) {
        tempMapper[key] = field_mapper[key]
      }
      field_mapper = tempMapper

      transform = {
        plugin_name: 'FieldMapper',
        source_table_name: result_table_name,
        result_table_name: result_table_name + '_',
        field_mapper: field_mapper,
      }
      for (const key in field_mapper) {
        if (!sourceFieldsSet.has(key) && !sinkFieldsSet.has(field_mapper[key])) {
          console.log(key, field_mapper[key])
          sourceFields.push(key)
          sinkFields.push(field_mapper[key])
        } else if (sinkFieldsSet.has(key)) {
          sinkFields.forEach((field, index) => {
            if (field === key) {
              sinkFields[index] = field_mapper[key]
            }
          })
        }
      }

      const dd = transformNode(node.children[0], sourceFields, sinkFields, transform.result_table_name)

      dd.sourceFields.forEach((field) => {
        if (!set.has(field)) {
          field_mapper[field] = field
          set.add(field)
        }
      })
      seaTunnelConfig.transform.push(transform)
      return dd
    } else if (node.type === 'Copy') {
      const fields = node.nodeData.fields
      transform = {
        plugin_name: 'Copy',
        source_table_name: result_table_name,
        result_table_name: result_table_name + '_',
        fields: fields,
      }
      for (const key in fields) {
        //"order_from": "book_channel"
        if (!sourceFieldsSet.has(fields[key]) && !sinkFieldsSet.has(fields[key])) {
          sourceFields.push(fields[key])
          sinkFields.push(fields[key])
        }
        sinkFields.push(key)
      }
    } else if (node.type === 'Replace') {
      transform = {
        plugin_name: 'Replace',
        source_table_name: result_table_name,
        result_table_name: result_table_name + '_',
        replace_field: node.nodeData.replace_field,
        pattern: node.nodeData.pattern,
        replacement: node.nodeData.replacement,
        is_regex: node.nodeData.is_regex,
        replace_first: node.nodeData.replace_first,
      }
      if (!sourceFieldsSet.has(transform.replace_field) && !sinkFieldsSet.has(transform.replace_field)) {
        sourceFields.push(transform.replace_field)
        sinkFields.push(transform.replace_field)
      }
    } else if (node.type === 'Split') {
      transform = {
        plugin_name: 'Split',
        source_table_name: result_table_name,
        result_table_name: result_table_name + '_',
        separator: node.nodeData.separator,
        split_field: node.nodeData.split_field,
        output_fields: node.nodeData.output_fields,
      }
      if (!sourceFieldsSet.has(transform.split_field) && !sinkFieldsSet.has(transform.split_field)) {
        sourceFields.push(transform.split_field)
        sinkFields.push(transform.split_field)
      }
      transform.output_fields.forEach((field) => {
        if (!sinkFieldsSet.has(field)) {
          sinkFields.push(field)
        }
      })
    } else if (node.type === 'Sql') {
      transform = {
        plugin_name: 'Sql',
        source_table_name: result_table_name,
        result_table_name: result_table_name + '_',
      }
      const query = node.nodeData.query
      const reg = /FROM\s+([A-Za-z_]+)/i

      const newQuery = query.replace(reg, 'FROM ' + result_table_name)
      transform.query = newQuery
    }
    const dd = transformNode(node.children[0], sourceFields, sinkFields, transform.result_table_name)
    seaTunnelConfig.transform.push(transform)
    return dd
  }

  function createFlow(node, index) {
    const source = node.nodeData
    const result_table_name = source.tableName + '_' + sourceIndex
    const sourceNode = {
      plugin_name: 'Jdbc',
      url: source.url,
      driver: source.driver,
      connection_check_timeout_sec: source.connection_check_timeout_sec,
      database: source.databaseName,
      user: source.username,
      password: source.password,
      table: source.tableName,
      result_table_name: result_table_name,
    }

    if (node.children[index].type === 'sink') {
      const sink = node.children[index].nodeData
      sourceNode.query = generateSelectSQL(source.tableName, sink.fieldNames)
      seaTunnelConfig.sink.push({
        plugin_name: 'Jdbc',
        url: sink.url,
        driver: sink.driver,
        connection_check_timeout_sec: sink.connection_check_timeout_sec,
        database: sink.databaseName,
        user: sink.username,
        password: sink.password,
        // generate_sink_sql: true,
        query: generateInsertSQL(sink.tableName, sink.fieldNames),
        table: sink.tableName,
        primary_keys: sink.primary_keys,
        source_table_name: result_table_name,
      })
    } else {
      // debugger
      const dd = transformNode(node.children[index], [], [], result_table_name)

      sourceNode.query = generateSelectSQL(source.tableName, dd.sourceFields)
    }

    seaTunnelConfig.source.push(sourceNode)
    sourceIndex++
  }

  sourceNodes.forEach((sourceNode) => {
    for (let i = 0; i < sourceNode.children.length; i++) {
      createFlow(sourceNode, i)
    }
  })

  return seaTunnelConfig
}

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

function generateInsertSQL(tableName, fieldNames) {
  if (!Array.isArray(fieldNames)) {
    throw new Error('Field names should be an array.')
  }

  const placeholders = fieldNames.map(() => '?').join(', ')
  const fieldNamesString = fieldNames.join(', ')

  const fieldNamesUpdateSQL = fieldNames.map((field) => `${field}=VALUES(${field})`).join(', ')

  const sql = `INSERT INTO ${tableName} (${fieldNamesString}) VALUES (${placeholders}) ON DUPLICATE KEY UPDATE ${fieldNamesUpdateSQL};`

  return sql
}

function generateSelectSQL(tableName, fieldNames) {
  if (!Array.isArray(fieldNames)) {
    throw new Error('Field names should be an array.')
  }

  const fieldNamesString = fieldNames.join(', ')

  const sql = `SELECT ${fieldNamesString} FROM ${tableName};`

  return sql
}
