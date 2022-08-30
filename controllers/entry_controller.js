const Entry = require('../models/entry');
const Category = require('../models/category');

const { body, validationResult } = require('express-validator');
const async = require('async')


exports.index = function(req, res){
    if(req.user){
        async.parallel({
            entries(callback){
                Entry
                .find({ userId: req.user._id })
                .limit(3)
                .sort({entry_date_time:-1})
                .exec(callback)
            },
            categories(callback){
                Category
                .find({ userId: req.user._id })
                .limit(5)
                .exec(callback)
            }
        }, function (err, results){
            if(err) return next(err);
            res.render('index', { title: 'Dear Diary', user: req.user, entries: results.entries, categories: results.categories  })
        })
    }else{
        res.render('index', { title: 'Dear Diary', user: req.user }) 
    }
    // res.render('index', { title: 'Dear Diary', user: req.user })
}

exports.entry_create_get = function(req, res, next){
    // res.json({ user: req.user })
    Category.find({userId: req.user._id})
    .exec(function (err, categories){
        if(err) { return next(err) }
        res.render('entry_form', { user: req.user, title: 'Create Entry', categories: categories })
    })
}

exports.entry_create_post = [
    (req, res, next) => {
        if(!(Array.isArray(req.body.category))){
            if(typeof req.body.category ==='undefined')
            req.body.category = [];
            else
            req.body.category = [req.body.category];
        }
        next();
    },

    body('name').trim().optional({ checkFalsy: true }).escape(),
    body('desc', 'Message cannot be empty').trim().isLength({ min:3 }).escape(),
    body('category.*').escape(),
    (req, res, next) =>{
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            res.render('entry_form', { user: req.user, errors: errors.array(), entry: req.body })
            return;
        }else{
            let time_now = new Date();
            let new_entry = new Entry({
                entry_text: req.body.desc,
                entry_title: req.body.name,
                entry_date_time: time_now,
                last_updated_time: time_now,
                category: req.body.category,
                year: time_now.getFullYear(),
                userId: req.user._id
            })
            new_entry.save(function(err){
                if(err) return next(err);
                res.redirect(new_entry.url);
            })
        }
    }
]

exports.entry_delete_get = function(req, res, next){
    Entry
    .findOne({ userId: req.user._id, _id: req.params.id })
    .populate('category')
    .exec(function(err, entry){
        if(err) { return next(err) }
        res.render('delete_entry', { title: 'Delete Entry', entry: entry});
    })
}

exports.entry_delete_post = function(req, res, next){
    Entry.findOneAndRemove({ _id:req.body.entry_id, userId: req.user._id}, function(err){
        if(err){ return next(err) }
        res.redirect('/diary')
    })
}

exports.entry_update_get = function(req, res, next){
    async.parallel({
        categories(callback){
            Category.find({ userId: req.user._id })
            .exec(callback)
        },
        entry(callback){
            Entry.findOne({ userId: req.user._id, _id: req.params.id })
            .exec(callback)
        }
    }, function(err, results){
        if(err){
            return next(err)
        }
        if(results.length==0 || !results){
            let err = new Error('Entry or Category not found')
            err.status = 404
            return next(err)
        }
        else{
            for (var cateory_iter = 0; cateory_iter < results.categories.length; cateory_iter++) {
                for (var entry_iter = 0; entry_iter < results.entry.category.length; entry_iter++) {
                    if (results.categories[cateory_iter]._id.toString()===results.entry.category[entry_iter]._id.toString()) {
                        results.categories[cateory_iter].checked='true';
                    }
                }
            }
            res.render('entry_form', { title: 'Update Entry', categories: results.categories, entry: results.entry })
        }
    })
}

exports.entry_update_post = [
    (req, res, next) => {
        if(!(Array.isArray(req.body.category))){
            if(typeof req.body.category ==='undefined')
            req.body.category = [];
            else
            req.body.category = [req.body.category];
        }
        next();
    },
    body('name').trim().optional({ checkFalsy: true }).escape(),
    body('desc').trim().isLength({ min:3 }).escape(),
    body('category.*').escape(),
    (req, res, next) =>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.render('entry_form', { user: req.user, errors: errors.array(), entry: req.body() })
            return;
        }else{
            let time_now = new Date();
            // let entry = new Entry({
            //     entry_text: req.body.desc,
            //     entry_title: req.body.name,
            //     last_updated_time: time_now,
            //     category: req.body.category,
            //     userId: req.user._id,
            //     _id: req.params.id
            // })
            // entry.save(function(err){
            //     if(err) return next(err);
            //     res.redirect(entry.url);
            // })
            Entry.findOneAndUpdate(
                { userId: req.user._id, _id: req.params.id },
                {
                    entry_text: req.body.desc,
                    entry_title: req.body.name,
                    last_updated_time: time_now,
                    category: req.body.category,
                    userId: req.user._id,
                    _id: req.params.id
                },
                {},
                function(err, entry){
                    res.redirect(entry.url)
                }
            )
        }
    }
]

exports.view_entry = function(req, res, next){
    
    Entry
    .findOne({ _id:req.params.id, userId: req.user._id })
    .populate('category')
    .exec(function(err, entry){
        if(err) return next(err)
        if(!entry){
            let err = new Error('Entry not found');
            err.status = 404;
            return next(err);
        }
        res.render('entry_detail', { user:req.user, entry: entry, category: entry.category })
    })
}

exports.entry_list = function(req, res, next){
    Entry
    .find({ userId: req.user._id })
    .populate('category')
    .sort({ entry_date_time: -1 })
    .exec(function(err, entries){
        if(err) return next(err)
        if(!entries || entries.length==0){
            let err = new Error('Entries not found');
            err.status = 404;
            return next(err);
        }
        res.render('entry_list', { user:req.user, entries: entries })
    })
    // res.redirect('/')
}
