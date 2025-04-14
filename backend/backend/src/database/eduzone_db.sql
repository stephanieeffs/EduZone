-- MySQL dump 10.13  Distrib 8.4.4, for Win64 (x86_64)
--
-- Host: localhost    Database: eduzone_db
-- ------------------------------------------------------
-- Server version	8.4.4

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
-- Table structure for table `books`
--

DROP TABLE IF EXISTS `books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `books` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `author` varchar(255) NOT NULL,
  `category` varchar(50) NOT NULL,
  `quantity` int NOT NULL DEFAULT '0',
  `available` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `grade` int DEFAULT NULL,
  `isbn` varchar(13) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `books`
--

LOCK TABLES `books` WRITE;
/*!40000 ALTER TABLE `books` DISABLE KEYS */;
INSERT INTO `books` VALUES (22,'Grade One Integrated Language Arts Workbook','Lunett Fearon','Language Arts',5,5,'2025-04-14 02:18:26',1,'9789761001001'),(23,'Integrated Reader (Grade 1)','L. Fearon, M. McLean, M. Miles & C. Campbell','Language Arts',5,5,'2025-04-14 02:18:26',1,'9789761001002'),(24,'Grade One Integrated Mathematics Workbook','Maureen McLean and Lunett Fearon','Mathematics',5,5,'2025-04-14 02:18:26',1,'9789761001003'),(25,'Grade One Integrated Studies Workbook: Home, School, Environment With Colours, Shapes And Sounds','Lunett Fearon, Maxine Miles, Carlene Campbell','Integrated Studies',5,5,'2025-04-14 02:18:26',1,'9789761001004'),(26,'Grade Two Language Arts Workbook Steps to PEP','Maureen McLean & Lunett Fearon','Language Arts',5,5,'2025-04-14 02:18:26',2,'9789762002001'),(27,'Integrated Reader (Grade 2)','Maureen McLean','Language Arts',5,5,'2025-04-14 02:18:26',2,'9789762002002'),(28,'Grade Two Integrated Mathematics Workbook','M. Miles, C. Campbell, M. McLean, L. Fearon','Mathematics',5,5,'2025-04-14 02:18:26',2,'9789762002003'),(29,'Integrated Studies Workbook: People, Places and Things in my Community','M. McLean','Integrated Studies',5,5,'2025-04-14 02:18:26',2,'9789762002004'),(30,'Sunbeam Integrated Language Arts Workbook','C. Campbell & M. Miles','Language Arts',5,5,'2025-04-14 02:18:26',3,'9789768237531'),(31,'Macmillan Primary Integrated Reading Scheme for Jamaica - Reggae Readers','Louis Fidge & Sue Graves','Language Arts',5,5,'2025-04-14 02:18:26',3,'9781405059872'),(32,'Jamaica Primary Mathematics Grade 3','Lisa Greenstein','Mathematics',5,5,'2025-04-14 02:18:26',3,'9789766482321'),(33,'Gateway to Numeracy','Unknown','Mathematics',5,5,'2025-04-14 02:18:26',4,'9789768245673'),(34,'Carlong Integrated Assessment Mathematics','Hyacinth Bennett','Mathematics',5,5,'2025-04-14 02:18:26',4,'9789766382171'),(35,'Jamaica Primary Social Studies Student\'s Book 4 (3rd Edition)','Eulie Manto, Trineta Fendall & Clare Eastland','Social Studies',5,5,'2025-04-14 02:18:26',4,'9789768277490'),(36,'Jamaica Primary Social Studies Student\'s Book 5 (3rd Edition)','Eulie Manto, Trineta Fendall & Clare Eastland','Social Studies',5,5,'2025-04-14 02:18:26',5,'9789768277506'),(37,'Primary Science for the National Standards Curriculum Mission: Science Student\'s Book 5, 2nd Edition','Terry Hudson & Debbie Roberts','Science',5,5,'2025-04-14 02:18:26',5,'9789768277513'),(38,'Language Tree Jamaica 3rd Edition Workbook 6','Leonie Bennett et al.','Language Arts',5,5,'2025-04-14 02:18:26',6,'9789766006001'),(39,'Rainbow Readers: A Jamaican Reading Series Grade 6 New NSC Edition','Roma Sinanan, Uriel Narinesingh, Charlene Sinanan-Hansraj','Language Arts',5,5,'2025-04-14 02:18:26',6,'9789766006002'),(40,'Grade 6 New Integrated Mathematics for PEP','L. Chamer, V. Dixon, S. Jackson','Mathematics',5,5,'2025-04-14 02:18:26',6,'9789766006003');
/*!40000 ALTER TABLE `books` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `calendar_events`
--

DROP TABLE IF EXISTS `calendar_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `calendar_events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `date` date NOT NULL,
  `type` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `calendar_events`
--

LOCK TABLES `calendar_events` WRITE;
/*!40000 ALTER TABLE `calendar_events` DISABLE KEYS */;
/*!40000 ALTER TABLE `calendar_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedback` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(50) NOT NULL,
  `text` text NOT NULL,
  `user_id` int DEFAULT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  `status` enum('Pending','Reviewed') DEFAULT 'Pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback`
--

LOCK TABLES `feedback` WRITE;
/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;
INSERT INTO `feedback` VALUES (2,'Complaint','The service was slow.',1,'John Doe','Reviewed','2025-04-10 07:11:54');
/*!40000 ALTER TABLE `feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `forms`
--

DROP TABLE IF EXISTS `forms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `forms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `category` varchar(50) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `file_size` int NOT NULL,
  `download_count` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `forms`
--

LOCK TABLES `forms` WRITE;
/*!40000 ALTER TABLE `forms` DISABLE KEYS */;
INSERT INTO `forms` VALUES (1,'Feedback Form','A form for submitting feedback','Feedback','/uploads/feedback_form.pdf',2048,1,'2025-04-10 23:33:50'),(3,'Student Registration','A form for a new student','Adminiistrative','/uploads/1744329610712.pdf',627325,0,'2025-04-11 00:00:10'),(4,'Student Registration','A form for a new student','Adminiistrative','/uploads/1744330366628.pdf',3343090,0,'2025-04-11 00:12:46'),(6,'Field Trip Permission Slip','A permission slip for a student','Permission','/uploads/1744599031233.pdf',153227,0,'2025-04-14 02:50:31'),(7,'Medical','a form used for gathering medical information','Health Form','/uploads/1744599116402.pdf',160887,0,'2025-04-14 02:51:56'),(8,'Registration Form','used to collect personal information, academic details, and consent for students or participants who are joining a program, course, or activity.\n\n','Registration','/uploads/1744599202800.pdf',109546,0,'2025-04-14 02:53:22'),(9,'Lesson Plan',' are used by educators to outline the content, objectives, and methods of instruction for a specific lesson.\n','Teaching Material','/uploads/1744599275905.pdf',160279,0,'2025-04-14 02:54:35'),(10,'Library Card application','.allow users to apply for library cards through the system, and could be managed by the library staff. ','Library','/uploads/1744599351673.pdf',83326,0,'2025-04-14 02:55:51');
/*!40000 ALTER TABLE `forms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staff`
--

DROP TABLE IF EXISTS `staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `staff` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `position` varchar(100) NOT NULL,
  `department` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `imagefilepath` varchar(255) NOT NULL,
  `bio` text NOT NULL,
  `role` enum('admin','staff','librarian') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff`
--

LOCK TABLES `staff` WRITE;
/*!40000 ALTER TABLE `staff` DISABLE KEYS */;
INSERT INTO `staff` VALUES (1,'Dr. Sarah Johnson','Principal','Administration','sarah.johnson@fps.edu','(555) 123-4567','/public/images/school-logo.png','Dr. Johnson has been the principal of Frankfield Primary & Infant School for 10 years. She holds a Ph.D. in Educational Leadership and is committed to providing quality education for all students.','admin','2025-04-14 03:54:24'),(2,'Mr. James Wilson','Vice Principal','Administration','james.wilson@fps.edu','(555) 123-4568','/public/images/school-logo.png','Mr. Wilson has been with the school for 8 years. He specializes in student discipline and parent communication.','admin','2025-04-14 03:54:24'),(3,'Ms. Emily Rodriguez','Grade 1 Teacher','Teaching','emily.rodriguez@fps.edu','(555) 123-4569','/public/images/school-logo.png','Ms. Rodriguez has been teaching for 5 years. She has a passion for early childhood education and creating engaging learning environments.','staff','2025-04-14 03:54:24'),(4,'Mr. David Chen','Grade 2 Teacher','Teaching','david.chen@fps.edu','(555) 123-4570','/public/images/school-logo.png','Mr. Chen has been teaching for 7 years. He specializes in mathematics education and incorporates technology into his lessons.','staff','2025-04-14 03:54:24'),(5,'Ms. Lisa Thompson','Grade 3 Teacher','Teaching','lisa.thompson@fps.edu','(555) 123-4571','/public/images/school-logo.png','Ms. Thompson has been teaching for 9 years. She has a background in special education and is dedicated to inclusive teaching practices.','staff','2025-04-14 03:54:24'),(6,'Ms. Maria Santos','Grade 4 Teacher','Teaching','maria.santos@fps.edu','(555) 123-4577','/public/images/school-logo.png','Ms. Santos has been teaching for 6 years. She specializes in language arts and creates an inclusive classroom environment.','staff','2025-04-14 03:54:24'),(7,'Mr. John Parker','Grade 5 Teacher','Teaching','john.parker@fps.edu','(555) 123-4578','/public/images/school-logo.png','Mr. Parker has been teaching for 10 years. He focuses on project-based learning and STEM education.','staff','2025-04-14 03:54:24'),(8,'Ms. Rachel Green','Grade 6 Teacher','Teaching','rachel.green@fps.edu','(555) 123-4579','/public/images/school-logo.png','Ms. Green has been teaching for 8 years. She excels in preparing students for their transition to secondary education.','staff','2025-04-14 03:54:24'),(9,'Dr. Michael Chang','Special Education Teacher','Teaching','michael.chang@fps.edu','(555) 123-4582','/public/images/school-logo.png','Dr. Chang has been in special education for 15 years. He develops individualized learning plans and provides support for students with diverse needs.','staff','2025-04-14 03:54:24'),(10,'Mr. Christopher Lee','Science Teacher','Teaching','christopher.lee@fps.edu','(555) 123-4584','/public/images/school-logo.png','Mr. Lee has been teaching science for 8 years. He makes science fun and engaging through hands-on experiments and real-world applications.','staff','2025-04-14 03:54:24'),(11,'Mr. Michael Brown','Physical Education Teacher','Specialist','michael.brown@fps.edu','(555) 123-4572','/public/images/school-logo.png','Mr. Brown has been teaching PE for 6 years. He is a former athlete and promotes healthy living and physical activity among students.','staff','2025-04-14 03:54:24'),(12,'Ms. Patricia Lee','Art Teacher','Specialist','patricia.lee@fps.edu','(555) 123-4573','/public/images/school-logo.png','Ms. Lee has been teaching art for 8 years. She has a background in fine arts and encourages creative expression in her students.','staff','2025-04-14 03:54:24'),(13,'Mr. Kevin Williams','Music Teacher','Specialist','kevin.williams@fps.edu','(555) 123-4580','/public/images/school-logo.png','Mr. Williams has been teaching music for 12 years. He leads the school band and choir programs.','staff','2025-04-14 03:54:24'),(14,'Ms. Sarah Martinez','ESL Teacher','Specialist','sarah.martinez@fps.edu','(555) 123-4581','/public/images/school-logo.png','Ms. Martinez has been teaching ESL for 7 years. She helps students develop strong English language skills while celebrating their cultural diversity.','staff','2025-04-14 03:54:24'),(15,'Mr. Robert Garcia','Librarian','Support','robert.garcia@fps.edu','(555) 123-4574','/public/images/school-logo.png','Mr. Garcia has been the school librarian for 5 years. He has a Master\'s in Library Science and is passionate about promoting literacy.','librarian','2025-04-14 03:54:24'),(16,'Ms. Jennifer White','School Nurse','Support','jennifer.white@fps.edu','(555) 123-4575','/public/images/school-logo.png','Ms. White has been the school nurse for 7 years. She has a background in pediatric nursing and ensures the health and safety of all students.','staff','2025-04-14 03:54:24'),(17,'Mr. Thomas Anderson','IT Specialist','Support','thomas.anderson@fps.edu','(555) 123-4576','/public/images/school-logo.png','Mr. Anderson has been the IT specialist for 4 years. He manages the school\'s technology infrastructure and provides technical support.','staff','2025-04-14 03:54:24'),(18,'Ms. Amanda Foster','Guidance Counselor','Support','amanda.foster@fps.edu','(555) 123-4583','/public/images/school-logo.png','Ms. Foster has been a guidance counselor for 9 years. She provides academic and emotional support to students and their families.','staff','2025-04-14 03:54:24');
/*!40000 ALTER TABLE `staff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teachers`
--

DROP TABLE IF EXISTS `teachers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teachers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `subject` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teachers`
--

LOCK TABLES `teachers` WRITE;
/*!40000 ALTER TABLE `teachers` DISABLE KEYS */;
INSERT INTO `teachers` VALUES (1,'Jane Doe','Mathematics','jane.doe@example.com','8764557899','2025-04-14 02:59:48');
/*!40000 ALTER TABLE `teachers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','teacher','student','parent','librarian') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Jane Doe','jane.doe@example.com','securepassword123','teacher','2025-04-10 04:27:12'),(4,'Test Admin','admin2@eduzone.com','$2a$10$IqKyLZluKlSE7kpWbxdtU.U7Tl5GV5YDoAeLCKpmlCUjpZRDGXCBW','admin','2025-04-10 06:40:04'),(5,'Admin','admin@eduzone.com','$2a$10$gooDhQQjxUkz0GO/Vtljtuq0WFNWRInqBXHgEik4hDMRRPUxrxQ46','admin','2025-04-10 06:42:54'),(6,'Lana Booksworth','librarian@eduzone.com','$2a$10$z5QeNpDnxrrDNH3lJyiuf.UfoziJIqc/ehl3ZyVQxQuI..ZDuHiTe','librarian','2025-04-10 06:47:26');
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

-- Dump completed on 2025-04-13 23:23:48
