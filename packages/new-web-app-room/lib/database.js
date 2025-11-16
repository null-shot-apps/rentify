// Database schema and models for RentDirect
import { Pool } from 'pg';

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/rentdirect',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Database schema creation
export const createTables = async () => {
  const client = await pool.connect();
  
  try {
    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('tenant', 'landlord', 'marketer', 'admin')),
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
        verification_documents JSONB,
        referred_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Properties table
    await client.query(`
      CREATE TABLE IF NOT EXISTS properties (
        id SERIAL PRIMARY KEY,
        landlord_id INTEGER REFERENCES users(id) NOT NULL,
        marketer_id INTEGER REFERENCES users(id),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        address TEXT NOT NULL,
        state VARCHAR(100) NOT NULL,
        city VARCHAR(100) NOT NULL,
        area VARCHAR(100) NOT NULL,
        annual_rent DECIMAL(12,2) NOT NULL,
        bedrooms INTEGER NOT NULL,
        bathrooms INTEGER NOT NULL,
        amenities JSONB,
        photos JSONB NOT NULL,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'rented')),
        admin_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Inspections table
    await client.query(`
      CREATE TABLE IF NOT EXISTS inspections (
        id SERIAL PRIMARY KEY,
        property_id INTEGER REFERENCES properties(id) NOT NULL,
        tenant_id INTEGER REFERENCES users(id) NOT NULL,
        marketer_id INTEGER REFERENCES users(id),
        admin_id INTEGER REFERENCES users(id),
        scheduled_date TIMESTAMP,
        status VARCHAR(20) DEFAULT 'requested' CHECK (status IN ('requested', 'scheduled', 'completed', 'cancelled')),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Rentals table
    await client.query(`
      CREATE TABLE IF NOT EXISTS rentals (
        id SERIAL PRIMARY KEY,
        property_id INTEGER REFERENCES properties(id) NOT NULL,
        tenant_id INTEGER REFERENCES users(id) NOT NULL,
        landlord_id INTEGER REFERENCES users(id) NOT NULL,
        marketer_id INTEGER REFERENCES users(id),
        annual_rent DECIMAL(12,2) NOT NULL,
        caution_fee DECIMAL(12,2) NOT NULL,
        platform_fee DECIMAL(12,2) NOT NULL,
        marketer_commission DECIMAL(12,2) DEFAULT 0,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'ended', 'terminated')),
        payment_reference VARCHAR(255) UNIQUE,
        escrow_status VARCHAR(20) DEFAULT 'held' CHECK (escrow_status IN ('held', 'released_to_tenant', 'released_to_landlord')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Payments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        rental_id INTEGER REFERENCES rentals(id) NOT NULL,
        tenant_id INTEGER REFERENCES users(id) NOT NULL,
        amount DECIMAL(12,2) NOT NULL,
        payment_type VARCHAR(20) NOT NULL CHECK (payment_type IN ('rent', 'caution', 'platform_fee')),
        payment_reference VARCHAR(255) UNIQUE NOT NULL,
        paystack_reference VARCHAR(255),
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'successful', 'failed')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Disputes table
    await client.query(`
      CREATE TABLE IF NOT EXISTS disputes (
        id SERIAL PRIMARY KEY,
        rental_id INTEGER REFERENCES rentals(id) NOT NULL,
        tenant_id INTEGER REFERENCES users(id) NOT NULL,
        landlord_id INTEGER REFERENCES users(id) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'closed')),
        admin_id INTEGER REFERENCES users(id),
        resolution TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Marketer earnings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS marketer_earnings (
        id SERIAL PRIMARY KEY,
        marketer_id INTEGER REFERENCES users(id) NOT NULL,
        rental_id INTEGER REFERENCES rentals(id) NOT NULL,
        commission_amount DECIMAL(12,2) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
        paid_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Database helper functions
export const db = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
};

// User model functions
export const UserModel = {
  async create(userData) {
    const { email, phone, password_hash, role, first_name, last_name, referred_by } = userData;
    const result = await db.query(
      `INSERT INTO users (email, phone, password_hash, role, first_name, last_name, referred_by) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [email, phone, password_hash, role, first_name, last_name, referred_by]
    );
    return result.rows[0];
  },

  async findByEmail(email) {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  },

  async findById(id) {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  },

  async updateVerificationStatus(id, status, documents = null) {
    const result = await db.query(
      `UPDATE users SET verification_status = $1, verification_documents = $2, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $3 RETURNING *`,
      [status, documents, id]
    );
    return result.rows[0];
  },

  async getMarketerStats(marketerId) {
    const result = await db.query(`
      SELECT 
        COUNT(p.id) as total_properties,
        COUNT(r.id) as total_rentals,
        COALESCE(SUM(me.commission_amount), 0) as total_earnings,
        COALESCE(SUM(CASE WHEN me.status = 'pending' THEN me.commission_amount ELSE 0 END), 0) as pending_earnings
      FROM users u
      LEFT JOIN properties p ON p.marketer_id = u.id
      LEFT JOIN rentals r ON r.marketer_id = u.id
      LEFT JOIN marketer_earnings me ON me.marketer_id = u.id
      WHERE u.id = $1 AND u.role = 'marketer'
      GROUP BY u.id
    `, [marketerId]);
    return result.rows[0];
  }
};

// Property model functions
export const PropertyModel = {
  async create(propertyData) {
    const { 
      landlord_id, marketer_id, title, description, address, state, city, area,
      annual_rent, bedrooms, bathrooms, amenities, photos 
    } = propertyData;
    
    const result = await db.query(`
      INSERT INTO properties (
        landlord_id, marketer_id, title, description, address, state, city, area,
        annual_rent, bedrooms, bathrooms, amenities, photos
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *
    `, [
      landlord_id, marketer_id, title, description, address, state, city, area,
      annual_rent, bedrooms, bathrooms, JSON.stringify(amenities), JSON.stringify(photos)
    ]);
    return result.rows[0];
  },

  async findApproved(filters = {}) {
    let query = `
      SELECT p.*, u.first_name as landlord_name, u.phone as landlord_phone
      FROM properties p
      JOIN users u ON p.landlord_id = u.id
      WHERE p.status = 'approved'
    `;
    const params = [];
    let paramCount = 0;

    if (filters.state) {
      paramCount++;
      query += ` AND p.state ILIKE $${paramCount}`;
      params.push(`%${filters.state}%`);
    }

    if (filters.city) {
      paramCount++;
      query += ` AND p.city ILIKE $${paramCount}`;
      params.push(`%${filters.city}%`);
    }

    if (filters.minRent) {
      paramCount++;
      query += ` AND p.annual_rent >= $${paramCount}`;
      params.push(filters.minRent);
    }

    if (filters.maxRent) {
      paramCount++;
      query += ` AND p.annual_rent <= $${paramCount}`;
      params.push(filters.maxRent);
    }

    if (filters.bedrooms) {
      paramCount++;
      query += ` AND p.bedrooms = $${paramCount}`;
      params.push(filters.bedrooms);
    }

    query += ' ORDER BY p.created_at DESC';

    const result = await db.query(query, params);
    return result.rows;
  },

  async findById(id) {
    const result = await db.query(`
      SELECT p.*, u.first_name as landlord_name, u.phone as landlord_phone,
             m.first_name as marketer_name, m.phone as marketer_phone
      FROM properties p
      JOIN users u ON p.landlord_id = u.id
      LEFT JOIN users m ON p.marketer_id = m.id
      WHERE p.id = $1
    `, [id]);
    return result.rows[0];
  },

  async updateStatus(id, status, admin_notes = null) {
    const result = await db.query(
      `UPDATE properties SET status = $1, admin_notes = $2, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $3 RETURNING *`,
      [status, admin_notes, id]
    );
    return result.rows[0];
  },

  async findPendingApproval() {
    const result = await db.query(`
      SELECT p.*, u.first_name as landlord_name, u.email as landlord_email
      FROM properties p
      JOIN users u ON p.landlord_id = u.id
      WHERE p.status = 'pending'
      ORDER BY p.created_at ASC
    `);
    return result.rows;
  }
};

// Rental model functions
export const RentalModel = {
  async create(rentalData) {
    const {
      property_id, tenant_id, landlord_id, marketer_id, annual_rent,
      caution_fee, platform_fee, marketer_commission, start_date, end_date, payment_reference
    } = rentalData;

    const result = await db.query(`
      INSERT INTO rentals (
        property_id, tenant_id, landlord_id, marketer_id, annual_rent,
        caution_fee, platform_fee, marketer_commission, start_date, end_date, payment_reference
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *
    `, [
      property_id, tenant_id, landlord_id, marketer_id, annual_rent,
      caution_fee, platform_fee, marketer_commission, start_date, end_date, payment_reference
    ]);

    // Update property status to rented
    await PropertyModel.updateStatus(property_id, 'rented');

    return result.rows[0];
  },

  async findByTenant(tenantId) {
    const result = await db.query(`
      SELECT r.*, p.title as property_title, p.address as property_address,
             u.first_name as landlord_name, u.phone as landlord_phone
      FROM rentals r
      JOIN properties p ON r.property_id = p.id
      JOIN users u ON r.landlord_id = u.id
      WHERE r.tenant_id = $1
      ORDER BY r.created_at DESC
    `, [tenantId]);
    return result.rows;
  },

  async updateEscrowStatus(id, status) {
    const result = await db.query(
      `UPDATE rentals SET escrow_status = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 RETURNING *`,
      [status, id]
    );
    return result.rows[0];
  }
};

const database = { db, UserModel, PropertyModel, RentalModel, createTables };

export default database;

