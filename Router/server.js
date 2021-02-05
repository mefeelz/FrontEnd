const express = require('express');
const Router = require('express-router');
const fetch = require("node-fetch");   // express-ejs-layouts 사용하기 설정
const app = express();
const router = express.Router();
const port = 3002;

app.set('views','views'); // 정적 파일 위치 지정
app.set('view engine','ejs'); // 템플릿 엔진 세팅
app.use(express.static('statics'));

//One of the routes
router.get("/", (req, res) => {
  fetch("http://localhost:3000/api/main/qna") 
      .then(response => response.json())
      .then(qnadata => {
        fetch("http://localhost:3000/api/main/div-rank",{method: 'GET'}) 
        .then(rankresponse =>{return rankresponse.json()})
        .then(rankdata => {
        return res.render("main.ejs", { qna: qnadata , rank : rankdata});
        })
      })
      .catch(err => {
        console.log("err"+err);
      });
});

// localhost:3000/login
router.get('/login',(req,res,next) => {
  res.render('login.ejs');
  next();
});

// localhost:3000/login
router.get('/review/:uid',(req,res,next) => {
  var uid = req.params.uid;
  fetch("http://localhost:3000/api/div/info?uid="+uid,{method:'GET'}) 
  .then(response => response.json())
  .then(divdata => {
    return res.render("review.ejs", { divdata: divdata});
  }).catch(err => {
    console.log("err"+err);
  });
});

// localhost:3000/login
router.get('/community',(req,res,next) => {
  res.render('community.ejs');
  next();
});

// localhost:3000/login
router.get('/qna',(req,res,next) => {
  res.render('qna.ejs');
  next();
});

// localhost:3000/login
router.get('/local',(req,res,next) => {
  res.render('local.ejs');
  next();
});

app.use('/',router);

app.listen(port,() => console.log('Example app listening at http://localhost:'+port))