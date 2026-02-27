const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Routes

router.get('', async (req, res) => {
   try {
    const locals = {
        title: "Nodejs Blog",
        description: "Simple blog created with Nodejs and MongoDB"
    }
    
    let perPage = 10;
    let page = req.query.page || 1;

    const data = await Post.aggregate([ { $sort: { createdAt: -1 } } ])
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec();

    const count = await Post.countDocuments;
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage );

    res.render('index', { 
        locals, 
        data,
        current: page,
        nextPage: hasNextPage ? nextPage : null
    });

    } catch (error) {
    console.log(error);
    }
});




router.get('/about', (req, res) => {
    res.render('about');
});

router.get('/contact', (req, res) => {
    res.render('contact');
});

router.get('/projects', (req, res) => {
    res.render('projects');
});

router.get('/resumee', (req, res) => {
    res.sendFile(process.cwd() + '/public/files/cv-rui-viveiros.pdf');
});

// GET 
// Post: id
router.get('/post/:id', async (req, res) => {
    try{
        let slug = req.params.id;
        const data = await Post.findById( { _id: slug});
        const locals = {
        title: data.title,
        description: "Simple blog created with Nodejs and MongoDB"
        }
        res.render('post', { locals, data });
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;