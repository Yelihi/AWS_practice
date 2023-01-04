const passport = require("passport");
const local = require("./local");
const { User } = require("../models");

module.exports = () => {
  passport.serializeUser((user, done) => {
    // 유저 저장
    done(null, user.id); // 이게 아이디만 저장하는거, 첫번째 인자 서버에러, 두번째 인자 성공여부
  });

  passport.deserializeUser(async (id, done) => {
    // 유저 복구
    try {
      const user = await User.findOne({ where: { id } });
      done(null, user);
    } catch (err) {
      console.error(err);
      done(err);
    }
  });

  local();
};
