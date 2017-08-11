module.exports = {
  secret: 'archer',
  exp: Date.now() + 7*24*60*60*1000,
  path: ['/api', '/api/login'],
  isRevoked: async (ctx, decodedToken, token) => {
    if(Date.now() < decodedToken.exp) {
      return false;
    } else {
      return true;
    }
  }
}