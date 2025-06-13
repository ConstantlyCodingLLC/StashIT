-- Drop tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS inventory_transactions;
DROP TABLE IF EXISTS purchase_order_items;
DROP TABLE IF EXISTS purchase_orders;
DROP TABLE IF EXISTS invoice_items;
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS devices;
DROP TABLE IF EXISTS inventory_items;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS suppliers;
DROP TABLE IF EXISTS business_settings;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS businesses;

-- Create businesses table
CREATE TABLE businesses (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  business_type VARCHAR(255) NOT NULL,
  address TEXT,
  currency VARCHAR(3) DEFAULT 'USD',
  tax_rate DECIMAL(5, 2) DEFAULT 0,
  fiscal_year_start VARCHAR(10) DEFAULT 'jan',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create business_settings table
CREATE TABLE business_settings (
  id VARCHAR(255) PRIMARY KEY,
  low_stock_alerts BOOLEAN DEFAULT TRUE,
  auto_order_suggestions BOOLEAN DEFAULT TRUE,
  low_stock_threshold INTEGER DEFAULT 10,
  business_id VARCHAR(255) NOT NULL,
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
);

-- Create users table
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  business_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
  UNIQUE (email, business_id)
);

-- Create categories table
CREATE TABLE categories (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  business_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
  UNIQUE (name, business_id)
);

-- Create suppliers table
CREATE TABLE suppliers (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255),
  contact_title VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  website VARCHAR(255),
  tax_id VARCHAR(100),
  payment_terms VARCHAR(255),
  notes TEXT,
  status VARCHAR(50) DEFAULT 'active',
  business_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
);

-- Create inventory_items table
CREATE TABLE inventory_items (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(100) NOT NULL,
  description TEXT,
  quantity INTEGER NOT NULL DEFAULT 0,
  min_quantity INTEGER DEFAULT 0,
  cost_price DECIMAL(10, 2),
  selling_price DECIMAL(10, 2),
  location VARCHAR(255),
  business_id VARCHAR(255) NOT NULL,
  category_id VARCHAR(255),
  supplier_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL,
  UNIQUE (sku, business_id)
);

-- Create devices table
CREATE TABLE devices (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  device_type VARCHAR(100) NOT NULL,
  manufacturer VARCHAR(255),
  model VARCHAR(255),
  serial_number VARCHAR(255),
  sku VARCHAR(100),
  purchase_date TIMESTAMP WITH TIME ZONE,
  warranty_expiry TIMESTAMP WITH TIME ZONE,
  assigned_to VARCHAR(255),
  status VARCHAR(50) DEFAULT 'available',
  notes TEXT,
  business_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
  UNIQUE (serial_number, business_id)
);

-- Create purchase_orders table
CREATE TABLE purchase_orders (
  id VARCHAR(255) PRIMARY KEY,
  po_number VARCHAR(100) NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  expected_delivery TIMESTAMP WITH TIME ZONE,
  payment_terms VARCHAR(255),
  shipping_address TEXT,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'draft',
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  business_id VARCHAR(255) NOT NULL,
  supplier_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE,
  UNIQUE (po_number, business_id)
);

-- Create purchase_order_items table
CREATE TABLE purchase_order_items (
  id VARCHAR(255) PRIMARY KEY,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  description TEXT,
  purchase_order_id VARCHAR(255) NOT NULL,
  item_id VARCHAR(255) NOT NULL,
  FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES inventory_items(id) ON DELETE CASCADE
);

-- Create invoices table
CREATE TABLE invoices (
  id VARCHAR(255) PRIMARY KEY,
  invoice_number VARCHAR(100) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(50) DEFAULT 'draft',
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  notes TEXT,
  business_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
  UNIQUE (invoice_number, business_id)
);

-- Create invoice_items table
CREATE TABLE invoice_items (
  id VARCHAR(255) PRIMARY KEY,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  description TEXT,
  invoice_id VARCHAR(255) NOT NULL,
  item_id VARCHAR(255) NOT NULL,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES inventory_items(id) ON DELETE CASCADE
);

-- Create inventory_transactions table
CREATE TABLE inventory_transactions (
  id VARCHAR(255) PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  quantity INTEGER NOT NULL,
  notes TEXT,
  business_id VARCHAR(255) NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  item_id VARCHAR(255),
  device_id VARCHAR(255),
  purchase_order_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES inventory_items(id) ON DELETE SET NULL,
  FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE SET NULL,
  FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id) ON DELETE SET NULL
);

-- Create audit_logs table
CREATE TABLE audit_logs (
  id VARCHAR(255) PRIMARY KEY,
  action VARCHAR(50) NOT NULL,
  item_type VARCHAR(50) NOT NULL,
  item_id VARCHAR(255) NOT NULL,
  details TEXT,
  ip_address VARCHAR(50),
  device_info TEXT,
  business_id VARCHAR(255) NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_inventory_items_business_id ON inventory_items(business_id);
CREATE INDEX idx_inventory_items_category_id ON inventory_items(category_id);
CREATE INDEX idx_inventory_items_supplier_id ON inventory_items(supplier_id);
CREATE INDEX idx_users_business_id ON users(business_id);
CREATE INDEX idx_audit_logs_business_id ON audit_logs(business_id);
CREATE INDEX idx_inventory_transactions_business_id ON inventory_transactions(business_id);
CREATE INDEX idx_purchase_orders_business_id ON purchase_orders(business_id);
CREATE INDEX idx_invoices_business_id ON invoices(business_id);
