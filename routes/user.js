const express = require('express');
const connection = require('../connection');
const router = express.Router();

const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

router.post('/signup', (req, res) => {
    let user = req.body;
    query = "select email,password,role,status from user where email=?"
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                query = "insert into user (name,contactNumber,email,password,status,role)values(?,?,?,?,'false','user')";
                connection.query(query, [user.name, user.contactNumber, user.email, user.password], (err, results) => {
                    if (!err) {
                        return res.status(200).json({ message: "Đăng ký thành công" });
                    }
                    else {
                        return res.status(500).json(err);
                    }
                })
            }
            else {
                return res.status(400).json({ message: "Emaily đã tồn tại. " });
            }
        }
        else {
            return res.status(500).json(err);
        }
    })

})

router.post("/login", (req, res) => {
    const user = req.body;
    query = "select email,password,role,status from user where  email = ?";
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0 || results[0].password != user.password) {
                return res.status(401).json({ message: "Tên đăng nhập hoặc mật khẩu không chính xác" });;
            }
            else if (results[0].status === 'false') {
                return res.status(401).json({ message: "Chờ phê duyệt của quản trị viên" });
            }
            else if (results[0].password === user.password) {
                const response = { email: results[0].email, role: results[0].role }
                const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, { expiresIn: '8h' })
                res.status(200).json({ token: accessToken });

            }
            else {
                return res.status(400).json({ message: "đã xảy ra lỗi. Vui lòng thử lại sau" });
            }
        }
        else {
            return res.status(500).json(err);
        }
    })
})

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

router.post('/forgotPassword', (req, res) => {
    const user = req.body;
    query = "select email,password from user where email =?";
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                return res.status(200).json({ message: "Password sent successfully to your email." });
            }
            else {
                var mailOptions = {
                    from: process.env.EMAIL,
                    to: results[0].email,
                    subject: 'Password by cafe managerment system',
                    html: '<p><b>Your Login details for cafe Management system</b> <br>Email: </br>' + results[0].email + '<br><b> Password: </b>' + results[0].password + '<br><a href="http://localhost:4200">Click here to login</a></p>'
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        console('Email sent:' + info.response);
                    }
                });
                return res.status(200).json({ message: "Password sent successfully to your email." });
            }
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.get('/get', auth.authenticateToken, checkRole.checkRole, (req, res) => {
    var query = "select id,name ,email,contactNumber,status from user where role='user'";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);

        }
    })
})

router.patch('/update', auth.authenticateToken, checkRole.checkRole, (req, res) => {
    let user = req.body;
    var query = "update user set status=? where id =?";
    connection.query(query, [user.status, user.id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "Id người dùng không phù hợp" });
            }
            return res.status(200).json({ message: "Người dùng được cập nhật thành công" });
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.get('/checkToken', auth.authenticateToken, (req, res) => {
    return res.status(200).json({ message: "true" });
})

router.post('/changePassword',auth.authenticateToken, (req, res) => {
    const user = req.body;
    const email = res.locals.email;
    var query = "select *from user where email =? and password=?";
    connection.query(query, [email, user.oldPassword], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                return res.status(400).json({ message: "Incorrect Old Password" });
            }
            else if (results[0].password == user.oldPassword) {
                query = "update user set password =? where email=?";
                connection.query(query, [user.newPassword, email], (err, results => {
                    if (!err) {
                        return res.status(200).json({ message: "Password update Successfully" })
                    }
                    else {
                        return res.status(500).json(err);
                    }
                }))
            }
            else {
                return res.status(400).json({ message: "Something went wrong .Please try again later " });
            }
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.delete('/delete/:id', auth.authenticateToken, checkRole.checkRole, (req, res) => {
    const userId = req.params.id;
    const query = "delete from user where id = ?";
    connection.query(query, [userId], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "Không tìm thấy người dùng với ID cung cấp" });
            }
            return res.status(200).json({ message: "Người dùng đã được xóa thành công" });
        } else {
            return res.status(500).json(err);
        }
    });
});

router.get('/getUser/:id', auth.authenticateToken, checkRole.checkRole, (req, res) => {
    const userId = req.params.id;
    const query = "select id, name, email, contactNumber, status, role from user where id = ?";
    connection.query(query, [userId], (err, results) => {
        if (!err) {
            if (results.length > 0) {
                return res.status(200).json(results[0]);
            } else {
                return res.status(404).json({ message: "Không tìm thấy người dùng với ID cung cấp" });
            }
        } else {
            return res.status(500).json(err);
        }
    });
});



module.exports = router;