const express = require('express');
const app = express();

const jwt = require('jsonwebtoken');
const extjwt = require('express-jwt');
const bodyparser = require('body-parser');
const path = require('path');

const PORT = 3000;
const secretkey = 'My secret key';

const jwtMW = extjwt({
    secret: secretkey,
    algorithms: ['HS256']
});

let users = [
    {
        id: 1,
        username: 'luckose',
        password: '1011'
    },
    {
        id: 1,
        username: 'manuel',
        password: '3qqq'
    }
];

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended:true }));
app.use((req, res, next)=> {
    res.setHeader('Access-Control-Allow-Origin','http://localhost:3000');
    res.setHeader('Access-Control-Allow-Headers','Content-type,Authorization');
    next();
});

app.get('/',(req, res) => {
    res.sendFile(path.join(__dirname,'index.html'));
});



app.post('/api/login',(req, res) => {
    const { username, password }= req.body;
    
    for (let user of users) {
        if(username == user.username && password == user.password){
           
            let token = jwt.sign({id: user.id, username: user.username}, secretkey, {expiresIn: 180});
            res.json({
                success: true,
                err:null,
                token
            });
            break;
        }
        else{
            res.status(401).json({
                success: false,
                token: null,
                err:'Invalid username or password'
            });
        }
    }
});

app.get('/api/dashboard',jwtMW, (req, res) => {
    
    res.json({
        success:true,
        myContent: 'Secret Content that only logged in people can see.'
    });
});

app.get('/api/settings',jwtMW, (req, res) => {
    
    res.json({
        success:true,
        myContent: 'Settings page'
    });
});

app.use(function(err, req, res, next) {
    if(err.name === 'UnauthorizedError'){
        res.status(401).json({
            success:false,
            officialError : err,
            err : 'Invalid Username/password'
        });
    }
    else{
        next(err);
    }
 });
app.listen(PORT, () => {
    console.log(`Serving on port ${PORT}`);
    
});