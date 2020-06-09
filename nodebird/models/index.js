
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password,config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

//model 선언
db.User = require('./user')(sequelize, Sequelize);
db.Post = require('./post')(sequelize, Sequelize);
db.Hashtag = require('./hashtag')(sequelize, Sequelize);

//관계 설정

//게시글 - 사용자간 매핑, 사용자 1명- 여러게시글
db.User.hasMany(db.Post);
db.Post.belongsTo(db.User);
/*
  해시태그 - 게시글 간 매핑. 게시글 하나에 여러 해시태그가 올 수 있고 
  같은 해시태그가 포함된 글이 있을 수 있으므로
  다대다 매핑에선 시퀄라이즈가 관계를 분석해서 PostHashtag라는 이름의 관계형 테이블을 자동생성
  칼럼명은 postId, hashTagId
*/
db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag'});
db.Hashtag.belongsToMany(db.Post,{ through: 'PostHashtag'});

/*
  팔로잉 기능. 이 경우 해시태그-게시글 관계가 유저-유저가 됨.
  followerId, followingId로 팔로워와 팔로잉유저를 구분.
  as 옵션은 시퀄라이즈가 조인 작업시 사용하는 이름.
  as에 등록된 이름을 바탕으로 get, add등의 메소드를 자동으로 추가해줌.
*/
db.User.belongsToMany(db.User,{
  foreignKey : 'followingId',
  as : 'Followers',
  through: 'Follow',
});

db.User.belongsToMany(db.User,{
  foreignKey : 'followerId',
  as : 'Followings',
  through: 'Follow',
});


module.exports = db;
