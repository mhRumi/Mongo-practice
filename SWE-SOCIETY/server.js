var express = require("express");
var app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require("body-parser");
const sessions = require("express-session");
const fs = require('fs');
const formidabel = require("formidable");
const Member = require('./models/member');
const Blog = require('./models/blog');
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
var user

app.use("/public", express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(
  sessions({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false
  })
);

app.set("view engine", "ejs");

app.get("/", function(req, res) {
  res.render("login");
});

const home = app.get("/home", function(req, res) {
  res.render("index");
});

const batch = app.get("/batch", function(req, res) {
  res.render("batch");
});

const loginPage = app.get("/login", function(req, res) {
  res.render("login");
});

const login =  app.post("/login", async function(req, res) {

  try {

    const user = await Member.find(req.body);
     
    if(user){
      
      req.session.userId = user.reg_no;
      res.redirect("home");
      
    }
  
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: {
        error
      }
    });
  }
  
 
});

const about = app.get("/about", function(req, res) {
  res.render("about");
});
const me = app.get("/me", function(req, res) {

    res.render("me", {myinfo: user});
});

const logout = app.get("/logout", function(req, res) {
  req.session.destroy(function(error) {
    console.log(error);
    res.render("login");
  });
});

const committe = app.get("/committe", function(req, res) {
  res.render("committe");
});

const allcommittee = app.get("/allCommittee", function(req, res) {
  res.render("allCommittee");
});

const nav = app.get('/nav', function(req, res){
  res.render('./partials/nav');
})

const register = app.get("/register", function(req, res) {
  res.render("register.ejs");
});

const feeds =app.get('/feeds', function(req, res){
  res.render("feeds");
});

const blog = app.get("/blog", async function(req, res) {

  try {
    const blogs = await Blog.find();
    console.log(blogs);
    // res.status(200).json({
    //   status: 'success',
    //   results: blogs.length,
    //   data: {
    //   blogs
    //   }
    // });
    res.render("blog", {blog: blogs});
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: {
        error
      }
    });
  }

  
});

const createBlog = app.post("/blog", async function(req, res) {

  let formData = {};

  const prefixPath = "/public/blog/";
  let filePath = "/blog/";
  new formidabel.IncomingForm()
    .parse(req)
    .on("fileBegin", (image, file) => {
      const randPath = file.path.split("_")[1] + "." + file.type.split("/")[1];
      file.path = __dirname + prefixPath + randPath;
      filePath += randPath;
      console.log('FilePath: '+filePath);
    })
    .on("file", (name, file) => {
      formData[name] = filePath;

    })

  .on('field', (fieldName, fieldValue) => {
    formData[fieldName] = fieldValue;
    })
     
  .once('end', async() => {
   formData['userId'] = user.reg_no;

   try {

    console.log(formData);
    const newBlog = await Blog.create(formData);
    res.redirect("blog");
  } catch (error) {
    res.status(400).json({
    status: 'fail',
    message: error

    });
  }
    });
  
});


const createMember = app.post("/register", async function(req, res) {
  try{
    const newMember = await Member.create(req.body);
    res.redirect("home");
  }catch( err){
    res.status(400).json({
      status: 'fail',
      message: err

    });
  }
  
});


app.listen(8000);
