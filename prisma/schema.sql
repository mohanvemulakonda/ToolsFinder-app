-- ToolsFinder Database Schema
-- Run this on Hostinger MySQL

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  brand VARCHAR(100),
  price DECIMAL(10,2),
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS suppliers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  website VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS library (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  tool_id INT NOT NULL,
  notes TEXT,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (tool_id) REFERENCES tools(id) ON DELETE CASCADE
);

-- Sample data
INSERT INTO tools (name, description, category, brand, price) VALUES
('DeWalt DCD771C2 Drill', '20V MAX Cordless Drill/Driver', 'Power Tools', 'DeWalt', 99.99),
('Milwaukee M18 Impact Driver', '18V Lithium-Ion Cordless Impact Driver', 'Power Tools', 'Milwaukee', 149.99),
('Stanley 25ft Tape Measure', 'PowerLock 25ft Tape Measure', 'Hand Tools', 'Stanley', 19.99),
('Makita Circular Saw', '7-1/4" Circular Saw', 'Power Tools', 'Makita', 129.99),
('Craftsman Socket Set', '230-Piece Mechanics Tool Set', 'Hand Tools', 'Craftsman', 199.99);

INSERT INTO suppliers (name, email, phone, website) VALUES
('Home Depot', 'pro@homedepot.com', '1-800-466-3337', 'https://homedepot.com'),
('Lowes', 'support@lowes.com', '1-800-445-6937', 'https://lowes.com'),
('Acme Tools', 'sales@acmetools.com', '1-800-732-4287', 'https://acmetools.com');
