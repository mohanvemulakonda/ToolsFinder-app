const mysql = require('mysql2/promise');

// Database connection
const dbConfig = {
  host: process.env.DB_HOST || 'srv1428.hstgr.io',
  user: process.env.DB_USER || 'u859308447_admin',
  password: process.env.DB_PASSWORD || '111aaa###$A',
  database: process.env.DB_NAME || 'u859308447_ToolsFinder',
};

// Tool data generators
const brands = ['Sandvik', 'Kennametal', 'Iscar', 'Seco', 'Walter', 'Mitsubishi', 'Kyocera', 'Tungaloy', 'Sumitomo', 'Korloy', 'Taegutec', 'Ceratizit', 'Dormer', 'OSG', 'Widia'];

const insertGrades = ['IC908', 'IC928', 'IC9250', 'KC5010', 'KC5025', 'KC9110', 'KC9125', 'GC4225', 'GC4235', 'GC2015', 'GC1125', 'TN60', 'T9115', 'T9125', 'VP15TF', 'MC6025', 'UE6110', 'AH120', 'AH725', 'PR1535'];

const coatings = ['TiAlN', 'TiN', 'TiCN', 'AlTiN', 'CVD', 'PVD', 'Diamond', 'Uncoated', 'DLC', 'nACo'];

const categories = {
  'Turning Inserts': { prefix: ['CNMG', 'TNMG', 'VNMG', 'DNMG', 'WNMG', 'SNMG', 'CCMT', 'TCMT', 'VCMT', 'DCMT'], priceRange: [5, 45] },
  'Milling Inserts': { prefix: ['APKT', 'APMT', 'RPMT', 'SNMT', 'SDMT', 'LNMT', 'XOMT', 'LOEX', 'AOMT', 'SEKN'], priceRange: [8, 55] },
  'Drilling Inserts': { prefix: ['SOMT', 'SPMG', 'SPGT', 'WCMX', 'ZCMT', 'XPMT'], priceRange: [12, 65] },
  'Grooving Inserts': { prefix: ['GFN', 'GFR', 'GFL', 'GIP', 'GIF', 'TGF', 'MGR', 'DGN', 'DGR'], priceRange: [15, 75] },
  'Threading Inserts': { prefix: ['16ER', '16IR', '11ER', '11IR', '22ER', '22IR', 'TN16', 'TN22'], priceRange: [18, 85] },
  'End Mills': { prefix: ['EM', 'BEM', 'SEM', 'REM', 'HEM', 'FEM'], priceRange: [25, 350] },
  'Drills': { prefix: ['SD', 'CD', 'UD', 'ID', 'MD'], priceRange: [35, 450] },
  'Face Mills': { prefix: ['FM', 'SFM', 'HFM', 'RFM'], priceRange: [150, 1200] },
  'Boring Bars': { prefix: ['BB', 'SBB', 'ABB', 'IBB'], priceRange: [85, 650] },
  'Tool Holders': { prefix: ['PCLNR', 'PDJNR', 'PTGNR', 'MWLNR', 'SDJCR', 'SCLCR', 'STFCR', 'SVJBR'], priceRange: [45, 380] },
};

// Generate random number in range
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min, max) => (Math.random() * (max - min) + min).toFixed(2);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Generate tool specifications
function generateInsertSpec(prefix) {
  const sizes = ['120404', '120408', '120412', '160404', '160408', '160412', '160612', '190408', '190612', '250724'];
  const chipbreakers = ['PM', 'MM', 'MF', 'SM', 'RM', 'GM', 'FM', 'PR', 'MR', 'GR'];
  return `${prefix} ${pick(sizes)}-${pick(chipbreakers)}`;
}

function generateEndMillSpec(prefix) {
  const diameters = ['3', '4', '5', '6', '8', '10', '12', '14', '16', '20', '25', '32'];
  const flutes = ['2', '3', '4', '5', '6'];
  const lengths = ['S', 'M', 'L', 'XL'];
  return `${prefix}${pick(diameters)}x${pick(flutes)}F-${pick(lengths)}`;
}

function generateDrillSpec(prefix) {
  const diameters = ['3.0', '3.5', '4.0', '4.5', '5.0', '5.5', '6.0', '6.5', '7.0', '8.0', '9.0', '10.0', '12.0', '14.0', '16.0', '18.0', '20.0'];
  const types = ['IC', 'TH', 'ST', 'DC'];
  return `${prefix}${pick(diameters)}-${pick(types)}`;
}

function generateHolderSpec(prefix) {
  const shanks = ['16', '20', '25', '32', '40', '50'];
  const lengths = ['100', '125', '150', '170', '200', '250'];
  return `${prefix}${pick(shanks)}${pick(shanks)}-${pick(lengths)}`;
}

// Generate description
function generateDescription(category, name, brand) {
  const descriptions = {
    'Turning Inserts': [
      `High-performance ${brand} turning insert for steel and stainless steel machining`,
      `${brand} precision turning insert with excellent chip control`,
      `Multi-purpose turning insert ideal for finishing and semi-finishing operations`,
      `${brand} coated insert for high-speed turning applications`,
      `Premium carbide turning insert with superior wear resistance`,
    ],
    'Milling Inserts': [
      `${brand} indexable milling insert for face and shoulder milling`,
      `High-feed milling insert with positive geometry`,
      `${brand} square shoulder milling insert for heavy-duty applications`,
      `Precision milling insert for aluminum and non-ferrous materials`,
      `${brand} high-performance insert for stainless steel milling`,
    ],
    'Drilling Inserts': [
      `${brand} indexable drilling insert for deep hole drilling`,
      `High-performance drilling insert with self-centering geometry`,
      `${brand} insert for modular drilling systems`,
      `Carbide drilling insert for cast iron and steel`,
    ],
    'Grooving Inserts': [
      `${brand} precision grooving insert for external and internal grooves`,
      `Parting and grooving insert with chip control geometry`,
      `${brand} deep grooving insert for turning centers`,
      `Multi-directional grooving insert for complex profiles`,
    ],
    'Threading Inserts': [
      `${brand} full profile threading insert for metric threads`,
      `Precision threading insert for ISO metric threads`,
      `${brand} partial profile insert for various thread forms`,
      `Threading insert for internal and external threads`,
    ],
    'End Mills': [
      `${brand} solid carbide end mill for high-speed machining`,
      `Multi-flute end mill with variable helix for vibration dampening`,
      `${brand} corner radius end mill for mold and die applications`,
      `High-performance end mill for hardened steels up to 65 HRC`,
    ],
    'Drills': [
      `${brand} solid carbide drill with internal coolant channels`,
      `High-performance drill for deep hole drilling up to 8xD`,
      `${brand} indexable insert drill for high-volume production`,
      `Through-coolant drill for stainless steel and titanium`,
    ],
    'Face Mills': [
      `${brand} indexable face mill for heavy roughing operations`,
      `High-feed face mill with positive cutting geometry`,
      `${brand} 45° entering angle face mill for general machining`,
      `Precision face mill for finishing applications`,
    ],
    'Boring Bars': [
      `${brand} anti-vibration boring bar with tuned mass damper`,
      `Modular boring bar system for deep bore machining`,
      `${brand} carbide shank boring bar for improved rigidity`,
      `Precision boring bar for tight tolerance bores`,
    ],
    'Tool Holders': [
      `${brand} turning tool holder with precision coolant delivery`,
      `Heavy-duty tool holder for interrupted cuts`,
      `${brand} quick-change tool holder for reduced setup time`,
      `Modular tool holder system with excellent repeatability`,
    ],
  };
  return pick(descriptions[category] || [`${brand} high-quality ${category.toLowerCase()}`]);
}

// Generate 1000 tools
function generateTools() {
  const tools = [];
  let id = 1;

  for (const [category, config] of Object.entries(categories)) {
    const toolsPerCategory = category.includes('Insert') ? 150 : 50;

    for (let i = 0; i < toolsPerCategory && tools.length < 1000; i++) {
      const brand = pick(brands);
      const prefix = pick(config.prefix);

      let name;
      if (category.includes('Insert')) {
        name = generateInsertSpec(prefix);
        if (Math.random() > 0.5) {
          name += ` ${pick(insertGrades)}`;
        }
      } else if (category === 'End Mills') {
        name = generateEndMillSpec(prefix);
      } else if (category === 'Drills') {
        name = generateDrillSpec(prefix);
      } else if (category === 'Tool Holders') {
        name = generateHolderSpec(prefix);
      } else {
        name = `${prefix}${random(10, 99)}-${random(100, 999)}`;
      }

      const tool = {
        name: `${brand} ${name}`,
        description: generateDescription(category, name, brand),
        category: category,
        brand: brand,
        price: randomFloat(config.priceRange[0], config.priceRange[1]),
      };

      tools.push(tool);
      id++;
    }
  }

  // Fill remaining with mixed tools
  while (tools.length < 1000) {
    const categoryKeys = Object.keys(categories);
    const category = pick(categoryKeys);
    const config = categories[category];
    const brand = pick(brands);
    const prefix = pick(config.prefix);

    let name;
    if (category.includes('Insert')) {
      name = generateInsertSpec(prefix);
    } else {
      name = `${prefix}${random(10, 99)}-${random(100, 999)}`;
    }

    tools.push({
      name: `${brand} ${name}`,
      description: generateDescription(category, name, brand),
      category: category,
      brand: brand,
      price: randomFloat(config.priceRange[0], config.priceRange[1]),
    });
  }

  return tools;
}

// Insert tools into database
async function seedDatabase() {
  const connection = await mysql.createConnection(dbConfig);

  console.log('Connected to database');
  console.log('Generating 1000 tools...');

  const tools = generateTools();

  console.log(`Generated ${tools.length} tools`);
  console.log('Inserting into database...');

  // Check which columns exist in the Tool table
  const [columns] = await connection.execute(`SHOW COLUMNS FROM Tool`);
  const columnNames = columns.map(c => c.Field);
  console.log('Available columns:', columnNames.join(', '));

  let inserted = 0;
  const batchSize = 50;

  for (let i = 0; i < tools.length; i += batchSize) {
    const batch = tools.slice(i, i + batchSize);

    // Build insert query based on available columns
    const values = batch.map(tool => {
      const cols = [];
      const vals = [];

      if (columnNames.includes('name')) { cols.push('name'); vals.push(tool.name); }
      if (columnNames.includes('description')) { cols.push('description'); vals.push(tool.description); }
      if (columnNames.includes('category')) { cols.push('category'); vals.push(tool.category); }
      if (columnNames.includes('brand')) { cols.push('brand'); vals.push(tool.brand); }
      if (columnNames.includes('price')) { cols.push('price'); vals.push(tool.price); }

      return vals;
    });

    const cols = [];
    if (columnNames.includes('name')) cols.push('name');
    if (columnNames.includes('description')) cols.push('description');
    if (columnNames.includes('category')) cols.push('category');
    if (columnNames.includes('brand')) cols.push('brand');
    if (columnNames.includes('price')) cols.push('price');

    const placeholders = values.map(() => `(${cols.map(() => '?').join(', ')})`).join(', ');
    const flatValues = values.flat();

    try {
      await connection.execute(
        `INSERT INTO Tool (${cols.join(', ')}) VALUES ${placeholders}`,
        flatValues
      );
      inserted += batch.length;
      process.stdout.write(`\rInserted ${inserted}/${tools.length} tools`);
    } catch (error) {
      console.error(`\nError inserting batch at ${i}:`, error.message);
    }
  }

  console.log('\n\nSeeding complete!');

  // Get count
  const [result] = await connection.execute('SELECT COUNT(*) as count FROM Tool');
  console.log(`Total tools in database: ${result[0].count}`);

  await connection.end();
}

seedDatabase().catch(console.error);
