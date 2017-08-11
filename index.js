const Koa = require('koa');
const logger = require('koa-logger');
const static = require('koa-static');
const koaBody = require('koa-body');
const koajwt = require('koa-jwt');

const config = require('./config/index');
const dbConfig = require('./config/db');
const jwtConfig = require('./config/jwt');
const index = require('./routes/index');
const users = require('./routes/users');

const mongoose = require('mongoose');

mongoose.connect(dbConfig.database);

const app = new Koa();

app.use(function(ctx, next){
  return next().catch((err) => {
    if (401 == err.status) {
      ctx.status = 401;
      ctx.body = 'Bad Authorization';
    } else {
      throw err;
    }
  });
});

app.use(logger());
app.use(koaBody({multipart: true}));
app.use(static(__dirname + '/public'));
app.use(koajwt({ secret: jwtConfig.secret, isRevoked: jwtConfig.isRevoked }).unless({ path: jwtConfig.path }));
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());

app.on('error', (err, ctx) => {
  log.error('server error', err, ctx)
});

app.use(ctx => {
  if (ctx.url.match(/^\/api/)) {
    ctx.body = 'protected\n';
  }
});

app.listen(config.port);

console.log('listening on port ' + config.port);