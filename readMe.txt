------dev run command with nodemon------
npm run dev


---- build dist using babel----
npm run build



CREATE TABLE `transaction` (
    `index_no` INT AUTO_INCREMENT PRIMARY KEY,
    `transactionID` INT NOT NULL,
    `created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

