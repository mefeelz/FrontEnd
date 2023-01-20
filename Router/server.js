const express = require('express');
const Router = require('express-router');
const fetch = require("node-fetch");   // express-ejs-layouts 사용하기 설정
const app = express();
const router = express.Router();
const port = 3000;
const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

//middlewares
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

app.use(express.static('statics'));
app.set('views','views'); // 정적 파일 위치 지정
app.set('view engine', 'ejs'); // 템플릿 엔진 세팅

// var base_url = 'https://api.naechinso.com/';
var base_url = 'http://localhost:8080/';
app.get('/', (req,res)=>{
  return res.render("login.ejs");
})

app.post("/sms/verify", (req, res) => {
  
  console.log("여기왔니,.,!?!? !?" + req.body.code);
  var object = {};
  object["phoneNumber"] = req.body.phoneNumber;
  object["code"] = req.body.code;
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  var url = "http://api.naechinso.com/sms/verify";
  var accessToken = '';
  var refreshToken = '';

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body : JSON.stringify(object)
  }).then((response) => response.json())
    .then((res) => {
      console.log(res.data);
      accessToken = res.data.accessToken;
      refreshToken = res.data.refreshToken
    }).then(() => { 
      console.log(accessToken, refreshToken);
      res.cookie('accessToken', accessToken)
      res.cookie('refreshToken', refreshToken)
      return res.redirect("/main");
    })
    .catch((err) => {
      console.log("err" + err);
    });
});

router.get("/main", (req, res) => {
  if (!req.cookies['accessToken']) { 
    return res.redirect("/");
  }else{
  var url = base_url + "member/find";
  fetch(url, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((user) => {
      console.log(user);
      return res.render("main.ejs", {
        user: user.data,
      });
    })
    .catch((err) => {
      console.log("err" + err);
    });
  }
});

// localhost:8080/user
router.get('/user/:id', (req, res, next) => {
  if (!req.cookies['accessToken']) {
    return res.render("login.ejs", {
      user: user.data,
    });
  } else {
    var url = base_url+ "member/" + req.params.id;
    fetch(url, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((user) => {
        var detail_url = base_url+ "member/detail/" + req.params.id;
        fetch(detail_url, {
          method: 'GET'
        })
          .then(response => response.json())
          .then(userdetail => {
            var pending_url = base_url+ "pending/member/" + req.params.id;
            fetch(pending_url, {
              method: 'GET'
            }).then(response => response.json())
              .then(pending => {
                pending = pending.data;
                pending.reverse();
                console.log(user);
                console.log(pending);
                return res.render("user.ejs", {
                  user: user.data,
                  userdetail: userdetail.data,
                  pending: pending
                });
              });
          })
          .catch((err) => {
            console.log("err" + err);
          });
      });
  }
});

router.get("/pending", (req, res) => {
  if (!req.cookies['accessToken']) { 
    return res.render("login.ejs", {
      user: user.data,
    });
  } else {
    var url = base_url+ "pending/find";
    fetch(url, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((pending) => {
        console.log(pending);
        return res.render("pending.ejs", {
          pending: pending.data,
        });
      })
      .catch((err) => {
        console.log("err" + err);
      });
  }
});

router.post('/pending/:pendingId/accept', (req, res, next) => { 
  var accessToken = "Bearer " + req.cookies.accessToken
  var pendingId = req.params.pendingId
  var url = base_url+"pending/" + pendingId + "/accept"
  var object = {};
  object["charmLevel"] = req.body.charmLevel;

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": accessToken
    },
    body: JSON.stringify(object)
  }).then((response) => {
    console.log(response);
    return res.redirect("/user" + response.data.memberId);
  });
})

router.post('/pending/:pendingId/reject', (req, res, next) => { 
  var accessToken = "Bearer " + req.cookies.accessToken
  var pendingId = req.params.pendingId
  var url = base_url+"pending/" + pendingId + "/reject"
  var object = {};
  var userId = req.body.userId
  object["reason"] = req.body.reason;
  object["rejectImages"] = req.body.rejectImages;

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": accessToken
    },
    body: JSON.stringify(object)
  }).then((response) => {
    return res.redirect("/user/" + userId);
  });
})

router.get('/community', (req, res, next) => {
      var uid = req.query.uid;
      var type = req.query.type;
      var status = req.query.status;
      var keyword = req.query.keyword;
      var path = base_url+ "api/div/info?uid=" + uid;
      fetch(path, {
          method: 'GET'
        })
        .then(response => {
          return response.json();
        })
        .then(divdata => {
          console.log(divdata);
          var rank_url =
            base_url+ "api/div/rating?uid=" +
            uid +
            "&type=1&status=2";
          fetch(rank_url, {
              method: 'GET'
            })
            .then(response => response.json())
            .then(ratingdata => {
              if(keyword != undefined){
                console.log("keyword!@")
              var commu_url =
                base_url+ "api/div/community/search?keyword=" +
                encodeURI(keyword) +
                "&uid=" +
                uid;
              }else{
              var commu_url =
                base_url+ "api/div/community?uid=" +
                uid +
                "&type=" +
                type;
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
        var path = base_url+ "api/div/info?uid=" + uid;
        fetch(path, {
            method: 'GET'
          })
          .then(response => {
            return response.json();
          })
          .then(divdata => {
            console.log(divdata);

            var rank_url =
              base_url+ "api/div/rating?uid=" +
              uid +
              "&type=" +
              type +
              "&status=" +
              status;
            fetch(rank_url, {
                method: 'GET'
              })
              .then(response => response.json())
              .then(ratingdata => {
                if(keyword != undefined){
                  console.log("keyword!@")
                var local_url =
                  base_url+ "api/div/local/search?keyword=" +
                  encodeURI(keyword) +
                  "&uid=" +
                  uid;
                }else{
                var local_url =
                  base_url+ "api/div/local?uid=" +
                  uid +
                  "&type=" +
                  type +
                  "&status=" +
                  status;
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


// localhost:8080/login
router.get('/community',(req,res,next) => {
  res.render('community.ejs');
  next();
});

// localhost:8080/login
router.get('/qna',(req,res,next) => {
  var keyword = req.query.keyword;
  if(keyword != undefined){
    console.log("keyword!@")
    var path =
      base_url+ "api/qna/search?keyword=" +
      encodeURI(keyword) +
      "&type=1";
  }else{
    var path = base_url+ "api/qna/list?type=1";
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

// localhost:8080/login
router.get('/local',(req,res,next) => {
  res.render('local.ejs');
  next();
});

// localhost:8080/login
router.get('/reviewWrite',(req,res,next) => {
  res.render('reviewWrite.ejs');
  next();
});

app.use('/',router);

app.listen(port,() => console.log('Example app listening at http://localhost:'+port))