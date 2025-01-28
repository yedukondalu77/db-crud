const express = require('express')
const app=express()
const db=require('./Database')
const PORT=3005
const cors=require('cors')
app.use(cors())
app.use(express.json())

app.get('/mobiles',(req,res)=>{
    db.Getmobiles()
    .then((mobiles)=>res.json(mobiles))
    .catch((err)=>res.send(err))
})


app.get('/mobiles/:id',(req,res)=>{
    db.Getmobiles(req.params.id)
    .then((mobiles)=>res.json(mobiles))
    .catch((err)=>res.send(err))
})

// ADD MOBILES
// app.post('/mobiles',(req,res)=>{
//     db.Addmobiles(req.body.name,req.body.price,req.body.ram,req.body.storage)
//     .then((result)=>res.json({ message: 'Person added successfully'}))
//     .catch((error)=>res.send(error))
// })
app.post('/mobiles', (req, res) => {
    const { name, price, ram, storage } = req.body; // Extract data from the request body

    if (!name || !price || !ram || !storage) {
        return res.status(400).json({ error: 'All fields (name, price, ram, storage) are required' });
    }

    db.Addmobiles(name, price, ram, storage)
        .then(() => res.status(201).json({ message: 'Mobile added successfully' }))
        .catch((error) => {
            if (error === 409) {
                res.status(409).json({ error: 'Mobile name already exists' });
            } else {
                res.status(500).json({ error: 'Internal Server Error', details: error });
            }
        });
});

app.listen(PORT,()=>console.log(`server started at server started at http://localhost:${PORT}`))