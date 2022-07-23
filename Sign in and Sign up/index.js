const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql');
const session = require('express-session');

app.use(session({secret:'secret', resave:true, saveUninitialized:true}));
app.use(express.json());
app.use(express.urlencoded({extented:true}));

// app.use(express.static(path.join(__dirname,'static')));

const database=mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'',
  database:'logintoday'
});

app.get('/',(req, res)=>{
  res.sendFile(path.join(__dirname,'/login.html'));
})

app.post('/auth',(req,res)=>{
  let username=req.body.username;
  let password=req.body.password;

  if(username && password)
  {
    database.connect(function (err){
      if(err) throw err;
      console.log("Connected Database in MySQL")
    });

    // var condition = 'SELECT * FROM users WHERE username = ? AND password = ?';
    // database.query(condition, [username, password], (err, result)=>{
    //   if(err) throw err;

    //   if(result.length >0)
    //   {
    //     res.send("Validated");
    //   }
    //   else{
    //     res.send("Wrong username/password combination");
    //   }
    //   res.end();
    // });

    database.query('SELECT * FROM users WHERE username = ? AND password = ?',[username, password], (err,result)=>{
      if(err) throw err;

      if(result.length >0)
      {
        // res.send("Validated");
        req.session.loggedIn=true;
        req.session.username=username;
        res.redirect('/home');
      }
      else{
        res.send("Wrong username/password combination");
      }
      res.end();
    });
  }
  else{
    res.send("Please enter your username and password");
    res.send();
  }
})

app.get('/home',(req,res)=>{
  if(req.session.loggedIn){
    res.send("Hai!"+req.session.username);
  }
  else{
    res.send("Please login");
  }
  res.end();

})

app.get('/Signup',(req, res)=>{
  res.sendFile(path.join(__dirname,'/Signup.html'));
})

app.post('/userregistration', (req,res)=>{
  const username = req.body.username;
  const password=req.body.password;
  database.query('INSERT INTO users (username, password) values(?,?)', [username, password], (err,result)=>{
    res.send("Registerd Successfully!!")
  })
})

app.listen(3007, ()=>{
    console.log("Your app is listening 3007");
})

// Console will print the message
console.log('Server running at http://127.0.0.1:3007/');


// var http = require('http');
// var formidable = require('formidable');
// var fs = require('fs');

// http.createServer(function (req, res) {
//   if (req.url == '/fileupload') {
//     var form = new formidable.IncomingForm();
//     form.parse(req, function (err, fields, files) {
//       var oldpath = files.filetoupload.filepath;
//       var newpath = 'D:/Kruthika/Node/' + files.filetoupload.originalFilename;
//       fs.rename(oldpath, newpath, function (err) {
//         if (err) throw err;
//         res.write('File uploaded and moved!');
//         res.end();
//       });
//  });
//   } else {
//     res.writeHead(200, {'Content-Type': 'text/html'});
//     res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
//     res.write('<input type="file" name="filetoupload"><br>');
//     res.write('<input type="submit">');
//     res.write('</form>');
//     return res.end();
//   }
// }).listen(8080);

// console.log('Server running at http://127.0.0.1:8080/');
