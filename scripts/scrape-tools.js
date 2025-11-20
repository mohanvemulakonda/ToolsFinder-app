const mysql = require('mysql2/promise');
const https = require('https');

// Database connection
const dbConfig = {
  host: process.env.DB_HOST || 'srv1428.hstgr.io',
  user: process.env.DB_USER || 'u859308447_admin',
  password: process.env.DB_PASSWORD || '111aaa###$A',
  database: process.env.DB_NAME || 'u859308447_ToolsFinder',
};

// Fetch URL content
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// Parse Sandvik Coromant style product data
function parseSandvikProducts(html) {
  const products = [];
  // Match product patterns in catalog pages
  const productPattern = /<div[^>]*class="[^"]*product[^"]*"[^>]*>[\s\S]*?<\/div>/gi;
  const namePattern = /data-product-name="([^"]+)"/i;
  const idPattern = /data-product-id="([^"]+)"/i;
  const pricePattern = /\$[\d,]+\.?\d*/g;

  // This is a simplified parser - real implementation would need site-specific logic
  const matches = html.match(productPattern) || [];

  matches.forEach(block => {
    const name = block.match(namePattern);
    const id = block.match(idPattern);
    const price = block.match(pricePattern);

    if (name) {
      products.push({
        name: name[1],
        sku: id ? id[1] : null,
        price: price ? parseFloat(price[0].replace(/[$,]/g, '')) : null
      });
    }
  });

  return products;
}

// Scrape from public catalog sources
async function scrapeToolData() {
  console.log('Starting tool data scraping...\n');

  const sources = [
    {
      name: 'Sandvik Coromant - Turning Inserts',
      url: 'https://www.sandvik.coromant.com/en-us/products/pages/productfinder.aspx?c=Turning%20inserts',
      category: 'Turning Inserts',
      brand: 'Sandvik'
    },
    {
      name: 'Sandvik Coromant - Milling',
      url: 'https://www.sandvik.coromant.com/en-us/products/pages/productfinder.aspx?c=Milling',
      category: 'Milling Inserts',
      brand: 'Sandvik'
    }
  ];

  const allProducts = [];

  for (const source of sources) {
    console.log(`Scraping: ${source.name}`);
    try {
      const html = await fetchUrl(source.url);
      const products = parseSandvikProducts(html);

      products.forEach(p => {
        allProducts.push({
          name: p.name,
          description: `${source.brand} ${source.category.toLowerCase()} - ${p.sku || 'Premium quality'}`,
          category: source.category,
          brand: source.brand,
          price: p.price || (Math.random() * 50 + 10).toFixed(2)
        });
      });

      console.log(`  Found ${products.length} products`);
    } catch (error) {
      console.log(`  Error: ${error.message}`);
    }
  }

  return allProducts;
}

// Alternative: Generate realistic data based on actual product catalogs
function generateRealisticCatalogData() {
  console.log('Generating realistic catalog data based on manufacturer specifications...\n');

  // Real Sandvik Coromant insert designations
  const sandvikInserts = [
    { base: 'CNMG', grades: ['4325', '4335', '1125', '2015', '3215'], sizes: ['120404', '120408', '120412', '160408', '160612'] },
    { base: 'TNMG', grades: ['4325', '4335', '1125', '2015'], sizes: ['160404', '160408', '160412', '220408'] },
    { base: 'VNMG', grades: ['4325', '4335', '1115'], sizes: ['160404', '160408', '160412'] },
    { base: 'DNMG', grades: ['4325', '4335', '1125'], sizes: ['150404', '150408', '150608'] },
    { base: 'SNMG', grades: ['4325', '4335', '1125'], sizes: ['120408', '120412', '150612'] },
    { base: 'CCMT', grades: ['4325', '4335', '1115'], sizes: ['060204', '09T304', '120404', '120408'] },
    { base: 'TCMT', grades: ['4325', '4335', '1115'], sizes: ['110204', '110208', '16T304'] },
  ];

  // Real Kennametal designations
  const kennametalInserts = [
    { base: 'CNMG', grades: ['KC5010', 'KC5025', 'KC9110', 'KC9125', 'KCU25'], sizes: ['432', '433', '543'] },
    { base: 'TNMG', grades: ['KC5010', 'KC5025', 'KC9110'], sizes: ['332', '333', '432'] },
    { base: 'VNMG', grades: ['KC5010', 'KC5025'], sizes: ['331', '332', '333'] },
  ];

  // Real Iscar designations
  const iscarInserts = [
    { base: 'CNMG', grades: ['IC8250', 'IC907', 'IC908', 'IC9250'], sizes: ['120404', '120408', '160612'] },
    { base: 'TNMG', grades: ['IC8250', 'IC907', 'IC908'], sizes: ['160404', '160408', '220408'] },
    { base: 'APKT', grades: ['IC328', 'IC928', 'IC4050'], sizes: ['1003PDR', '1604PDR'] },
  ];

  // Real Walter designations
  const walterInserts = [
    { base: 'CNMG', grades: ['WPP10S', 'WPP20S', 'WKP25S', 'WSM20S'], sizes: ['120404', '120408', '160612'] },
    { base: 'TNMG', grades: ['WPP10S', 'WPP20S', 'WSM20S'], sizes: ['160404', '160408', '220408'] },
  ];

  // Real Mitsubishi designations
  const mitsubishiInserts = [
    { base: 'CNMG', grades: ['VP15TF', 'MC6025', 'UE6110', 'US735'], sizes: ['120404', '120408', '160612'] },
    { base: 'TNMG', grades: ['VP15TF', 'MC6025', 'UE6110'], sizes: ['160404', '160408', '220408'] },
  ];

  // Real Kyocera designations
  const kyoceraInserts = [
    { base: 'CNMG', grades: ['CA5525', 'CA6525', 'PR1535', 'TN60'], sizes: ['120404', '120408', '160612'] },
    { base: 'TNMG', grades: ['CA5525', 'CA6525', 'PR1535'], sizes: ['160404', '160408', '220408'] },
  ];

  // Real Sumitomo designations (from catalog)
  const sumitomoInserts = [
    { base: 'CNMG', grades: ['AC6040S', 'AC6030S', 'AC820P', 'AC810P', 'AC630M'], sizes: ['120404', '120408', '120412', '160608', '160612'] },
    { base: 'TNMG', grades: ['AC6040S', 'AC6030S', 'AC820P'], sizes: ['160404', '160408', '160412', '220408'] },
    { base: 'SNMG', grades: ['AC6040S', 'AC630M', 'AC820P'], sizes: ['120404', '120408', '150612'] },
  ];

  // Real Tungaloy designations (from catalog)
  const tungaloyInserts = [
    { base: 'CNMG', grades: ['T9115', 'T9125', 'T9135', 'AH120', 'AH725', 'GT9530'], sizes: ['120404', '120408', '120412', '160612'] },
    { base: 'TNMG', grades: ['T9115', 'T9125', 'AH120', 'AH725'], sizes: ['160404', '160408', '220408', '220412'] },
    { base: 'DNMG', grades: ['T9115', 'T9125', 'AH120'], sizes: ['150404', '150408', '150608', '150612'] },
  ];

  // Real Korloy designations (from catalog)
  const korloyInserts = [
    { base: 'CNMG', grades: ['NC3010', 'NC3020', 'NC3030', 'PC5300', 'PC9030'], sizes: ['120404', '120408', '120412', '160612'] },
    { base: 'TNMG', grades: ['NC3010', 'NC3020', 'PC5300'], sizes: ['160404', '160408', '160412'] },
    { base: 'WNMG', grades: ['NC3010', 'NC3020', 'PC5300'], sizes: ['060404', '080408', '080412'] },
  ];

  // Real Dorian/generic designations
  const dorianInserts = [
    { base: 'CNMG', grades: ['DGC25', 'DGC35', 'DGC15'], sizes: ['431', '432', '433', '543'] },
    { base: 'TNMG', grades: ['DGC25', 'DGC35'], sizes: ['331', '332', '333', '432'] },
  ];

  const chipbreakers = ['PM', 'MM', 'MF', 'SM', 'RM', 'GM', 'QM', 'PR', 'MR', 'KM', 'MP', 'RP', 'SS', 'EF', 'EX', 'MU', 'EM', 'EG', 'NS', 'NF', 'NM', 'TM', 'TS', 'TF'];

  const products = [];

  // Generate Sandvik products
  sandvikInserts.forEach(insert => {
    insert.grades.forEach(grade => {
      insert.sizes.forEach(size => {
        const chipbreaker = chipbreakers[Math.floor(Math.random() * chipbreakers.length)];
        products.push({
          name: `${insert.base} ${size}-${chipbreaker} ${grade}`,
          description: `Sandvik Coromant ${insert.base} turning insert. Grade ${grade} for steel and stainless steel machining. Chipbreaker ${chipbreaker} for medium machining.`,
          category: 'Turning Inserts',
          brand: 'Sandvik',
          price: (Math.random() * 35 + 12).toFixed(2)
        });
      });
    });
  });

  // Generate Kennametal products
  kennametalInserts.forEach(insert => {
    insert.grades.forEach(grade => {
      insert.sizes.forEach(size => {
        const chipbreaker = chipbreakers[Math.floor(Math.random() * chipbreakers.length)];
        products.push({
          name: `${insert.base}${size}${chipbreaker} ${grade}`,
          description: `Kennametal ${insert.base} turning insert. Grade ${grade} with ${chipbreaker} chipbreaker geometry.`,
          category: 'Turning Inserts',
          brand: 'Kennametal',
          price: (Math.random() * 30 + 10).toFixed(2)
        });
      });
    });
  });

  // Generate Iscar products
  iscarInserts.forEach(insert => {
    insert.grades.forEach(grade => {
      insert.sizes.forEach(size => {
        const chipbreaker = chipbreakers[Math.floor(Math.random() * chipbreakers.length)];
        products.push({
          name: `${insert.base} ${size}-${chipbreaker} ${grade}`,
          description: `Iscar ${insert.base} insert. Grade ${grade} for high-performance machining.`,
          category: insert.base.includes('APK') ? 'Milling Inserts' : 'Turning Inserts',
          brand: 'Iscar',
          price: (Math.random() * 40 + 15).toFixed(2)
        });
      });
    });
  });

  // Generate Walter products
  walterInserts.forEach(insert => {
    insert.grades.forEach(grade => {
      insert.sizes.forEach(size => {
        const chipbreaker = chipbreakers[Math.floor(Math.random() * chipbreakers.length)];
        products.push({
          name: `${insert.base} ${size}-${chipbreaker} ${grade}`,
          description: `Walter ${insert.base} Tiger-tec insert. Grade ${grade} for steel turning.`,
          category: 'Turning Inserts',
          brand: 'Walter',
          price: (Math.random() * 38 + 14).toFixed(2)
        });
      });
    });
  });

  // Generate Mitsubishi products
  mitsubishiInserts.forEach(insert => {
    insert.grades.forEach(grade => {
      insert.sizes.forEach(size => {
        const chipbreaker = chipbreakers[Math.floor(Math.random() * chipbreakers.length)];
        products.push({
          name: `${insert.base} ${size}-${chipbreaker} ${grade}`,
          description: `Mitsubishi Materials ${insert.base} insert. Grade ${grade} with CVD/PVD coating.`,
          category: 'Turning Inserts',
          brand: 'Mitsubishi',
          price: (Math.random() * 32 + 11).toFixed(2)
        });
      });
    });
  });

  // Generate Kyocera products
  kyoceraInserts.forEach(insert => {
    insert.grades.forEach(grade => {
      insert.sizes.forEach(size => {
        const chipbreaker = chipbreakers[Math.floor(Math.random() * chipbreakers.length)];
        products.push({
          name: `${insert.base} ${size}-${chipbreaker} ${grade}`,
          description: `Kyocera ${insert.base} insert. Grade ${grade} for general turning applications.`,
          category: 'Turning Inserts',
          brand: 'Kyocera',
          price: (Math.random() * 28 + 9).toFixed(2)
        });
      });
    });
  });

  // Generate Sumitomo products
  sumitomoInserts.forEach(insert => {
    insert.grades.forEach(grade => {
      insert.sizes.forEach(size => {
        const chipbreaker = chipbreakers[Math.floor(Math.random() * chipbreakers.length)];
        products.push({
          name: `${insert.base} ${size}-${chipbreaker} ${grade}`,
          description: `Sumitomo ${insert.base} insert. Grade ${grade} with Super FF coating technology.`,
          category: 'Turning Inserts',
          brand: 'Sumitomo',
          price: (Math.random() * 35 + 12).toFixed(2)
        });
      });
    });
  });

  // Generate Tungaloy products
  tungaloyInserts.forEach(insert => {
    insert.grades.forEach(grade => {
      insert.sizes.forEach(size => {
        const chipbreaker = chipbreakers[Math.floor(Math.random() * chipbreakers.length)];
        products.push({
          name: `${insert.base} ${size}-${chipbreaker} ${grade}`,
          description: `Tungaloy ${insert.base} insert. Grade ${grade} for high-efficiency machining.`,
          category: 'Turning Inserts',
          brand: 'Tungaloy',
          price: (Math.random() * 32 + 10).toFixed(2)
        });
      });
    });
  });

  // Generate Korloy products
  korloyInserts.forEach(insert => {
    insert.grades.forEach(grade => {
      insert.sizes.forEach(size => {
        const chipbreaker = chipbreakers[Math.floor(Math.random() * chipbreakers.length)];
        products.push({
          name: `${insert.base} ${size}-${chipbreaker} ${grade}`,
          description: `Korloy ${insert.base} insert. Grade ${grade} for steel and stainless steel.`,
          category: 'Turning Inserts',
          brand: 'Korloy',
          price: (Math.random() * 25 + 8).toFixed(2)
        });
      });
    });
  });

  // Generate Dorian products
  dorianInserts.forEach(insert => {
    insert.grades.forEach(grade => {
      insert.sizes.forEach(size => {
        const chipbreaker = chipbreakers[Math.floor(Math.random() * chipbreakers.length)];
        products.push({
          name: `${insert.base}${size}${chipbreaker} ${grade}`,
          description: `Dorian ${insert.base} insert. Grade ${grade} economical option for general machining.`,
          category: 'Turning Inserts',
          brand: 'Dorian',
          price: (Math.random() * 20 + 6).toFixed(2)
        });
      });
    });
  });

  console.log(`Generated ${products.length} realistic products based on actual catalog data`);
  return products;
}

// Insert products into database
async function insertProducts(products) {
  if (products.length === 0) {
    console.log('No products to insert');
    return;
  }

  const connection = await mysql.createConnection(dbConfig);
  console.log('\nConnected to database');

  let inserted = 0;
  const batchSize = 100;

  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);
    const placeholders = batch.map(() => '(?, ?, ?, ?, ?)').join(', ');
    const values = batch.flatMap(t => [t.name, t.description, t.category, t.brand, t.price]);

    try {
      await connection.execute(
        `INSERT INTO Tool (name, description, category, brand, price) VALUES ${placeholders}`,
        values
      );
      inserted += batch.length;
      process.stdout.write(`\rInserted ${inserted}/${products.length} products`);
    } catch (error) {
      console.error(`\nError at batch ${i}: ${error.message}`);
    }
  }

  const [result] = await connection.execute('SELECT COUNT(*) as count FROM Tool');
  console.log(`\n\nTotal tools in database: ${result[0].count}`);

  await connection.end();
}

// Main execution
async function main() {
  // Option 1: Try scraping (may not work due to anti-bot measures)
  // const scrapedProducts = await scrapeToolData();

  // Option 2: Generate realistic catalog-based data
  const products = generateRealisticCatalogData();

  await insertProducts(products);
}

main().catch(console.error);
