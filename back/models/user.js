const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class User extends Model {
  static init(sequelize) {
    return super.init(
      {
        email: {
          type: DataTypes.STRING(30), // 30글자 이하 STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME
          allowNull: false, // 필수
          unique: true, // 중복 안되게
        },
        nickname: {
          type: DataTypes.STRING(30), // 30글자 이하
          allowNull: false, // 필수
        },
        password: {
          type: DataTypes.STRING(100), // 30글자 이하
          allowNull: false, // 필수
        },
      },
      {
        // 유저 모델에 대한 셋팅
        modelName: "User",
        tableName: "users",
        charset: "utf8",
        collate: "utf8_general_ci",
        sequelize,
      }
    );
  }
  static associate(db) {
    db.User.hasMany(db.Post); // 사람이 여러개의 게시글을 가질 수 있다.
    db.User.hasMany(db.Comment); // 사람이 여러개의 게시글을 가질 수 있다.
    db.User.belongsToMany(db.Post, { through: "Like", as: "Liked" }); // through 는 테이블 이름을 설정, as 는 햇갈리지 않게 별칭지어주기
    db.User.belongsToMany(db.User, {
      through: "Follow",
      as: "Followers",
      foreignKey: "FollowingId",
    });
    db.User.belongsToMany(db.User, {
      through: "Follow",
      as: "Followings",
      foreignKey: "FollowerId",
    });
    // 같은 테이블에서 다대다는 foreignKey 가 필요하다. 왜냐면 예를 들어 팔로잉한 사람을 찾고싶으면, 먼저 팔로워 쪽에서의 자신을 찾은 다음 팔로잉을 찾는것이다.
    // 그래서 foreignKey 로 Id 이름을 바꿔준다고 생각하자. 안바꿔주면 둘다 userId 일테니깐
  }
};
