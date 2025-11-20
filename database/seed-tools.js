const mysql = require('mysql2/promise')

async function seedTools() {
  const connection = await mysql.createConnection({
    host: 'srv1428.hstgr.io',
    user: 'u859308447_admin',
    password: '111aaa###$A',
    database: 'u859308447_ToolsFinder',
    multipleStatements: true
  })

  try {
    // Check current tables
    const [tables] = await connection.query('SHOW TABLES')
    console.log('Existing tables:', tables.map(t => Object.values(t)[0]))

    // Check Tool columns
    const [cols] = await connection.query('DESCRIBE Tool')
    console.log('\nTool columns:', cols.map(c => c.Field).join(', '))

    // First, create suppliers
    const suppliers = [
      { name: 'Sandvik Coromant', website: 'https://www.sandvik.coromant.com' },
      { name: 'Kennametal', website: 'https://www.kennametal.com' },
      { name: 'Iscar', website: 'https://www.iscar.com' },
      { name: 'Mitsubishi Materials', website: 'https://www.mitsubishicarbide.com' }
    ]

    console.log('\nCreating suppliers...')
    const supplierIds = {}

    for (const supplier of suppliers) {
      try {
        const [result] = await connection.execute(
          'INSERT INTO Supplier (name, website) VALUES (?, ?)',
          [supplier.name, supplier.website]
        )
        supplierIds[supplier.name] = result.insertId
        console.log(`✓ Created supplier: ${supplier.name} (ID: ${result.insertId})`)
      } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          const [rows] = await connection.execute('SELECT id FROM Supplier WHERE name = ?', [supplier.name])
          supplierIds[supplier.name] = rows[0]?.id
          console.log(`⚠ Supplier exists: ${supplier.name} (ID: ${supplierIds[supplier.name]})`)
        } else {
          console.error(`✗ Failed supplier: ${supplier.name} - ${err.message}`)
        }
      }
    }

    // Insert sample tools using existing schema (camelCase columns)
    const tools = [
      {
        name: 'CNMG 120408-PM 4325',
        partNumber: 'CNMG120408-PM4325',
        description: 'Turning insert for steel, medium machining',
        type: 'Turning Insert',
        application: 'Steel turning',
        diameter: 12.7,
        cornerRadius: 0.8,
        thickness: 4.76,
        supplier: 'Sandvik Coromant'
      },
      {
        name: 'DCMT 11T304-PF 4315',
        partNumber: 'DCMT11T304-PF4315',
        description: 'Turning insert for finishing operations',
        type: 'Turning Insert',
        application: 'Finishing',
        diameter: 9.525,
        cornerRadius: 0.4,
        thickness: 3.97,
        supplier: 'Sandvik Coromant'
      },
      {
        name: 'KC5010 End Mill 10mm',
        partNumber: 'KC5010-10',
        description: 'Solid carbide end mill for general purpose',
        type: 'End Mill',
        application: 'General milling',
        diameter: 10.0,
        length: 72.0,
        supplier: 'Kennametal'
      },
      {
        name: 'TNMG 160408-MS IC9250',
        partNumber: 'TNMG160408MS',
        description: 'Triangle insert for medium steel turning',
        type: 'Turning Insert',
        application: 'Medium machining',
        diameter: 16.0,
        cornerRadius: 0.8,
        thickness: 4.76,
        supplier: 'Iscar'
      },
      {
        name: 'VP15TF Carbide Insert',
        partNumber: 'APMT1135PDER-VP15TF',
        description: 'Milling insert for high speed machining',
        type: 'Milling Insert',
        application: 'High speed machining',
        diameter: 11.0,
        cornerRadius: 3.5,
        supplier: 'Mitsubishi Materials'
      }
    ]

    console.log('\nSeeding tools...')

    for (const tool of tools) {
      // Replace supplier name with supplierId
      const toolData = { ...tool }
      if (toolData.supplier) {
        toolData.supplierId = supplierIds[toolData.supplier]
        delete toolData.supplier
      }

      const columns = Object.keys(toolData).join(', ')
      const placeholders = Object.keys(toolData).map(() => '?').join(', ')
      const values = Object.values(toolData)

      try {
        const [result] = await connection.execute(
          `INSERT INTO Tool (${columns}) VALUES (${placeholders})`,
          values
        )
        console.log(`✓ Inserted: ${tool.name} (ID: ${result.insertId})`)
      } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          console.log(`⚠ Already exists: ${tool.name}`)
        } else {
          console.error(`✗ Failed: ${tool.name} - ${err.message}`)
        }
      }
    }

    console.log('\nSeed complete!')
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await connection.end()
  }
}

seedTools()
