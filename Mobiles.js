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


app.get('/mobiles/:id', (req, res) => {
    db.Getmobiles(req.params.id)
        .then((mobiles) => {
            if (mobiles.length === 0) {
                res.status(404).json({ error: `Mobile with id ${req.params.id} not found` });
            } else {
                res.json(mobiles);
            }
        })
        .catch((err) => res.status(500).send(err));
});


app.post('/mobiles', (req, res) => {
    const { name, price, ram, storage } = req.body; 

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


// app.put('/mobiles/:id',(req,res)=>{
//     db.Update(req.params.id,
//         req.body.name,
//         req.body.price,
//         req.body.ram,
//         req.body.storage
//     )
//     .then(()=>{
//         res.json(req.body)
//     })
//     .catch((err) => {
//         // If an error occurs, send the appropriate status code
//         if (err === 404) {
//             res.status(404).json({ error: 'Mobile not found' });
//         } else if (err === 500) {
//             res.status(500).json({ error: 'Internal Server Error' });
//         } else {
//             res.status(500).json({ error: 'Unknown error' });
//         }
//     });
// })

app.put('/mobiles/:id', (req, res) => {
    
    const { name, price, ram, storage } = req.body;
    const { id } = req.params;  

    db.Update(id, name, price, ram, storage)
    .then(() => {

        res.json({
            message: `Mobile with ID ${id} updated successfully.`,
            updatedMobile: req.body  
        });
    })
    .catch((err) => {
        if (err === 404) {
            res.status(404).json({ error: `Mobile with id ${id} not found` });
        } else if (err === 500) {
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.status(500).json({ error: 'Unknown error occurred' });
        }
    });
});


app.delete('/mobiles/:id',(req,res)=>{
    const {id}=req.params;
    db.Delete(id)
    .then((result)=>{
        if(result==204){
            res.json({message:"mobile deleted"})
        }
        else {
            res.status(404).json({ error: 'ID not Found', details: error });
        }
    })
    .catch((err)=>res.send(err))
})
app.listen(PORT,()=>console.log(`server started at server started at http://localhost:${PORT}`))