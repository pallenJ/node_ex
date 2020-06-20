module.exports = (sequelize , DataTypes) =>{
    return sequelize.define('article',{
        board:{
            type : DataTypes.STRING(50),
            allowNull:true,
        },
        title:{
            type: DataTypes.STRING(150),
            allowNull:false,
        },
        content:{
            type: DataTypes.TEXT,
            allowNull:false,
        },
    },{
        timestamps: true,//createAt, updateAt
        paranoid:true,//deleteAt 
    }
    );
}