#!/usr/bin/env node
const fs = require("fs");
let data = fs.readFileSync("PPG-origin.csv", "utf8").split("\n");
let result = new Array();
data[0] = data[0].split(",");
data[0].splice( 2, 2 );
data[0].splice( 2, 0, "value" );
result.push( data[0].join(",") );
for(let i = 1 ; i < data.length ; i++){
  let row = data[i];
  let d = row.split(",");
  let d1 = d.slice();
  let d2 = d.slice();
  d1.splice( 2, 1 );
  d2.splice( 3, 1 );
  result.push( d2.join(",") ); // it's the first record (maybe)
  result.push( d1.join(",") );
}

fs.writeFileSync("PPG.csv", result.join("\n"));
