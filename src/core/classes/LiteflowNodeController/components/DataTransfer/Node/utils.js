/**
 * 该已知bug
 * 1.如果使用字段映射节点，一定要映射主键id，不然会执行失败
 * 2.字段映射的非相同字段后，不能使用其他字段进行修改，为了防止这种情况发生，最好把字段映射放到底部
 */
export function GenerateSeaTunnelConfig(data) {
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
  function createSinkCOnfig(sink, { sinkFields, result_table_name }) {
    const sinkConfig = {
      plugin_name: sink.plugin_name,
      url: getUrl(sink),
      driver: sink.driver,
      connection_check_timeout_sec: sink.connection_check_timeout_sec,
      user: sink.user,
      password: sink.password,
      query: generateInsertSQL(sink.table, sinkFields, sink.type, sink.primary_keys),
      table: sink.table,
      primary_keys: sink.primary_keys,
      source_table_name: result_table_name,
    }
    return sinkConfig
  }

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

      seaTunnelConfig.sink.push(createSinkCOnfig(sink, { sinkFields, result_table_name }))
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
    const result_table_name = source.table + '_' + sourceIndex

    if (!seaTunnelConfig.env['job.mode']) {
      seaTunnelConfig.env['job.mode'] = source.mode
    } else {
      if (seaTunnelConfig.env['job.mode'] !== source.mode) {
        throw new Error('不支持不同的工作模式，请检查数据来源节点配置')
      }
    }

    const sourceConfig = {
      plugin_name: source.plugin_name,
      url: getUrl(source),
      driver: source.driver,
      connection_check_timeout_sec: source.connection_check_timeout_sec,
      user: source.user,
      password: source.password,
      table: source.table,
      result_table_name: result_table_name,
    }
    if (source.isCDC) {
      sourceConfig['database-names'] = [source.database]
      sourceConfig['table-names'] = [source.database + '.' + source.table]
      sourceConfig['base-url'] = sourceConfig.url
      sourceConfig.username = source.user
    }

    if (node.children[index].type === 'sink') {
      const sink = node.children[index].nodeData
      sourceConfig.query = generateSelectSQL(source.table, sink.fieldNames)
      seaTunnelConfig.sink.push(createSinkCOnfig(sink, { sinkFields: sink.fieldNames, result_table_name }))
    } else {
      const dd = transformNode(node.children[index], [], [], result_table_name)
      sourceConfig.query = generateSelectSQL(source.table, dd.sourceFields)
    }

    seaTunnelConfig.source.push(sourceConfig)
    sourceIndex++
  }

  sourceNodes.forEach((sourceNode) => {
    for (let i = 0; i < sourceNode.children.length; i++) {
      createFlow(sourceNode, i)
    }
  })

  return seaTunnelConfig
}

function generateInsertSQL(table, fieldNames, type, ids = ['id']) {
  if (!Array.isArray(fieldNames)) {
    throw new Error('Field names should be an array.')
  }

  const placeholders = fieldNames.map(() => '?').join(', ')
  const fieldNamesString = fieldNames.join(', ')
  if (type === 'MySQL') {
    const fieldNamesUpdateSQL = fieldNames.map((field) => `${field}=VALUES(${field})`).join(', ')
    const sql = `INSERT INTO ${table} (${fieldNamesString}) VALUES (${placeholders}) ON DUPLICATE KEY UPDATE ${fieldNamesUpdateSQL};`
    return sql
  } else if (type === 'PostgreSQL') {
    const fieldNamesUpdateSQL = fieldNames.map((field) => `${field}=EXCLUDED.${field}`).join(', ')
    const sql = `INSERT INTO ${table} (${fieldNamesString}) VALUES (${placeholders}) ON CONFLICT (${ids.join(
      ', '
    )}) DO UPDATE SET ${fieldNamesUpdateSQL};`
    return sql
  } else if (type === 'Oracle') {
    const placeholderFields = fieldNames.map((field) => `? As ${field}`).join(', ')
    const fieldNamesUpdateSQL = fieldNames
      .filter((field) => !ids.includes(field))
      .map((field) => `target.${field} = source.${field}`)
      .join(', ')
    const idEqualString = ids.map((id) => `target.${id} = source.${id}`).join(' AND ')
    const srcFieldNamesString = fieldNames.map((field) => `source.${field}`).join(', ')
    const sql = `MERGE INTO ${table} target USING (SELECT ${placeholderFields} FROM dual) source ON (${idEqualString}) WHEN MATCHED THEN UPDATE SET ${fieldNamesUpdateSQL} WHEN NOT MATCHED THEN INSERT (${fieldNamesString}) VALUES (${srcFieldNamesString})`
    return sql
  } else if (type === 'SqlServer') {
    const fieldNamesUpdateSQL = fieldNames.map((field) => `target.${field} = source.${field}`).join(', ')
    const idEqualString = ids.map((id) => `target.${id} = source.${id}`).join(' AND ')
    const srcFieldNamesString = fieldNames.map((field) => `source.${field}`).join(', ')
    const sql = `MERGE INTO ${table} As target
    USING (VALUES (${placeholders})) As source (${fieldNamesString})
    ON ${idEqualString} WHEN MATCHED THEN
    UPDATE SET ${fieldNamesUpdateSQL} WHEN NOT MATCHED THEN
    INSERT (${fieldNamesString}) VALUES (${srcFieldNamesString});`
    return sql
  }
}
function getUrl(nodeData) {
  if (nodeData.type === 'MySQL' || nodeData.type === 'MySQL-CDC') {
    return `jdbc:mysql://${nodeData.ip}:${nodeData.port}/${nodeData.database}`
  } else if (nodeData.type === 'PostgreSQL') {
    return `jdbc:postgresql://${nodeData.ip}:${nodeData.port}/${nodeData.database}`
  } else if (nodeData.type === 'Oracle') {
    return `jdbc:oracle:thin:@//${nodeData.ip}:${nodeData.port}/${nodeData.database}`
  } else if (nodeData.type === 'SqlServer' || nodeData.type === 'SqlServer-CDC') {
    return `jdbc:sqlserver://${nodeData.ip}:${nodeData.port};database=${nodeData.database}`
  }
}

function generateSelectSQL(table, fieldNames) {
  if (!Array.isArray(fieldNames)) {
    throw new Error('Field names should be an array.')
  }
  const fieldNamesString = fieldNames.join(', ')

  const sql = `SELECT ${fieldNamesString} FROM ${table}`

  return sql
}
