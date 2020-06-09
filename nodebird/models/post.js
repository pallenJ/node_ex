module.exports = (sequelize, DataTypes) => (
    sequelize.define('post',{
        content: {//게시글 내용
            type: DataTypes.STRING(140),
            allowNull:false,
        },
        img: {//이미지 칼럼
            type: DataTypes.STRING(200),
            allowNull:true
        },
    },{
        timestamp: true,//createAt, updateAt 칼럼 추가됨
        paranoid: true,//deleteAt 추가됨
    })
);

