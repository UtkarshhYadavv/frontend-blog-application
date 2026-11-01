const fs=require("fs");
const path=require("path");
const filePath=(name)=>path.join(__dirname,"..","data",name+".json");
function read(name){try{return JSON.parse(fs.readFileSync(filePath(name),"utf8"));}catch{return [];}}
function write(name,data){fs.writeFileSync(filePath(name),JSON.stringify(data,null,2));}
module.exports={read,write};
