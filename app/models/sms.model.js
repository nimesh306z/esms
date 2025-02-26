const sql = require("./db.js");
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const apiConfig = require("../config/api.config.js");


// constructor
const SMS = function(sms) {
  this.indexNo = sms.indexNo;
  this.name = sms.name;
  this.mobileNo = sms.mobileNo;
  this.message = sms.message;
};

let transactionID = 0;

SMS.insertAndSend = async (newSMS, result)  => {
    sql.query(
      "INSERT INTO `sms_data` SET ?",
      newSMS,
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          //result(err, null);
          return;
        }
  
        console.log("created user: ", { id: res.insertId, ...newSMS });
        //result(null, { id: res.insertId, ...newSMS });
      }
    );

    sql.query(`SELECT COALESCE(MAX(transactionID)+1, 800) AS maxTransactionID FROM transaction WHERE DATE(created) = CURDATE();`, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }
    
        if (res.length) {
             transactionID = res[0].maxTransactionID; // Access the maxTransactionID column
            console.log("Max Transaction ID: ", transactionID);
           
            const newTransaction = {
                transactionID: transactionID,
                created: new Date(), // Use current timestamp
              };

              sql.query(
                "INSERT INTO `transaction` SET ?",
                newTransaction,
                (err, res) => {
                  if (err) {
                    console.log("error: ", err);
                  }
             
                }
              );


          } else {
            console.log("No result found.");
          }
     
      });


    try {

        
        // Step 1: Generate token
        const token = await generateToken();
        console.log('login ToKEN:', token);

        const mobileNo=MobileNumberprocess(newSMS.mobileNo);
    
        // Step 2: Send SMS
        const smsResponse = await sendSms(token,mobileNo , newSMS.message, transactionID);
    
        // result(null, {result.status(200).json(smsResponse)}); 
        
        result(null, smsResponse); 
  
        // res.send({ error: false, data: resmsResponsesult, message: 'Data inserted successfully.' });
      } catch (error) {
        console.log('ERROZZZZZ',error);
        result(error, null); 
      }




  };

  function MobileNumberprocess(input) {
    // Convert input to string to handle both number and string types
    let number = input.toString();

    // Check if the length is 10 and the first character is '0'
    if (number.length === 10 && number[0] === '0') {
        // Remove the first character
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
    throw new Error('Token generation failed: ' + error.message);
  }
}

// Function to send SMS
async function sendSms(token, mobile, message, transaction_id) {
    try {
      const formattedmobile = [{ mobile: mobile }];
  
      console.log('Request Data:', {
        msisdn: formattedmobile,
        message,
        sourceAddress: apiConfig.DEFAULT_MASK,
        transaction_id,
        payment_method: 0
      });
  
  
      const response = await axios.post(
        `${apiConfig.API_SMS_SEND_URL}`,
        {
          msisdn: formattedmobile, // format msisdn as required
          message,
          sourceAddress : apiConfig.DEFAULT_MASK,
          transaction_id: transaction_id,
          payment_method: 0, // default to wallet payment
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error('SMS sending failed: ' + error.message);
    }
  }




module.exports = SMS;
