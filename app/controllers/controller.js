const User = require("../models/user.model.js");

// Create and Save a new User
exports.userRegister = (req, res) => {
  // Validate request
  console.log('userRegister request=>',req.body);
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a User
  const user = new User({
    userName: req.body.userName,
    password: req.body.password,
    mobileNo: req.body.mobileNo 
  });

  // Save User in the database
  User.register(user, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the User."
      });
    else res.send(data);
  });
};



// User login
exports.userLogin = (req, res) => {
  // Validate request
  console.log('userLogin request=>', req.body);
  if (!req.body) {
    return res.status(400).send({
      message: "Content can not be empty!"
    });
  }
    // Create a User
    const user = new User({
      userName: req.body.userName,
      password: req.body.password
    });
  

  // Find the user by username or mobile number
  User.findOne(user, (err, data) => {
    if (err){
      res.status(401).send({
        message:
          err.message || "User Name or password error"
      });


}else{

// Create a response
const Response = function(user,isLogin) {
  this.data = user;
  this.isLogin = isLogin;
};


const response=new Response({
  userData:data,
  isLogin:'1'
});


  res.status(200).send(response);
   } 
  });
};
