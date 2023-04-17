require('dotenv').config();
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const ejs = require("ejs");
const lowerCase = require('lodash.lowercase');
const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

mongoose.set('strictQuery', false);

// Connect to MongoDB database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

// create blog schema
const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

// create blog model
const Post = mongoose.model('Post', postSchema);

const homeStartingContent = "Welcome to my first blog website. In order for you to start posting a blog you will need to add '/compose' to the end of the website's URL to access the compose section of the page. The about and contact pages are filled with lorem ipsums to fill them in with content. They currently have no specific focus. Additionally, a function to delete a blog post has not been added yet.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

// home root response

app.get('/', function(req,res){

  Post.find({})
  .then((foundItems) => {
    res.render('home.ejs', {
      homeContent: homeStartingContent,
      // passes array and the array is read in home.ejs using a forEach loop to display
      homePosts: foundItems,
    });
  })
  .catch((err) => {
    console.log(err);
  });
});

// about response

app.get('/about', function(req, res){
  res.render('about', {
    about: aboutContent
  });
});

// contact response

app.get('/contact', function(req,res){
  res.render('contact', {
    contact: contactContent
  });
});

// compose response

app.get('/compose', function (req,res) {
    res.render('compose');
});

// compose post

app.post('/compose', function(req,res){

  const blogPost = new Post({
    title: req.body.blogtitle,
    content: req.body.blogpost
  })

  blogPost.save();
  res.redirect('/');
});

// route params response

app.get('/posts/:postID', (req,res) => {
  const requestedPostID = req.params.postID;

  Post.findOne({_id:requestedPostID})
  .then((foundPost) => {
    res.render('post', {
      selectedBlogTitle: foundPost.title,
      selectedBlogContent: foundPost.content
    });
  })
  .catch((err) => {
    console.log(err);
  })
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Listening to ${PORT}`);
  });
});