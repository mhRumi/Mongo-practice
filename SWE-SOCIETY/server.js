var express = require("express");
var app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const sessions = require("express-session");
const fs = require('fs');
const formidabel = require("formidable");

dotenv.config({path: './config.env'});
const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(con => {
  console.log(con.connections);
  console.log('Db connection successful');
})

var session;
var data;

app.use("/public", express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(
  sessions({
    secret: '98rw-0di9fw89e-09r8=w-ed-089f8s09d8f=w879464werwe',
    resave: false,
    saveUninitialized: true
  })
);



app.set("view engine", "ejs");

const memberSchema = new mongoose.Schema({
  reg_no: {
    type: Number,
    unique: true,
  },
  username: String,
  password: String,
  email: String,
  birth_date: Date,
  pro_pic: String,
  phone: String,
  batch: String,
  skills: String,
  facebook: String,
  linkedin: String,
  github: String,
  isgraduated: Boolean,
  isMailVarified: Boolean,
  isApproved: Boolean,
  isAlumni: Boolean,
  created_on: Date,
  last_login: Date
});

const Member = mongoose.model('Member', memberSchema);

app.get("/", function(req, res) {
  res.render("login");
});

app.get("/home", function(req, res) {
  res.render("index");
});

app.get("/batch", function(req, res) {
  res.render("batch");
});
app.get("/login", function(req, res) {
  res.render("login");
});

app.post("/login", function(req, res) {
  console.log(req.body);
  res.redirect("me");
 
});
app.get("/committe", function(req, res) {
  res.render("committe");
});
app.get("/about", function(req, res) {
  res.render("about");
});
app.get("/me", function(req, res) {

    res.render("me")
});

app.get("/logout", function(req, res) {
  req.session.destroy(function(error) {
    console.log(error);
    res.render("login");
  });
});

app.get("/allCommittee", function(req, res) {
  res.render("allCommittee");
});
app.get("/bal", function(req, res) {
  res.render("bal.ejs");
});
app.get("/register", function(req, res) {
  res.render("register.ejs");
});

app.get("/blog", function(req, res) {
  
   res.render("blog", {blog: data});
  
});

app.post("/blog", function(req, res) {

  console.log(req.body);
  let formData = {};

  const prefixPath = "/public/blog/";
  let filePath = "/blog/";
  new formidabel.IncomingForm()
    .parse(req)
    .on("fileBegin", (image, file) => {
      const randPath = file.path.split("_")[1] + "." + file.type.split("/")[1];
      file.path = __dirname + prefixPath + randPath;
      filePath += randPath;
    })
    .on("file", (name, file) => {
      formData[name] = filePath;

    })

  .on('field', (fieldName, fieldValue) => {
    console.log(fieldName+': '+fieldValue);
    formData[fieldName] = fieldValue;
    })
     
  .once('end', () => {

      console.log(formData.title);
      const query = {
        text: 'INSERT INTO public."blog"(user_id, title, blog_content, postdate, image, isapproved) VALUES($1, $2, $3, $4, $5, $6)',
        values: [session.reg_no, formData.title, formData.blog_content, new Date(), filePath, false],
      }
      client.query(query, (err, res) => {
        if (err) {
          console.log(err.stack);
        } else {
          console.log("Successfully update");
        }
      });
    });
  


  res.redirect("blog");
});

app.post("/register", function(req, res) {
  console.log(req.body);
  console.log(new Date());
  const query = {
    text: 'INSERT INTO public."members"(reg_no, username, pass, email) VALUES($1, $2, $3, $4)',
    values: [req.body.reg, req.body.username, req.body.password, req.body.email],
  }
  client.query(query, (err, res) => {
    if (err) {
      console.log(err.stack);
    } else {
      console.log(res.rows[1]);
    }
  });
  res.redirect("home");
});

app.listen(8000);
