/*
 Navicat Premium Data Transfer

 Source Server         : locallaptop
 Source Server Type    : MySQL
 Source Server Version : 80200
 Source Host           : localhost:3306
 Source Schema         : travel_ticket

 Target Server Type    : MySQL
 Target Server Version : 80200
 File Encoding         : 65001

 Date: 31/01/2024 16:51:06
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for booking
-- ----------------------------
DROP TABLE IF EXISTS `booking`;
CREATE TABLE `booking`  (
  `booking_id` bigint NOT NULL AUTO_INCREMENT,
  `customer_id` bigint NULL DEFAULT NULL,
  `booking_type` char(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `booking_price` decimal(10, 2) NULL DEFAULT 0.00,
  `created_date` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint NULL DEFAULT 1,
  PRIMARY KEY (`booking_id`) USING BTREE,
  INDEX `booking_to_cust`(`customer_id` ASC) USING BTREE,
  CONSTRAINT `booking_to_cust` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chk_book_typ` CHECK ((`booking_type` = _utf8mb4'ECO') or (`booking_type` = _utf8mb4'VIP'))
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for coupon
-- ----------------------------
DROP TABLE IF EXISTS `coupon`;
CREATE TABLE `coupon`  (
  `coupon_id` bigint NOT NULL AUTO_INCREMENT,
  `coupon_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `coupon_prc_cut` decimal(10, 2) NULL DEFAULT 0.00,
  `created_date` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint NULL DEFAULT 1,
  PRIMARY KEY (`coupon_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for coupon_connector
-- ----------------------------
DROP TABLE IF EXISTS `coupon_connector`;
CREATE TABLE `coupon_connector`  (
  `coupon_connector_id` bigint NOT NULL AUTO_INCREMENT,
  `coupon_id` bigint NULL DEFAULT NULL,
  `booking_id` bigint NULL DEFAULT NULL,
  `created_date` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint NULL DEFAULT 1,
  PRIMARY KEY (`coupon_connector_id`) USING BTREE,
  INDEX `book_to_cp_con`(`booking_id` ASC) USING BTREE,
  INDEX `coupon_to_cp_con`(`coupon_id` ASC) USING BTREE,
  CONSTRAINT `book_to_cp_con` FOREIGN KEY (`booking_id`) REFERENCES `booking` (`booking_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `coupon_to_cp_con` FOREIGN KEY (`coupon_id`) REFERENCES `coupon` (`coupon_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for customer
-- ----------------------------
DROP TABLE IF EXISTS `customer`;
CREATE TABLE `customer`  (
  `customer_id` bigint NOT NULL AUTO_INCREMENT,
  `customer_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `customer_dob` date NULL DEFAULT NULL,
  `created_date` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint NULL DEFAULT 1,
  PRIMARY KEY (`customer_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
