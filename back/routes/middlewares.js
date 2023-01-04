exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    // 여기가 로그인여부 인증하는 곳
    next();
  } else {
    res.status(401).send("로그인이 필요합니다.");
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next(); // 인자가 없으니 다음 미들웨어로 간다. 인자가 들어있다면 에러처리 미들웨어로 간다. 에러처리 미들웨어는 app.js 에 있는 app.listen 에서 처리, 아니면 직접 만듬
  } else {
    res.status(401).send("로그인하지 않은 사용자만 접근 가능합니다");
  }
};
