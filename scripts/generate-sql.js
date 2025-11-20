const fs = require('fs');

// Tool data generators
const brands = ['Sandvik', 'Kennametal', 'Iscar', 'Seco', 'Walter', 'Mitsubishi', 'Kyocera', 'Tungaloy', 'Sumitomo', 'Korloy', 'Taegutec', 'Ceratizit', 'Dormer', 'OSG', 'Widia'];

const insertGrades = ['IC908', 'IC928', 'IC9250', 'KC5010', 'KC5025', 'KC9110', 'KC9125', 'GC4225', 'GC4235', 'GC2015', 'GC1125', 'TN60', 'T9115', 'T9125', 'VP15TF', 'MC6025', 'UE6110', 'AH120', 'AH725', 'PR1535'];

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

const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min, max) => (Math.random() * (max - min) + min).toFixed(2);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

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

function generateDescription(category, brand) {
  const descriptions = {
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
  return descriptions[category] || `${brand} industrial cutting tool`;
}

function escape(str) {
  return str.replace(/'/g, "''");
}

function generateTools() {
  const tools = [];

  for (const [category, config] of Object.entries(categories)) {
    const toolsPerCategory = category.includes('Insert') ? 150 : 50;

    for (let i = 0; i < toolsPerCategory && tools.length < 1000; i++) {
      const brand = pick(brands);
      const prefix = pick(config.prefix);

      let name;
      if (category.includes('Insert')) {
        name = generateInsertSpec(prefix);
        if (Math.random() > 0.5) name += ` ${pick(insertGrades)}`;
      } else if (category === 'End Mills') {
        name = generateEndMillSpec(prefix);
      } else if (category === 'Drills') {
        name = generateDrillSpec(prefix);
      } else if (category === 'Tool Holders') {
        name = generateHolderSpec(prefix);
      } else {
        name = `${prefix}${random(10, 99)}-${random(100, 999)}`;
      }

      tools.push({
        name: `${brand} ${name}`,
        description: generateDescription(category, brand),
        category: category,
        brand: brand,
        price: randomFloat(config.priceRange[0], config.priceRange[1]),
      });
    }
  }

  while (tools.length < 1000) {
    const categoryKeys = Object.keys(categories);
    const category = pick(categoryKeys);
    const config = categories[category];
    const brand = pick(brands);
    const prefix = pick(config.prefix);
    let name = category.includes('Insert') ? generateInsertSpec(prefix) : `${prefix}${random(10, 99)}-${random(100, 999)}`;

    tools.push({
      name: `${brand} ${name}`,
      description: generateDescription(category, brand),
      category: category,
      brand: brand,
      price: randomFloat(config.priceRange[0], config.priceRange[1]),
    });
  }

  return tools;
}

// Generate SQL
const tools = generateTools();
let sql = '-- ToolsFinder: 1000 Industrial Cutting Tools\n';
sql += '-- Generated for database seeding\n\n';

// Generate INSERT statements in batches of 50
for (let i = 0; i < tools.length; i += 50) {
  const batch = tools.slice(i, i + 50);
  sql += 'INSERT INTO Tool (name, description, category, brand, price) VALUES\n';

  const values = batch.map((t, idx) => {
    const comma = idx === batch.length - 1 ? ';' : ',';
    return `('${escape(t.name)}', '${escape(t.description)}', '${escape(t.category)}', '${escape(t.brand)}', ${t.price})${comma}`;
  });

  sql += values.join('\n') + '\n\n';
}

fs.writeFileSync('scripts/seed-1000-tools.sql', sql);
console.log('Generated scripts/seed-1000-tools.sql with 1000 tools');
console.log('Import this file via phpMyAdmin or mysql CLI');
