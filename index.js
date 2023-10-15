require('dotenv').config() 
const express=require('express')
const app=express() 
app.get('/',(req,res)=>{
    res.send('Hello world!')
})
app.get('/Login',(req,res)=>{
    res.send('<h1>This is Login.</h1>')
})
app.listen(process.env.PORT,()=>{
    console.log(`Server is Listening on port:${process.env.PORT}`)
})