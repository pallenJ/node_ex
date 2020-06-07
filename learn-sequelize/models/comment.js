module.exports = (sequelize, DataType) =>{
    return sequelize.define('comment', {
        comment:{
            type: DataType.STRING(100),
            allowNull: false,
        },
        create_at:{
            type: DataType.DATE,
            allowNull: true,
            defaultValue: DataType.NOW,
        },
    },{
        timestamps: false,
    });
}