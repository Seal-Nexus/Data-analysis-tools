const http = require("http");
const sr_module_path = "./simple-router/module-template";
const sr = require(`${sr_module_path}/simple-router/core.js`);
const fs = require("fs");

sr.set( ( req, res, next ) => {
  console.log(`${req.method} ${req.url}`);
  next();
})

sr.setPublic( __dirname, "public" );

sr.use("/", ( req, res ) => {
  let deny = [ "Data", "README.md" ];
  let apps = fs.readdirSync("./public").filter( v => deny.indexOf( v ) == -1 );
  let html = ``;
  for(let app of apps){
    html += `<p><a href="${app}/index.html">${app}</p>`;
  }
  res.send( html );
});

http.createServer( sr.core ).listen( process.env.PORT || 3000 );