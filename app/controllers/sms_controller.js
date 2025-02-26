const SmsModel = require("../models/sms.model.js");

// Create and Save a new User
exports.sendEsms = (req, res) => {
    // Validate request
    console.log('sms data request=>',req.body);
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
  
    // Create a User
    const user = new SmsModel({
      indexNo: req.body.indexNo,
      name: req.body.name,
      mobileNo: req.body.mobileNo,
      message:req.body.message, 
    });
  
    // Save User in the database
    SmsModel.insertAndSend(user, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Sms."
        });
      else res.send(data);
    });
  };