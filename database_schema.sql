-- ============================================
-- DATABASE SCHEMA FOR PIZZERIA DA GIANNI
-- ============================================
-- MySQL Database Schema
-- Created by Terry - Terragon Labs
-- ============================================

-- Create Database
CREATE DATABASE IF NOT EXISTS pizzeria_gianni;
USE pizzeria_gianni;

-- ============================================
-- TABLE: users
-- Manages customer accounts and authentication
-- ============================================
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    INDEX idx_email (email),
    INDEX idx_phone (phone)
);

-- ============================================
-- TABLE: addresses
-- Customer delivery addresses
-- ============================================
CREATE TABLE addresses (
    address_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    address_type ENUM('home', 'work', 'other') DEFAULT 'home',
    street_address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    province VARCHAR(50) NOT NULL,
    country VARCHAR(50) DEFAULT 'Italia',
    is_default BOOLEAN DEFAULT FALSE,
    delivery_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
);

-- ============================================
-- TABLE: categories
-- Pizza and menu item categories
-- ============================================
CREATE TABLE categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(100) NOT NULL,
    description TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE: products
-- All menu items (pizzas, drinks, desserts, etc.)
-- ============================================
CREATE TABLE products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    product_name VARCHAR(150) NOT NULL,
    description TEXT,
    base_price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    is_available BOOLEAN DEFAULT TRUE,
    is_vegetarian BOOLEAN DEFAULT FALSE,
    is_vegan BOOLEAN DEFAULT FALSE,
    is_gluten_free BOOLEAN DEFAULT FALSE,
    is_spicy BOOLEAN DEFAULT FALSE,
    calories INT,
    preparation_time INT COMMENT 'In minutes',
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id),
    INDEX idx_category (category_id),
    INDEX idx_availability (is_available),
    FULLTEXT idx_search (product_name, description)
);

-- ============================================
-- TABLE: product_sizes
-- Different sizes for pizzas (small, medium, large)
-- ============================================
CREATE TABLE product_sizes (
    size_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    size_name VARCHAR(50) NOT NULL COMMENT 'e.g., Piccola, Media, Grande',
    size_code VARCHAR(10) NOT NULL COMMENT 'e.g., S, M, L',
    price_modifier DECIMAL(10, 2) DEFAULT 0.00,
    is_available BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    INDEX idx_product (product_id)
);

-- ============================================
-- TABLE: ingredients
-- All available ingredients
-- ============================================
CREATE TABLE ingredients (
    ingredient_id INT PRIMARY KEY AUTO_INCREMENT,
    ingredient_name VARCHAR(100) NOT NULL,
    is_vegetarian BOOLEAN DEFAULT TRUE,
    is_vegan BOOLEAN DEFAULT FALSE,
    is_gluten_free BOOLEAN DEFAULT TRUE,
    allergen_info TEXT,
    price DECIMAL(10, 2) DEFAULT 0.00,
    is_available BOOLEAN DEFAULT TRUE,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE: product_ingredients
-- Default ingredients for each product
-- ============================================
CREATE TABLE product_ingredients (
    product_ingredient_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    ingredient_id INT NOT NULL,
    is_removable BOOLEAN DEFAULT TRUE,
    quantity VARCHAR(50) COMMENT 'e.g., normale, abbondante',
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(ingredient_id),
    UNIQUE KEY unique_product_ingredient (product_id, ingredient_id)
);

-- ============================================
-- TABLE: orders
-- Customer orders
-- ============================================
CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    order_type ENUM('delivery', 'pickup', 'dine-in') NOT NULL,
    order_status ENUM('pending', 'confirmed', 'preparing', 'ready', 'out-for-delivery', 'completed', 'cancelled') DEFAULT 'pending',
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    payment_method ENUM('cash', 'card', 'online', 'paypal') DEFAULT 'cash',

    -- Address info (for delivery)
    delivery_address_id INT,
    delivery_address_text TEXT,

    -- Customer info (for guest orders)
    customer_name VARCHAR(200),
    customer_phone VARCHAR(20),
    customer_email VARCHAR(255),

    -- Financial
    subtotal DECIMAL(10, 2) NOT NULL,
    delivery_fee DECIMAL(10, 2) DEFAULT 0.00,
    tax_amount DECIMAL(10, 2) DEFAULT 0.00,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    total_amount DECIMAL(10, 2) NOT NULL,

    -- Timing
    estimated_delivery_time TIMESTAMP NULL,
    actual_delivery_time TIMESTAMP NULL,

    -- Notes
    special_instructions TEXT,
    admin_notes TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (delivery_address_id) REFERENCES addresses(address_id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_status (order_status),
    INDEX idx_created (created_at),
    INDEX idx_order_number (order_number)
);

-- ============================================
-- TABLE: order_items
-- Individual items in an order
-- ============================================
CREATE TABLE order_items (
    order_item_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    size_id INT,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    special_instructions TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (size_id) REFERENCES product_sizes(size_id),
    INDEX idx_order (order_id)
);

-- ============================================
-- TABLE: order_item_customizations
-- Custom ingredients added/removed from order items
-- ============================================
CREATE TABLE order_item_customizations (
    customization_id INT PRIMARY KEY AUTO_INCREMENT,
    order_item_id INT NOT NULL,
    ingredient_id INT NOT NULL,
    customization_type ENUM('add', 'remove', 'extra') NOT NULL,
    price_adjustment DECIMAL(10, 2) DEFAULT 0.00,
    FOREIGN KEY (order_item_id) REFERENCES order_items(order_item_id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(ingredient_id)
);

-- ============================================
-- TABLE: reviews
-- Customer reviews and ratings
-- ============================================
CREATE TABLE reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    order_id INT,
    product_id INT,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_title VARCHAR(200),
    review_text TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    admin_response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE SET NULL,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    INDEX idx_product (product_id),
    INDEX idx_rating (rating),
    INDEX idx_approved (is_approved)
);

-- ============================================
-- TABLE: promo_codes
-- Discount codes and promotions
-- ============================================
CREATE TABLE promo_codes (
    promo_id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount_type ENUM('percentage', 'fixed') NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    min_order_amount DECIMAL(10, 2) DEFAULT 0.00,
    max_discount DECIMAL(10, 2),
    usage_limit INT,
    usage_count INT DEFAULT 0,
    valid_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_active (is_active, valid_from, valid_until)
);

-- ============================================
-- TABLE: cart
-- Shopping cart (for logged-in users)
-- ============================================
CREATE TABLE cart (
    cart_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    size_id INT,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (size_id) REFERENCES product_sizes(size_id) ON DELETE SET NULL,
    UNIQUE KEY unique_cart_item (user_id, product_id, size_id)
);

-- ============================================
-- TABLE: cart_customizations
-- Custom ingredients for items in cart
-- ============================================
CREATE TABLE cart_customizations (
    cart_customization_id INT PRIMARY KEY AUTO_INCREMENT,
    cart_id INT NOT NULL,
    ingredient_id INT NOT NULL,
    customization_type ENUM('add', 'remove', 'extra') NOT NULL,
    FOREIGN KEY (cart_id) REFERENCES cart(cart_id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(ingredient_id)
);

-- ============================================
-- TABLE: reservations
-- Table reservations for dine-in
-- ============================================
CREATE TABLE reservations (
    reservation_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    customer_name VARCHAR(200) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(255),
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    party_size INT NOT NULL,
    table_number VARCHAR(20),
    status ENUM('pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no-show') DEFAULT 'pending',
    special_requests TEXT,
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_date_time (reservation_date, reservation_time),
    INDEX idx_status (status)
);

-- ============================================
-- TABLE: staff
-- Restaurant staff management
-- ============================================
CREATE TABLE staff (
    staff_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role ENUM('admin', 'manager', 'chef', 'driver', 'cashier') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    hired_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_role (role),
    INDEX idx_active (is_active)
);

-- ============================================
-- TABLE: delivery_zones
-- Delivery coverage areas with fees
-- ============================================
CREATE TABLE delivery_zones (
    zone_id INT PRIMARY KEY AUTO_INCREMENT,
    zone_name VARCHAR(100) NOT NULL,
    postal_codes TEXT COMMENT 'Comma-separated list',
    delivery_fee DECIMAL(10, 2) NOT NULL,
    min_order_amount DECIMAL(10, 2) DEFAULT 0.00,
    estimated_delivery_time INT COMMENT 'In minutes',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE: opening_hours
-- Restaurant operating hours
-- ============================================
CREATE TABLE opening_hours (
    schedule_id INT PRIMARY KEY AUTO_INCREMENT,
    day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
    open_time TIME NOT NULL,
    close_time TIME NOT NULL,
    is_closed BOOLEAN DEFAULT FALSE,
    special_note VARCHAR(255),
    UNIQUE KEY unique_day (day_of_week)
);

-- ============================================
-- TABLE: notifications
-- System notifications for users
-- ============================================
CREATE TABLE notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    notification_type ENUM('order_update', 'promotion', 'reservation', 'general') NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    related_order_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (related_order_id) REFERENCES orders(order_id) ON DELETE SET NULL,
    INDEX idx_user_read (user_id, is_read)
);

-- ============================================
-- SAMPLE DATA INSERTION
-- ============================================

-- Insert Categories
INSERT INTO categories (category_name, description, display_order) VALUES
('Pizze Classiche', 'Le nostre pizze tradizionali napoletane', 1),
('Pizze Speciali', 'Creazioni uniche dello chef', 2),
('Pizze Bianche', 'Pizze senza pomodoro', 3),
('Antipasti', 'Per iniziare il pasto', 4),
('Insalate', 'Fresche e genuine', 5),
('Dolci', 'Per concludere in dolcezza', 6),
('Bevande', 'Birre, vini e soft drinks', 7);

-- Insert Sample Products (Pizze)
INSERT INTO products (category_id, product_name, description, base_price, is_vegetarian, calories, preparation_time, display_order) VALUES
(1, 'Margherita', 'Pomodoro, mozzarella, basilico fresco', 7.50, TRUE, 800, 15, 1),
(1, 'Marinara', 'Pomodoro, aglio, origano, olio EVO', 6.50, TRUE, 650, 15, 2),
(1, 'Napoli', 'Pomodoro, mozzarella, acciughe, origano', 8.50, FALSE, 850, 15, 3),
(1, 'Capricciosa', 'Pomodoro, mozzarella, prosciutto cotto, funghi, carciofi, olive', 10.50, FALSE, 950, 18, 4),
(2, 'Quattro Formaggi', 'Mozzarella, gorgonzola, parmigiano, fontina', 11.00, TRUE, 1100, 18, 5),
(2, 'Diavola', 'Pomodoro, mozzarella, salame piccante', 9.50, FALSE, 920, 15, 6),
(2, 'Prosciutto e Funghi', 'Pomodoro, mozzarella, prosciutto cotto, funghi', 10.00, FALSE, 900, 18, 7),
(2, 'Vegetariana', 'Pomodoro, mozzarella, melanzane, zucchine, peperoni', 9.50, TRUE, 780, 18, 8),
(3, 'Bianca Bufala', 'Mozzarella di bufala, pomodorini, rucola, grana', 12.50, TRUE, 850, 15, 9),
(3, 'Salsiccia e Friarielli', 'Mozzarella, salsiccia, friarielli', 11.50, FALSE, 980, 18, 10);

-- Insert Product Sizes
INSERT INTO product_sizes (product_id, size_name, size_code, price_modifier) VALUES
(1, 'Piccola (25cm)', 'S', 0.00),
(1, 'Media (30cm)', 'M', 3.00),
(1, 'Grande (35cm)', 'L', 5.00),
(2, 'Piccola (25cm)', 'S', 0.00),
(2, 'Media (30cm)', 'M', 3.00),
(2, 'Grande (35cm)', 'L', 5.00),
(3, 'Piccola (25cm)', 'S', 0.00),
(3, 'Media (30cm)', 'M', 3.00),
(3, 'Grande (35cm)', 'L', 5.00),
(4, 'Media (30cm)', 'M', 0.00),
(4, 'Grande (35cm)', 'L', 3.00);

-- Insert Ingredients
INSERT INTO ingredients (ingredient_name, is_vegetarian, is_vegan, price) VALUES
('Mozzarella', TRUE, FALSE, 1.50),
('Pomodoro', TRUE, TRUE, 0.50),
('Basilico', TRUE, TRUE, 0.30),
('Prosciutto Cotto', FALSE, FALSE, 2.00),
('Funghi', TRUE, TRUE, 1.50),
('Salame Piccante', FALSE, FALSE, 2.00),
('Gorgonzola', TRUE, FALSE, 2.00),
('Bufala', TRUE, FALSE, 3.00),
('Rucola', TRUE, TRUE, 1.00),
('Olive', TRUE, TRUE, 1.00),
('Acciughe', FALSE, FALSE, 2.00),
('Carciofi', TRUE, TRUE, 1.50),
('Melanzane', TRUE, TRUE, 1.50),
('Zucchine', TRUE, TRUE, 1.50),
('Peperoni', TRUE, TRUE, 1.50);

-- Insert Sample Promo Codes
INSERT INTO promo_codes (code, description, discount_type, discount_value, min_order_amount, valid_until, is_active) VALUES
('BENVENUTO10', 'Sconto 10% primo ordine', 'percentage', 10.00, 15.00, DATE_ADD(NOW(), INTERVAL 30 DAY), TRUE),
('ESTATE2025', 'Sconto estivo 5 euro', 'fixed', 5.00, 25.00, DATE_ADD(NOW(), INTERVAL 90 DAY), TRUE),
('PIZZA50', 'Sconto 50% su ordini sopra 50€', 'percentage', 50.00, 50.00, DATE_ADD(NOW(), INTERVAL 7 DAY), TRUE);

-- Insert Delivery Zones
INSERT INTO delivery_zones (zone_name, postal_codes, delivery_fee, min_order_amount, estimated_delivery_time, is_active) VALUES
('Centro Città', '37100,37121,37122', 2.50, 10.00, 30, TRUE),
('Zona Nord', '37123,37124,37125', 4.00, 15.00, 45, TRUE),
('Zona Sud', '37126,37127,37128', 4.00, 15.00, 45, TRUE),
('Periferia', '37129,37130,37131', 5.50, 20.00, 60, TRUE);

-- Insert Opening Hours
INSERT INTO opening_hours (day_of_week, open_time, close_time, is_closed) VALUES
('Monday', '18:00:00', '23:00:00', FALSE),
('Tuesday', '12:00:00', '15:00:00', FALSE),
('Tuesday', '18:00:00', '23:00:00', FALSE),
('Wednesday', '12:00:00', '15:00:00', FALSE),
('Wednesday', '18:00:00', '23:00:00', FALSE),
('Thursday', '12:00:00', '15:00:00', FALSE),
('Thursday', '18:00:00', '23:00:00', FALSE),
('Friday', '12:00:00', '15:00:00', FALSE),
('Friday', '18:00:00', '00:00:00', FALSE),
('Saturday', '12:00:00', '15:00:00', FALSE),
('Saturday', '18:00:00', '00:00:00', FALSE),
('Sunday', '12:00:00', '15:00:00', FALSE),
('Sunday', '18:00:00', '23:00:00', FALSE);

-- ============================================
-- USEFUL VIEWS
-- ============================================

-- View: Complete Product Information
CREATE VIEW view_products_full AS
SELECT
    p.product_id,
    p.product_name,
    p.description,
    p.base_price,
    p.image_url,
    p.is_available,
    p.is_vegetarian,
    p.is_vegan,
    p.is_gluten_free,
    p.calories,
    c.category_name,
    COALESCE(AVG(r.rating), 0) as avg_rating,
    COUNT(r.review_id) as review_count
FROM products p
JOIN categories c ON p.category_id = c.category_id
LEFT JOIN reviews r ON p.product_id = r.product_id AND r.is_approved = TRUE
GROUP BY p.product_id;

-- View: Order Summary
CREATE VIEW view_orders_summary AS
SELECT
    o.order_id,
    o.order_number,
    o.order_type,
    o.order_status,
    o.payment_status,
    o.total_amount,
    o.created_at,
    COALESCE(CONCAT(u.first_name, ' ', u.last_name), o.customer_name) as customer_name,
    COALESCE(u.phone, o.customer_phone) as customer_phone,
    COUNT(oi.order_item_id) as item_count
FROM orders o
LEFT JOIN users u ON o.user_id = u.user_id
LEFT JOIN order_items oi ON o.order_id = oi.order_id
GROUP BY o.order_id;

-- ============================================
-- STORED PROCEDURES
-- ============================================

DELIMITER //

-- Procedure: Calculate Order Total
CREATE PROCEDURE sp_calculate_order_total(IN p_order_id INT)
BEGIN
    DECLARE v_subtotal DECIMAL(10,2);
    DECLARE v_delivery_fee DECIMAL(10,2);
    DECLARE v_tax_rate DECIMAL(5,4) DEFAULT 0.22; -- 22% IVA

    -- Calculate subtotal
    SELECT SUM(total_price) INTO v_subtotal
    FROM order_items
    WHERE order_id = p_order_id;

    -- Get delivery fee
    SELECT delivery_fee INTO v_delivery_fee
    FROM orders
    WHERE order_id = p_order_id;

    -- Update order totals
    UPDATE orders SET
        subtotal = v_subtotal,
        tax_amount = (v_subtotal + COALESCE(v_delivery_fee, 0)) * v_tax_rate,
        total_amount = v_subtotal + COALESCE(v_delivery_fee, 0) + ((v_subtotal + COALESCE(v_delivery_fee, 0)) * v_tax_rate)
    WHERE order_id = p_order_id;
END //

-- Procedure: Apply Promo Code
CREATE PROCEDURE sp_apply_promo_code(
    IN p_order_id INT,
    IN p_promo_code VARCHAR(50),
    OUT p_discount_amount DECIMAL(10,2),
    OUT p_success BOOLEAN,
    OUT p_message VARCHAR(255)
)
BEGIN
    DECLARE v_promo_id INT;
    DECLARE v_discount_type VARCHAR(20);
    DECLARE v_discount_value DECIMAL(10,2);
    DECLARE v_min_order DECIMAL(10,2);
    DECLARE v_max_discount DECIMAL(10,2);
    DECLARE v_order_subtotal DECIMAL(10,2);

    SET p_success = FALSE;

    -- Get promo code details
    SELECT promo_id, discount_type, discount_value, min_order_amount, max_discount
    INTO v_promo_id, v_discount_type, v_discount_value, v_min_order, v_max_discount
    FROM promo_codes
    WHERE code = p_promo_code
        AND is_active = TRUE
        AND (valid_from <= NOW())
        AND (valid_until IS NULL OR valid_until >= NOW())
    LIMIT 1;

    IF v_promo_id IS NULL THEN
        SET p_message = 'Codice promo non valido o scaduto';
        SET p_discount_amount = 0;
    ELSE
        -- Get order subtotal
        SELECT subtotal INTO v_order_subtotal
        FROM orders
        WHERE order_id = p_order_id;

        IF v_order_subtotal < v_min_order THEN
            SET p_message = CONCAT('Ordine minimo richiesto: €', v_min_order);
            SET p_discount_amount = 0;
        ELSE
            -- Calculate discount
            IF v_discount_type = 'percentage' THEN
                SET p_discount_amount = v_order_subtotal * (v_discount_value / 100);
            ELSE
                SET p_discount_amount = v_discount_value;
            END IF;

            -- Apply max discount limit
            IF v_max_discount IS NOT NULL AND p_discount_amount > v_max_discount THEN
                SET p_discount_amount = v_max_discount;
            END IF;

            -- Update order
            UPDATE orders SET discount_amount = p_discount_amount WHERE order_id = p_order_id;

            -- Update promo usage
            UPDATE promo_codes SET usage_count = usage_count + 1 WHERE promo_id = v_promo_id;

            SET p_success = TRUE;
            SET p_message = 'Codice promo applicato con successo';
        END IF;
    END IF;
END //

DELIMITER ;

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Additional indexes for common queries
CREATE INDEX idx_products_category_available ON products(category_id, is_available);
CREATE INDEX idx_orders_user_status ON orders(user_id, order_status, created_at);
CREATE INDEX idx_reviews_product_approved ON reviews(product_id, is_approved, rating);

-- ============================================
-- END OF SCHEMA
-- ============================================
