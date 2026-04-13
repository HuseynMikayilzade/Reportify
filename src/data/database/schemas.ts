// Database Schema Constants
export const Tables = {
  USERS: 'users',
  REPORTS: 'reports',
  SYNC_QUEUE: 'sync_queue',
  PRODUCTS: 'products',
  TEMPLATES: 'templates',
  TEMPLATE_PRODUCTS: 'template_products',
  TEMPLATE_EXPENSES: 'template_expenses',
  EXPENSES: 'expenses',
  REPORT_STOCK: 'report_stock',
  REPORT_SALES: 'report_sales',
  REPORT_EXPENSES: 'report_expenses',
} as const;

export const CREATE_USERS_TABLE = `
  CREATE TABLE IF NOT EXISTS ${Tables.USERS} (
    id TEXT PRIMARY KEY NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL,
    branch TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );
`;

export const CREATE_REPORTS_TABLE = `
  CREATE TABLE IF NOT EXISTS ${Tables.REPORTS} (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL,
    user_full_name TEXT NOT NULL,
    branch TEXT,
    shift TEXT NOT NULL,
    notes TEXT,
    sync_status TEXT NOT NULL DEFAULT 'pending',
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES ${Tables.USERS}(id)
  );
`;

export const CREATE_SYNC_QUEUE_TABLE = `
  CREATE TABLE IF NOT EXISTS ${Tables.SYNC_QUEUE} (
    id TEXT PRIMARY KEY NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    action TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    retry_count INTEGER NOT NULL DEFAULT 0,
    last_error TEXT
  );
`;

export const CREATE_PRODUCTS_TABLE = `
  CREATE TABLE IF NOT EXISTS ${Tables.PRODUCTS} (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    product_type TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    is_active INTEGER NOT NULL
  );
`;

export const CREATE_EXPENSES_TABLE = `
  CREATE TABLE IF NOT EXISTS ${Tables.EXPENSES} (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    description_required INTEGER NOT NULL,
    is_active INTEGER NOT NULL
  );
`;

export const CREATE_TEMPLATES_TABLE = `
  CREATE TABLE IF NOT EXISTS ${Tables.TEMPLATES} (
    id TEXT PRIMARY KEY NOT NULL,
    branch TEXT NOT NULL,
    name TEXT NOT NULL
  );
`;

export const CREATE_TEMPLATE_PRODUCTS_TABLE = `
  CREATE TABLE IF NOT EXISTS ${Tables.TEMPLATE_PRODUCTS} (
    template_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    FOREIGN KEY (template_id) REFERENCES ${Tables.TEMPLATES}(id),
    FOREIGN KEY (product_id) REFERENCES ${Tables.PRODUCTS}(id),
    PRIMARY KEY (template_id, product_id)
  );
`;

export const CREATE_TEMPLATE_EXPENSES_TABLE = `
  CREATE TABLE IF NOT EXISTS ${Tables.TEMPLATE_EXPENSES} (
    id TEXT PRIMARY KEY NOT NULL,
    template_id TEXT NOT NULL,
    name TEXT NOT NULL,
    require_description INTEGER NOT NULL,
    FOREIGN KEY (template_id) REFERENCES ${Tables.TEMPLATES}(id)
  );
`;

export const CREATE_REPORT_STOCK_TABLE = `
  CREATE TABLE IF NOT EXISTS ${Tables.REPORT_STOCK} (
    report_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    received_qty REAL NOT NULL,
    delivered_qty REAL NOT NULL,
    FOREIGN KEY (report_id) REFERENCES ${Tables.REPORTS}(id),
    PRIMARY KEY (report_id, product_id)
  );
`;

export const CREATE_REPORT_SALES_TABLE = `
  CREATE TABLE IF NOT EXISTS ${Tables.REPORT_SALES} (
    report_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity REAL NOT NULL,
    FOREIGN KEY (report_id) REFERENCES ${Tables.REPORTS}(id),
    PRIMARY KEY (report_id, product_id)
  );
`;

export const CREATE_REPORT_EXPENSES_TABLE = `
  CREATE TABLE IF NOT EXISTS ${Tables.REPORT_EXPENSES} (
    id TEXT PRIMARY KEY NOT NULL,
    report_id TEXT NOT NULL,
    name TEXT NOT NULL,
    amount REAL NOT NULL,
    description TEXT,
    FOREIGN KEY (report_id) REFERENCES ${Tables.REPORTS}(id)
  );
`;
