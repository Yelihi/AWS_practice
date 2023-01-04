<h1 align="center">Twitter 핵심기능 구현</h1>
<h3 align="center"> React Nodebird -Back- 정리 </h3> 
<br />

<h2 id="프로젝트소개"> :dart: 개요 및 목표</h2>

<p align="justify">
SNS 서비스 중 twitter 에서 사용되고 있는 기능들을 학습하였습니다. <br />
express 와 시퀄라이즈를 활용하여 mySQL 과 연동하여, 데이터를 관리하였고, 간단한 서버를 구현하였습니다.
</p>
<br />

![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)

<h2 id="사용 기술"> :book: 학습한 기술들</h2>

> **pakage**

- Node : @16.16.0
- Express : @4.18.2
- Express-session : @1.17.3
- MySQL2 : @2.3.3
- Sequelize : @5.22.5
- cors: @2.8.5
- passport: @0.6.0
- dotenv: @16.0.3
- cookie-parser: @1.4.6
- multer: @1.4.5
- morgan: @1.10.0
  <br />

![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)

<h2 id="구현목표"> :floppy_disk: 학습 내용(진행중)</h2>

- 개략적인 <b>node.js</b>, <b>express</b> 개념.
- <b>sequelize</b>를 통한 <b>MySQL</b> 데이터베이스 관리방법.
- 비밀번호 암호화를 위한 <b>bycript</b>.
- <b>Cors</b>문제가 발생하는 이유와 해결책.
- 로그인 처리과정. (<b>passport</b>, <b>session</b>, <b>cookie</b>, <b>dotenv</b>)
- 미들웨어를 이용한 로그인 유무 파악.
- 게시글 작성 과정에서 <b>params</b> 이용하기.
- credentails 로 쿠키 공유하는 방법.
- 게시글 불러오기, 게시글 제거, 닉네임 변경 과정.
- 이미지 업로드를 위한 <b>multer</b> 이용방법.

![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)

<h2 align="center" id="next">:large_blue_diamond: Study</h2>
<br>

<details>
<summary><b>node.js & express</b></summary>
<div markdown="1">
<br />

> **Node.js**

<p align="justify">
Node.js 에는 웹서버가 내장되어 있기 때문에 코드를 통해 서버를 만들고 실행할 수 있습니다.
</p>
<br />

```js
// 서버를 만드는 모듈 http 를 불러옵니다.
const http = require("http");
// 서버를 만드는 메서드를 활용해서 서버를 생성합니다.
const server = http.createServer((req, res) => {
  console.log(req.url, req.method); //request, response
  res.end("hello node");
});
// 3065 포트에 연결해줍니다. 연결이 되었다면 콘솔창에 찍히게 됩니다.
server.listen(3065, () => {
  console.log("서버 실행 중");
});
```

<p align="justify">
Node.js 모듈 시스템을 구축하고 있습니다. http 모둘을 가져오면서 서버를 실행시킬 수 있습니다. <br/><br />
위 createServer 메서드의 req, res 는 각각 request, response 를 의미합니다. request 는 요청을 담당하는데, 서버는 이러한 요청에 반응을 하게 됩니다. 그리고 그 결과를 response 에 담아서 돌려줍니다.
<br />요청에 대한 응답으로 어떠한 정보를 보내고 싶다면 이 response 에 담아서 전달하면 됩니다. 위 "hello node" 역시 메세지를 응답에 담아서 보내는 것입니다. 메세지 뿐 아니라 JSON, AJAX, Image 등 이러한 정보들을 담아서 전달할 수 있습니다.<br/></br/>
요청 -> 서버처리 -> 응답 으로 이어지는 흐름이고, 또한 하나의 요청은 하나의 응답으로 대응되어야 합니다.<br /><br />request, response 에는 header 부분과 body 부분이 있는데, header 부분에는 종류나 크기,캐시 여부 등등이 담겨있으며, body 에 실제로 주고받고자 하는 내용이 담겨져 있습니다. 
</p>
<br />

> **Express**

<p align="justify">
express 는 서버 구성을 도와주는 프레임워크입니다. 범용으로 자주 사용되는 프레임워크입니다.
</p>

```
npm i express
```

<p align="justify">
http 모듈은 express 에서 내부적으로 처리하기 때문에 사용하지 않아도 되며, `const app = express()` 를 사용해서 만든 Express app 객체로 모든 서버의 일을 처리합니다. 마지막에는 `app.listen()` 을 통해서 요청을 대기중입니다.
</p>

```js
// express 를 가져옵니다.
const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("hello express");
});

app.get("/api", (req, res) => {
  res.send("hello api");
});

app.get("/api/post", (req, res) => {
  res.json([
    {
      id: 1,
      content: "hello",
    },
    {
      id: 1,
      content: "hello",
    },
    {
      id: 1,
      content: "hello",
    },
  ]);
});

app.post("/api/post", (req, res) => {
  res.json({ id: 1, content: "hello" });
});

app.delete("/api/post", (req, res) => {
  res.json({ id: 1 });
});

app.listen(3065, () => {
  console.log("서버 실행 중");
});
```

  <br />

<p align="justify">
위 코드는 express 의 라우팅 부분에 대한 예시 입니다. 메서드에 대해 간단하게 요약하자면, 
</p>

- `app.get` : 가져오기
- `app.post` : 생성하기
- `app.put` : 전체 수정
- `app.delete` : 제거하기
- `app.patch` : 부분 수정
- `app.option` : 데이터를 보낼 수 있음을 암시
- `app.head` : 헤더만 가져오기

<p align="justify">
메서드의 경우 백엔드 개발자와 프론트엔드 개발자 간 협의에 의해 정하면 됩니다.<br /><br />
또한 app 상태내에서 너무 코드가 길어질 수 있으니, 라우터를 분리할 수 있습니다.
</p>

```js
const postRouter = require("./routes/post");

// 생략

app.use("/post", postRouter); // 공통된 주소를 빼줍니다.
```

```js
const express = require("express");
// router 를 설정해줍니다.
const router = express();

router.post("/", (req, res) => {
  res.json({ id: 1, content: "hello" });
});

router.delete("/", (req, res) => {
  res.json({ id: 1 });
});
// 모듈로서 export 시킵니다.
module.exports = router;
```

</div>
</details>

<details>
<summary><b>데이터베이스 설정</b></summary>
<div markdown="1">
<br />

> **Sequelize**

<p align="justify">
sequelize 는 MySQL 자바스크립트를 통해 관리할 수 있도록 도와줍니다.<br />
아래와 같이 설치 후 초기 셋팅을 하겠습니다.
</p>

```
npm i sequelize sequelize-cli mysql2
```

- mysql2 는 node 와 database 를 연결시켜주는 드라이버 같은 역할을 하게 됩니다.

```
npx sequelize init
```

- config.json

```json
{
  "development": {
    "username": "root",
    "password": "dnjsdlr1",
    "database": "react-nodebird",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": "dnjsdlr1",
    "database": "react-nodebird",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": "dnjsdlr1",
    "database": "react-nodebird",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
```

- 비밀번호를 입력해주고 데이터베이스의 이름을 정해주면 됩니다.
- 그리고 기본 폴더들이 설치되었을 텐데, 이 폴더 중 model/index.js 를 셋팅해주어야 합니다.

```js
// 시퀄라이즈를 불러오고
const Sequelize = require("sequelize");
// 기본값이 development 이며 셋팅을 했다면 앞에것으로 하겟습니다.
const env = process.env.NODE_ENV || "development";
// config.json 에서 [env] 에 따라 development, test, production 중에서 가져옵니다.
const config = require("../config/config.json")[env];
const db = {};

// 데이터를 가져옵니다.
const sequelize = new Sequelize(config.database, config.username, config.password, config);

// 이 부분은 추후 데이터간 일대다, 다대다 관계 시 연결된 부분들을 같이 연관시켜서 가져오게 됩니다.
// 반복문을 사용해서 일괄 처리해준것입니다.
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
```

<br />

> **데이터베이스 사용자 설계**

<p align="justify">
기본적으로 셋팅이 완료되었다면, 실제로 데이터들이 들어갈 데이터베이스를 설계하여야 합니다. models 폴더 안 생성하는 파일 이름이 곧 데이터테이블의 이름이 됩니다. 트위터에서 사용될 데이터베이스를 생각하여 파일을 생성합니다. 이 중 예를 들어 `User` 데이터를 살펴보겠습니다.
</p>

```js
const DataTypes = require("sequelize");
const { Model } = DataTypes;

// User 가 모델 이름입니다.
module.exports = class User extends Model {
  static init(sequelize) {
    return super.init(
      {
        email: {
          // 들어갈 데이터를 설정해줍니다.
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
        // 유저 모델에 대한 셋팅입니다.
        modelName: "User", // 이부분은 추후 프론트 엔드와의 연결 시 잘 맞춰주어야 합니다.
        tableName: "users",
        charset: "utf8", // 한글 저장이 가능하게 합니다.
        collate: "utf8_general_ci",
        sequelize,
      }
    );
  }
  static associate(db) {
    db.User.hasMany(db.Post); // 사람이 여러개의 게시글을 가질 수 있습니다. (hasMany)
    db.User.hasMany(db.Comment); // 사람이 여러개의 게시글을 가질 수 있습니다.
    db.User.belongsToMany(db.Post, { through: "Like", as: "Liked" }); // through 는 테이블 이름을 설정, as 는 햇갈리지 않게 별칭지어주기
    // Post 와 다대다 관계가 형성이 됩니다.
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
    // 같은 테이블에서 다대다는 foreignKey 가 필요합니다. 왜냐면 예를 들어 팔로잉한 사람을 찾고싶으면, 먼저 팔로워 쪽에서의 자신을 찾은 다음 팔로잉을 찾는것이기 때문이죠.
    // 그래서 foreignKey 로 Id 이름을 바꿔준다고 생각하면 됩니다.
  }
};
```

- 마치 표를 자바스크립트 코드로 작성한다고 생각하시면 됩니다.

<br />

> **sequelize 관계설정**

<p align="justify">
위 코드의 주석으로 설명이 나와있지만, 정리해보자면, 위 예시에서도 알 수 있듯이, 한 사람이 여러 글을 작성할 수 있으며, 그렇다고 한 게시글을 여러명이서 작성할 수 있는 것은 아닙니다. 이러한 관계를 일대다 관계라 하는데, 이런식으로 각 데이터간 관계들을 표현해주어야 올바르게 프론트에게 데이터를 전달할 수 있습니다. <br /><br />
기본적으로 시퀄라이즈에는 일대일, 일대다, 다대다 관계를 구별해주는 메서드가 있습니다.
</p>

- `belongsTo` : 속한다는 의미로 어떤 사용자에게 속해있는것입니다.
- `hasMany` : 많이 가지고 있다는 의미입니다.
- `belongsToMany` : 다대다 관계를 나타냅니다.
- `Through` : 다대다 관계에서 테이블의 이름을 정해줍니다. 다대다 관계는 중간 테이블이 필요하기 때문입니다.
- `as` : 다대다 관계의 column 을 지어줍니다.
- `foreignKey` : 같은 테이블에 다대다 관계가 맺어지면 같은 userId 이기 때문에 이를 구별해주기 위하여 필요합니다.

<br />

> **실제 mysql 과 연결시키기**

- index.js

```js
// 생략
// 모델들을 불러와줍니다.
const comment = require("./comment");
const hashtag = require("./hashtag");
const image = require("./image");
const post = require("./post");
const user = require("./user");

// 생략
// db 객체안에 넣어주며
db.Comment = comment;
db.Hashtag = hashtag;
db.Image = image;
db.Post = post;
db.User = user;

// 이들을 모두 시퀄라이즈와 연결시킵니다.
Object.keys(db).forEach((modelName) => {
  db[modelName].init(sequelize);
});

// 생략
```

- app.js

```js
const db = require("./models");

db.sequelize
  .sync()
  .then(() => {
    console.log("db 연결 성공");
  })
  .catch(console.error);
```

<p align="justify">
app.js 에서 설정이 끝났다면, 실제 mySQL 과 연결을 시켜주어야 합니다. 순서대로 진행합시다
</p>

- mysql server 를 실행시켜줍니다. (`mysql.server start`)
- `mysql -u root -p` 를 통해 시작합니다.
- 다음 vscode 로 돌아가 `npx sequelize db:create` 를 통해 연결시켜줍니다.
- 이제 workbench 에 들어가서 확인하면 됩니다.
- 참고로 workbench 는 추가로 설치해주면 됩니다.

<br />

</div>
</details>

<details>
<summary><b>비밀번호 암호화를 위한 bycript</b></summary>
<div markdown="1">
<br />

> **bycript**

<p align="justify">
비밀번호를 저장할 때 해킹의 위험에 대비하여 암호화를 할 필요가 있습니다. 이에 해시 메커니즘을 이용한 암호화를 해주는 bcrypt 를 사용하겠습니다.
<br />
bcrypt 는 패스워드를 해싱할 때 내부적으로 랜던한 salt 를 생성하기 때문에 같은 문자열에 대해서 매번 다른 해싱결과를 반환합니다. (단 길이는 동일합니다.) salt 값이 통합된 형식이기에, 변환 가능한 해시 값을 저장해놓은 표인 레인보 테이블만으로는 암호를 해킹할 수 없게 됩니다.
<br />
</p>

```
npm i bcyript
```

<p align='justify'> 회원가입을 하기 위하여, 사용자가 입력창에 아이디와 패스워드를 입력하여 서버에 전송하였다고 가정하겠습니다. 이렇게 되면 action 을 통해 백엔드 서버로 데이터가 전송이 되고, 이 때 기입한 암호가 그대로 전달이 됩니다. 이 암호를 해시화하여 암호화 하여야 합니다. 회원가입 과정을 코드로 나타내보겠습니다. </p>
<br />

> 예제 (회원가입)

```js
const express = require("express");
// bcrypt 를 import 해줍니다.
const bcrypt = require("bcrypt");
const { User } = require("../models");
const router = express.Router();

// /post 주소로 data와 함께 보낼 시, 회원가입이 진행이 됩니다.
router.post("/", async (req, res) => {
  try {
    const exUser = await User.findOne({
      // 우선 지금 기입한 정보로 된 유저가 기존에 존재하는지 부터 확인하겠습니다.
      where: {
        // 기입한 이메일
        email: req.body.email,
      },
    });
    // 또한 기입한 닉네임이 존재하는지도 확인하겠습니다.
    const exNickName = await User.findOne({
      where: {
        nickname: req.body.nickname,
      },
    });
    // 이메일이 존재한다면 에러메세지를 송부합니다.
    if (exUser) {
      return res.status(403).send("이미 사용중인 아이디입니다."); // return 안붙이면 밑에 코드도 실행되어 버리니 주의합시다.
    }
    // 닉네임 역시 존재한다면 에러메세지를 송부합니다.
    if (exNickName) {
      return res.status(403).send("이미 사용중인 닉네임입니다."); // 하나의 요청에 하나의 응답을 해주어야 합니다.
    }
    // 이제 받은 패스워드를 암호화 하는 과정입니다.
    // 뒤 숫자는 생성되는 salt 의 길이입니다.
    const hashedPassword = await bcrypt.hash(req.body.password, 13);
    // promise 를 활용하였기에 이러한 문법으로 작성했습니다.
    // 유저를 생성합니다.
    await User.create({
      email: req.body.email, // req.body == data == action.data
      nickname: req.body.nickname,
      password: hashedPassword,
    });
  } catch (error) {
    console.log(error);
    next(error); // error 들이 express 가 브라우저에게 이런 에러 났다고 얘기해줌. status 500 에러
  }
  // 생성이 성공적이라면 ok 를 보내줍니다.
  res.status(200).send("ok");
}); // /user

module.exports = router;
```

<p align='justify'>현재 기본적으로 사용한 방법은 공식 문서에 적혀있는 promise 를 활용한 hash 화 방법입니다.</p>

```js
bcrypt.hash(myPlaintextPassword, saltRounds).then(function (hash) {
  // Store hash in your password DB.
});
```

<p align='justify'>패스워드를 load 하는 방법은 아래와 같습니다.</p>

```js
// Load hash from your password DB.
bcrypt.compare(myPlaintextPassword, hash).then(function (result) {
  // result == true
});
```

<br />
<p align='justify'>각 요소들의 사용법은 공식 문서를 활용하도록 합시다</p>
</br>

[공식 문서](https://www.npmjs.com/package/bcrypt)

</div>
</details>

<details>
<summary><b>CORS 문제와 해결책</b></summary>
<div markdown="1">
<br />

> **CORS(Cross Origin Resource Sharing)**

<p align="justify">
CORS(Cross Origin Resource Sharing) 정책은 우리가 사용하는 리소스들이 안전한지 검사하는 브라우저의 방화벽과 같은 역할을 한다 생각하면 됩니다. 여기서 출처(Origin)은 URL 부분에 있어 프로토콜 + 호스트 + 포트 부분으로 이해하면 된다. 
<br />
해결 방법으로는 proxy 방법이 있고, 직접 서버측에서 처리하는 방법이 있는데 지금은 서버측에서 처리하는 방법을 활용하겠습니다. 자세한 설명은 아래 블로그 링크를 참고하시면 됩니다.
<br />
</p>

[CORS 정책에 대하여](https://rock7246.tistory.com/56)

<p align="justify">
미들웨어 cors 를 활용하여 해결이 가능합니다.
<br />
</p>

```
npm i cors
```

```js
app.use(
  cors({
    origin: true, // 요청하는 브라우저의 포트를 자동으로 설정해줍니다.
    credentials: true, // 쿠키를 서버에 전달하기 위해서 꼭 필요합니다.
  })
);
```

</div>
</details>

<details>
<summary><b>로그인 구현 과정(작성중)</b></summary>
<div markdown="1">
<br />

> **Passport**

</div>
</details>

![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)
