-- MySQL dump 10.13  Distrib 8.0.27, for macos11 (x86_64)
--
-- Host: 127.0.0.1    Database: bajajHMS
-- ------------------------------------------------------
-- Server version	8.0.28

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cities`
--

DROP TABLE IF EXISTS `cities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `stateId` int NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `stateFk_idx` (`stateId`),
  CONSTRAINT `stateFk` FOREIGN KEY (`stateId`) REFERENCES `state` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cities`
--

LOCK TABLES `cities` WRITE;
/*!40000 ALTER TABLE `cities` DISABLE KEYS */;
INSERT INTO `cities` VALUES (1,1,'Kolkata');
/*!40000 ALTER TABLE `cities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hotel_pics`
--

DROP TABLE IF EXISTS `hotel_pics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hotel_pics` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uploadedBy` int unsigned NOT NULL,
  `hotelId` int DEFAULT NULL,
  `url` varchar(45) DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `uploaderId_idx` (`uploadedBy`),
  KEY `hotel_id_idx` (`hotelId`),
  CONSTRAINT `hotel_id` FOREIGN KEY (`hotelId`) REFERENCES `hotels` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `uploaderId` FOREIGN KEY (`uploadedBy`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hotel_pics`
--

LOCK TABLES `hotel_pics` WRITE;
/*!40000 ALTER TABLE `hotel_pics` DISABLE KEYS */;
INSERT INTO `hotel_pics` VALUES (11,18,2,'https://anna12e3.com/go43odho4te3l.jpg','2022-06-02 11:26:46'),(12,18,2,'https://anhbhbna12e3.com/go43odho4te3l.jpg','2022-06-02 11:27:03'),(13,18,2,'https://anhbuhbna12e3.com/go43odho4te3l.jpg','2022-06-02 12:14:36'),(14,18,2,'https://anhbuhbna12e3.com/go43odho4te3l.jpg','2022-06-02 12:14:39'),(15,18,2,'https://anhbuhbna12e3.com/go43odho4te3l.jpg','2022-06-02 12:14:41'),(16,18,2,'https://anhbuhbna12e3.com/go43odho4te3l.jpg','2022-06-02 13:25:32');
/*!40000 ALTER TABLE `hotel_pics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hotel_room_types`
--

DROP TABLE IF EXISTS `hotel_room_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hotel_room_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(45) NOT NULL,
  `description` text,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hotel_room_types`
--

LOCK TABLES `hotel_room_types` WRITE;
/*!40000 ALTER TABLE `hotel_room_types` DISABLE KEYS */;
INSERT INTO `hotel_room_types` VALUES (1,'Standard room','a standard room is likely the same as a queen or a single room, great for a solo traveler or a couple. Expect a double bed. ','2022-06-01 16:53:42','2022-06-01 16:53:42'),(2,'Deluxe room','these rooms might be a bit bigger with slightly upgraded amenities or a nicer view. These rooms are typically equipped for groups who need more space, like a couple or small family. ','2022-06-01 16:53:42','2022-06-01 16:53:42'),(3,'Suite','suites come in a few different sizes. A basic suite or executive suite comes with a separate living space connected to one or more bedrooms. This set up is sometimes also called a master suite. A mini-suite or junior suite refers to a single room with a bed and sitting area. Some suites also come with kitchenettes. The presidential suite, as the name would suggest, is usually the most expensive room provided by a hotel. It will have one or more bedrooms, a living space, and impressive amenities, decoration, and tailor-made services. ','2022-06-01 16:53:42','2022-06-01 16:53:42'),(4,'Villa','most villas can be found at resorts. These kinds of rooms are actually stand-alone houses that have extra space and privacy. Villas typically come equipped with multiple bedrooms, a living room, a swimming pool, and a balcony.','2022-06-01 16:53:42','2022-06-01 16:53:42');
/*!40000 ALTER TABLE `hotel_room_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hotel_rooms`
--

DROP TABLE IF EXISTS `hotel_rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hotel_rooms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `hotel_id` int NOT NULL,
  `room_type_id` int DEFAULT NULL,
  `rooms_available` int DEFAULT NULL,
  `facilities` enum('ACKO','NOACKO') DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `price` decimal(10,0) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `hotel_fk_id_idx` (`hotel_id`),
  CONSTRAINT `hotel_fk_id` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hotel_rooms`
--

LOCK TABLES `hotel_rooms` WRITE;
/*!40000 ALTER TABLE `hotel_rooms` DISABLE KEYS */;
INSERT INTO `hotel_rooms` VALUES (1,2,1,10,'ACKO','2022-06-02 08:18:54','2022-06-02 08:18:54',987),(2,2,3,16,'ACKO','2022-06-02 12:26:00','2022-06-02 12:26:00',987),(3,2,2,16,'ACKO','2022-06-02 12:26:09','2022-06-02 12:26:09',987);
/*!40000 ALTER TABLE `hotel_rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hotels`
--

DROP TABLE IF EXISTS `hotels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hotels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `adminId` int NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `cityId` int DEFAULT NULL,
  `stateId` int DEFAULT NULL,
  `addrLine1` varchar(45) NOT NULL,
  `addrLine2` varchar(45) DEFAULT NULL,
  `zip_code` int DEFAULT NULL,
  `isApproved` tinyint NOT NULL DEFAULT '0',
  `isActive` tinyint NOT NULL DEFAULT '0',
  `brandPic` varchar(45) DEFAULT NULL,
  `lat` varchar(45) DEFAULT NULL,
  `long` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  KEY `adminFk_idx` (`adminId`),
  KEY `cityId_idx` (`cityId`),
  KEY `stateId_idx` (`stateId`),
  CONSTRAINT `cityId` FOREIGN KEY (`cityId`) REFERENCES `cities` (`id`),
  CONSTRAINT `stateId` FOREIGN KEY (`stateId`) REFERENCES `state` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hotels`
--

LOCK TABLES `hotels` WRITE;
/*!40000 ALTER TABLE `hotels` DISABLE KEYS */;
INSERT INTO `hotels` VALUES (2,18,'Annapurna','annapurna@gmail.com','2022-06-02 06:55:18','2022-06-02 06:55:18',1,1,'Ha street','near gopal enclave',600079,1,1,'','60.008','-179.00'),(7,18,'Annapurna2 grand','annapurnagrand@gmail.com','2022-06-02 06:59:17','2022-06-02 06:59:17',1,1,'Ha street','near gopal enclave',600079,1,1,'','60.008','-179.00');
/*!40000 ALTER TABLE `hotels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservations`
--

DROP TABLE IF EXISTS `reservations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `check_in` date NOT NULL,
  `check_out` date NOT NULL,
  `room_id` int NOT NULL,
  `no_of_guest` int NOT NULL DEFAULT '1',
  `no_of_rooms` int NOT NULL DEFAULT '1',
  `reserved_by` int unsigned NOT NULL,
  `is_canceled` tinyint NOT NULL DEFAULT '0',
  `checkedin` tinyint NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `reserced_by_fk_idx` (`reserved_by`),
  KEY `room_id_idx` (`room_id`),
  CONSTRAINT `reserced_by_fk` FOREIGN KEY (`reserved_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `room_id` FOREIGN KEY (`room_id`) REFERENCES `hotel_rooms` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservations`
--

LOCK TABLES `reservations` WRITE;
/*!40000 ALTER TABLE `reservations` DISABLE KEYS */;
INSERT INTO `reservations` VALUES (1,'2022-06-03','2022-06-06',2,2,4,11,1,0,'2022-06-03 03:16:05','2022-06-03 03:16:05'),(2,'2022-06-03','2022-06-06',2,3,4,11,0,1,'2022-06-03 03:16:59','2022-06-03 03:16:59');
/*!40000 ALTER TABLE `reservations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `state`
--

DROP TABLE IF EXISTS `state`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `state` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `state`
--

LOCK TABLES `state` WRITE;
/*!40000 ALTER TABLE `state` DISABLE KEYS */;
INSERT INTO `state` VALUES (1,'West Bengal');
/*!40000 ALTER TABLE `state` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `prefix` enum('MR','MRS','Ms','MISS') DEFAULT NULL,
  `firstName` varchar(45) DEFAULT NULL,
  `lastName` varchar(45) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `email` varchar(45) NOT NULL,
  `passwordHash` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `isActive` tinyint DEFAULT '1',
  `roleCode` enum('NU','HM') DEFAULT 'NU',
  `profilePic` varchar(45) DEFAULT NULL,
  `cityId` int DEFAULT NULL,
  `stateId` int DEFAULT NULL,
  `zip_code` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `state_fk_idx` (`stateId`),
  KEY `cityId_fk_idx` (`cityId`),
  KEY `city_id_fk_idx` (`cityId`),
  CONSTRAINT `city_id_fk` FOREIGN KEY (`cityId`) REFERENCES `cities` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `stateId_fk` FOREIGN KEY (`stateId`) REFERENCES `state` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (11,'MR','Nilanjan','Majumdar','2001-05-18','n.majumder14@gmail.com','$2b$10$T/LfpKNbiCeULARGMCzbHe/jcOKwqMRx0BricfpTP8K4NHhDAjpIa','2022-05-26 16:37:45','2022-05-26 16:37:45',1,'NU','https://picsum.photos/200/300',1,1,700079),(14,'MR','Nilanjan','Majumdar','2001-05-18','n.majumder134@gmail.com','$2b$10$f4ajjI0dnJBSX.4LNl9qUelKktrN/8VzNbjdcTYY91SnpiyTPat8a','2022-05-26 16:44:17','2022-05-26 16:44:17',1,'NU','https://picsum.photos/200/300',1,1,700079),(15,'MR','Nilanjan','Majumdar','2001-05-18','n.majumder134d@gmail.com','$2b$10$72uMhFOmhZfTProzuBdMauRTXIl4Vflc6FBbXdZWaUrZFKAM4Xswm','2022-05-27 09:29:03','2022-05-27 09:29:03',1,'NU','https://picsum.photos/200/300',1,1,700079),(17,'MR','Nilanjan','Majumdar','2001-05-18','n.majumder134@gmail.com','$2b$10$s3iZACCV6QO.SRrTMrv03ekgdHtiEz6Kdw8gG3nkUJWnlewWRqV/q','2022-06-01 16:43:45','2022-06-01 16:43:45',1,'HM','https://picsum.photos/200/300',1,1,700079),(18,'MR','Nilanjan','Majumdar','2001-05-18','n.majumder1343@gmail.com','$2b$10$SGqyYzOVEGl9R9J5TYCLjeG5QwUSDIKyAzFBQ7m.RnAVNmH6rDNnm','2022-06-01 16:44:18','2022-06-01 16:44:18',1,'HM','https://picsum.photos/200/300',1,1,700079),(19,'MR','Nilanjan','Majumdar','2001-05-18','n.majumder13e4d@gmail.com','$2b$10$P6DA8CdvQyFfvXZUqi9JAelbFUYOEKVRhRauqFCgKbWaoQVFZeyD.','2022-06-03 03:13:37','2022-06-03 03:13:37',1,'NU','https://picsum.photos/200/300',1,1,700079);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-06-03 12:40:57
