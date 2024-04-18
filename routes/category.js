const express = require('express');
const router = express.Router();
const connection = require('../connection');
const auth = require('../services/authentication');
const checkRole = require('../services/checkRole');

router.post('/add', auth.authenticateToken, checkRole.checkRole, (req, res,next) => {
    let category = req.body;
     query = "insert into category (name) VALUES (?)";  
    connection.query(query, [category.name], (err, results) => {
        if (!err) {
            return res.status(200).json({ message: "Category Thêm thành công" });
        } 
        else {
            return res.status(500).json(err);
        }
    });
});


router.get('/get', auth.authenticateToken, (req, res,next) => {
    var query = "select * from category order by name";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    });
});

router .patch('/update',auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
let product =req.body;
var query= "update category set name=? where id=?";
connection.query(query,[product.name,product.id],(err,results)=>{
    if(!err){
        if(results.affectedRows== 0){
            return res.status(404).json({messsage:"Category id không phù hợp"});

        }
        return res.status(200).json({message:"category update thành công"});
    }
    else{
        return res.status(500).json(err);
        
    }
})
})
module.exports = router;
