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
router.get("/main", (req, res) => {
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
router.get("/main/search", (req, res) => {
  var keyword = req.query.keyword;
  console.log("keyord"+keyword);
  var url = "http://localhost:3000/api/main/search?keyword="+keyword;
  fetch(url) 
      .then(response => response.json())
      .then(answer => {
        return console.log("answer"+answer);
        // return res.render("aftersearch.ejs", { answer: answer});
        })
      .catch(err => {
        console.log("err"+err);
      });
});
// localhost:3000/login
router.get('/review', (req, res, next) => {
  var uid = req.query.uid;
  var type = req.query.type;
  var status = req.query.status;
  var path = "http://localhost:3000/api/div/info?uid=" + uid;
  fetch(path, {
      method: 'GET'
    })
    .then(response => {
      return response.json();
    })
    .then(divdata => {
      console.log(divdata);
      var rank_url = "http://localhost:3000/api/div/rating?uid=" + uid + "&type=" + type + "&status=" + status;
      fetch(rank_url, {
          method: 'GET'
        })
        .then(response => response.json())
        .then(ratingdata => {
          return res.render("review.ejs", {
            divdata: divdata,
            ratingdata: ratingdata
          });
        });
    }).catch(err => {
      console.log("err" + err);
    });
});


router.get('/community', (req, res, next) => {
      var uid = req.query.uid;
      var type = req.query.type;
      var status = req.query.status;
      var keyword = req.query.keyword;
      var path = "http://localhost:3000/api/div/info?uid=" + uid;
      fetch(path, {
          method: 'GET'
        })
        .then(response => {
          return response.json();
        })
        .then(divdata => {
          console.log(divdata);
          var rank_url = "http://localhost:3000/api/div/rating?uid=" + uid + "&type=1&status=2";
          fetch(rank_url, {
              method: 'GET'
            })
            .then(response => response.json())
            .then(ratingdata => {
              if(keyword != undefined){
                console.log("keyword!@")
              var commu_url = "http://localhost:3000/api/div/community/search?keyword="+encodeURI(keyword)+"&uid="+uid;
              }else{
              var commu_url = "http://localhost:3000/api/div/community?uid=" + uid + "&type=" + type;
              }
              fetch(commu_url, {
                  method: 'GET'
                })
                .then(response => response.json())
                .then(commudata => {
                  console.log("commu"+commudata);
                  return res.render("community.ejs", {
                    divdata: divdata,
                    ratingdata: ratingdata,
                    commudata: commudata
                  });
                });
              });
            })
            .catch(err => {
              console.log("err" + err);
            });
        });

      router.get('/local', (req, res, next) => {
        var uid = req.query.uid;
        var type = req.query.type;
        var status = req.query.status;
        var keyword = req.query.keyword;
        var path = "http://localhost:3000/api/div/info?uid=" + uid;
        fetch(path, {
            method: 'GET'
          })
          .then(response => {
            return response.json();
          })
          .then(divdata => {
            console.log(divdata);

            var rank_url = "http://localhost:3000/api/div/rating?uid=" + uid + "&type=" + type + "&status=" + status;
            fetch(rank_url, {
                method: 'GET'
              })
              .then(response => response.json())
              .then(ratingdata => {
                if(keyword != undefined){
                  console.log("keyword!@")
                var local_url = "http://localhost:3000/api/div/local/search?keyword="+encodeURI(keyword)+"&uid="+uid;
                }else{
                var local_url = "http://localhost:3000/api/div/local?uid=" + uid + "&type=" + type + "&status=" + status;
                }
                fetch(local_url, {
                    method: 'GET'
                  })
                  .then(response => response.json())
                  .then(localdata => {
                    return res.render("local.ejs", {
                      divdata: divdata,
                      ratingdata: ratingdata,
                      localdata: localdata
                    });
                  });
              });
          })
          .catch(err => {
            console.log("err" + err);
          });
      });


// localhost:3000/login
router.get('/community',(req,res,next) => {
  res.render('community.ejs');
  next();
});

// localhost:3000/login
router.get('/qna',(req,res,next) => {
  var keyword = req.query.keyword;
  if(keyword != undefined){
    console.log("keyword!@")
    var path = "http://localhost:3000/api/qna/search?keyword="+encodeURI(keyword)+"&type=1";
  }else{
    var path = "http://localhost:3000/api/qna/list?type=1";
  }
 
  fetch(path, {
      method: 'GET'
    })
    .then(response => {
      return response.json();
    })
    .then(qnadata => {
      console.log(qnadata);
      return res.render("QnA.ejs", {
        qnadata : qnadata,
      });
    })
    .catch(err => {
      console.log("err" + err);
    });
  });

// localhost:3000/login
router.get('/local',(req,res,next) => {
  res.render('local.ejs');
  next();
});

// localhost:3000/login
router.get('/reviewWrite',(req,res,next) => {
  res.render('reviewWrite.ejs');
  next();
});

app.use('/',router);

app.listen(port,() => console.log('Example app listening at http://localhost:'+port))