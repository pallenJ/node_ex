const express = require('express');
const multer= require('multer');
const path = require('path');
const fs = require('fs');

const {Post, Hashtag, User} = require('../models');
const {isLoggedIn} = require('./middlewares');

const router = express.Router();

fs.readdir('uploads',(error)=>{
    if(error){
        console.error('uploads 폴더가 없어서 해당폴더를 생성합니다.');
        fs.mkdirSync('uploads');
    }
});
/*
    multer는 미들웨어 역할. multipart 데이터를 업로드하는 라우터에 붙는 미들웨어.bp

    upload는 미들웨어를 만드는 객체가 됨
    폴더가 없을시 이를 만들고 있을시 기존이름 + 날짜로 업로드(중복을 피하기 위해서)
    
 */
const upload = multer({
    storage: multer.diskStorage({
        destination(req,file,cb){
            cb(null,'uploads/')
        },
        filename(req,file,cb){
            const ext = path.extname(file.originalname);
            console.log('PATH:'+path.basename(file.originalname,ext) + Date.now() + ext);
            cb(null,path.basename(file.originalname,ext) + Date.now() + ext);
        },
    }),
    limits: {fileSize: 5*1024*1024}
});
//이미지 업로드를 처리하는 부분
//upload.single은 이미지 하나는 req.file, 나머지는 req.body로 처리
router.post('/img', isLoggedIn,upload.single('img'),(req,res)=>{
    console.log(req.file);
    res.json({url:`/img/${req.file.filename}`});
});

const upload2 = multer();

//게시글 업로드를 처리하는 부분
//upload.none은 모든 정보를 req.none로
router.post('/', isLoggedIn, upload2.none(), async(req,res,next)=>{
    try {
        const post = await Post.create({
            content:req.body.content,
            img: req.body.url,
            userId: req.user.id
        });
        const hashTags = req.body.content.match('/#[^\s#]*/g');
        if(hashTags){
            const result = await Promise.all(hashTags.map(tag =>Hashtag.findOrCreate({
                where: {title: tag.slice(1).toLowerCase() }
            })));
            await post.addHashtags(result.map(r=>r[0]));
        }
        res.redirect('/')
    } catch (error) {
        console.error(error);
        next(error);
    }
});

//실제 서버 운영시는 AWS S3난 클라우드 스토리지 같은 정적 파일 제공 서비스를 쓰는게 좋음

router.get('/hashtag', async (req,res,next)=>{
    const query = req.query.hashtag;
    if(query){
        return res.redirect('/');
    }
    try {
        const hashtag = await Hashtag.fineOne({where:{title: query} });
        let posts = [];
        if(hashtag){
            posts = await hashtag.getPosts({include:[{ model:User }]});
        }
        return res.render('main',{
            title : `${query}|Nodebird`,
            user : req.user,
            twits : posts,
        });

    } catch (error) {
        console.error(error);
        return next(error);
    }

});

module.exports = router;
