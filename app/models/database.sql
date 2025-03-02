CREATE DATABASE esms;

USE esms;

CREATE TABLE `user` (
  `userName` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `mobileNo` varchar(15) DEFAULT NULL
);

CREATE TABLE `sms_data` (
  `indexNo` varchar(100) DEFAULT NULL,
  `mobileNo` varchar(100) DEFAULT NULL,
  `message` varchar(100) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL
);

CREATE TABLE `transaction` (
  `index_no` int NOT NULL AUTO_INCREMENT,
  `transactionID` int NOT NULL,
  `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`index_no`)
) ;