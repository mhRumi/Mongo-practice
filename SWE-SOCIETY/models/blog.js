const mongoose = require('mongoose');
const blogSchema = new mongoose.Schema({
    userId:{
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    blog_content: {
        type: String,
        required: true
    },
    postdate: {
        type: Date,
        default: Date.now()
    },
    image: {
        type: String
    },

    likes: {
        type: [Number]
    },
    isApproved: {
        type: Boolean,
        default: false
    }

});

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;