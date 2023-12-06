const mongoclient = require("mongodb").MongoClient;
const ObjId = require('mongodb').ObjectId;
const url = 
'mongodb+srv://1234:1234@cluster0.z7qwiig.mongodb.net/?retryWrites=true&w=majority';
let mydb;
mongoclient.connect(url)
    .then((client)=> {
        mydb = client.db("myboard");
    })
    

const express = require('express');
const app = express();
const sha = require('sha256');

let cookieParser = require('cookie-parser');
app.use(cookieParser('ncvka0e398323kpfd'));
app.get('/cookie', (req,res)=>{
res.cookie('milk','1000원',{signed:true});
res.send('product : '+ req.signedCookies.milk);
});

let session = require('express-session');
app.use(session({
    secret: '123jifji9e3',
    resave: false,
    saveUninitialized: true,
}));

app.get('/session', (req,res)=> {
    if(isNaN(req.session.milk)){
        req.session.milk = 0;
    }
    req.session.milk = req.session.milk+1000;
    res.send('session : ' + req.session.milk+'원');
});

app.use(express.static('public'));

// body parser 추가
const bodyParser = require('body-parser');
const { render } = require("ejs");
app.use(bodyParser.urlencoded({extended:true}));


app.set('view engine', 'ejs');

app.listen(8080,function(){
    console.log("포트 8080으로 서버 대기중 ... ")
});

app.get('/enter',function(req,res){
    res.sendFile(__dirname + '/enter.html');
    });

app.get('/entermongo',function(req,res){
    if(req.session.user){
        console.log('세션 유지');
        res.render('enter.ejs');
    }else{
        res.render('login.ejs');
    } 
    });

    app.get('/signup',function(req,res){
        res.render('signup.ejs');
        });    

    app.get('/login',function(req,res){
        console.log(req.session);
        if(req.session.user){
            console.log('세션 유지');
            res.render('index.ejs',{user:req.session.user});
        }else{
            res.render('login.ejs');
        }  
        });

    app.get('/logout',function(req,res){
        console.log('로그아웃');
        req.session.destroy();
        res.render('index.ejs',{user:null});
        });

app.post('/save',function(req,res){
    console.log(req.body.title);
    console.log(req.body.content);
    console.log(req.body.someDate);
    let sql = "insert into post (title, content, created) values(?,?,?)";
    let params = [req.body.title,req.body.content,req.body.someDate];
    conn.query(sql,params,function(err,result){
        if(err) throw err;
        console.log('데이터 추가 성공');
    });
    res.send('데이터 추가 성공');
     });

app.post('/savemongo',function(req,res){
    console.log(req.session.user);

   console.log(req.body.title);
   console.log(req.body.content);

   let now = new Date();

   mydb.collection('post').insertOne(
    {userid: req.session.user.userid, title : req.body.title, content:req.body.content, date : now.getTime()})
    .then(result => {
        console.log(result);
        console.log('데이터 추가 성공');
   });
    res.redirect('/listmongo');
     });

     app.post('/signup',function(req,res){
        console.log(req.body);
     
        mydb.collection('account').insertOne(
         {userid : req.body.userid, userpw:sha(req.body.userpw), usergroup: req.body.usergroup,useremail: req.body.email})
         .then(result => {
             console.log(result);
             console.log('회원가입 성공');
        });
         res.redirect('/');
          });

app.get('/',function(req,res){
    res.render('index.ejs',{user:null});
    });

    app.get('/1',function(req,res){
        res.render('1.ejs',{user:null});
        });
    
        app.get('/2',function(req,res){
            res.render('2.ejs',{user:null});
            });

            app.get('/3',function(req,res){
                res.render('3.ejs',{user:null});
                });

                app.get('/4',function(req,res){
                    res.render('4.ejs',{user:null});
                    });

                    app.get('/5',function(req,res){
                        res.render('5.ejs',{user:null});
                        });

                        app.get('/6',function(req,res){
                            res.render('6.ejs',{user:null});
                            });

app.get("/list" , function (req , res){
     conn.query("select * from post" , function (err,rows,fields){
         if(err) throw err;
         console.log(rows);
         res.render('list.ejs', {data : rows});
     });
    });


    app.post("/deletemysql", function (req, res) {
        console.log(req.body);
      let sql = "DELETE FROM post WHERE id = ?";
      let params = [req.body.id];
        conn.query(sql, params, function (err, result) {
            if (err) {
                console.log(err);
                res.status(500).send();
            } else {
                console.log('삭제완료');
                res.status(200).send();
            }
        });
    });
    
     app.get("/listmongo",function(req,res){
        mydb.collection("post")
        .find()
        .toArray()
        .then((result) => {
            console.log(result);
        res.render('list_mongo.ejs', {data : result});
     });
    });

    app.get("/content/:id", function(req,res){
        console.log(req.params.id);
        let new_id = new ObjId(req.params.id);

        mydb.collection("post")
        .findOne({_id:new_id})
        .then(result => {
            console.log(result);
        res.render('content.ejs', {data : result});
     })   .catch(err =>{
        console.log(err);
        res.status(500).send();
   
});
    });

    app.get("/edit/:id", function(req,res){
        console.log(req.params.id);
        let new_id = new ObjId(req.params.id);

        mydb.collection("post")
        .findOne({_id:new_id})
        .then(result => {
            console.log(result);
        res.render('edit.ejs', {data : result});
     })   .catch(err =>{
        console.log(err);
        res.status(500).send();
   
});
    });

    app.post("/login", function(req,res){

        mydb.collection("account")
        .findOne({userid : req.body.userid})
        .then(result => {
            if(result.userpw==sha(req.body.userpw)){
                req.session.user=req.body;
                console.log('새로운 로그인');
                res.render('index.ejs',{user : req.session.user});
            }else{
                res.render('login.ejs'); 
            }
   
        });
    });


app.post("/delete",function(req,res){
    console.log(req.body);
    req.body._id = new ObjId(req.body._id);
    mydb.collection('post').deleteOne(req.body)
    .then(result =>{
        console.log('삭제완료');
        res.status(200).send();
    }) 
    .catch(err =>{
        console.log(err);
        res.status(500).send();
   
});
});

app.post('/edit',function(req,res){
    console.log(req.body.title);
    console.log(req.body.content);
    console.log(req.body.someDate);
    
   let new_id  = new ObjId(req.body.id);
    mydb.collection('post').updateOne({_id:new_id},
    {$set:  {title : req.body.title, content:req.body.content, date : req.body.someDate}})
     .then(result => {
         console.log('데이터 수정 성공');
         res.redirect('/listmongo');
    });
      });