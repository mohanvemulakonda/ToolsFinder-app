const mysql = require('mysql2/promise')
const fs = require('fs')
const path = require('path')

async function runSchema() {
  const connection = await mysql.createConnection({
    host: 'srv1428.hstgr.io',
    user: 'u859308447_admin',
    password: '111aaa###$A',
    database: 'u859308447_ToolsFinder',
    multipleStatements: true
  })

  try {
    const schemaPath = path.join(__dirname, 'schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')

    console.log('Running schema...')
    await connection.query(schema)
    console.log('Schema execution complete!')
  } catch (error) {
    console.error('Error:', error.message)
    if (error.code) console.error('Code:', error.code)
  } finally {
    await connection.end()
  }
}

runSchema()
