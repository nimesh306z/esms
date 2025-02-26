CREATE DATABASE esms;

USE esms;

CREATE TABLE user_data (
  id INT AUTO_INCREMENT PRIMARY KEY,
  indexNo VARCHAR(50),
  mobileNo VARCHAR(20),
  message TEXT,
  name VARCHAR(100)
);

CREATE TABLE user_login (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userName VARCHAR(50) UNIQUE,
  password VARCHAR(255)
);
