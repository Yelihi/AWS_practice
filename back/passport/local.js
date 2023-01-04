const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const { User } = require("../models");
const bcrypt = require("bcrypt");

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({
            where: { email: email }, // { email } 로 줄일수 있다. ES6 문법에 따라
          });
          if (!user) {
            return done(null, false, { reason: "존재하지 않는 사용자입니다!" }); // 첫번째자리 서버에러, 두번째 자리 성공여부, 세번째 자리 클라이언트에러(보내는쪽에서 잘못)
          }
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            return done(null, user); // 성공에다가 사용자 정보 넘겨주기
          }
          return done(null, false, { reason: "비밀번호가 틀렸습니다" });
        } catch (err) {
          console.error(error);
          return done(error); // 서버에러에 error 넣어주기
        }
      }
    )
  );
};
