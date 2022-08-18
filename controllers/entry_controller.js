exports.index = function(req, res){
    res.render('index', { title: 'Dear Diary', user: req.user })
}

exports.entry_create_get = function(req, res, next){
    // res.json({ user: req.user })
    res.render('create_entry_form', { user: req.user })
}

exports.entry_create_post = [
    body()
]

exports.entry_delete_get = function(req, res, next){
    res.json({msg: 'To be implemented'})
}

exports.entry_delete_post = function(req, res, next){
    res.json({msg: 'To be implemented'})
}

exports.entry_update_get = function(req, res, next){
    res.json({msg: 'To be implemented'})
}

exports.entry_update_post = function(req, res, next){
    res.json({msg: 'To be implemented'})
}

exports.view_entry = function(req, res, next){
    res.json({msg: 'To be implemented'})
}

exports.entry_list = function(req, res, next){
    res.json({msg: 'To be implemented'})
}
