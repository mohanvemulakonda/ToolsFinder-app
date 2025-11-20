-- ToolsFinder Database Schema
-- Run this in your Hostinger MySQL database

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tools table
CREATE TABLE IF NOT EXISTS tools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  description TEXT,
  supplier_id INT,
  price DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

-- Library table (user saved tools)
CREATE TABLE IF NOT EXISTS library (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  tool_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (tool_id) REFERENCES tools(id)
);

-- Indexes
CREATE INDEX idx_tools_category ON tools(category);
CREATE INDEX idx_tools_name ON tools(name);
CREATE INDEX idx_library_user ON library(user_id);

-- Sample data
INSERT INTO suppliers (name, email, phone) VALUES
('Industrial Supply Co', 'contact@industrialsupply.com', '555-0100'),
('Tool Masters Inc', 'sales@toolmasters.com', '555-0200'),
('Global Equipment', 'info@globalequip.com', '555-0300');

INSERT INTO tools (name, category, description, supplier_id, price) VALUES
('Power Drill X500', 'Power Tools', 'High-performance cordless drill with 20V battery', 1, 149.99),
('Precision Wrench Set', 'Hand Tools', 'Complete metric and SAE wrench set', 2, 89.99),
('Industrial Saw', 'Power Tools', 'Heavy-duty circular saw for professional use', 1, 299.99),
('Digital Caliper', 'Measuring', 'Digital caliper with 0.01mm precision', 3, 45.99),
('Welding Kit Pro', 'Welding', 'Complete MIG welding starter kit', 2, 599.99);
