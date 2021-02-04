const express = require('express');
const Router = require('express-router');
var expressLayouts = require('express-ejs-layouts');

const app = express();
const router = express.Router();
const port = 3000;

app.set('view engine', 'ejs');                  // express 의 view 엔진을 ejs 로 세팅 
app.set('views', __dirname + '/views');         // 디폴트 view 경로세팅 
app.use(expressLayouts);                        // express-ejs-layouts 사용하기 설정

router.get('/',(req,res,next) => {
  res.render('main.ejs');
  next();
});

app.use('/',router);

app.listen(port,() => console.log('Example app listening at http://localhost:'+port))