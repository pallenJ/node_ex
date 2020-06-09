module.exports = (sequelize, DataTypes) => (
    sequelize.define('user',{
        email:{
            type:DataTypes.STRING(40),
            allowNull:true,
            unique: true,
        }, 
        nick:{
            type:DataTypes.STRING(15),
            allowNull:false,
        },
        passowrd:{
            type:DataTypes.STRING(100),
            allowNull:true,
        },
        provider:{
            //local 로그인인지 sns로그인인지 저장. 기본값은 local
            type:DataTypes.STRING(10),
            allowNull:false,
            defaultValue: 'local'
        },
        snsId:{
            //sns로 로그인시만 값이 저장
            type:DataTypes.STRING(30),
            allowNull:true,
        },
    }, {
        timestamps: true,//createAt, updateAt 칼럼 추가됨
        paranoid:true,//deleteAt 추가됨
    })
);