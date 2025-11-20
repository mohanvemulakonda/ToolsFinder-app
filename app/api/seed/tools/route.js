import { NextResponse } from 'next/server'
const pool = require('../../../../lib/db')

// Tool data generators
const manufacturers = [
  'Sandvik Coromant', 'Kennametal', 'Iscar', 'Mitsubishi Materials',
  'Walter', 'Seco Tools', 'Tungaloy', 'Kyocera', 'Dormer Pramet',
  'OSG', 'Guhring', 'Emuge', 'YG-1', 'Sumitomo', 'Widia'
]

const coatings = ['TiN', 'TiAlN', 'TiCN', 'AlTiN', 'AlCrN', 'DLC', 'Uncoated', 'Diamond']
const substrates = ['Carbide', 'HSS', 'HSS-Co', 'Cermet', 'Ceramic', 'CBN', 'PCD']

const toolTypes = {
  'End Mill': {
    prefixes: ['EM', 'EMS', 'EMR', 'EMF'],
    diameters: [1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 18, 20, 25],
    flutes: [2, 3, 4, 5, 6],
    descriptions: ['Square End Mill', 'Ball Nose End Mill', 'Corner Radius End Mill', 'Roughing End Mill', 'Finishing End Mill']
  },
  'Drill': {
    prefixes: ['DR', 'DRL', 'DRB', 'DRC'],
    diameters: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20],
    descriptions: ['Solid Carbide Drill', 'Jobber Drill', 'Stub Drill', 'Through Coolant Drill', 'Step Drill']
  },
  'Turning Insert': {
    prefixes: ['CNMG', 'DNMG', 'WNMG', 'VNMG', 'TNMG', 'SNMG', 'CCMT', 'DCMT', 'VCMT', 'TCMT'],
    sizes: ['120404', '120408', '120412', '160404', '160408', '160412', '160612', '160616'],
    descriptions: ['Turning Insert', 'Finishing Insert', 'Medium Machining Insert', 'Roughing Insert']
  },
  'Milling Insert': {
    prefixes: ['APMT', 'APKT', 'RPMT', 'SDMT', 'SNMT', 'LNMT', 'ONMT', 'XOMT'],
    sizes: ['1003', '1135', '1204', '1604', '1606'],
    descriptions: ['Face Milling Insert', 'Shoulder Milling Insert', 'High Feed Insert', 'Round Insert']
  },
  'Threading Tap': {
    prefixes: ['TAP', 'SPT', 'FLT'],
    sizes: ['M3', 'M4', 'M5', 'M6', 'M8', 'M10', 'M12', 'M14', 'M16', 'M20'],
    pitches: ['0.5', '0.7', '1.0', '1.25', '1.5', '1.75', '2.0', '2.5'],
    descriptions: ['Spiral Flute Tap', 'Spiral Point Tap', 'Straight Flute Tap', 'Form Tap', 'Thread Mill']
  },
  'Reamer': {
    prefixes: ['RMR', 'RMC', 'RMH'],
    diameters: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 18, 20],
    descriptions: ['Solid Carbide Reamer', 'Adjustable Reamer', 'Machine Reamer', 'Hand Reamer']
  },
  'Face Mill': {
    prefixes: ['FM', 'FMR', 'FMC'],
    diameters: [32, 40, 50, 63, 80, 100, 125, 160, 200],
    descriptions: ['Face Mill Cutter', 'High Feed Face Mill', 'Shell Mill']
  },
  'Boring Bar': {
    prefixes: ['BBR', 'BBC', 'BBF'],
    diameters: [6, 8, 10, 12, 16, 20, 25, 32, 40],
    descriptions: ['Solid Carbide Boring Bar', 'Steel Boring Bar', 'Anti-Vibration Boring Bar']
  }
}

const materials = ['P', 'M', 'K', 'N', 'S', 'H']
const materialNames = {
  'P': 'Steel',
  'M': 'Stainless Steel',
  'K': 'Cast Iron',
  'N': 'Non-Ferrous',
  'S': 'Heat Resistant Alloys',
  'H': 'Hardened Steel'
}

function generateTools(count) {
  const tools = []
  const typeKeys = Object.keys(toolTypes)

  for (let i = 0; i < count; i++) {
    const typeKey = typeKeys[Math.floor(Math.random() * typeKeys.length)]
    const type = toolTypes[typeKey]
    const manufacturer = manufacturers[Math.floor(Math.random() * manufacturers.length)]
    const coating = coatings[Math.floor(Math.random() * coatings.length)]
    const substrate = substrates[Math.floor(Math.random() * substrates.length)]
    const material = materials[Math.floor(Math.random() * materials.length)]

    let partNumber, name, diameter, description

    if (typeKey === 'Turning Insert' || typeKey === 'Milling Insert') {
      const prefix = type.prefixes[Math.floor(Math.random() * type.prefixes.length)]
      const size = type.sizes[Math.floor(Math.random() * type.sizes.length)]
      const grade = `GC${1000 + Math.floor(Math.random() * 9000)}`
      partNumber = `${prefix}${size}-${grade}`
      name = `${prefix} ${size} ${type.descriptions[Math.floor(Math.random() * type.descriptions.length)]}`
      diameter = null
      description = `${substrate} ${typeKey} with ${coating} coating. Grade ${grade}. Suitable for ${materialNames[material]} machining.`
    } else if (typeKey === 'Threading Tap') {
      const size = type.sizes[Math.floor(Math.random() * type.sizes.length)]
      const pitch = type.pitches[Math.floor(Math.random() * type.pitches.length)]
      const prefix = type.prefixes[Math.floor(Math.random() * type.prefixes.length)]
      partNumber = `${prefix}-${size}x${pitch}`
      name = `${type.descriptions[Math.floor(Math.random() * type.descriptions.length)]} ${size}x${pitch}`
      diameter = parseFloat(size.replace('M', ''))
      description = `${substrate} ${typeKey} ${size}x${pitch}mm. ${coating} coated. For ${materialNames[material]}.`
    } else {
      const prefix = type.prefixes[Math.floor(Math.random() * type.prefixes.length)]
      diameter = type.diameters[Math.floor(Math.random() * type.diameters.length)]
      const suffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
      partNumber = `${prefix}-${diameter.toString().padStart(2, '0')}-${suffix}`

      const flutes = type.flutes ? type.flutes[Math.floor(Math.random() * type.flutes.length)] : null
      const fluteText = flutes ? `${flutes} flute ` : ''
      name = `${fluteText}${type.descriptions[Math.floor(Math.random() * type.descriptions.length)]} Ø${diameter}mm`
      description = `${substrate} ${typeKey} with ${coating} coating. Diameter ${diameter}mm. ${fluteText}Suitable for ${materialNames[material]} machining.`
    }

    // Calculate price based on type and size
    let basePrice = 15
    if (typeKey === 'End Mill') basePrice = 25 + (diameter || 10) * 3
    else if (typeKey === 'Drill') basePrice = 15 + (diameter || 5) * 2
    else if (typeKey.includes('Insert')) basePrice = 8 + Math.random() * 15
    else if (typeKey === 'Threading Tap') basePrice = 20 + (diameter || 6) * 2
    else if (typeKey === 'Face Mill') basePrice = 150 + (diameter || 50) * 2
    else if (typeKey === 'Boring Bar') basePrice = 80 + (diameter || 10) * 3
    else if (typeKey === 'Reamer') basePrice = 45 + (diameter || 8) * 4

    const price = (basePrice + Math.random() * basePrice * 0.3).toFixed(2)

    // Generate application based on material
    const applications = {
      'P': 'Steel machining',
      'M': 'Stainless steel machining',
      'K': 'Cast iron machining',
      'N': 'Non-ferrous machining',
      'S': 'Superalloy machining',
      'H': 'Hardened steel machining'
    }

    // Generate length based on tool type
    let length = null
    if (typeKey === 'End Mill' || typeKey === 'Drill') {
      length = diameter ? diameter * (3 + Math.random() * 4) : 50 + Math.random() * 100
    } else if (typeKey === 'Boring Bar') {
      length = 100 + Math.random() * 200
    } else if (typeKey === 'Threading Tap') {
      length = 40 + Math.random() * 60
    } else if (typeKey === 'Reamer') {
      length = diameter ? diameter * 6 : 80
    }

    // Corner radius for certain tools
    let cornerRadius = null
    if (typeKey === 'End Mill' && Math.random() > 0.5) {
      cornerRadius = 0.5 + Math.random() * 2
    }

    tools.push({
      name,
      partNumber,
      description,
      type: typeKey,
      application: applications[material],
      diameter,
      length: length ? parseFloat(length.toFixed(2)) : null,
      cornerRadius: cornerRadius ? parseFloat(cornerRadius.toFixed(2)) : null,
      has3DModel: Math.random() > 0.3,
      hasSpeedsFeeds: Math.random() > 0.2,
      supplierId: Math.floor(Math.random() * 3) + 1 // Assuming 3 suppliers
    })
  }

  return tools
}

export async function POST(request) {
  try {
    // Check current tool count
    const [countResult] = await pool.execute('SELECT COUNT(*) as count FROM Tool')
    const currentCount = countResult[0].count

    if (currentCount >= 1000) {
      return NextResponse.json({
        message: `Database already has ${currentCount} tools. Skipping seed.`,
        count: currentCount
      })
    }

    const toolsNeeded = 1000 - currentCount
    const tools = generateTools(toolsNeeded)

    // Insert in batches of 50
    const batchSize = 50
    let inserted = 0

    for (let i = 0; i < tools.length; i += batchSize) {
      const batch = tools.slice(i, i + batchSize)

      const values = batch.map(tool => [
        tool.partNumber,
        tool.name,
        tool.description,
        tool.type,
        tool.application,
        tool.supplierId,
        tool.diameter,
        tool.length,
        tool.cornerRadius,
        tool.has3DModel,
        tool.hasSpeedsFeeds
      ])

      const placeholders = batch.map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').join(', ')

      await pool.execute(
        `INSERT INTO Tool (partNumber, name, description, type, application, supplierId, diameter, length, cornerRadius, has3DModel, hasSpeedsFeeds)
         VALUES ${placeholders}`,
        values.flat()
      )

      inserted += batch.length
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${inserted} tools`,
      totalCount: currentCount + inserted
    })

  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const [result] = await pool.execute('SELECT COUNT(*) as count FROM Tool')
    const [columns] = await pool.execute('DESCRIBE Tool')
    return NextResponse.json({
      currentToolCount: result[0].count,
      columns: columns.map(c => c.Field),
      message: 'Use POST to seed 1000 tools'
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
