import express, { response } from "express";
import { coursePage, introducePage, mainPage } from "./controller/webController.js";
import db from "./config/db.js";
import { getCourseList } from "./controller/courseController.js";

const app = express();

const PORT = 8000;

// 서버 오픈 - 서버 계속 돌려돌려
app.listen(PORT, () => {
  console.log(`서버가 열렸다. http://localhost:${PORT}`);
});

// EJS
app.set("view engine", "ejs");
app.set("views", process.cwd() + "/src/client/html");
//허용

// 정적 파일 내보내기
app.use("/css", express.static("src/client/css"));
app.use("/js", express.static("src/client/js"));
app.use("/file", express.static("src/client/file"));

app.use((req, res, next) => {
  console.log("통과합니다.");
  // 차단 ㄱ ㄱ
  next();
});

// JSON 형식 변환 미들웨어
app.use(express.json())

// const middleware = (req, res, next) => {
//   const ok = req.query.ok;
//   console.log(ok);
//   if (ok === "true") {
//     next();
//   } else {
//     res.send("잘못된 주소입니다.");
//   }
// };

// 웹라우터
app.get("/", mainPage);
app.get("/introduce", introducePage);
app.get("/course",coursePage)

// api라우터
app.get("/api/course", getCourseList);


// // GET
// app.get("/test", middleware, (req, res) => {
//   const data = req.query;
//   console.log(data);
//   res.send("abc");
// });
