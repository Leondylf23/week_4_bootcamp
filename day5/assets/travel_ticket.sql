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

 Date: 31/01/2024 16:50:54
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
-- Records of booking
-- ----------------------------
INSERT INTO `booking` VALUES (1, 1, 'VIP', 400000.00, '2024-01-31 03:38:08', 0);
INSERT INTO `booking` VALUES (2, 1, 'ECO', 150000.00, '2024-01-31 03:38:45', 0);
INSERT INTO `booking` VALUES (3, 2, 'ECO', 50000.00, '2024-01-31 03:39:07', 1);
INSERT INTO `booking` VALUES (4, 3, 'VIP', 520000.00, '2024-01-31 03:39:24', 1);
INSERT INTO `booking` VALUES (5, 5, 'ECO', 50000.00, '2024-01-31 07:24:00', 1);
INSERT INTO `booking` VALUES (8, 2, 'ECO', 50000.00, '2024-01-31 08:53:44', 1);
INSERT INTO `booking` VALUES (9, 2, 'ECO', 50000.00, '2024-01-31 08:53:45', 1);
INSERT INTO `booking` VALUES (10, 2, 'ECO', 50000.00, '2024-01-31 09:02:54', 1);
INSERT INTO `booking` VALUES (11, 6, 'ECO', 50000.00, '2024-01-31 09:36:22', 1);
INSERT INTO `booking` VALUES (12, 6, 'ECO', 50000.00, '2024-01-31 09:45:30', 1);

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
-- Records of coupon
-- ----------------------------
INSERT INTO `coupon` VALUES (1, 'Discount 50k', 50000.00, '2024-01-31 03:40:48', 0);
INSERT INTO `coupon` VALUES (2, 'Discount 100k', 100000.00, '2024-01-31 03:41:49', 0);
INSERT INTO `coupon` VALUES (3, 'Discount 25k', 25000.00, '2024-01-31 03:42:08', 1);
INSERT INTO `coupon` VALUES (4, 'Diskon aja amp 30k', 30000.05, '2024-01-31 07:32:26', 1);
INSERT INTO `coupon` VALUES (5, 'Diskon aja amp 30k', 30000.05, '2024-01-31 09:02:58', 0);
INSERT INTO `coupon` VALUES (6, 'Diskon aja amp 30k', 30000.05, '2024-01-31 09:36:35', 1);
INSERT INTO `coupon` VALUES (7, 'Diskon aja amp 30k', 30000.05, '2024-01-31 09:45:43', 1);

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
-- Records of coupon_connector
-- ----------------------------
INSERT INTO `coupon_connector` VALUES (1, 1, 1, '2024-01-31 03:42:27', 0);
INSERT INTO `coupon_connector` VALUES (2, 3, 1, '2024-01-31 03:42:45', 1);
INSERT INTO `coupon_connector` VALUES (3, 1, 2, '2024-01-31 03:43:27', 1);
INSERT INTO `coupon_connector` VALUES (4, 3, 3, '2024-01-31 03:44:38', 1);
INSERT INTO `coupon_connector` VALUES (5, 2, 4, '2024-01-31 03:45:04', 1);
INSERT INTO `coupon_connector` VALUES (6, 1, 4, '2024-01-31 03:45:32', 1);
INSERT INTO `coupon_connector` VALUES (7, 4, 5, '2024-01-31 07:35:27', 0);
INSERT INTO `coupon_connector` VALUES (8, 4, 5, '2024-01-31 09:18:48', 1);
INSERT INTO `coupon_connector` VALUES (9, 4, 5, '2024-01-31 09:36:44', 1);
INSERT INTO `coupon_connector` VALUES (10, 4, 5, '2024-01-31 09:48:29', 1);
INSERT INTO `coupon_connector` VALUES (11, 4, 5, '2024-01-31 09:50:21', 1);

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

-- ----------------------------
-- Records of customer
-- ----------------------------
INSERT INTO `customer` VALUES (1, 'Test edit', '2004-12-30', '2024-01-31 03:36:59', 0);
INSERT INTO `customer` VALUES (2, 'Test edit', '2004-12-30', '2024-01-31 03:37:17', 1);
INSERT INTO `customer` VALUES (3, 'test cust 3', '2023-12-12', '2024-01-31 03:37:28', 1);
INSERT INTO `customer` VALUES (4, 'dari api', '2000-01-22', '2024-01-31 06:57:01', 1);
INSERT INTO `customer` VALUES (5, 'dari apihhhhh', '2000-01-22', '2024-01-31 07:00:28', 1);
INSERT INTO `customer` VALUES (6, 'dari apihhhhh', '2000-01-22', '2024-01-31 09:02:35', 1);
INSERT INTO `customer` VALUES (7, 'dari apihhhhh jjjj', '2000-01-22', '2024-01-31 09:36:05', 1);
INSERT INTO `customer` VALUES (8, 'dari apihhhhh jjjj', '2000-01-22', '2024-01-31 09:45:16', 1);

SET FOREIGN_KEY_CHECKS = 1;
