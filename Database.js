const sql =require('mysql2')
const connection= sql.createConnection({
    host:'localhost',
    user:'root',
    password:'server77',
    database:'mydatabse'
})

// Get functions all

function Getmobiles(id){
    return new Promise((resolve, reject) => {
        if(id){
            connection.query('SELECT * FROM mobiles WHERE id = ?',[id],
                (err,row,cols)=>{
                    if(err) reject(err)
                    else resolve(row)
                }
            )
        }
        else
        {
            connection.query(`SELECT * FROM mobiles`,(err,rows,cols)=>{
                if(err) reject(err)
                else resolve(rows)
            })
        }
    })
}



// check mobile name

function Checkmobile(name){
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM mobiles WHERE name=?',[name],
            (err,row,cols)=>{
                if(err) reject(err)
                else resolve(row)
            }
        )
    })
}
function Addmobiles(name, price, ram, storage) {
    return new Promise((resolve, reject) => {
        // Check if the mobile name already exists
        Checkmobile(name)
            .then((res) => {
                if (res.length > 0) {
                    reject(409); 
                } else {
                    // Insert the new mobile into the database
                    connection.query(
                        'INSERT INTO mobiles (name, price, ram, storage) VALUES (?, ?, ?, ?)',
                        [name, price, ram, storage],
                        (err, result) => {
                            if (err) {
                                reject(err); 
                            } else {
                                resolve(result); 
                            }
                        }
                    );
                }
            })
            .catch((err) => reject(err)); 
    });
}

// Update mobiles

// function Update(name ,price,ram,storage,id){
//     return new Promise((resolve, reject) => {
//         Getmobiles(id)
//         .then((rows)=>{
//             if(rows.length>0){
//                 connection.query('UPDATE mobiles SET name=?,price=?,ram=?,storage=? WHERE= ?',
//                     [name,price,ram,storage,id],
//                     (err,res)=>{
//                         if(err) reject(500)
//                         else resolve(res)
//                     }
//                 )
//             }
//             else reject(404)
//         })
//         .catch(()=> reject(500))
//     })
// }

function Update(id, name, price, ram, storage) {
    return new Promise((resolve, reject) => {
        Getmobiles(id)  
        .then((rows) => {
            if (rows.length > 0) {
                
                connection.query('UPDATE mobiles SET name=?, price=?, ram=?, storage=? WHERE id=?',
                    [name, price, ram, storage, id],  
                    (err, res) => {
                        if (err) {
                            console.error('Error executing update query:', err);  
                            reject(500); 
                        } else {
                            console.log('Update result:', res);  
                            resolve(res);  
                        }
                    }
                );
            } else {
                console.log(`Mobile with id ${id} not found.`);  
                reject(404);  
            }
        })
        .catch((err) => {
            console.error('Error fetching mobile:', err);  
            reject(500);  
        });
    });
}


function Delete(id){
    return new Promise((resolve, reject) => {
        Getmobiles(id)
        .then((rows)=>{
            if(rows.length>0){
                connection.query(`DELETE FROM mobiles WHERE id=?`,[id],
                    (err,res)=>{
                        if(err) reject(500)
                        else resolve(204)
                    }
                )
            }
            else{
                reject(404)
            }
        })
        .catch(()=>reject(500))
    })
}

module.exports={Getmobiles,Addmobiles,Update,Delete}