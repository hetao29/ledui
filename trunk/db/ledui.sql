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
  `ImageFileID` varchar(24) NOT NULL DEFAULT '',
  `Camera` varchar(64) DEFAULT NULL,
  `ExposureTime` int(11) unsigned DEFAULT NULL,
  `Aperture` varchar(20) DEFAULT NULL,
  `ShootMode` varchar(20) DEFAULT NULL,
  `ISO` varchar(8) DEFAULT NULL,
  `FocalLength` varchar(20) DEFAULT NULL,
  `Latitude` varchar(32) NOT NULL DEFAULT '0',
  `Longitude` varchar(32) NOT NULL DEFAULT '0',
  `Altitude` varchar(32) NOT NULL DEFAULT '0',
  `ExifData` text,
  `_insertTime` datetime DEFAULT NULL,
  PRIMARY KEY (`ImageFileID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

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
-- Table structure for table `t_money`
--

DROP TABLE IF EXISTS `t_money`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_money` (
  `UserID` int(11) unsigned NOT NULL,
  `MoneyCurrent` int(11) unsigned NOT NULL DEFAULT '0',
  `MoneyUsedTotal` int(10) unsigned DEFAULT '0',
  `_version` int(4) unsigned DEFAULT NULL,
  `_insertTime` datetime DEFAULT NULL,
  `_updateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`UserID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `t_money_log`
--

DROP TABLE IF EXISTS `t_money_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_money_log` (
  `UserID` int(11) unsigned NOT NULL,
  `OrderID` int(10) unsigned DEFAULT NULL,
  `MoneyAmount` int(11) unsigned NOT NULL DEFAULT '0',
  `ActualMoneyCurrency` tinyint(4) NOT NULL,
  `ActualMoneyAmount` int(11) unsigned NOT NULL DEFAULT '1',
  `ActualMoneyExchangeRate` double NOT NULL DEFAULT '1',
  `MoneyType` tinyint(4) NOT NULL,
  `_updateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`UserID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `t_order`
--

DROP TABLE IF EXISTS `t_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_order` (
  `OrderID` int(11) NOT NULL AUTO_INCREMENT,
  `TradeNo` varchar(64) DEFAULT NULL,
  `UserID` int(11) unsigned NOT NULL,
  `ActualMoneyAmount` int(10) unsigned DEFAULT NULL,
  `ActualMoneyCurrency` varchar(5) DEFAULT NULL,
  `ActualMoneyExchangeRate` double DEFAULT NULL,
  `OrderAmount` int(10) unsigned DEFAULT NULL,
  `OrderTotalPrice` int(10) unsigned DEFAULT NULL,
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
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

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
-- Table structure for table `t_postcard`
--

DROP TABLE IF EXISTS `t_postcard`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_postcard` (
  `PostCardID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `UserID` int(11) unsigned DEFAULT NULL,
  `ProductID` int(11) unsigned DEFAULT NULL,
  `Latitude` varchar(32) NOT NULL DEFAULT '0',
  `Longitude` varchar(32) NOT NULL DEFAULT '0',
  `IP` int(10) unsigned DEFAULT NULL,
  `Comment` text,
  `Address` varchar(250) NOT NULL,
  `TemplateID` int(11) NOT NULL DEFAULT '0',
  `PostCardStatus` tinyint(4) DEFAULT '-1',
  `PostCardPublicType` int(2) DEFAULT NULL,
  `_insertTime` datetime DEFAULT NULL,
  `_updateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ImageFileID` varchar(48) NOT NULL,
  `ImageWidth` int(11) unsigned NOT NULL DEFAULT '0',
  `ImageHeight` int(11) unsigned NOT NULL DEFAULT '0',
  `ImageX` int(11) DEFAULT NULL,
  `ImageY` int(11) DEFAULT NULL,
  `ImageRotate` varchar(32) NOT NULL DEFAULT '0',
  `Sender` varchar(32) NOT NULL,
  PRIMARY KEY (`PostCardID`)
) ENGINE=MyISAM AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

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
) ENGINE=MyISAM AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

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
  `Province` varchar(30) NOT NULL DEFAULT '0',
  `City` varchar(30) NOT NULL DEFAULT '0',
  `_order` int(11) DEFAULT NULL,
  `_isDef` tinyint(4) DEFAULT NULL,
  `_isDel` tinyint(2) NOT NULL DEFAULT '0',
  PRIMARY KEY (`AddressID`),
  KEY `UserID` (`UserID`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

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
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2012-09-25 15:56:39
