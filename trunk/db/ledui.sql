-- MySQL dump 10.13  Distrib 5.1.61, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: ledui
-- ------------------------------------------------------
-- Server version	5.1.61-0ubuntu0.10.10.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `t_exif`
--

DROP TABLE IF EXISTS `t_exif`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_exif` (
  `ExifID` int(11) unsigned NOT NULL,
  `Camera` varchar(64) DEFAULT NULL,
  `ExposureTime` int(11) unsigned DEFAULT NULL,
  `Aperture` varchar(20) DEFAULT NULL,
  `ShootMode` varchar(20) DEFAULT NULL,
  `ISO` varchar(8) DEFAULT NULL,
  `FocalLength` varchar(20) DEFAULT NULL,
  `Latitude` varchar(32) NOT NULL DEFAULT '0',
  `Longitude` varchar(32) NOT NULL DEFAULT '0',
  `Altitude` varchar(32) NOT NULL DEFAULT '0',
  `_insertTime` datetime DEFAULT NULL,
  PRIMARY KEY (`ExifID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_exif`
--

LOCK TABLES `t_exif` WRITE;
/*!40000 ALTER TABLE `t_exif` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_exif` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_image`
--

DROP TABLE IF EXISTS `t_image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_image` (
  `ImageFileID` varchar(24) NOT NULL,
  `UserID` int(11) unsigned NOT NULL,
  `ImageFileID128` varchar(20) DEFAULT NULL,
  `ImageFileID256` varchar(20) DEFAULT NULL,
  `ImageFileID512` varchar(20) DEFAULT NULL,
  `ImageFileIDSource` varchar(20) DEFAULT NULL,
  `ImageSourceWidth` varchar(20) DEFAULT NULL,
  `ImageSourceHeight` varchar(20) DEFAULT NULL,
  `ImageType` tinyint(2) DEFAULT NULL,
  `_insertTime` datetime DEFAULT NULL,
  `_updateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ImageFileID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_image`
--

LOCK TABLES `t_image` WRITE;
/*!40000 ALTER TABLE `t_image` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_image` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_mapping_product_image`
--

DROP TABLE IF EXISTS `t_mapping_product_image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_mapping_product_image` (
  `ProductID` int(11) unsigned NOT NULL,
  `ImageFileID` int(11) unsigned NOT NULL DEFAULT '0',
  `ImageOrder` int(11) unsigned DEFAULT NULL,
  `Status` tinyint(2) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`ProductID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_mapping_product_image`
--

LOCK TABLES `t_mapping_product_image` WRITE;
/*!40000 ALTER TABLE `t_mapping_product_image` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_mapping_product_image` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_money`
--

DROP TABLE IF EXISTS `t_money`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_money` (
  `UserID` int(11) unsigned NOT NULL,
  `MoneyCurrency` int(11) unsigned NOT NULL,
  `MoneyCurrent` int(11) unsigned NOT NULL DEFAULT '0',
  `MoneyTotal` int(11) unsigned NOT NULL DEFAULT '0',
  `_version` int(4) unsigned DEFAULT NULL,
  `_insertTime` datetime DEFAULT NULL,
  `_updateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`UserID`,`MoneyCurrency`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_money`
--

LOCK TABLES `t_money` WRITE;
/*!40000 ALTER TABLE `t_money` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_money` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_money_log`
--

DROP TABLE IF EXISTS `t_money_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_money_log` (
  `UserID` int(11) unsigned NOT NULL,
  `MoneyCurrency` int(11) unsigned NOT NULL,
  `MoneyAmount` int(11) unsigned NOT NULL DEFAULT '0',
  `MoneyType` tinyint(2) NOT NULL DEFAULT '1',
  `OrderID` int(11) unsigned NOT NULL,
  `_updateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`UserID`,`MoneyCurrency`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_money_log`
--

LOCK TABLES `t_money_log` WRITE;
/*!40000 ALTER TABLE `t_money_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_money_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_order`
--

DROP TABLE IF EXISTS `t_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_order` (
  `OrderID` int(11) unsigned NOT NULL,
  `TradeNo` varchar(64) DEFAULT NULL,
  `UserID` int(11) unsigned NOT NULL,
  `OrderCost` int(11) unsigned NOT NULL,
  `OrderCurrency` int(11) DEFAULT NULL,
  `TotalPrice` int(11) unsigned NOT NULL DEFAULT '0',
  `ShippingCost` int(11) unsigned NOT NULL DEFAULT '0',
  `Score` int(11) unsigned NOT NULL DEFAULT '0',
  `Address` text,
  `DeliveryType` int(11) DEFAULT '1',
  `InvoiceID` int(4) NOT NULL DEFAULT '0',
  `OrderComment` text,
  `OrderStatus` tinyint(4) NOT NULL DEFAULT '1',
  `OrderSKU` text,
  `_version` varchar(20) DEFAULT NULL,
  `_insertTime` datetime DEFAULT NULL,
  `_updateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`OrderID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_order`
--

LOCK TABLES `t_order` WRITE;
/*!40000 ALTER TABLE `t_order` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_order_content`
--

DROP TABLE IF EXISTS `t_order_content`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_order_content` (
  `OrderID` int(11) unsigned NOT NULL,
  `OrderSource` tinyint(4) DEFAULT NULL,
  `ContentID` int(11) unsigned DEFAULT NULL,
  `ProductPrice` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`OrderID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_order_content`
--

LOCK TABLES `t_order_content` WRITE;
/*!40000 ALTER TABLE `t_order_content` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_order_content` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_postcard`
--

DROP TABLE IF EXISTS `t_postcard`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_postcard` (
  `PostCardID` int(11) unsigned NOT NULL,
  `UserID` int(11) unsigned DEFAULT NULL,
  `ProductID` int(11) unsigned DEFAULT NULL,
  `SourceImageFileID` int(11) unsigned DEFAULT NULL,
  `ClipImageFileID` int(11) unsigned DEFAULT NULL,
  `ClipLeft` varchar(32) DEFAULT NULL,
  `ClipRight` varchar(32) DEFAULT NULL,
  `ClipTop` varchar(32) DEFAULT NULL,
  `ClipBottom` varchar(32) DEFAULT NULL,
  `Latitude` varchar(32) NOT NULL DEFAULT '0',
  `Longitude` varchar(32) NOT NULL DEFAULT '0',
  `IP` int(10) unsigned DEFAULT NULL,
  `Comment` text,
  `Address` varchar(200) DEFAULT NULL,
  `TemplateID` int(11) NOT NULL DEFAULT '0',
  `PostCardStatus` int(2) NOT NULL DEFAULT '1',
  `PostCardPublicType` int(2) DEFAULT NULL,
  `_insertTime` datetime DEFAULT NULL,
  `_updateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`PostCardID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_postcard`
--

LOCK TABLES `t_postcard` WRITE;
/*!40000 ALTER TABLE `t_postcard` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_postcard` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_postcard_template`
--

DROP TABLE IF EXISTS `t_postcard_template`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_postcard_template` (
  `TemplateID` int(11) unsigned NOT NULL,
  `Front` text,
  `Back` text,
  PRIMARY KEY (`TemplateID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_postcard_template`
--

LOCK TABLES `t_postcard_template` WRITE;
/*!40000 ALTER TABLE `t_postcard_template` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_postcard_template` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_postcard_upload_progress`
--

DROP TABLE IF EXISTS `t_postcard_upload_progress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_postcard_upload_progress` (
  `PostCardID` int(11) unsigned NOT NULL DEFAULT '0',
  `TotalSize` int(11) unsigned NOT NULL DEFAULT '0',
  `Uploaded` int(11) unsigned NOT NULL DEFAULT '0',
  `TmpFile` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`PostCardID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_postcard_upload_progress`
--

LOCK TABLES `t_postcard_upload_progress` WRITE;
/*!40000 ALTER TABLE `t_postcard_upload_progress` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_postcard_upload_progress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_product`
--

DROP TABLE IF EXISTS `t_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_product` (
  `ProductID` int(11) unsigned NOT NULL,
  `ProductName` varchar(64) DEFAULT NULL,
  `ProductDesc` text,
  `ProductPrice` int(11) unsigned NOT NULL DEFAULT '0',
  `ProductPriceMarcket` int(11) unsigned NOT NULL DEFAULT '0',
  `ProductScoreLimit` int(11) unsigned NOT NULL DEFAULT '0',
  `ProductCategoryID` int(11) unsigned DEFAULT NULL,
  `ProductType` tinyint(2) unsigned NOT NULL DEFAULT '0',
  `ProductTags` varchar(200) DEFAULT NULL,
  `ProductStatus` tinyint(4) unsigned NOT NULL DEFAULT '1',
  `ProductPublicType` tinyint(4) unsigned NOT NULL DEFAULT '1',
  `ProductImageFielID` int(11) unsigned DEFAULT NULL,
  `_insertTime` datetime DEFAULT NULL,
  `_updateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ProductID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_product`
--

LOCK TABLES `t_product` WRITE;
/*!40000 ALTER TABLE `t_product` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_product_category`
--

DROP TABLE IF EXISTS `t_product_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_product_category` (
  `CategoryID` int(11) unsigned NOT NULL,
  `CategoryParentID` int(11) unsigned NOT NULL DEFAULT '0',
  `CategoryLeftValue` int(11) unsigned DEFAULT NULL,
  `CategoryRightValue` int(11) unsigned DEFAULT NULL,
  `CategoryName` varchar(200) DEFAULT NULL,
  `CategoryOrder` int(11) unsigned NOT NULL DEFAULT '0',
  `CategoryStatus` tinyint(2) NOT NULL DEFAULT '1',
  PRIMARY KEY (`CategoryID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_product_category`
--

LOCK TABLES `t_product_category` WRITE;
/*!40000 ALTER TABLE `t_product_category` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_product_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_score`
--

DROP TABLE IF EXISTS `t_score`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_score` (
  `UserID` int(11) unsigned NOT NULL,
  `ScoreCurrent` int(11) unsigned DEFAULT NULL,
  `ScoreTotal` int(11) unsigned DEFAULT NULL,
  `_version` int(4) unsigned DEFAULT NULL,
  `_insertTime` datetime DEFAULT NULL,
  `_updateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`UserID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_score`
--

LOCK TABLES `t_score` WRITE;
/*!40000 ALTER TABLE `t_score` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_score` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_score_log`
--

DROP TABLE IF EXISTS `t_score_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_score_log` (
  `UserID` int(11) unsigned NOT NULL,
  `Score` int(11) unsigned DEFAULT NULL,
  `RuleID` int(11) unsigned NOT NULL DEFAULT '0',
  `ScoreBefore` int(11) unsigned NOT NULL DEFAULT '0',
  `ScoreAfter` int(11) unsigned NOT NULL DEFAULT '0',
  `_updateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`UserID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_score_log`
--

LOCK TABLES `t_score_log` WRITE;
/*!40000 ALTER TABLE `t_score_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_score_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_score_rule`
--

DROP TABLE IF EXISTS `t_score_rule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_score_rule` (
  `RuleID` int(11) unsigned NOT NULL,
  `RuleName` varchar(32) DEFAULT NULL,
  `RuleScore` int(11) unsigned DEFAULT NULL,
  `RuleStatus` tinyint(2) NOT NULL DEFAULT '1',
  `_insertTime` datetime DEFAULT NULL,
  `_updateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`RuleID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_score_rule`
--

LOCK TABLES `t_score_rule` WRITE;
/*!40000 ALTER TABLE `t_score_rule` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_score_rule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_user`
--

DROP TABLE IF EXISTS `t_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_user` (
  `UserID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `UserAlias` varchar(200) DEFAULT NULL,
  `UserSID` varchar(200) DEFAULT NULL,
  `PartnerID` int(10) unsigned NOT NULL DEFAULT '1',
  `UserPassword` varchar(200) NOT NULL,
  `UserStatus` int(11) unsigned NOT NULL DEFAULT '1',
  `UserEmailVerified` tinyint(4) NOT NULL DEFAULT '-1',
  `UserDesc` text,
  `_version` int(11) unsigned NOT NULL DEFAULT '0',
  `_insertTime` datetime DEFAULT NULL,
  `_updateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `UK` (`UserSID`,`PartnerID`)
) ENGINE=MyISAM AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_user`
--

LOCK TABLES `t_user` WRITE;
/*!40000 ALTER TABLE `t_user` DISABLE KEYS */;
INSERT INTO `t_user` VALUES (1,NULL,'hetao@hetao.name',1,'huoqiabc',1,-1,NULL,0,'2012-08-09 14:54:56','2012-08-09 06:54:56'),(2,NULL,'huzhiliang@youku.com',1,'huzhiliang',1,-1,NULL,0,'2012-08-09 15:53:28','2012-08-09 07:53:28'),(3,NULL,'gonahuabin@tom.com',1,'gonghuabin',1,-1,NULL,0,'2012-08-09 16:48:59','2012-08-09 08:48:59'),(4,NULL,'hetao1@hetao.name',1,'11111111',1,-1,NULL,0,'2012-08-09 17:54:45','2012-08-09 09:54:45'),(5,NULL,'hetao2@hetao.name',1,'11111111',1,-1,NULL,0,'2012-08-09 17:59:42','2012-08-09 09:59:42'),(6,NULL,'11@11.com',1,'11111111',1,-1,NULL,0,'2012-08-11 21:30:10','2012-08-11 13:30:10'),(7,NULL,'111@11.com',1,'11111111',1,-1,NULL,0,'2012-08-11 21:36:57','2012-08-11 13:36:57'),(8,NULL,'1111@11.com',1,'11111111',1,-1,NULL,0,'2012-08-11 21:37:18','2012-08-11 13:37:18'),(9,NULL,'11222211@11.com',1,'11111111',1,-1,NULL,0,'2012-08-12 22:07:05','2012-08-12 14:07:05'),(10,NULL,'1122332211@11.com',1,'11111111',1,-1,NULL,0,'2012-08-12 22:08:22','2012-08-12 14:08:22'),(11,NULL,'ewwq@sdfdf.com',1,'qweqweqwe',1,-1,NULL,0,'2012-08-13 22:59:39','2012-08-13 14:59:39'),(12,NULL,'qwe@qwe.com',1,'qweqweqwe',1,-1,NULL,0,'2012-08-13 23:00:03','2012-08-13 15:00:03'),(13,NULL,'gonghuabin@tom.com',1,'gonghuabin',1,-1,NULL,0,'2012-09-12 10:13:30','2012-09-12 02:13:30'),(14,NULL,'2@a.com',1,'3',1,-1,NULL,0,NULL,'2012-09-12 02:29:13'),(15,NULL,'a@a.com',1,'111',1,-1,NULL,0,NULL,'2012-09-12 02:30:30'),(16,NULL,'jiuxinda@163.com',1,'qfh888',1,-1,NULL,0,'2012-09-14 09:55:21','2012-09-14 01:55:21'),(17,NULL,'bianjunjie@ledui.com',1,'111111',1,-1,NULL,0,NULL,'2012-09-14 09:17:28');
/*!40000 ALTER TABLE `t_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_user_address`
--

DROP TABLE IF EXISTS `t_user_address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_user_address` (
  `AddressID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `UserID` int(11) unsigned NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Country` varchar(30) NOT NULL DEFAULT '0',
  `Address` text,
  `Mobile` varchar(30) DEFAULT NULL,
  `Phone` varchar(30) DEFAULT NULL,
  `Email` varchar(50) DEFAULT NULL,
  `PostCode` varchar(10) DEFAULT NULL,
  `_order` int(11) DEFAULT NULL,
  `Def` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`AddressID`),
  KEY `UserID` (`UserID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_user_address`
--

LOCK TABLES `t_user_address` WRITE;
/*!40000 ALTER TABLE `t_user_address` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_user_address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_user_device`
--

DROP TABLE IF EXISTS `t_user_device`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_user_device` (
  `UserID` int(11) unsigned NOT NULL,
  `DeviceUuid` varchar(64) NOT NULL,
  `DeviceName` varchar(32) DEFAULT NULL,
  `DevicePhoneGap` varchar(32) DEFAULT NULL,
  `DevicePlatform` varchar(32) DEFAULT NULL,
  `DeviceVersion` varchar(32) DEFAULT NULL,
  `_insertTime` datetime DEFAULT NULL,
  `_updateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `DeviceUuid` (`DeviceUuid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_user_device`
--

LOCK TABLES `t_user_device` WRITE;
/*!40000 ALTER TABLE `t_user_device` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_user_device` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_user_profile`
--

DROP TABLE IF EXISTS `t_user_profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_user_profile` (
  `UserID` int(11) unsigned NOT NULL,
  `UserGender` tinyint(2) unsigned NOT NULL DEFAULT '0',
  `UserMobile` varchar(32) NOT NULL DEFAULT '0',
  `UserCardNo` varchar(32) NOT NULL DEFAULT '0',
  `UserCountry` varchar(32) DEFAULT NULL,
  `UserAddress` varchar(250) DEFAULT NULL,
  `UserBirthday` date DEFAULT NULL,
  `UserBirthDayType` tinyint(2) unsigned NOT NULL DEFAULT '1',
  `UserMarrigeStatus` tinyint(2) unsigned NOT NULL DEFAULT '0',
  `UserIncome` tinyint(2) unsigned NOT NULL DEFAULT '0',
  `UserInterest` text,
  `_insertTime` datetime DEFAULT NULL,
  PRIMARY KEY (`UserID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_user_profile`
--

LOCK TABLES `t_user_profile` WRITE;
/*!40000 ALTER TABLE `t_user_profile` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_user_profile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_user_status`
--

DROP TABLE IF EXISTS `t_user_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_user_status` (
  `UserID` int(11) unsigned NOT NULL,
  `UserToken` char(32) NOT NULL DEFAULT '',
  `UserTokenType` varchar(200) NOT NULL DEFAULT '1',
  `UserTokenExpiredTime` int(11) unsigned DEFAULT '0',
  PRIMARY KEY (`UserID`,`UserToken`,`UserTokenType`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_user_status`
--

LOCK TABLES `t_user_status` WRITE;
/*!40000 ALTER TABLE `t_user_status` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_user_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_user_token`
--

DROP TABLE IF EXISTS `t_user_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_user_token` (
  `UserID` int(11) unsigned NOT NULL,
  `UserToken` char(32) NOT NULL,
  `UserTokenType` varchar(200) NOT NULL DEFAULT '1',
  `UserTokenExpiredTime` int(11) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`UserID`,`UserToken`,`UserTokenType`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_user_token`
--

LOCK TABLES `t_user_token` WRITE;
/*!40000 ALTER TABLE `t_user_token` DISABLE KEYS */;
INSERT INTO `t_user_token` VALUES (1,'jk25qiq6qrs6kk30tbgdn2c9v5','1',1376042450),(2,'nkvld3hp9usi1klv1m6k8kg9m0','1',1376034821),(2,'mu9frvt5n1jocev7gll19uafn5','1',1376053528),(8,'gdsmkka8ji88gj8dlahgeoa584','1',1376228260),(8,'2s7smbeur7hosst9nqp8nvekt7','1',1376297109),(8,'42k3e729tjcci1ph5dpgjld5h5','1',1376316448),(12,'5i54fi2ckqojhorb0t5qbmib30','1',1376408044),(2,'b9dn36i275j0h2ia1v8kgrjud1','1',1376447225),(2,'am462fhu7uk60a09bm1hqo5ev2','1',1376470432),(2,'40inp6cvvkhksudftdvae272t5','1',1377678658),(2,'41g5767e57jtb398eujpdimcv1','1',1377702309),(2,'52mtbfosfuslvhshsnqm3hisa5','1',1377788009),(1,'le6h6kee5t54c709o3bgca00q3','2',1348112419),(1,'i7a7fhh1g55r3mohegnlc9i0l4','2',1348112584),(1,'dfsm0v8kg1561gost32kso5qq5','2',1348112646),(1,'1hmiao36v7lvgb482ibekhqef0','2',1348235974),(1,'ft3i7ijaeqasn0ih393753vae0','2',1348236015),(1,'pcjbheh03ek0ta9pnegs6dkl31','2',1348236573),(1,'ah8vh1n20msl7pvm8gjquaj4h2','2',1348236660),(1,'bv07v84d8r6cr4dhm3rvstg9t1','2',1348236671),(1,'6hgt5h71pbd42a0lr0d21ji5q3','2',1348236835),(1,'5t6n2h8pp12nrfhbfo0mpafsi4','2',1348236974),(1,'cphota1t03ord6hpbkigkbh3e2','2',1348237298),(1,'spq5u46hogm4pfa9qjfptuha25','2',1348237609),(1,'4eckfvcuutg5c7pjpsq3r4vnm4','2',1348237639),(1,'bfugfurqukkf0otba1cd59qih6','2',1348237700),(1,'ampmkkgejl8bmujvsf8llppuj3','2',1348237887),(1,'pat94214uhl3tfq1nc55dlsc07','2',1348237894),(1,'u4d99h91u72munk9mrnhoauqh7','2',1348237903),(1,'pchept3fdum6npvn8m1h4l5is7','2',1348238481),(1,'3me87tiegrh2ju5m8vqf670fa3','2',1348239174),(1,'15vddhmqe4tl8sugpt9aps9033','2',1348240550),(1,'dg523c4upn76p193ai7jfm3gt4','2',1348240673),(1,'ojo15cgg82cvrpgd738idm7bm7','2',1348280009),(1,'fabs0vd0egillc5129k71stlc4','2',1348241349),(1,'paqh6bnfgpea01mtrj3i2isl00','2',1348279890),(1,'prm27thi8bv7huc33nm3c28704','2',1348279905),(13,'q4ks8a4jtf44tc9ufgtdnrqe61','1',0),(1,'ips48ip366tljsb6gre5n83nn0','2',1348283445),(1,'b71j01si0qhv6631tfi18lvha5','2',1348283963),(1,'mush1t4g6akmpfeuv0g160rdr4','2',1348299038),(1,'v2c3i0s30ng2h7jde4md0b5nn1','2',1348298928),(1,'nbcoq459ouk2rqqjukh851tag5','2',1348298955),(1,'3poi4oen32qfr3fol16qd8khk1','2',1348298957),(1,'99b6rhqu688gjefd86njrvmok0','2',1348298963),(16,'vtecn9pqem5uti57eom241fbk4','1',0),(1,'vvh4fc35if0bi74357e4gbmkr6','2',1348459796),(1,'7n7uaq5jel7do7uh49k0iddlr1','2',1348459889),(1,'o5a860be0bfujel7gkiota1241','2',1348459939),(17,'ifrsvbup9c15607uohhcsdnos1','2',1348541610),(13,'kf56ligve12hct4j7sq7p0mrt6','1',0),(1,'ihp8a0t71s3clqppu6d9p1a5g5','2',1348660047),(1,'ccsssp9uatp755uor2bii5jtt6','2',1348660151),(1,'v2a8qumeghmtundpauq1noo5t3','2',1348661154),(1,'bp6fqoalltulk2tutu3oh3v8c7','2',1348670454),(1,'cuujtmoum0c5recugn8vfq1cr1','2',1348669648),(1,'ksat772ugpa7kkvame7abn4321','2',1348673889),(1,'2ak3k6bsgmcrh5ar93rdr47jm5','2',1348673677);
/*!40000 ALTER TABLE `t_user_token` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2012-09-17 17:56:57
