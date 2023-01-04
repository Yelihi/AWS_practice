const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs"); // 파일 시스템을 조작할 수 있는 fs 모듈

const { Post, Image, User, Hashtag } = require("../models");
const { Comment } = require("../models");

const { isLoggedIn } = require("./middlewares");

const router = express.Router();

try {
  fs.accessSync("uploads");
} catch (err) {
  console.log("upload 폴더가 없으니 생산합니다");
  fs.mkdirSync("uploads");
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, "uploads");
    },
    filename(req, file, done) {
      // 원익.jpg
      const ext = path.extname(file.originalname); // 확장자만 추출
      const basename = path.basename(file.originalname, ext); //원익
      done(null, basename + "_" + new Date().getTime() + ext); // 원익2341.jpg
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20mb
  // 프론트에서 클라우드로 바로 올릴수 있도록 하는게 맞는데, 일단은 이렇게 처리하자
});

router.post("/", isLoggedIn, upload.none(), async (req, res, next) => {
  try {
    const hashtags = req.body.content.match(/#[^\s#]+/g); // 정규표현식에 일치하는 것만 뜬다.
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id, // 이거 로그인 할 때, deserlialize 를 통해서 아이디만 들고 있다가, router 에 접근 시 그 전에 이걸 실행해서 사용자 데이터 복구해서 req.user 에 넣어놓는다고 하였다.
    });
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map((tag) =>
          Hashtag.findOrCreate({
            where: { name: tag.slice(1).toLowerCase() },
          })
        ) // findOrCreate 는 있으면 찾고 없으면 생성하는 메서드. 중복 태그 생성을 막기 위함이다.
      ); // [[노드, true], [리액트, true]] 이런식으로 전달이 되어서 밑에 map 을 써준다.
      await post.addHashtags(result.map((v) => v[0]));
    }
    if (req.body.image) {
      // req.body 안에 존재한다.
      if (Array.isArray(req.body.image)) {
        // 배열이라면 image: [123.png, dkfkd.png, ...] 이런식으로 오게된다.
        const images = await Promise.all(
          req.body.image.map((image) => Image.create({ src: image })) // 시퀄라이즈 작업은 비동기이기에 map 으로 돌린것이니 여러개. 따라서 promise.all
        ); // 직접 주소를 넣어준다. 사진 자체는 db 에 넣지는 않는다.
        await post.addImages(images);
      } else {
        // 1개라면 image: 123.png
        const image = await Image.create({ src: req.body.image });
        await post.addImages(image);
      }
    }
    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
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
          model: User, // 게시글 작성자
          attributes: ["id", "nickname"],
        },
        {
          model: User, // 좋아요 누른 사람
          as: "Likers",
          attributes: ["id"],
        },
      ],
    });
    res.status(201).json(fullPost);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post("/:postId/comment", isLoggedIn, async (req, res, next) => {
  // 주소 부분에서 동적으로 바뀌는 부분을 파라미터라고 한다.
  try {
    // 혹여나 게시글이 없는데 댓글을 달아버릴수도 있으니깐.
    const post = await Post.findOne({
      // 아이디로 게시글 찾기
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(403).send("존재하지 않는 게시글입니다."); // 요청 한번에 응답 한번
    }
    const comment = await Comment.create({
      content: req.body.content,
      PostId: parseInt(req.params.postId, 10), // req.params 는 문자열이다.
      UserId: req.user.id,
    });
    const fullComment = await Comment.findOne({
      where: { id: comment.id },
      include: [
        {
          model: User,
          attributes: ["id", "nickname"],
        },
      ],
    });
    res.status(201).json(fullComment);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post("/:postId/retweet", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: parseInt(req.params.postId, 10) },
      include: [
        {
          // 모델에서 retweetId 에 어떤 값이 들어있는 것이 있다.
          model: Post,
          as: "Retweet", // 이렇게 해주기에 post.Retweet 이 생긴다.
        },
      ],
    });
    if (!post) {
      return res.status(403).send("존재하지 않는 게시글입니다.");
    }
    // 자신의 글을 리트윗 하는 경우와, 자신을 글을 누군가 리트윗 했을 때 그 리트윗글에 내가 다시 리트윗 하는겅우, 2가지 경우를 막을 것임
    if (req.user.id === post.UserId || (post.Retweet && post.Retweet.UserId === req.user.id)) {
      return res.status(403).send("자신의 글은 리트윗 할 수 없습니다.");
    }
    const retweetTargetId = post.RetweetId || post.id;
    const exPost = await Post.findOne({
      where: {
        UserId: req.user.id,
        RetweetId: retweetTargetId,
      },
    });
    if (exPost) {
      return res.status(403).send("이미 리트윗했습니다.");
    }
    const retweet = await Post.create({
      UserId: req.user.id,
      RetweetId: retweetTargetId,
      content: "retweet", // allownull : false 라 어쩔수없음
    });
    const retweetWithPrevPost = await Post.findOne({
      where: { id: retweet.id },
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
          model: User,
          attributes: ["id", "nickname"],
        },
        {
          model: Image,
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
          ],
        },
        {
          model: User,
          as: "Likers",
          attributes: ["id"],
        },
      ],
    });
    res.status(200).json(retweetWithPrevPost);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get("/:postId", async (req, res, next) => {
  //GET post/1
  try {
    const post = await Post.findOne({
      where: { id: parseInt(req.params.postId, 10) },
    });
    if (!post) {
      return res.status(403).send("존재하지 않는 게시글입니다.");
    }
    const fullPost = await Post.findOne({
      where: { id: post.id },
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
          model: User,
          attributes: ["id", "nickname"],
        },
        {
          model: Image,
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
          ],
        },
        {
          model: User,
          as: "Likers",
          attributes: ["id"],
        },
      ],
    });
    res.status(200).json(fullPost);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post("/images", isLoggedIn, upload.array("image"), async (req, res, next) => {
  // POST /post/images
  res.json(req.files.map((v) => v.filename));
});

router.patch("/:postId/like", isLoggedIn, async (req, res, next) => {
  // PATCH /post/1/like
  try {
    const post = await Post.findOne({ where: { id: req.params.postId } });
    if (!post) {
      return res.status(403).send("게시글이 존재하지 않습니다");
    }
    await post.addLikers(req.user.id);
    res.status(200).json({ PostId: post.id, UserId: req.user.id });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.delete("/:postId/like", isLoggedIn, async (req, res, next) => {
  // DELETE /post/1/like
  try {
    const post = await Post.findOne({ where: { id: req.params.postId } });
    if (!post) {
      return res.status(403).send("게시글이 존재하지 않습니다.");
    }
    await post.removeLikers(req.user.id);
    res.status(200).json({ PostId: post.id, UserId: req.user.id });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.delete("/:postId/post", isLoggedIn, async (req, res, next) => {
  try {
    await Post.destroy({
      where: { id: req.params.postId, UserId: req.user.id }, // UserId 가 일치해야 글을 삭제할 수 있도록 하자.
    });
    res.status(200).json({ PostId: parseInt(req.params.postId, 10) });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
