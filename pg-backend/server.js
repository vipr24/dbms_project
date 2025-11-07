import express from "express";

const app = express();

app.get('/', (req, res)=>{
    res.send('Hi, this is server');
})

app.listen(3000, () => {
	console.log("server running");
});
