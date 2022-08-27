const { get: _get } = require("lodash");
const User = require("../models/User");

module.exports = {
  getAllUser: async (req, res) => {
    let where = {};
    Object.entries(searchParams).forEach(([key, value]) => {
      if (key && value) where = { ...where, [key]: { $like: `%${value}%` } };
    });

    User.findAndCountAll({
      where,
    })
      .then(value => {
        let response = JSON.parse(JSON.stringify(value));
        res.status(200).json(response);
      })
      .catch(err => {
        res.status(500).json({
          message: err.message || "Error in Fetching Data"
        });
      });
  },

  getUserById: (req, res) => {
    const { id } = req.params;

    User.findByPk(id)
      .then(async (value) => {
        if (!value) {
          throw new Error("Invalid User Id");
        }
        let response = JSON.parse(JSON.stringify(value));
        res.status(200).json({
          message: "User Fetched successfully",
          data: response
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err.message || "Error in Fetching Data"
        });
      });
  },


  loginUser: async (req, res) => {
    const { email, password } = req.body;
    User.findOne({
      where: {
        email: { $eq: email, $not: null },
        password: { $eq: password, $not: null },
      }
    })
      .then(async (currUser) => {
        if (!currUser) {
          return res.status(404).json({
            message: "User not Found, email or password is not valid."
          });
        }
        
        return res.status(200).json({
          message: "User Logged-in Successfully",
          data: currUser
        });
       
      })
      .catch(err =>
        res.status(500).json({
          message: err.message || "Error in Fetching Data"
        })
      );
  },

  updateUserById: async (req, res) => {
    const { id } = req.params;

    User.findByPk(id)
      .then(async currUser => {
        if (!currUser) {
          return res.status(404).json({
            message: "User Id not Found"
          });
        }
        
        currUser
          .update({
            ...currUser,
            ...valData,
            firstLogin: false
          })
          .then(updatedUser =>{
            let result = JSON.parse(JSON.stringify(updatedUser));
            res.status(200).json({
              message: "User Updated Successfully",
              data: result
            })
          }
          )
          .catch(err =>
            res.status(500).json({
              message: err.message || "Error in Updating Data"
            })
          );
      })
      .catch(err =>
        res.status(500).json({
          message: err.message || "Error in Fetching Data"
        })
      );
  },

  deleteUserById: async (req, res) => {
    const { id } = req.params;

    User.findByPk(id)
      .then(currUser => {
        if (!currUser) {
          return res.status(404).json({
            message: "User Id not Found"
          });
        }

        currUser
          .destroy()
          .then(() =>
            res.status(200).json({
              message: "User Deleted Successfully"
            })
          )
          .catch(err =>
            res.status(500).json({
              message: err.message || "Error in Deleting Data"
            })
          );
      })
      .catch(err =>
        res.status(500).json({
          message: err.message || "Error in Fetching Data"
        })
      );
  },

  saveUser: async (req, res) => {
    const { email } = req.body;

    User.findOne({
      
      where: {
        email: { $eq: email, $not: null }
      }
    })
      .then(async (currUser) => {
        if (currUser && !req.body.isCheck) {
          return res.status(200).json({
            message: "Email already registered."
          });
        }
        User.create(req.body)
      .then(value => {
        let result = JSON.parse(JSON.stringify(value))
        res.status(200).json({
          message: "User Saved successfully",
          data: result
        });
      })
      .catch(err => {
        console.log("err :>> ", err);
        res.status(500).json({
          message: err.message || "Error in Saving Data"
        });
      });
       
      })
      .catch(err =>
        res.status(500).json({
          message: err.message || "Error in Fetching Data"
        })
      );
    
  },
};

