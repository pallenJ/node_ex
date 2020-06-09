module.exports = (sequelize, DataTypes)=>(
    sequelize.define('hashtag',{
        title:{//태그로 검색을 구현하기 위한 모델
            type: DataTypes.STRING(15),
            allowNull: false,
            unique: true,
        }
    },{
        timestamp: true,//createAt, updateAt 칼럼 추가됨
        paranoid: true,//deleteAt 추가됨        
    })
);