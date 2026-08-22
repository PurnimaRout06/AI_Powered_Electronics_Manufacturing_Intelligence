-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: electronics_manufacturing_db
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `downtime`
--

DROP TABLE IF EXISTS `downtime`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `downtime`
--

LOCK TABLES `downtime` WRITE;
/*!40000 ALTER TABLE `downtime` DISABLE KEYS */;
INSERT INTO `downtime` VALUES (1,1,'2026-08-18 10:00:00','2026-08-18 11:30:00','Material Shortage',1.50),(2,2,'2026-08-18 15:00:00','2026-08-18 16:00:00','Machine Adjustment',1.00),(3,3,'2026-08-18 23:00:00','2026-08-19 03:00:00','Mechanical Failure',4.00),(4,4,'2026-08-18 09:30:00','2026-08-18 10:15:00','Testing Error',0.75),(5,5,'2026-08-18 17:00:00','2026-08-18 18:00:00','Calibration',1.00);
/*!40000 ALTER TABLE `downtime` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `employee_id` int NOT NULL AUTO_INCREMENT,
  `employee_name` varchar(100) NOT NULL,
  `department` varchar(100) DEFAULT NULL,
  `role` varchar(100) DEFAULT NULL,
  `shift` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES (1,'Rahul Kumar','Production','Machine Operator','Morning'),(2,'Priya Sharma','Production','Machine Operator','Evening'),(3,'Arjun Rao','Maintenance','Maintenance Engineer','Morning'),(4,'Sneha Patel','Quality','Quality Inspector','Morning'),(5,'Vikram Singh','Production','Production Supervisor','Night');
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory`
--

DROP TABLE IF EXISTS `inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory` (
  `inventory_id` int NOT NULL AUTO_INCREMENT,
  `material_name` varchar(100) NOT NULL,
  `quantity_available` int NOT NULL,
  `reorder_level` int DEFAULT NULL,
  `unit` varchar(20) DEFAULT NULL,
  `last_updated` date DEFAULT NULL,
  PRIMARY KEY (`inventory_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory`
--

LOCK TABLES `inventory` WRITE;
/*!40000 ALTER TABLE `inventory` DISABLE KEYS */;
INSERT INTO `inventory` VALUES (1,'PCB Boards',5000,1000,'pieces','2026-08-18'),(2,'Solder Wire',250,50,'kg','2026-08-18'),(3,'Electronic Components',8000,2000,'pieces','2026-08-18'),(4,'Copper Wire',1200,300,'meters','2026-08-18'),(5,'Flux Material',180,40,'kg','2026-08-18');
/*!40000 ALTER TABLE `inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `machines`
--

DROP TABLE IF EXISTS `machines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `machines` (
  `machine_id` int NOT NULL AUTO_INCREMENT,
  `machine_name` varchar(100) NOT NULL,
  `machine_type` varchar(100) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `installation_date` date DEFAULT NULL,
  PRIMARY KEY (`machine_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `machines`
--

LOCK TABLES `machines` WRITE;
/*!40000 ALTER TABLE `machines` DISABLE KEYS */;
INSERT INTO `machines` VALUES (1,'PCB Assembly Line 01','Assembly Line','Production Floor A','Operational','2022-05-10'),(2,'PCB Assembly Line 02','Assembly Line','Production Floor A','Operational','2022-08-15'),(3,'CNC Precision Unit','CNC Machine','Production Floor B','Maintenance','2021-03-20'),(4,'Testing Station 01','Testing Equipment','Quality Floor','Operational','2023-01-12'),(5,'Testing Station 02','Testing Equipment','Quality Floor','Operational','2023-04-18');
/*!40000 ALTER TABLE `machines` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `maintenance`
--

DROP TABLE IF EXISTS `maintenance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `maintenance`
--

LOCK TABLES `maintenance` WRITE;
/*!40000 ALTER TABLE `maintenance` DISABLE KEYS */;
INSERT INTO `maintenance` VALUES (1,1,'2026-08-17','Preventive','Completed',2.00,5000.00),(2,2,'2026-08-16','Routine Inspection','Completed',1.50,3000.00),(3,3,'2026-08-18','Corrective','In Progress',5.00,12000.00),(4,4,'2026-08-15','Preventive','Completed',1.00,2500.00),(5,5,'2026-08-14','Routine Inspection','Completed',1.50,2800.00);
/*!40000 ALTER TABLE `maintenance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `production`
--

DROP TABLE IF EXISTS `production`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `production`
--

LOCK TABLES `production` WRITE;
/*!40000 ALTER TABLE `production` DISABLE KEYS */;
INSERT INTO `production` VALUES (1,1,'2026-08-18','Morning',950,50,8.00),(2,2,'2026-08-18','Afternoon',880,20,8.00),(3,3,'2026-08-18','Night',720,80,8.00),(4,4,'2026-08-18','Morning',970,30,8.00),(5,5,'2026-08-18','Afternoon',930,20,8.00);
/*!40000 ALTER TABLE `production` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `production_logs`
--

DROP TABLE IF EXISTS `production_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `production_logs`
--

LOCK TABLES `production_logs` WRITE;
/*!40000 ALTER TABLE `production_logs` DISABLE KEYS */;
INSERT INTO `production_logs` VALUES (1,1,1,1,'2026-08-18 08:00:00',950),(2,2,2,2,'2026-08-18 14:00:00',880),(3,3,3,5,'2026-08-18 22:00:00',720),(4,4,4,4,'2026-08-18 09:00:00',970),(5,5,5,1,'2026-08-18 15:00:00',930);
/*!40000 ALTER TABLE `production_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `production_targets`
--

DROP TABLE IF EXISTS `production_targets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `production_targets` (
  `target_id` int NOT NULL AUTO_INCREMENT,
  `machine_id` int NOT NULL,
  `target_date` date NOT NULL,
  `target_quantity` int NOT NULL,
  PRIMARY KEY (`target_id`),
  KEY `machine_id` (`machine_id`),
  CONSTRAINT `production_targets_ibfk_1` FOREIGN KEY (`machine_id`) REFERENCES `machines` (`machine_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `production_targets`
--

LOCK TABLES `production_targets` WRITE;
/*!40000 ALTER TABLE `production_targets` DISABLE KEYS */;
INSERT INTO `production_targets` VALUES (1,1,'2026-08-18',1000),(2,2,'2026-08-18',900),(3,3,'2026-08-18',800),(4,4,'2026-08-18',1000),(5,5,'2026-08-18',950);
/*!40000 ALTER TABLE `production_targets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quality`
--

DROP TABLE IF EXISTS `quality`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quality`
--

LOCK TABLES `quality` WRITE;
/*!40000 ALTER TABLE `quality` DISABLE KEYS */;
INSERT INTO `quality` VALUES (1,1,'2026-08-18','Solder Defect',12,'Pass'),(2,2,'2026-08-18','Component Misplacement',8,'Pass'),(3,3,'2026-08-18','PCB Damage',15,'Fail'),(4,4,'2026-08-18','Solder Defect',6,'Pass'),(5,5,'2026-08-18','Component Misplacement',5,'Pass');
/*!40000 ALTER TABLE `quality` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sensors`
--

DROP TABLE IF EXISTS `sensors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sensors`
--

LOCK TABLES `sensors` WRITE;
/*!40000 ALTER TABLE `sensors` DISABLE KEYS */;
INSERT INTO `sensors` VALUES (1,1,'Temperature',72.50,'°C','2026-08-18 08:00:00'),(2,1,'Vibration',3.20,'mm/s','2026-08-18 08:00:00'),(3,2,'Temperature',68.40,'°C','2026-08-18 14:00:00'),(4,2,'Vibration',2.80,'mm/s','2026-08-18 14:00:00'),(5,3,'Temperature',85.70,'°C','2026-08-18 22:00:00'),(6,3,'Vibration',5.60,'mm/s','2026-08-18 22:00:00'),(7,4,'Temperature',64.20,'°C','2026-08-18 09:00:00'),(8,5,'Temperature',66.80,'°C','2026-08-18 15:00:00');
/*!40000 ALTER TABLE `sensors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shifts`
--

DROP TABLE IF EXISTS `shifts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shifts` (
  `shift_id` int NOT NULL AUTO_INCREMENT,
  `shift_name` varchar(50) NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `supervisor` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`shift_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shifts`
--

LOCK TABLES `shifts` WRITE;
/*!40000 ALTER TABLE `shifts` DISABLE KEYS */;
INSERT INTO `shifts` VALUES (1,'Morning','06:00:00','14:00:00','Vikram Singh'),(2,'Afternoon','14:00:00','22:00:00','Priya Sharma'),(3,'Night','22:00:00','06:00:00','Vikram Singh');
/*!40000 ALTER TABLE `shifts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `suppliers`
--

DROP TABLE IF EXISTS `suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suppliers` (
  `supplier_id` int NOT NULL AUTO_INCREMENT,
  `supplier_name` varchar(100) NOT NULL,
  `material_supplied` varchar(100) DEFAULT NULL,
  `contact_email` varchar(100) DEFAULT NULL,
  `contact_phone` varchar(20) DEFAULT NULL,
  `delivery_rating` decimal(3,2) DEFAULT NULL,
  PRIMARY KEY (`supplier_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suppliers`
--

LOCK TABLES `suppliers` WRITE;
/*!40000 ALTER TABLE `suppliers` DISABLE KEYS */;
INSERT INTO `suppliers` VALUES (1,'TechParts India','Electronic Components','contact@techparts.com','9876543210',4.50),(2,'PCB Solutions','PCB Boards','sales@pcbsolutions.com','9876543211',4.70),(3,'WireTech Industries','Copper Wire','info@wiretech.com','9876543212',4.20),(4,'SolderPro India','Solder Wire','support@solderpro.com','9876543213',4.60),(5,'ElectroSupply Co','Flux Material','sales@electrosupply.com','9876543214',4.30);
/*!40000 ALTER TABLE `suppliers` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-22 20:16:39
