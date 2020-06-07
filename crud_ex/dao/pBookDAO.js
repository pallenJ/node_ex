var publicDAO = require('./publicDAO');

module.exports = {
    phone_list:function (callback) {
        let sql = "SELECT * FROM phone_book";
        publicDAO.selectALL(sql,callback);
    },
    next_num:function(callback){
        let sql= "SELECT AUTO_INCREMENT AS next_no FROM information_schema.TABLES "+
        "WHERE table_name = 'phone_book' AND table_schema = 'nodejs'";
        publicDAO.selectOne(sql,callback);
    },
    phone_insert(data, callback){
        let sql = "INSERT INTO phone_book (name,phone,comment) VALUES(?,?,?)"
        publicDAO.change(sql,[data.name,data.phone,data.comment],callback);
    },
    phone_remove(phone_no,callback){
        let sql = "DELETE FROM phone_book WHERE  no=?";
        publicDAO.change(sql,[phone_no],callback);
    },
    phone_update(id,data,callback){
        let sql = "UPDATE phone_book SET name=?, phone=?, comment=? WHERE  no=?";
        publicDAO.change(sql,[data.name,data.phone,data.comment,id],callback);
    }
}