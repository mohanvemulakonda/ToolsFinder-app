import { NextResponse } from 'next/server'
const pool = require('../../../../lib/db')

// Tool data generators
const brands = ['Sandvik', 'Kennametal', 'Iscar', 'Seco', 'Walter', 'Mitsubishi', 'Kyocera', 'Tungaloy', 'Sumitomo', 'Korloy', 'Taegutec', 'Ceratizit', 'Dormer', 'OSG', 'Widia'];
const insertGrades = ['IC908', 'IC928', 'GC4225', 'GC4235', 'KC5010', 'KC5025', 'VP15TF', 'MC6025', 'AH120', 'PR1535'];

const categories = {
  'Turning Inserts': { prefix: ['CNMG', 'TNMG', 'VNMG', 'DNMG', 'WNMG', 'SNMG', 'CCMT', 'TCMT', 'VCMT', 'DCMT'], priceRange: [5, 45] },
  'Milling Inserts': { prefix: ['APKT', 'APMT', 'RPMT', 'SNMT', 'SDMT', 'LNMT', 'XOMT', 'AOMT', 'SEKN'], priceRange: [8, 55] },
  'Drilling Inserts': { prefix: ['SOMT', 'SPMG', 'SPGT', 'WCMX', 'ZCMT'], priceRange: [12, 65] },
  'Grooving Inserts': { prefix: ['GFN', 'GFR', 'GFL', 'GIP', 'TGF', 'DGN'], priceRange: [15, 75] },
  'Threading Inserts': { prefix: ['16ER', '16IR', '11ER', '11IR', '22ER', '22IR'], priceRange: [18, 85] },
  'End Mills': { prefix: ['EM', 'BEM', 'SEM', 'REM', 'HEM'], priceRange: [25, 350] },
  'Drills': { prefix: ['SD', 'CD', 'UD', 'ID', 'MD'], priceRange: [35, 450] },
  'Face Mills': { prefix: ['FM', 'SFM', 'HFM'], priceRange: [150, 1200] },
  'Boring Bars': { prefix: ['BB', 'SBB', 'ABB'], priceRange: [85, 650] },
  'Tool Holders': { prefix: ['PCLNR', 'PDJNR', 'PTGNR', 'MWLNR', 'SDJCR', 'SCLCR'], priceRange: [45, 380] },
};

const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min, max) => (Math.random() * (max - min) + min).toFixed(2);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function generateInsertSpec(prefix) {
  const sizes = ['120404', '120408', '160404', '160408', '160612', '190612', '250724'];
  const chipbreakers = ['PM', 'MM', 'MF', 'SM', 'RM', 'GM'];
  return `${prefix} ${pick(sizes)}-${pick(chipbreakers)}`;
}

function generateDescription(category, brand) {
  const desc = {
    'Turning Inserts': `${brand} high-performance turning insert for steel and stainless steel`,
    'Milling Inserts': `${brand} indexable milling insert for face and shoulder milling`,
    'Drilling Inserts': `${brand} indexable drilling insert with self-centering geometry`,
    'Grooving Inserts': `${brand} precision grooving and parting insert`,
    'Threading Inserts': `${brand} full profile threading insert for ISO metric threads`,
    'End Mills': `${brand} solid carbide end mill for high-speed machining`,
    'Drills': `${brand} solid carbide drill with internal coolant`,
    'Face Mills': `${brand} indexable face mill for heavy roughing`,
    'Boring Bars': `${brand} anti-vibration boring bar`,
    'Tool Holders': `${brand} precision tool holder with coolant delivery`,
  };
  return desc[category] || `${brand} industrial cutting tool`;
}

function generateTools(count) {
  const tools = [];
  const categoryKeys = Object.keys(categories);

  for (let i = 0; i < count; i++) {
    const category = categoryKeys[i % categoryKeys.length];
    const config = categories[category];
    const brand = pick(brands);
    const prefix = pick(config.prefix);

    let name = category.includes('Insert')
      ? generateInsertSpec(prefix) + (Math.random() > 0.5 ? ` ${pick(insertGrades)}` : '')
      : `${prefix}${random(10, 99)}-${random(100, 999)}`;

    tools.push({
      name: `${brand} ${name}`,
      description: generateDescription(category, brand),
      category,
      brand,
      price: randomFloat(config.priceRange[0], config.priceRange[1]),
    });
  }
  return tools;
}

export async function POST(request) {
  try {
    const { count = 1000 } = await request.json().catch(() => ({}));
    const tools = generateTools(Math.min(count, 1000));

    let inserted = 0;
    const batchSize = 50;

    for (let i = 0; i < tools.length; i += batchSize) {
      const batch = tools.slice(i, i + batchSize);
      const placeholders = batch.map(() => '(?, ?, ?, ?, ?)').join(', ');
      const values = batch.flatMap(t => [t.name, t.description, t.category, t.brand, t.price]);

      await pool.execute(
        `INSERT INTO Tool (name, description, category, brand, price) VALUES ${placeholders}`,
        values
      );
      inserted += batch.length;
    }

    const [result] = await pool.execute('SELECT COUNT(*) as count FROM Tool');

    return NextResponse.json({
      success: true,
      inserted,
      total: result[0].count
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const [result] = await pool.execute('SELECT COUNT(*) as count FROM Tool');
    return NextResponse.json({ count: result[0].count });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
