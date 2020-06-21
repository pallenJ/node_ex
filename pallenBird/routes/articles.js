const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const {User,Articles} = require('../models');


router.get('/', async(req,res,next)=>{
    const article_list = await Articles.findAll(
        {
            include: {
                model:User
            }
        });
        res.send(article_list);
});

router.get('/:id',async(req,res,next)=>{
    const articleId = req.params.id;
    const article_data = await Articles.findOne({
        where:{
            id:articleId
        }
    }); 
    res.send(article_data);
});

router.post('/add', async(req,res,next)=>{
    let jsonData = {};
    const loginInfo = req.session.loginInfo;
    if(loginInfo){
        const {board,title,content} = req.body;
        //const {id,email} = loginInfo;
        Articles.create({
            board,title,content,userId:loginInfo.id
        })
        jsonData = {board,title,content,userId:loginInfo.id};
    }
    res.send(jsonData);
});

module.exports = router;