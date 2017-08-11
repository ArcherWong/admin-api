const Router = require('koa-router');
const multer = require('koa-multer');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

const User = require('../models/User');
const jwtConfig = require('../config/jwt');

const upload = multer({ dest: __dirname + '/public/upload' });

const router = new Router({
  prefix: '/api'
});

router.get('/', async ctx => {
  ctx.body = 'Hello World';
});

router.post('/upload', upload.any(), async ctx => {
  ctx.req.files.forEach(file => {
    let {originalname, path, mimetype} = file;
    fs.rename(path, `${__dirname}/public/upload/` + originalname);
  });
  ctx.body = 'upload success';
});

router.post('/login', async ctx => {
  let body = ctx.request.body;
  let token = jwt.sign({data: {username: body.username}, exp: jwtConfig.exp}, jwtConfig.secret);
  let user = await User.findOne({username: body.username});
  if(user) {
    if (body.password === user.password){
      ctx.body = {
        message: '登录成功！',
        status: true,
        payload: {
          username: body.username,
          token: token
        }
      };
    } else {
      ctx.body = {
        message: '密码错误！',
        status: false
      };
    }
  } else {
    ctx.body = {
      message: '用户不存在！',
      status: false
    };
  }
});

module.exports = router;