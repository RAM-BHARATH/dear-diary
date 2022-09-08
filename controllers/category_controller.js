const Category = require('../models/category');
const async = require('async')

const { body, validationResult } = require('express-validator');
// const category = require('../models/category');
const Entry = require('../models/entry')

exports.category_detail = function(req, res, next){
    // Category.findOne({_id: req.params.id, userId: req.user._id}).exec(
    //     function(err, category){
    //         if(err){ return next(err) }
    //         if(!category){
    //             let err = new Error('Category not found');
    //             err.status = 404
    //             return next(err)
    //         }
    //         res.render('category_detail', { user: req.user, category: category })
    //     }
    // )
    async.parallel({
        category(callback){
            Category.findOne({_id: req.params.id, userId: req.user._id}).exec(callback)
        },
        entries(callback){
            Entry.find({category: req.params.id, userId: req.user._id }).populate('category').exec(callback)
        }
    }, function(err, results){
        if(err){ return next(err) }
            if(!results.category){
                let err = new Error('Category not found');
                err.status = 404
                return next(err)
            }
        res.render('category_detail', { user: req.user, category: results.category, entries: results.entries })
    })
}

exports.category_create_get = function(req, res, next){
    res.render('category_form', {user: req.user })
}

exports.category_create_post = [
    body('name', 'Category name required').trim().isLength({ min: 1 }).escape(),
    body('description').trim().optional({ checkFalsy: true }).isLength({ min:1 }).escape(),
    (req, res, next)=>{
        const errors = validationResult(req);
        let category = new Category({
            name: req.body.name,
            description: req.body.description,
            userId: req.user._id
        });

        if(!errors.isEmpty()){
            res.render('category_form', { title: 'Create Category', category: category })
        } else{
            Category.findOne({ 'name': req.body.name })
                .exec(function(err, found_category){
                    if(err) return next(err);
                    if(found_category){
                        res.redirect(found_category.url);
                    } else{
                        category.save(function(err){
                            if(err) { return next(err) }
                            res.redirect(category.url);
                        })
                    }
                })
        }
    }
]

exports.category_update_get = function(req, res, next){
    Category
    .findOne({ userId: req.user._id, _id: req.params.id  })
    .exec(function(err, category){
        if(err) return next(err);
        res.render('category_form', { user: req.user, category: category })
    })
}

exports.category_update_post = [
    body('name', 'Name is required').trim().isLength({ min:1 }).escape(),
    body('descritption').trim().optional({ checkFalsy: true }).isLength({ min:1 }).escape(),
    (req, res, next) =>{
        let errors = validationResult(req);
        
        let category = new Category({
            name: req.body.name,
            description: req.body.description,
            userId: req.user._id,
            _id: req.params.id
        })

        if(!errors.isEmpty()){
            res.render('category_form', { title: 'Create Category', category: category })
        } else{
            Category.findOneAndUpdate(
                { _id: req.params.id, userId: req.user._id }, category, {}, 
                function(err, updatedCategory){
                    if(err) return next(err);
                    res.redirect(updatedCategory.url)
                }
            )
        }
    }
]   

exports.category_delete_get = function(req, res, next){
    Category
    .findOne({ userId: req.user._id, _id: req.params.id })
    .exec(function(err, category){
        if(err){ return next(err) }
        if(category){
            res.render('delete_category', { title: 'Delete Category', category: category, user: req.user })
        }
    })
}

exports.category_delete_post = function(req, res, next){
    async.parallel({
        category(callback){
            Category
            .findOneAndRemove({ _id:req.body.category_id, userId: req.user._id})  
            .exec(callback)
        },
        entries(callback){
            Entry.updateMany(
                { userId: req.user._id, category: req.params.id },
                { '$pull': { "category": req.params.id } },
                { 'multi': true }
            ).exec(callback)
        }
    }, function(err, results){
        if(err){ return next(err) }
        if(!results.category || results.category.length==0){
            let err = new Error('Category not found')
            err.status = 404;
            return next(err)
        }
        res.redirect('/diary');
    })
    
}

exports.category_list = function(req, res, next){
    Category.find({ userId: req.user._id })
    .exec(function(err, categories){
        if(err) return next(err);
        if(categories){
            res.render('category_list', { title: 'All Categories', categories: categories, user: req.user})
        }
    })
}