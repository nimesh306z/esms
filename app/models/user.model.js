const sql = require("./db.js");

// constructor
const User = function(user) {
  this.userName = user.userName;
  this.password = user.password;
  this.mobileNo = user.mobileNo;
};

User.register = (newUser, result) => {
    sql.query(
      "INSERT INTO `user` SET ?",
      newUser,
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }
  
        console.log("created user: ", { id: res.insertId, ...newUser });
        result(null, { id: res.insertId, ...newUser });
      }
    );
  };


User.findOne = (user, result) => {
    console.log("error: ", user);
    sql.query(`SELECT * FROM user WHERE userName = '${user.userName}'`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found user: ", res[0]);

        // Compare the provided password directly (no hashing)
      if (user.password === res[0].password) {
        console.log("Password match successful!");

        res[0].password='';
        result(null, res[0]);  
      } else {
        console.log("Invalid password");
        result({ kind: "invalid_password" }, null);  // Password doesn't match
      }

        return;
      }
  
      // not found user with the id
      result({ kind: "not_found" }, false);
    });
  };

module.exports = User;
