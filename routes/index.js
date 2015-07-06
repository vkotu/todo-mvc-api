var express = require('express');
var router = express.Router();
var mysql = require('./mysql');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/todos',function(req,res,next){
  var qry = "select * from todos";
  console.log("here2");
  mysql.fetchData(qry,[],function(err,results){
    if(!err){
      results.forEach(function(entry){
        console.log(entry);
      });
      var todos = {
        todos:results
      }
      res.send(todos);
    }else{
      res.send({"status":"error"});
    }
  });
});

router.post('/api/todos',function(req,res,next){
  var qry = "insert into todos (title,iscompleted) values (?,?)";
  console.log(req.body);
  var todo = req.body.todo;
  var title = todo.title;
  var isCompleted = todo.isCompleted;
  mysql.execQuery(qry,[title,isCompleted],function(err,results){
    if(!err){
      var id = results.insertId;
      res.send({"todo":{"id":id,"title":title,"isCompleted":isCompleted}});
    }else{
      res.send({"status":"error"});
    }
  });
});

router.put('/api/todos/:id',function(req,res,next){
  var qry = "update todos set title=?,isCompleted=? where id =?";
  console.log(req.body);
  var todo = req.body.todo;
  var title = todo.title;
  var isCompleted = todo.isCompleted;
  var id = parseInt(req.params.id);
  mysql.execQuery(qry,[title,isCompleted,id],function(err,results){
    if(!err){
      res.send({"todo":{"id":id,"title":title,"isCompleted":isCompleted}});
    }else{
      res.send({"status":"error"});
    }
  });
});

router.delete('/api/todos/:id',function(req,res,next){
  var qry = "delete from todos where id =?";
  var id = parseInt(req.params.id);
  mysql.execQuery(qry, [id], function (err, results) {
    if (!err) {
      res.send({'status':'success'});
      res.end();
    } else {
      res.send({'status': "error"});
      res.end();
    }

  });

});


module.exports = router;
