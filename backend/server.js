import express from "express";

const app = express();

app.get('/', (req, res) => {
    res.send("Hi this is server");
})

// auth routes
app.post(/login/doctor, (req, res)=>{
    const {email, password} = req.body;
    if(email==='doctor1@gmail.com' && password==='doctor123'){
        res.status(200);
    }
})
app.post(/register/doctor, (req, res)=>{})
app.post(/login/patient, (req, res)=>{
    const {email, password} = req.body;
    if(email==='patient1@gmail.com' && password==='patient123'){
        res.status(200);
    }
})
app.post(/register/patient, (req, res)=>{})

app.listen(3000, () => {
    console.log("server is running");
})