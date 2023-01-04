const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");

const postRouter = require("./routes/post"); // 게시글 하나 작성, 댓글 하나 작성, 하나 지우기 등 단수
const userRouter = require("./routes/user");
const postsRouter = require("./routes/posts"); // 게시글 여러개를 가져오기
const hashtagRouter = require("./routes/hashtag");
const db = require("./models");

const passport = require("passport");
const passportConfig = require("./passport");

const app = express();

dotenv.config();
passportConfig();

db.sequelize
  .sync()
  .then(() => {
    console.log("db 연결 성공");
  })
  .catch(console.error);

app.use(morgan("dev"));
// 밑 메서드 및 라우터 위에 이거 적어주자.
app.use(
  cors({
    origin: true,
    credentials: true, // 쿠키를 서버에 전달하기 위해서 꼭 필요하다.
  })
);
app.use("/", express.static(path.join(__dirname, "uploads"))); // 디렉토리 폴더에 uploads 폴더를 추가해준다.
// '/' 는 localhost:3065/ 이다. 프론트에서 이 주소로 접근할 수 있다.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// 세션과 쿠키 설정해주기. 로그인했다 하더라도 브라우저와 백엔드 서버가 다른 포트를 사용하니, 브라우저에다가 로그인 정보를 보내준다
// 근데 비밀번호를 그대로 전달하면 보안에 취약하니, 대신 렌덤한 글자를 보내준다.
// 이걸 쿠키라고 한다.
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET, // 치환되서 들어감
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/post", postRouter);
app.use("/user", userRouter);
app.use("/posts", postsRouter);
app.use("/hashtag", hashtagRouter);

// 직접 에러를 특별하게 처리하고 싶다면
// app.use((err, req, res, next) => {})

app.listen(3065, () => {
  console.log("서버 실행 중!");
});
