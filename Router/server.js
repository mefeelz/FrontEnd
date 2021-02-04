const express = require('express');
const Router = require('express-router');
                     // express-ejs-layouts 사용하기 설정

const app = express();
const router = express.Router();
const port = 3000;

app.set('views','views'); // 정적 파일 위치 지정
app.set('view engine','ejs'); // 템플릿 엔진 세팅

router.get('/',(req,res,next) => {
  res.render('main.ejs');
  next();
});


app.use('/',router);

app.listen(port,() => console.log('Example app listening at http://localhost:'+port))