const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
//check post input data error 
const { check, validationResult } = require('express-validator/check');
const User = require('../../models/User');

// @route POST api/users
// @desc Register user
// @access Public
//add second param to check error
router.post('/', 
[
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include valid email').isEmail(),
    check('password', 'Please enter valid password with min length 6'
    ).isLength({ min: 6 })
], 
  async  (req, res) => { //get promise
    const errors = validationResult(req); //receive req
    //check error
    if(!errors.isEmpty()){
        //if there's error, send json data back in an array
        //400 means bad request
        return res.status(400).json({errors: errors.array()});
    }

    //pull out some from body
    const {name, email, password} = req.body;

    try{
     //see if user exists
    let user = await User.findOne({email});
    if(user){
       return res.status(400).json({errors: [{msg: 'User already exists'}]});//match error message in line 24
    }    
    //get users gravatar(based on email)
    const avatar = gravatar.url(email, {
        s: '200', //size
        r: 'pg',  //rating
        d: 'mm'   //default img
    })
    //create new instances
    user = new User({
        name,
        email,
        password
    });
    //encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save(); //await promise

    //return jsonwebtoken
    const payload = {
        user: {
            id: user.id
        }
    }
    
    jwt.sign(
        payload, 
        config.get('jwtSecret'),//config default.js add jwtSecret
        {expiresIn: 360000},
        (err, token) => {
            if(err) throw err;
            res.json({token})
        }
        );
    //res.send('User registered');
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }

    
    //console.log(req.body); //object of data the route sent
    //initialize middleware for body parser --> server.js
    
});

//export route
module.exports = router;