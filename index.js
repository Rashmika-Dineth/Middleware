const express = require('express')
const app = express()

const port =3000;


// Application middleware 
const loggerMiddleware = (req, res, next) =>{
    console.log(` ${new Date()} --- Request [${req.method}] --- URL ${req.url}`)
    next();
}

app.use(loggerMiddleware);

app.listen(port, ()=>{
    console.log("App listing on port ", port)
})