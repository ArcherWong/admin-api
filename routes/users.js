const Router = require('koa-router');
const User = require('../models/User');

const router = new Router({
  prefix: '/api/users'
});

router.post('/', async ctx => {
  let body = ctx.request.body;
  let username = body.username;
  let password = body.password;
  let result = await User.find({username: body.username});
  if(result.length > 0) {
    ctx.body = {
      message: '用户已经存在！',
      status: false
    };
  } else {
    let user = new User({
      username: username,
      password: password
    });
    user.save(err => {
      if(err) {
        console.error(err);
      }
      console.log("user is saved!");
    });
    ctx.body = {
      message: '注册成功！',
      status: true
    };
  }
});

router.del('/:id', async ctx => {
  let id = ctx.params.id;
  User.remove({_id: id}, err => {
    if(err) {
      console.error(err);
    }
    console.log("user is removed!");
  });
  ctx.body = {
    message: '删除成功！',
    status: true
  };
});

router.put('/:id', async ctx => {
  let id = ctx.params.id;
  let body = ctx.request.body;
  let user = await User.findOneAndUpdate({_id: id}, body);
  ctx.body = {
    message: '修改成功！',
    status: true
  };
});

router.get('/:id', async ctx => {
  let id = ctx.params.id;
  let user = await User.findOne({_id: id});
  ctx.body = user;
});

router.get('/', async ctx => {
  let users = await User.find();
  ctx.body = users;
});

module.exports = router;