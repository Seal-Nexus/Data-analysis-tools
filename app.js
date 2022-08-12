const http = require("http");
const sr_module_path = "./simple-router/module-template";
const sr = require(`${sr_module_path}/simple-router/core.js`);

sr.set( ( req, res, next ) => {
  console.log(`${req.method} ${req.url}`);
  next();
})

sr.setPublic( __dirname, "public" );

sr.use("/", ( req, res ) => {
  res.send("Hello");
});

http.createServer( sr.core ).listen( process.env.PORT || 3000 );