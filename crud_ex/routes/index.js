var express = require('express');
var router = express.Router();
var pBookDAO = require('../dao/pBookDAO')

/* GET home page. */
router.get('/', function(req, res) {
  pBookDAO.phone_list(function (phone_rs,phone_data) {
    console.log(phone_rs,phone_data)
      pBookDAO.next_num(function (next_num_rs,next_no_data) {
        console.log(next_num_rs,next_no_data);
        res.render('index', {phone_list:phone_data, next_no:next_no_data.next_no});
    })
  });
});

router.post('/',function (req,res) { 
    let phone_data = req.body;
    pBookDAO.phone_insert(phone_data,function (insert_data) {
      console.log(insert_data);
    })
    res.send(phone_data)

 });

router.delete('/:id',function (req,res) {
   let phone_no = req.params.id;
   pBookDAO.phone_remove(phone_no,e=>{
     console.log(e);
     res.send(JSON.stringify(req.params))
   })
})

router.put('/:id',function (req,res) {
   let phone_no = req.params.id;
   console.log("header:"+JSON.stringify(req.headers));
   pBookDAO.phone_update(phone_no,req.headers,e=>{
     console.log(e);
     res.send(JSON.stringify(req.headers))
    })
})



module.exports = router;
