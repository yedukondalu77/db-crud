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
            connection.query(`SELECT * FROM mobiles WHERE id=?`,[id],
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

// function Get(id){
//     return new Promise((resolve, reject) => {
//         if(id){
//             connection.query('SELECT * FROM mobiles WHERE id=?',id,(err,roe,cols)=>{
//                 if(err) reject(err)
//                 else resolve(row)
//             })
//         }
//         else
//         {
//             connection.query('SELECT * FROM mobiles',(err,rows,cols)=>{
//                 if(err) reject(err)
//                 else reject(rows)
//             })
//         }
//     })
// }

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

module.exports={Getmobiles,Addmobiles}