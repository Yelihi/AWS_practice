const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { User, Post, Image, Comment } = require("../models");
const router = express.Router();

const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

router.get("/", async (req, res, next) => {
  console.log(req.headers);
  try {
    if (req.user) {
      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.user.id },
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: Post,
          },
          {
            model: User,
            as: "Followings",
          },
          {
            model: User,
            as: "Followers",
          },
        ],
      });
      res.status(200).json(fullUserWithoutPassword);
    } else {
      res.status(200).json(null);
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get("/followers", isLoggedIn, async (req, res, next) => {
  // DELETE /user/1/userId
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
    });
    if (!user) {
      return res.status(403).send("존재하지 않는 유저입니다.");
    }
    const followers = await user.getFollowers({
      limit: parseInt(req.query.limit, 10),
    });
    res.status(200).json(followers);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/followings", isLoggedIn, async (req, res, next) => {
  // DELETE /user/1/userId
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
    });
    if (!user) {
      return res.status(403).send("존재하지 않는 유저입니다.");
    }
    const followings = await user.getFollowings({
      limit: parseInt(req.query.limit, 10),
    });
    res.status(200).json(followings);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/:userId", async (req, res, next) => {
  // GET /user/1
  try {
    const fullUserWithoutPassword = await User.findOne({
      where: { id: req.params.userId },
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: Post,
          attributes: ["id"],
        },
        {
          model: User,
          as: "Followings",
          attributes: ["id"],
        },
        {
          model: User,
          as: "Followers",
          attributes: ["id"],
        },
      ],
    });
    if (fullUserWithoutPassword) {
      const data = fullUserWithoutPassword.toJSON(); // json 으로 변경해주기
      data.Posts = data.Posts.length; // 개인정보 보호를 위해 그냥 길이로 가져온다.
      data.Followers = data.Followers.length; // 이렇게 안하면 포스트글을 다 가져와서 개인정보 유출이 될 수 있다.
      data.Followings = data.Followings.length;
      res.status(200).json(data);
    } else {
      res.status(404).send("존재하지 않는 사용자입니다.");
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post("/login", isNotLoggedIn, (req, res, next) => {
  // 이러한 패턴을 미들웨어 확장이라고 한다. 원래 passport 는 res,req, next 를 쓸수 없는 미들웨어인데 사용가능하게끔 확장함.
  passport.authenticate("local", (err, user, info) => {
    // 매개변수 이름은 마음대로
    if (err) {
      console.error(err);
      return next(err);
    }
    if (info) {
      return res.status(401).send(info.reason);
    }
    return req.login(user, async (loginErr) => {
      // passport 에서 login 할 수 있도록 해줌.
      if (loginErr) {
        // 이건 passport 에서의 에러
        console.error(loginErr);
        return next(loginErr);
      }
      // res.setHeader('Cookie', '랜덤문자');
      // 서버에서는 session 을 들고있다. 다만 이것도 백엔드 서버에서 다 가진게 아니라 아이디 값만 가지고 있다. 그래야 용량에서 유리하니.
      // req.login 실행시 동시실행되는게 index.js 에 serializeUser 실행된다.
      const fullUserWithoutPassword = await User.findOne({
        where: { id: user.id },
        attributes: {
          exclude: ["password"], // 비밀번호는 제외한다.
        },
        include: [
          {
            model: Post,
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followings",
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followers",
            attributes: ["id"],
          },
        ],
      });
      return res.status(200).json(fullUserWithoutPassword); // 뒤 데이터가 saga 에서 action.data, reducer 에선 me 에 들어간다.
    });
  })(req, res, next);
});
// Post / user/login

router.post("/logout", isLoggedIn, (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy();
    res.send("ok");
  });
});

router.post("/", isNotLoggedIn, async (req, res) => {
  try {
    const exUser = await User.findOne({
      // 조건 넣어주기
      where: {
        email: req.body.email,
      },
    });
    const exNickName = await User.findOne({
      where: {
        nickname: req.body.nickname,
      },
    });
    if (exUser) {
      return res.status(403).send("이미 사용중인 아이디입니다."); // return 안붙이면 밑에 코드도 실행되어 버린다
    }
    if (exNickName) {
      return res.status(403).send("이미 사용중인 닉네임입니다."); // return 안붙이면 밑에 코드도 실행되어 버린다
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 13);
    await User.create({
      email: req.body.email, // req.body == data == action.data
      nickname: req.body.nickname,
      password: hashedPassword,
    });
    res.status(200).send("ok");
  } catch (error) {
    console.log(error);
    next(error); // error 들이 express 가 브라우저에게 이런 에러 났다고 얘기해줌. status 500 에러
  }
}); // /user

router.get("/:userId/posts", async (req, res, next) => {
  try {
    let where = { UserId: req.params.userId };
    if (parseInt(req.query.lastId, 10)) {
      // 초기 로딩이 아닐때
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) }; // lastId 보다 작은 거 10개를 가져온다.
    }
    const posts = await Post.findAll({
      // 모든 게시글을 가져온다.
      where, // 페이지네이션 구현할 때, lastId 는 고정이기에 게시글 수정 삭제 추가 할 때도 관계없이 고정이다.
      limit: 10, // offset : 0~ 10 까지 가져와라, 즉 시작점을 말해준다. 근데 실무에서는 잘 안쓴다.
      order: [
        ["createdAt", "DESC"], // 최신 게시물
        [Comment, "createdAt", "DESC"],
      ], // 최신 댓글부터 가져온다.
      include: [
        {
          model: Post,
          as: "Retweet",
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
            {
              model: Image,
            },
          ],
        },
        {
          model: User, // 게시글 작성자
          attributes: ["id", "nickname"],
        },
        {
          model: Image,
        },
        {
          model: Comment,
          include: [
            {
              model: User, // 댓글 작성자
              attributes: ["id", "nickname"],
            },
          ],
        },
        {
          model: User, // 좋아요 누른 사람
          as: "Likers",
          attributes: ["id"],
        },
      ],
    });
    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    next(err);
  }
}); // GET / posts

// 닉네임 수정하기
router.patch("/nickname", isLoggedIn, async (req, res, next) => {
  try {
    await User.update(
      {
        nickname: req.body.nickname,
      },
      {
        where: { id: req.user.id },
      }
    );
    res.status(200).json({ nickname: req.body.nickname });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.patch("/:userId/follow", isLoggedIn, async (req, res, next) => {
  // PATCH /user/1/userId
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) {
      return res.status(403).send("존재하지 않는 유저입니다.");
    }
    await user.addFollowers(req.user.id);
    res.status(200).json({ id: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete("/:userId/follow", isLoggedIn, async (req, res, next) => {
  // DELETE /user/1/userId
  try {
    const user = await User.findOne({
      where: { id: parseInt(req.params.userId, 10) },
    });
    if (!user) {
      return res.status(403).send("존재하지 않는 유저입니다.");
    }
    await user.removeFollowers(req.user.id);
    res.status(200).json({ id: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete("/follower/:userId", isLoggedIn, async (req, res, next) => {
  // DELETE /user/1/userId
  try {
    const user = await User.findOne({
      where: { id: parseInt(req.params.userId, 10) },
    });
    if (!user) {
      return res.status(403).send("존재하지 않는 유저입니다.");
    }
    await user.removeFollowings(req.user.id);
    res.status(200).json({ id: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
