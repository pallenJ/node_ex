const express = require('express');
const router = express.Router();
const {User,Article} = require('../models');
//const multer = require('multer');
/*
let uploads = multer({
    dest:'upload'
});
*/
router.get('/', async(req,res,next)=>{
    let page = req.param('pg');
    console.log(page);
    if(page==undefined||page<=0) page =1;
    const article_list = await Article.findAll(
        {
            include: {
                model:User,
                
            },
            order:[['no','DESC']],
            limit:9,
            offset:(page-1)*9,
        });
        res.render('articles/article_list',{article_list});
});

router.get('/add', (req,res,next)=>{
    res.render('articles/article_add');
})
//Create
router.post('/add',async(req,res,next)=>{
    let jsonData = {};
    const loginInfo = req.session.loginInfo;
    if(loginInfo){
        const {board,title,content} = req.body;
        //const {id,email} = loginInfo;
        Article.create({
            board,title,content,userId:loginInfo.id
        })
        jsonData = {board,title,content,userId:loginInfo.id,img:req.files};
    }
    res.send(jsonData);
});

//Read
router.get('/:id',async(req,res,next)=>{
    const articleId = req.params.id;
    const article_data = await Article.findOne({
        include:{
            model:User 
        },
        where:{
            id:articleId
        }
    }); 
    res.render('articles/article_detail',{article_data});
});

//Update
router.patch('/:id',async(req,res,next)=>{
    let jsonData = {};
    const articleId = req.params.id;
    const loginInfo = req.session.loginInfo;
    const article_data = await Article.findOne({
        where:{
            id:articleId
        }
    }); 
    if(!article_data) {//해당 글이 없을시
        jsonData={message:'article is not exist'};
    }else if(loginInfo&&loginInfo.id == article_data.userId){
        let {title, board, content} = req.body;
        //수정내용이 없을시 기존내용입력
        title = title||article_data.title;
        board = board||article_data.board;
        content = content||article_data.content;

        await Article.update({
            title,board,content
        },{ 
            where:{ id:article_data.userId } 
        });
        
        jsonData={message:'update success',title,board,content,userId:article_data.userId}
    }
    res.json(jsonData)
});

router.delete('/:id',async(req,res,next)=>{
    let jsonData = {};
    const articleId = req.params.id;
    const loginInfo = req.session.loginInfo;
    const article_data = await Article.findOne({
        where:{
            id:articleId
        }
    }); 
    if(!article_data) {//해당 글이 없을시
        jsonData={message:'article is not exist'};
    }else if(loginInfo&&loginInfo.id == article_data.userId){
        //수정내용이 없을시 기존내용입력
        await Article.destro2y({
            where :{id:articleId}
        });
        jsonData={delete:`article ${articleId} delete success`};
    }
    res.json(jsonData)
});

module.exports = router; 