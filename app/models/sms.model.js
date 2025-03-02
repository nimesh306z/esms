const sql = require("./db.js");
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const apiConfig = require("../config/api.config.js");


// Constructor
const SMS = function (sms) {
  this.indexNo = sms.indexNo;
  this.name = sms.name;
  this.mobileNo = sms.mobileNo;
  this.message = sms.message;
};

let transactionID = 0;

SMS.insertAndSend = async (newSMS, result) => {
  try {
    // Insert SMS data into the database
    const smsInsertResult = await new Promise((resolve, reject) => {
      sql.query("INSERT INTO `sms_data` SET ?", newSMS, (err, res) => {
        if (err) {
          console.log("error: ", err);
          reject(err);
          return;
        }
        console.log("created user: ", { id: res.insertId, ...newSMS });
        resolve(res);
      });
    });

    // Get the next transaction ID
    const transactionResult = await new Promise((resolve, reject) => {
      sql.query(
        `SELECT COALESCE(MAX(transactionID) + 1, 800) AS maxTransactionID FROM transaction WHERE DATE(created) = CURDATE();`,
        (err, res) => {
          if (err) {
            console.log("error: ", err);
            reject(err);
            return;
          }
          if (res.length) {
            transactionID = res[0].maxTransactionID;
            console.log("Max Transaction ID: ", transactionID);
            resolve(transactionID);
          } else {
            reject(new Error("No result found for transaction ID."));
          }
        }
      );
    });

    // Insert the new transaction into the database
    const newTransaction = {
      transactionID: transactionID,
      created: new Date(),
    };

    await new Promise((resolve, reject) => {
      sql.query("INSERT INTO `transaction` SET ?", newTransaction, (err, res) => {
        if (err) {
          console.log("error: ", err);
          reject(err);
          return;
        }
        resolve(res);
      });
    });

    // Generate token and send SMS
    const token = await generateToken();
    console.log("login TOKEN:", token);

    const mobileNo = MobileNumberprocess(newSMS.mobileNo);
    const smsResponse = await sendSms(token, mobileNo, newSMS.message, transactionID);

    // Send the final response
    result(null, smsResponse);
  } catch (error) {
    console.log("Error:", error);
    result(error, null);
  }
};

// Helper function to process mobile numbers
function MobileNumberprocess(input) {
  let number = input.toString();
  if (number.length === 10 && number[0] === "0") {
    number = number.slice(1);
  }
  return number;
}

// Function to generate token
async function generateToken() {
  try {
    const response = await axios.post(`${apiConfig.API_SMS_LOGIN_URL}`, {
      username: apiConfig.USERNAME,
      password: apiConfig.PASSWORD,
    });
    return response.data.token;
  } catch (error) {
    throw new Error("Token generation failed: " + error.message);
  }
}

// Function to send SMS
async function sendSms(token, mobile, message, transaction_id) {
  try {
    const formattedmobile = [{ mobile: mobile }];

    console.log("Request Data:", {
      msisdn: formattedmobile,
      message,
      sourceAddress: apiConfig.DEFAULT_MASK,
      transaction_id,
      payment_method: 0,
    });

    const response = await axios.post(
      `${apiConfig.API_SMS_SEND_URL}`,
      {
        msisdn: formattedmobile,
        message,
        sourceAddress: apiConfig.DEFAULT_MASK,
        transaction_id: transaction_id,
        payment_method: 0,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.comment;
  } catch (error) {
    throw new Error("SMS sending failed: " + error.message);
  }
}

module.exports = SMS;