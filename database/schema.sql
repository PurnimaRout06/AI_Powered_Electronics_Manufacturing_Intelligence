-- =============================================================================
-- Manufacturing Intelligence — Database Schema
-- =============================================================================
-- This file creates the full schema: the 12 original manufacturing tables
-- (taken from electronics_manufacturing_db.sql, unchanged) plus two new
-- tables that add login and preferences support: `users` and
-- `user_preferences`.
--
-- Run this against an empty database, e.g.:
--   mysql -u root -p electronics_manufacturing_db < schema.sql
--
-- After running this, load the existing generated CSVs with the project's
-- own data-ml/src/load_data_to_mysql.py script (unchanged) to populate the
-- 12 manufacturing tables with data. The `users` table starts empty — create
-- an account through the app's Register page.
-- =============================================================================

CREATE DATABASE IF NOT EXISTS electronics_manufacturing_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

USE electronics_manufacturing_db;

SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------
-- machines — physical equipment on the floor
-- -----------------------------------------------------------------------
DROP TABLE IF EXISTS `machines`;
CREATE TABLE `machines` (
  `machine_id` int NOT NULL AUTO_INCREMENT,
  `machine_name` varchar(100) NOT NULL,
  `machine_type` varchar(100) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `installation_date` date DEFAULT NULL,
  PRIMARY KEY (`machine_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- -----------------------------------------------------------------------
-- employees — plant staff
-- -----------------------------------------------------------------------
DROP TABLE IF EXISTS `employees`;
CREATE TABLE `employees` (
  `employee_id` int NOT NULL AUTO_INCREMENT,
  `employee_name` varchar(100) NOT NULL,
  `department` varchar(100) DEFAULT NULL,
  `role` varchar(100) DEFAULT NULL,
  `shift` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`employee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- -----------------------------------------------------------------------
-- inventory — raw material stock levels
-- -----------------------------------------------------------------------
DROP TABLE IF EXISTS `inventory`;
CREATE TABLE `inventory` (
  `inventory_id` int NOT NULL AUTO_INCREMENT,
  `material_name` varchar(100) NOT NULL,
  `quantity_available` int NOT NULL,
  `reorder_level` int DEFAULT NULL,
  `unit` varchar(20) DEFAULT NULL,
  `last_updated` date DEFAULT NULL,
  PRIMARY KEY (`inventory_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- -----------------------------------------------------------------------
-- suppliers — raw material vendors
-- -----------------------------------------------------------------------
DROP TABLE IF EXISTS `suppliers`;
CREATE TABLE `suppliers` (
  `supplier_id` int NOT NULL AUTO_INCREMENT,
  `supplier_name` varchar(100) NOT NULL,
  `material_supplied` varchar(100) DEFAULT NULL,
  `contact_email` varchar(100) DEFAULT NULL,
  `contact_phone` varchar(20) DEFAULT NULL,
  `delivery_rating` decimal(3,2) DEFAULT NULL,
  PRIMARY KEY (`supplier_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- -----------------------------------------------------------------------
-- shifts — shift definitions
-- -----------------------------------------------------------------------
DROP TABLE IF EXISTS `shifts`;
CREATE TABLE `shifts` (
  `shift_id` int NOT NULL AUTO_INCREMENT,
  `shift_name` varchar(50) NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `supervisor` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`shift_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- -----------------------------------------------------------------------
-- production — one row per machine/shift/day production run
-- -----------------------------------------------------------------------
DROP TABLE IF EXISTS `production`;
CREATE TABLE `production` (
  `production_id` int NOT NULL AUTO_INCREMENT,
  `machine_id` int NOT NULL,
  `production_date` date NOT NULL,
  `shift` varchar(20) DEFAULT NULL,
  `units_produced` int DEFAULT NULL,
  `units_rejected` int DEFAULT NULL,
  `production_time_hours` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`production_id`),
  KEY `machine_id` (`machine_id`),
  CONSTRAINT `production_ibfk_1` FOREIGN KEY (`machine_id`) REFERENCES `machines` (`machine_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- -----------------------------------------------------------------------
-- production_targets — planned output per machine/day
-- -----------------------------------------------------------------------
DROP TABLE IF EXISTS `production_targets`;
CREATE TABLE `production_targets` (
  `target_id` int NOT NULL AUTO_INCREMENT,
  `machine_id` int NOT NULL,
  `target_date` date NOT NULL,
  `target_quantity` int NOT NULL,
  PRIMARY KEY (`target_id`),
  KEY `machine_id` (`machine_id`),
  CONSTRAINT `production_targets_ibfk_1` FOREIGN KEY (`machine_id`) REFERENCES `machines` (`machine_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- -----------------------------------------------------------------------
-- production_logs — granular log entries tied to production runs
-- -----------------------------------------------------------------------
DROP TABLE IF EXISTS `production_logs`;
CREATE TABLE `production_logs` (
  `log_id` int NOT NULL AUTO_INCREMENT,
  `production_id` int NOT NULL,
  `machine_id` int NOT NULL,
  `employee_id` int DEFAULT NULL,
  `log_date` datetime NOT NULL,
  `quantity_produced` int DEFAULT NULL,
  PRIMARY KEY (`log_id`),
  KEY `production_id` (`production_id`),
  KEY `machine_id` (`machine_id`),
  KEY `employee_id` (`employee_id`),
  CONSTRAINT `production_logs_ibfk_1` FOREIGN KEY (`production_id`) REFERENCES `production` (`production_id`),
  CONSTRAINT `production_logs_ibfk_2` FOREIGN KEY (`machine_id`) REFERENCES `machines` (`machine_id`),
  CONSTRAINT `production_logs_ibfk_3` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- -----------------------------------------------------------------------
-- quality — inspection results tied to a production run
-- -----------------------------------------------------------------------
DROP TABLE IF EXISTS `quality`;
CREATE TABLE `quality` (
  `quality_id` int NOT NULL AUTO_INCREMENT,
  `production_id` int NOT NULL,
  `inspection_date` date NOT NULL,
  `defect_type` varchar(100) DEFAULT NULL,
  `defect_count` int DEFAULT NULL,
  `quality_status` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`quality_id`),
  KEY `production_id` (`production_id`),
  CONSTRAINT `quality_ibfk_1` FOREIGN KEY (`production_id`) REFERENCES `production` (`production_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- -----------------------------------------------------------------------
-- sensors — raw temperature/vibration/etc. sensor readings per machine
-- -----------------------------------------------------------------------
DROP TABLE IF EXISTS `sensors`;
CREATE TABLE `sensors` (
  `sensor_id` int NOT NULL AUTO_INCREMENT,
  `machine_id` int NOT NULL,
  `sensor_type` varchar(50) NOT NULL,
  `sensor_value` decimal(10,2) DEFAULT NULL,
  `unit` varchar(20) DEFAULT NULL,
  `recorded_at` datetime NOT NULL,
  PRIMARY KEY (`sensor_id`),
  KEY `machine_id` (`machine_id`),
  CONSTRAINT `sensors_ibfk_1` FOREIGN KEY (`machine_id`) REFERENCES `machines` (`machine_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- -----------------------------------------------------------------------
-- downtime — unplanned/planned stoppage events
-- -----------------------------------------------------------------------
DROP TABLE IF EXISTS `downtime`;
CREATE TABLE `downtime` (
  `downtime_id` int NOT NULL AUTO_INCREMENT,
  `machine_id` int NOT NULL,
  `downtime_start` datetime NOT NULL,
  `downtime_end` datetime DEFAULT NULL,
  `downtime_reason` varchar(150) DEFAULT NULL,
  `downtime_hours` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`downtime_id`),
  KEY `machine_id` (`machine_id`),
  CONSTRAINT `downtime_ibfk_1` FOREIGN KEY (`machine_id`) REFERENCES `machines` (`machine_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- -----------------------------------------------------------------------
-- maintenance — scheduled/completed maintenance work orders
-- -----------------------------------------------------------------------
DROP TABLE IF EXISTS `maintenance`;
CREATE TABLE `maintenance` (
  `maintenance_id` int NOT NULL AUTO_INCREMENT,
  `equipment_id` int NOT NULL,
  `maintenance_date` date NOT NULL,
  `maintenance_type` varchar(50) DEFAULT NULL,
  `maintenance_status` varchar(50) DEFAULT NULL,
  `downtime_hours` decimal(5,2) DEFAULT NULL,
  `maintenance_cost` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`maintenance_id`),
  KEY `equipment_id` (`equipment_id`),
  CONSTRAINT `maintenance_ibfk_1` FOREIGN KEY (`equipment_id`) REFERENCES `machines` (`machine_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =============================================================================
-- NEW TABLES — added to support login and user preferences in the app.
-- Nothing above this line was changed from the original database.
-- =============================================================================

-- -----------------------------------------------------------------------
-- users — application accounts (separate from `employees`, which models
-- plant staff, not app logins)
-- -----------------------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'viewer',   -- 'admin' | 'manager' | 'viewer'
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- -----------------------------------------------------------------------
-- user_preferences — one row per user, created on first save
-- -----------------------------------------------------------------------
DROP TABLE IF EXISTS `user_preferences`;
CREATE TABLE `user_preferences` (
  `user_id` int NOT NULL,
  `theme` varchar(20) NOT NULL DEFAULT 'light',              -- 'light' | 'dark'
  `default_date_range` varchar(20) NOT NULL DEFAULT '7d',    -- 'today' | '7d' | '30d'
  `temperature_unit` varchar(10) NOT NULL DEFAULT 'celsius', -- 'celsius' | 'fahrenheit'
  `email_notifications` tinyint(1) NOT NULL DEFAULT 1,
  `default_landing_page` varchar(50) NOT NULL DEFAULT 'overview',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `user_preferences_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

SET FOREIGN_KEY_CHECKS = 1;
