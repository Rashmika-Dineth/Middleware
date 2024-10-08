const express = require('express');
const app = express();
const router = express.Router();
const port =3000;
const path = require("path");
var morgan = require('morgan')
const multer  = require('multer');
const { error } = require('console');
const upload = multer({ dest: 'uploads/' })

//Inbuild middleware 
app.use(express.json());
app.use(morgan('combined'));
app.use(express.urlencoded({extended: true}))
app.use("/static",express.static(path.join(__dirname,"public")));

//3rd Party Application middleware
app.post('/profile', upload.single('image'), function (req, res, next) {
    console.log()
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    res.send();
  },(error,req,res,next) =>{
res.status(400).send({error : error.message})
  }
)

// Application middleware 
const loggerMiddleware = (req, res, next) =>{
    console.log(` ${new Date()} --- Request [${req.method}] --- URL ${req.url}`)
    next();
}

const fakeAuth = (req, res, next) => {
    const authStatus = true;
    if(authStatus){
        console.log("User Auth status : ", authStatus);
        next();
    }
    else{
        res.status(401);
        throw new Error("User not Authorized")
    }
}

app.use(loggerMiddleware);

// Router level middleware
app.use("/api/users", router);

const getUser = (req,res)=>{
    res.json({message: "Get All Users"});
}
const createUser = (req,res)=>{
    console.log("This is the sample body", req.body)
    res.json({message: "Create new user"});
}

router.use(fakeAuth);
router.route("/").get(getUser).post(createUser)

errorHandler = (error, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500 ;
    res.status(statusCode);
    switch(statusCode){
        case 401:
            res.json({
                title: "Unauthorized",
                message: error.message
            })
        break;
        case 404:
            res.json({
                title: "Not Found",
                message: error.message
            })
        break;
        case 500:
            res.json({
                title: "Server Error",
                message: error.message
            })
        break;
        default:            
        break;
    }
}

app.all("*", (req,res) => {
    res.status(404);
    throw new Error("Route not Found");
})
app.use(errorHandler);
app.listen(port, ()=>{
    console.log("App listing on port ", port)
})