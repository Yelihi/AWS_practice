const express = require("express");
const { Op } = require("sequelize");

const { Post, User, Image, Comment, Hashtag } = require("../models");
const router = express.Router();

router.get("/:hashtag", async (req, res, next) => {
  try {
    let where = {};
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
          model: Hashtag,
          where: { name: decodeURIComponent(req.params.hashtag) }, // 에를 조건으로 적용하기.
        },
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

module.exports = router;
