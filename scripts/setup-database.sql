-- Create inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  sku VARCHAR(50) UNIQUE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  min_quantity INTEGER NOT NULL DEFAULT 0,
  cost_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  selling_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  location VARCHAR(100),
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  address TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'Active',
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  supplier_id INTEGER NOT NULL REFERENCES suppliers(id),
  order_date DATE NOT NULL,
  expected_delivery_date DATE,
  delivery_date DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'Pending',
  total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  inventory_id INTEGER NOT NULL REFERENCES inventory(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  received_quantity INTEGER DEFAULT 0
);

-- Create inventory_transactions table
CREATE TABLE IF NOT EXISTS inventory_transactions (
  id SERIAL PRIMARY KEY,
  inventory_id INTEGER NOT NULL REFERENCES inventory(id),
  transaction_type VARCHAR(20) NOT NULL, -- 'purchase', 'sale', 'adjustment'
  quantity INTEGER NOT NULL,
  reference_id INTEGER, -- Can be order_id or other reference
  reference_type VARCHAR(50), -- 'order', 'adjustment', etc.
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create users table if not exists
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create sample data
-- Insert sample inventory items
INSERT INTO inventory (name, category, sku, quantity, min_quantity, cost_price, selling_price, location, description)
VALUES
  ('Laptop Dell XPS 13', 'Electronics', 'ELEC-001', 15, 5, 999.99, 1299.99, 'Warehouse A', 'High-end laptop with 16GB RAM and 512GB SSD'),
  ('Office Chair', 'Furniture', 'FURN-001', 5, 10, 149.99, 199.99, 'Warehouse B', 'Ergonomic office chair with lumbar support'),
  ('Wireless Mouse', 'Electronics', 'ELEC-002', 30, 10, 19.99, 24.99, 'Warehouse A', 'Wireless optical mouse with 2.4GHz connectivity'),
  ('Desk Lamp', 'Office Supplies', 'OFF-001', 12, 5, 24.99, 34.99, 'Warehouse B', 'LED desk lamp with adjustable brightness'),
  ('Printer Paper', 'Office Supplies', 'OFF-002', 3, 15, 7.99, 9.99, 'Warehouse A', 'A4 printer paper, 500 sheets per pack');

-- Insert sample suppliers
INSERT INTO suppliers (name, contact_person, email, phone, address, status, notes)
VALUES
  ('Acme Electronics', 'John Smith', 'john@acmeelectronics.com', '555-123-4567', '123 Tech Lane, Silicon Valley, CA', 'Active', 'Reliable supplier for electronic items'),
  ('Office Furniture Co.', 'Jane Doe', 'jane@officefurniture.com', '555-987-6543', '456 Chair Street, Furnishville, NY', 'Active', 'Quality office furniture supplier'),
  ('Tech Supplies Inc.', 'Robert Johnson', 'robert@techsupplies.com', '555-456-7890', '789 Supply Road, Techville, TX', 'Inactive', 'Previously used for small electronics'),
  ('Global Imports', 'Sarah Williams', 'sarah@globalimports.com', '555-789-0123', '321 Import Avenue, Portcity, WA', 'Active', 'International supplier with good prices'),
  ('Quality Products Ltd.', 'Michael Brown', 'michael@qualityproducts.com', '555-321-6547', '654 Quality Drive, Goodstown, IL', 'Active', 'Premium quality office supplies');

-- Insert sample orders
INSERT INTO orders (order_number, supplier_id, order_date, expected_delivery_date, status, total_amount, notes)
VALUES
  ('PO-2023-001', 1, '2023-06-15', '2023-06-25', 'Delivered', 2499.99, 'Regular order for electronics'),
  ('PO-2023-002', 2, '2023-06-20', '2023-06-30', 'Processing', 1299.50, 'Office furniture restock'),
  ('PO-2023-003', 3, '2023-06-25', '2023-07-05', 'Pending', 899.75, 'Small electronics order'),
  ('PO-2023-004', 4, '2023-06-28', '2023-07-08', 'Delivered', 3499.99, 'Large import order'),
  ('PO-2023-005', 5, '2023-07-01', '2023-07-10', 'Processing', 1799.50, 'Office supplies restock');

-- Insert sample order items
INSERT INTO order_items (order_id, inventory_id, quantity, unit_price, total_price, received_quantity)
VALUES
  (1, 1, 2, 999.99, 1999.98, 2),
  (1, 3, 20, 19.99, 399.80, 20),
  (2, 2, 8, 149.99, 1199.92, 5),
  (3, 3, 15, 19.99, 299.85, 0),
  (3, 4, 20, 24.99, 499.80, 0),
  (4, 1, 3, 999.99, 2999.97, 3),
  (5, 4, 30, 24.99, 749.70, 15),
  (5, 5, 100, 7.99, 799.00, 50);

-- Insert sample inventory transactions
INSERT INTO inventory_transactions (inventory_id, transaction_type, quantity, reference_id, reference_type, notes)
VALUES
  (1, 'purchase', 2, 1, 'order', 'Initial purchase of laptops'),
  (3, 'purchase', 20, 1, 'order', 'Restock of wireless mice'),
  (2, 'purchase', 5, 2, 'order', 'Partial delivery of office chairs'),
  (1, 'sale', -1, NULL, NULL, 'Sold to IT department'),
  (3, 'sale', -5, NULL, NULL, 'Sold to marketing team'),
  (1, 'purchase', 3, 4, 'order', 'Additional laptops purchase'),
  (4, 'purchase', 15, 5, 'order', 'Partial delivery of desk lamps'),
  (5, 'purchase', 50, 5, 'order', 'Partial delivery of printer paper');

-- Insert sample user
INSERT INTO users (name, email, password, role)
VALUES
  ('Admin User', 'admin@example.com', '$2a$10$JIYFwSMEDhFwm4fWmQkOIeGwuYIPCCNbQXZMDYGzFLBcnBQuGDxdK', 'admin'); -- Password: admin123
