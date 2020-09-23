var ObjectID = require('mongodb').ObjectID;

module.exports = function(app, db) {
  // PUT START
  // редактировании поста
  app.put('/post/:id', (req, res) => {
    const id = req.params.id;
    const query = { '_id': new ObjectID(id) };

    var updatedPost = {
      $set: {
        title: req.body.title,
        description: req.body.description,
        content: req.body.content,
      },
    };

    db.collection('post').updateOne(query, updatedPost, (err, result) => {
      if (err) {
          res.send({'error':'An error has occurred'});
      } else {
          res.send(result);
      } 
    });
  });

  // добавление комментария к статье
  app.put('/post/comment/:id', (req, res) => {
    const postCollection = db.collection('post');

    const details = { '_id': new ObjectID(req.params.id) };
    
    const newComment = {
      _id: new ObjectID().toString(),
      userName: req.body.userName,
      userId: req.body.userId,
      message: req.body.message,
      createDate: new Date(),
    };

    postCollection.findOneAndUpdate(details, { $addToSet: { comments: newComment } }, { returnOriginal: false },
      (err, result) => {
      if (err) {
        res.send({'error': 'An error has occurred'});
    } else {
        res.send(result.value);
    } 
    });
  });

  // удаление комментария из статьи
  app.put('/post/comment/:postId/delete', (req, res) => {
    const postCollection = db.collection('post');
    const query = { '_id': new ObjectID(req.params.postId) };

    postCollection.findOneAndUpdate(
      query,
      { $pull: { comments: { _id: req.body.commentId } } },
      { returnOriginal: false },
      (err, result) => {
        if (err) {
          res.send({'error': 'An error has occurred'});
        } else {
          res.send(result.value);
        } 
      },
    );
  });

  // редактирование комментария из статьи
  app.put('/post/comment/:postId/change', (req, res) => {
    const postCollection = db.collection('post');
    const query = { '_id': new ObjectID(req.params.postId) };

    postCollection.findOneAndUpdate(
      query,
      { $set: { "comments.$[element]": req.body.comment } },
      {
        multi:true,
        arrayFilters: [{ "element._id" : req.body.comment._id }],
        returnOriginal: false
      },
      (err, result) => {
        if (err) {
          res.send({'error': 'An error has occurred'});
        } else {
          res.send(result.value);
        } 
      },
    );
  });

  // DELETE START
  // удаление поста
  app.delete('/post/:id', (req, res) => {
    const id = req.params.id;

    const query = { '_id': new ObjectID(id) }

    db.collection('post').deleteOne(query, (err) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send('Post deleted!');
      } 
    });
  });

  // GET START
  // получение всех статей
  app.get('/posts', (req, res) => {
    const postCollection = db.collection('post');

    postCollection
      .find(
        {},
        {
          sort: [[
            'postDate',
            'desc'
          ]],
          projection: {
            content: 0,
            comments: 0,
          }
        })
      .toArray((err, result) => {
        if (err) {
          res.send(err);
        } else {
          res.send(JSON.stringify(result))
        }
      }
    );
  });

  // получение поста
  app.get('/post/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };

    db.collection('post').findOneAndUpdate(details, { $inc: { view: 1 } }, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send(item.value);
      }
    });
  });


  // POST START
  // добавление статьи
  app.post('/post', (req, res) => {
    const post = {
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
      comments: [],
      postDate: new Date(),
      view: 175862,
    };

    db.collection('post').insertOne(post, (err, result) => {
      if (err) { 
        res.send({ 'error': 'An error has occurred' }); 
      } else {
        console.log('post data ', post);
        res.send(result.ops[0]);
      }
    });
  });
};
