-- --------------------------------------------------------
-- Host:                         127.0.0.1
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
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_thai_520_w2;

-- Dumping data for table todo_db.activity: seed rows (NationalId-invalid users และกิจกรรมที่อ้างถึงถูกลบแล้ว)
INSERT INTO `activity` (`Id`, `Name`, `When`, `UserId`) VALUES
	(1, 'อ่านหนังสือเตรียมสอบ .NET', '2026-04-02 09:00:00', 2),
	(2, 'ไปออกกำลังกายที่ยิม', '2026-04-03 17:30:00', 2),
	(3, 'ส่งโปรเจกต์อาจารย์', '2026-04-08 13:00:00', 2),
	(4, 'ส่งโปรเจกต์อาจารย์ 2', '2026-04-08 13:00:00', 2),
	(5, 'ส่งโปรเจกต์อาจารย์ 3', '2026-04-08 13:00:00', 2),
	(6, 'ไปออกกำลังกายที่ยิม Cu Sport Complex', '2026-04-03 17:30:00', 2),
	(9, 'ยกเวท', '2026-04-03 11:52:49', 11),
	(10, 'ติวหนังสือ', '2026-04-04 11:52:49', 11),
	(12, 'อ่านหนังสือเตรียมสอบ', '2026-04-10 10:00:00', 13),
	(20, 'Smoke test activity', '2026-04-17 10:00:00', 19),
	(21, 'Hyrox', '2026-04-20 04:09:43', 20),
	(23, 'Hyrox 3 PUT', '2026-04-23 04:12:13', 20),
	(26, 'Hello Newyear Updated', '2026-04-20 04:25:41', 24),
	(29, 'Test Swagger', '2026-04-17 03:02:30', 24),
	(31, 'Hi ครับบบ', '2026-04-27 16:30:57', 25),
	(32, 'Test 1234', '2026-04-24 09:19:02', 25),
	(33, 'Test ย้อน', '2026-04-26 00:19:08', 25),
	(34, 'Test Date', '2026-04-30 00:37:28', 25),
	(35, 'Test Future', '2026-04-30 07:37:44', 25),
	(36, 'Shooting Updated', '2026-04-19 02:40:37', 27),
	(37, 'Run Club 2', '2026-02-05 00:47:52', 27),
	(38, 'Do Proposal Project', '2026-05-02 16:55:05', 27),
	(40, 'Tiktok Pro Max', '2026-06-16 05:39:00', 30),
	(41, 'Facebook', '2026-04-20 03:39:00', 30),
	(43, 'ดำหดหก', '2026-04-20 22:50:10', 25);

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
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_thai_520_w2;

-- Dumping data for table todo_db.user: seed rows (ลบแถวที่ NationalId ไม่ครบ 13 หลัก / ไม่ใช่เลขบัตรประชาชน)
INSERT INTO `user` (`Id`, `NationalId`, `Salt`, `HashedPassword`, `Title`, `FirstName`, `LastName`) VALUES
	(1, '1111111111111', 'FJQPHYc1uPwQcJGigTB2fw==', '+/1f7Gyj2jLFXFxwFVtkXdPDTCBQlrBs7UGnUCkUjVE=', 'Mr.', 'Kunanon', 'Sopacharoen'),
	(2, '1234567890123', 'KTB72IRE8GX0yX5scxXVag==', 'T+zD6wLr+OQjgQJdcAdkh5Byaqhb37Pxf6spc5SXQrs=', 'Mr.', 'Kunanon', 'Sopacharoen'),
	(5, '9999999999999', 'x1KmbL699rZjB6YByBR95g==', '7bn2Y1/TAM/mP286qs4QxSZ+sd0Ojq53EXppThv6aWc=', 'Ms.', 'Test', 'Todoapp'),
	(6, '8888888888888', 'BIV73+dlzUnsIRyb0/CRYQ==', 'Yxr1F1EUOiLXbAkp8emXGwaHopvuVZSl1Jabi/agpds=', 'Mr.', 'Test2', 'TodoApp'),
	(7, '9888888888888', 'turzTOF2AerigBQL9QnvNw==', '2yA1ruJhEc70JLzCCUavQFXY65WIshTkOZEyzxsf9CI=', 'Mr.', 'Test3', 'TodoApp'),
	(8, '9888888888887', 'PGfkd11miKzgkH9v+n1SXQ==', 'olg9OLG8W17mU3qE2c4fe3Qt3xjO0j15kPnFRp0Dq38=', 'Mr.', 'Test5', 'TodoApp'),
	(9, '6888888888887', 'rCEaho22+s2WcJzI66M77Q==', 'Mnlpl9+bfXWP/A7HNeLwHtj473kykMA2Uc0hj9/UaqY=', 'Mr.', 'Test6', 'TodoApp'),
	(10, '1111111111112', 'hxt6tObemdT8rHw3LhX+6w==', 'IxChmifcrAutloxL7nlq8/DYR7S3uYsRi/r8D4wJlXE=', 'Ms.', 'Testuser10', 'Todoweb'),
	(11, '1100700123456', '6GM/uFGamKegC8aaPXjF3w==', 'xzmpowtnZuumx0s4ubUXnjhkKInODWbcpiFf66toIek=', '', 'สมชาย', 'ใจดี'),
	(12, '1179900459435', 's8EfjwV7AjH96KagLah6+g==', 'OiyxoNxz48O2sl5XocWOTyNaVkRejZfiX/QvekFT0qQ=', 'Mr.', 'Kunanon', 'Sopacharoen'),
	(13, '1179900459567', 'KFLdXYnJ1pvnthvnXBd4Vw==', 'knfVEu/pEChOnmv6WVELLV9IdXWENCClnwnazcNXEdc=', 'Mr.', 'Testnew', 'Goodapp'),
	(14, '3333333333333', 'Q0w4346jnz7Ym+I1pqcXaw==', '0Cu3boe9p3BLtlIwZsWt3pxBVi2hVrmidN/8VwOrbQY=', 'Mr.', 'Hallo', 'GGWP'),
	(15, '1179900459456', 'RWfK5GZ9qirkKQyX1b6fpQ==', 'MbjKNUWzCd2zqosXNVxPT94zfCsdTc1RVyYiQ3CzvoE=', 'Mr.', 'Testnew', 'Goodapp'),
	(17, '7894561233214', 'Y1PfkvAXo6xeM8/g8SN/gg==', 'Nvu+2K1riLADlGB0itB1b6G9QOszq4HVueAA40uU2ZE=', 'Ms.', 'Papa', 'Mama'),
	(19, '9999999900011', 'GKcv8uIIfnOVTAeul46vcg==', 'hCfvFkq/8ZEeKOVYnX8OiFTEM1y+bsL56WuvGH9gf30=', 'Mr.', 'Db', 'Check'),
	(20, '1455673456789', 'NaquJ+T3kzqRBpDBZhw4Fg==', 'lF+PltNHeMp4RlA2J8S8gSVwbJH9JJd96vdbywANqcQ=', 'Ms.', 'Chanon', 'Wongpojanee'),
	(21, '9900117764014', 'zE5tu7XWMRUP0d8aucJOYA==', 'YjKnjAX/ahmOszXNqtbeDoPTn6AFDKQ4H+HDbE+1B1k=', 'Mr.', 'E2E', 'Flow'),
	(24, '1223344556677', 'UvYFeKvwCR6G3o00Oio5DQ==', 'bLjM/cavxK7HC3R0ZlwVX5tNyKW+tCXztK6Mh6009g4=', 'Mr.', 'Supakorn', 'Muattia'),
	(25, '1223344556678', 'mDwv63pdofQCtbSAKW0aHQ==', 'e8Ie79SLV6SZyP18dhqey1pqKiz0W+J/trirWEhkPkw=', 'Mrs.', 'Pattaraphorn', 'Meedumnuen'),
	(26, '1223344556679', 'O9kave8f1FqN39apfD7RKw==', 'UUtCWsDObxAu3ZGFLgRFZ8KIVhX95Ye2S0Ar/r263RI=', 'Mr.', 'Testy', 'asdfa'),
	(27, '2323232323232', '9kTjAtaa01Ivwqy6faO+Ag==', 'PPFvwQSSJqrhnyOQ8AhQCqlw5bpfP0DUTbMhyjaUXFM=', 'Mrs.', 'Viroj', 'Kaokai'),
	(28, '1112223334445', 'lj/8Vfs6d8Qz3eD6hXPe+g==', 'le8KFWTI/cUogUjKefnraH4GrwF0asUk5RDXY9Wg3Rw=', 'Mr.', 'Jiroj', 'Ayanokoji'),
	(29, '1122334455123', 'oDWU2/UNH/OL/CZtvX2fPw==', 'Y8CKt/wGzFz2T1HTl/quWc16S06hlwaibE1L2yAm/iw=', 'Mr.', 'Ayanokoji', 'Jiroj'),
	(30, '1112223334444', 'SqoQvRn3FQoSL+//lFZxLg==', 'ksO0ujBOOst7vzuSPiT0MJWQelCpGPZqbZS++WQoxBs=', 'Mr.', 'Huawei', 'Vivo');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
