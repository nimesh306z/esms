module.exports = app => {
    const appController = require("../controllers/controller.js");
    const smsController = require("../controllers/sms_controller.js");
  
    var router = require("express").Router();
  
    // Create a new appController
    router.post("/user-register", appController.userRegister);

    router.post("/login", appController.userLogin);

    router.post("/sendSms", smsController.sendEsms);
  
    app.use('/api', router);
  };
  