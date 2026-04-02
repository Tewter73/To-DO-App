-- --------------------------------------------------------
-- Host:                         
-- Server version:               12.2.2-MariaDB - MariaDB Server
-- Server OS:                    Win64
-- HeidiSQL Version:             12.14.0.7165
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for todo_db
CREATE DATABASE IF NOT EXISTS `todo_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_thai_520_w2 */;
USE `todo_db`;

-- Dumping structure for table todo_db.activity
CREATE TABLE IF NOT EXISTS `activity` (
  `Id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) NOT NULL,
  `When` datetime NOT NULL,
  `UserId` int(10) unsigned NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `FK_activity_user` (`UserId`),
  CONSTRAINT `FK_activity_user` FOREIGN KEY (`UserId`) REFERENCES `user` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_thai_520_w2;

-- Dumping data for table todo_db.activity: ~6 rows (approximately)
INSERT INTO `activity` (`Id`, `Name`, `When`, `UserId`) VALUES
	(1, 'อ่านหนังสือเตรียมสอบ .NET', '2026-04-02 09:00:00', 2),
	(2, 'ไปออกกำลังกายที่ยิม', '2026-04-03 17:30:00', 2),
	(3, 'ส่งโปรเจกต์อาจารย์', '2026-04-08 13:00:00', 2),
	(4, 'ส่งโปรเจกต์อาจารย์ 2', '2026-04-08 13:00:00', 2),
	(5, 'ส่งโปรเจกต์อาจารย์ 3', '2026-04-08 13:00:00', 2),
	(6, 'ไปออกกำลังกายที่ยิม Cu Sport Complex', '2026-04-03 17:30:00', 2);

-- Dumping structure for table todo_db.user
CREATE TABLE IF NOT EXISTS `user` (
  `Id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `NationalId` char(13) NOT NULL,
  `Salt` char(24) NOT NULL,
  `HashedPassword` char(44) NOT NULL,
  `Title` varchar(100) NOT NULL,
  `FirstName` varchar(100) NOT NULL,
  `LastName` varchar(100) NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `NationalId` (`NationalId`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_thai_520_w2;

-- Dumping data for table todo_db.user: ~9 rows (approximately)
INSERT INTO `user` (`Id`, `NationalId`, `Salt`, `HashedPassword`, `Title`, `FirstName`, `LastName`) VALUES
	(1, '1111111111111', 'FJQPHYc1uPwQcJGigTB2fw==', '+/1f7Gyj2jLFXFxwFVtkXdPDTCBQlrBs7UGnUCkUjVE=', 'Mr.', 'Kunanon', 'Sopacharoen'),
	(2, '1234567890123', 'KTB72IRE8GX0yX5scxXVag==', 'T+zD6wLr+OQjgQJdcAdkh5Byaqhb37Pxf6spc5SXQrs=', 'Mr.', 'Kunanon', 'Sopacharoen'),
	(3, 'string', 'WGnbWRKpdavwIUyhbBKfrA==', 'PgFrmrLqkN1mxFN1lQqtrrrP5ZrFwvJI7rzefd2HtK8=', 'string', 'string', 'string'),
	(4, '1234', 'PJlknZi7FTjCdRX1qfpJ+w==', 'lEB9fE/O2bijv0GbZf9fqaHBh9VGnu6JU9XaTMgfWVs=', 'string', 'string', 'string'),
	(5, '9999999999999', 'x1KmbL699rZjB6YByBR95g==', '7bn2Y1/TAM/mP286qs4QxSZ+sd0Ojq53EXppThv6aWc=', 'Ms.', 'Test', 'Todoapp'),
	(6, '8888888888888', 'BIV73+dlzUnsIRyb0/CRYQ==', 'Yxr1F1EUOiLXbAkp8emXGwaHopvuVZSl1Jabi/agpds=', 'Mr.', 'Test2', 'TodoApp'),
	(7, '9888888888888', 'turzTOF2AerigBQL9QnvNw==', '2yA1ruJhEc70JLzCCUavQFXY65WIshTkOZEyzxsf9CI=', 'Mr.', 'Test3', 'TodoApp'),
	(8, '9888888888887', 'PGfkd11miKzgkH9v+n1SXQ==', 'olg9OLG8W17mU3qE2c4fe3Qt3xjO0j15kPnFRp0Dq38=', 'Mr.', 'Test5', 'TodoApp'),
	(9, '6888888888887', 'rCEaho22+s2WcJzI66M77Q==', 'Mnlpl9+bfXWP/A7HNeLwHtj473kykMA2Uc0hj9/UaqY=', 'Mr.', 'Test6', 'TodoApp');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
