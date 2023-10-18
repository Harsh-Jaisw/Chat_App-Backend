require('dotenv').config() 
const express=require('express')
const  mongoose = require('mongoose')
const routes = require('./routes/routes');

const mongoString=process.env.DATABASE_URL 


mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})


const app=express() 

app.use('/api',routes)

app.listen(process.env.PORT,()=>{
    console.log(`Server is Listening on port:${process.env.PORT}`)
})