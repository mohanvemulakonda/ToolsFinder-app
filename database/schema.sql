-- ToolsFinder Enhanced Database Schema
-- Based on ISO 13399 / DIN 4000 standards for cutting tool data

-- =============================================
-- LOOKUP TABLES (Reference Data)
-- =============================================

-- Tool Categories/Types
CREATE TABLE IF NOT EXISTS ToolCategory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20),
    description TEXT,
    parent_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES ToolCategory(id)
);

-- Manufacturers/Brands
CREATE TABLE IF NOT EXISTS Manufacturer (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20),
    logo_url VARCHAR(500),
    website VARCHAR(255),
    country VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Substrate Materials (Carbide, HSS, Ceramic, etc.)
CREATE TABLE IF NOT EXISTS Substrate (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20),
    description TEXT
);

-- Coatings (TiN, TiAlN, etc.)
CREATE TABLE IF NOT EXISTS Coating (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20),
    color VARCHAR(50),
    description TEXT
);

-- Workpiece Material Groups (ISO P, M, K, N, S, H)
CREATE TABLE IF NOT EXISTS WorkpieceMaterial (
    id INT AUTO_INCREMENT PRIMARY KEY,
    iso_code CHAR(1) NOT NULL,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(20),
    description TEXT
);

-- Insert default workpiece materials
INSERT INTO WorkpieceMaterial (iso_code, name, color, description) VALUES
('P', 'Steel', '#0000FF', 'Unalloyed, low-alloy, high-alloy steels'),
('M', 'Stainless Steel', '#FFFF00', 'Austenitic, duplex, ferritic stainless'),
('K', 'Cast Iron', '#FF0000', 'Grey, nodular, malleable cast iron'),
('N', 'Non-Ferrous', '#00FF00', 'Aluminum, copper, brass'),
('S', 'Heat Resistant Alloys', '#FFA500', 'Titanium, nickel-based alloys'),
('H', 'Hardened Steel', '#808080', 'Hardened steel >45 HRC');

-- Operation Types
CREATE TABLE IF NOT EXISTS OperationType (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20),
    description TEXT
);

INSERT INTO OperationType (name, code) VALUES
('Turning', 'TURN'),
('Milling', 'MILL'),
('Drilling', 'DRILL'),
('Boring', 'BORE'),
('Threading', 'THREAD'),
('Grooving', 'GROOVE'),
('Parting', 'PART'),
('Reaming', 'REAM');

-- Coolant Types
CREATE TABLE IF NOT EXISTS CoolantType (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20)
);

INSERT INTO CoolantType (name, code) VALUES
('Flood', 'FLOOD'),
('Through Tool', 'THROUGH'),
('MQL (Minimum Quantity)', 'MQL'),
('Dry', 'DRY'),
('Air Blast', 'AIR');

-- =============================================
-- MAIN TOOL TABLE (Enhanced)
-- =============================================

-- Alter existing Tool table to add new columns
ALTER TABLE Tool
    -- Basic Identification
    ADD COLUMN part_number VARCHAR(100) AFTER name,
    ADD COLUMN gtin VARCHAR(14),
    ADD COLUMN iso_code VARCHAR(50),

    -- Foreign Keys to Lookup Tables
    ADD COLUMN manufacturer_id INT,
    ADD COLUMN category_id INT,
    ADD COLUMN substrate_id INT,
    ADD COLUMN coating_id INT,
    ADD COLUMN operation_type_id INT,
    ADD COLUMN coolant_type_id INT,

    -- Geometry (in mm - convert for imperial display)
    ADD COLUMN diameter DECIMAL(10,4),
    ADD COLUMN length DECIMAL(10,4),
    ADD COLUMN cutting_length DECIMAL(10,4),
    ADD COLUMN shank_diameter DECIMAL(10,4),
    ADD COLUMN flute_count INT,
    ADD COLUMN corner_radius DECIMAL(10,4),
    ADD COLUMN helix_angle DECIMAL(5,2),
    ADD COLUMN rake_angle DECIMAL(5,2),
    ADD COLUMN relief_angle DECIMAL(5,2),
    ADD COLUMN point_angle DECIMAL(5,2),

    -- Insert Specific (for turning inserts)
    ADD COLUMN insert_shape CHAR(1),
    ADD COLUMN insert_clearance CHAR(1),
    ADD COLUMN insert_tolerance CHAR(1),
    ADD COLUMN chipbreaker VARCHAR(50),

    -- Grade/Material
    ADD COLUMN grade VARCHAR(50),

    -- Cutting Parameters (recommended ranges)
    ADD COLUMN min_speed DECIMAL(10,2),
    ADD COLUMN max_speed DECIMAL(10,2),
    ADD COLUMN min_feed DECIMAL(10,4),
    ADD COLUMN max_feed DECIMAL(10,4),
    ADD COLUMN min_depth_of_cut DECIMAL(10,4),
    ADD COLUMN max_depth_of_cut DECIMAL(10,4),

    -- CAD/CAM Files
    ADD COLUMN step_file_url VARCHAR(500),
    ADD COLUMN dxf_file_url VARCHAR(500),
    ADD COLUMN pdf_datasheet_url VARCHAR(500),

    -- Supply Chain
    ADD COLUMN supplier VARCHAR(255),
    ADD COLUMN lead_time_days INT,
    ADD COLUMN min_order_qty INT DEFAULT 1,
    ADD COLUMN stock_status ENUM('in_stock', 'low_stock', 'out_of_stock', 'made_to_order') DEFAULT 'in_stock',
    ADD COLUMN discontinued BOOLEAN DEFAULT FALSE,

    -- Additional Info
    ADD COLUMN weight_grams DECIMAL(10,2),
    ADD COLUMN notes TEXT,
    ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Add foreign key constraints
ALTER TABLE Tool
    ADD CONSTRAINT fk_tool_manufacturer FOREIGN KEY (manufacturer_id) REFERENCES Manufacturer(id),
    ADD CONSTRAINT fk_tool_category FOREIGN KEY (category_id) REFERENCES ToolCategory(id),
    ADD CONSTRAINT fk_tool_substrate FOREIGN KEY (substrate_id) REFERENCES Substrate(id),
    ADD CONSTRAINT fk_tool_coating FOREIGN KEY (coating_id) REFERENCES Coating(id),
    ADD CONSTRAINT fk_tool_operation FOREIGN KEY (operation_type_id) REFERENCES OperationType(id),
    ADD CONSTRAINT fk_tool_coolant FOREIGN KEY (coolant_type_id) REFERENCES CoolantType(id);

-- Add indexes for common searches
CREATE INDEX idx_tool_part_number ON Tool(part_number);
CREATE INDEX idx_tool_iso_code ON Tool(iso_code);
CREATE INDEX idx_tool_diameter ON Tool(diameter);
CREATE INDEX idx_tool_manufacturer ON Tool(manufacturer_id);
CREATE INDEX idx_tool_category ON Tool(category_id);

-- =============================================
-- JUNCTION TABLES (Many-to-Many)
-- =============================================

-- Tool to Workpiece Material compatibility
CREATE TABLE IF NOT EXISTS ToolWorkpieceMaterial (
    tool_id INT NOT NULL,
    workpiece_material_id INT NOT NULL,
    suitability ENUM('excellent', 'good', 'fair') DEFAULT 'good',
    PRIMARY KEY (tool_id, workpiece_material_id),
    FOREIGN KEY (tool_id) REFERENCES Tool(id) ON DELETE CASCADE,
    FOREIGN KEY (workpiece_material_id) REFERENCES WorkpieceMaterial(id)
);

-- Tool Images (multiple images per tool)
CREATE TABLE IF NOT EXISTS ToolImage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tool_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    image_type ENUM('main', 'thumbnail', 'technical', '3d_render') DEFAULT 'main',
    sort_order INT DEFAULT 0,
    FOREIGN KEY (tool_id) REFERENCES Tool(id) ON DELETE CASCADE
);

-- Tool Specifications (flexible key-value for additional specs)
CREATE TABLE IF NOT EXISTS ToolSpecification (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tool_id INT NOT NULL,
    spec_name VARCHAR(100) NOT NULL,
    spec_value VARCHAR(255) NOT NULL,
    unit VARCHAR(20),
    FOREIGN KEY (tool_id) REFERENCES Tool(id) ON DELETE CASCADE
);

-- =============================================
-- SAMPLE DATA
-- =============================================

-- Insert sample manufacturers
INSERT INTO Manufacturer (name, code, country) VALUES
('Sandvik Coromant', 'SANDVIK', 'Sweden'),
('Kennametal', 'KENNAMETAL', 'USA'),
('Iscar', 'ISCAR', 'Israel'),
('Mitsubishi Materials', 'MITSUBISHI', 'Japan'),
('Walter', 'WALTER', 'Germany'),
('Seco Tools', 'SECO', 'Sweden'),
('Tungaloy', 'TUNGALOY', 'Japan'),
('Kyocera', 'KYOCERA', 'Japan');

-- Insert sample substrates
INSERT INTO Substrate (name, code, description) VALUES
('Cemented Carbide', 'CC', 'Tungsten carbide with cobalt binder'),
('High Speed Steel', 'HSS', 'High speed steel'),
('Cermet', 'CER', 'Ceramic-metal composite'),
('Ceramic', 'CRM', 'Alumina or silicon nitride based'),
('CBN', 'CBN', 'Cubic boron nitride'),
('PCD', 'PCD', 'Polycrystalline diamond');

-- Insert sample coatings
INSERT INTO Coating (name, code, color) VALUES
('Uncoated', 'UC', 'Silver'),
('TiN', 'TIN', 'Gold'),
('TiCN', 'TICN', 'Gray'),
('TiAlN', 'TIALN', 'Purple'),
('AlTiN', 'ALTIN', 'Black'),
('AlCrN', 'ALCRN', 'Gray'),
('Diamond', 'DIA', 'Clear'),
('DLC', 'DLC', 'Black');

-- Insert sample categories
INSERT INTO ToolCategory (name, code) VALUES
('Turning Inserts', 'TURN_INS'),
('Milling Inserts', 'MILL_INS'),
('Drilling Inserts', 'DRILL_INS'),
('End Mills', 'ENDMILL'),
('Face Mills', 'FACEMILL'),
('Drills', 'DRILL'),
('Taps', 'TAP'),
('Reamers', 'REAM'),
('Boring Bars', 'BORE'),
('Tool Holders', 'HOLDER');
