const express = require('express');

const router = express.Router()
const Model=require('../models/model')
router.get('/gitHubJson',(req,res)=>{
    res.json([
        {
            "id": 1,
            "name": "Leanne Graham",
            "username": "Bret",
            "email": "Sincere@april.biz",
            "address": {
                "street": "Kulas Light",
                "suite": "Apt. 556",
                "city": "Gwenborough",
                "zipcode": "92998-3874",
                "geo": {
                    "lat": "-37.3159",
                    "lng": "81.1496"
                }
            },
            "phone": "1-770-736-8031 x56442",
            "website": "hildegard.org",
            "company": {
                "name": "Romaguera-Crona",
                "catchPhrase": "Multi-layered client-server neural-net",
                "bs": "harness real-time e-markets"
            }
        },
        {
            "id": 2,
            "name": "Ervin Howell",
            "username": "Antonette",
            "email": "Shanna@melissa.tv",
            "address": {
                "street": "Victor Plains",
                "suite": "Suite 879",
                "city": "Wisokyburgh",
                "zipcode": "90566-7771",
                "geo": {
                    "lat": "-43.9509",
                    "lng": "-34.4618"
                }
            },
            "phone": "010-692-6593 x09125",
            "website": "anastasia.net",
            "company": {
                "name": "Deckow-Crist",
                "catchPhrase": "Proactive didactic contingency",
                "bs": "synergize scalable supply-chains"
            }
        }])
    })
    router.post('/post',(req,res)=>{
        console.log(req.body)
        const data=new Model({
            name:req.body.name,
            age:req.body.age
        })
        try{
            const dataToSave = data.save();
            res.status(200).json(dataToSave)
        }
        catch{
            res.status(400).json({message: error.message})
        }
    })
    router.get('/getAll', (req, res) => {
        res.send('Get All Api')
    })
    router.get('/getOne:id',(req,res)=>{
        res.send(req.params.id)
    })
    router.patch('/update:id',(req,res)=>{
        res.send('update by Id API')
    })
    router.delete('/delete:id',(req,res)=>{
        res.send('Delete by Id API')
    })
    module.exports = router;