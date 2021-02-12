  module.exports = (req, res, next) => {
    res.locals = {
      port: process.env.PORT
  }
  res.header("Access-Control-Allow-Origin", "*", "https://tour-x.herokuapp.com/swagger/");
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
};

