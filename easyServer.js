#! /usr/bin/env node

var http = require("http"),
	Url = require("url"),
	fs = require("fs"),
	mimeType = require("./mimeType.js"),
	argv = process.argv.slice(2),
	basePath = process.cwd(),
	port = 8099;

if(basePath.charAt(basePath.length - 1) !== '\\'){
	basePath += "\\";
}

for(var i = 0; i < argv.length; i += 1){
	if(!isNaN(parseInt(argv[i]))){
		port = parseInt(argv[i]);
	}else if(/^\\\//.test(argv[i])){
		basePath = basePath.replace(/^([a-zA-Z]:)/, "$1") + argv[i];
	}else{
		basePath += argv[i];
	}
}

http.createServer(function (request, response) {
	var pathname = Url.parse(request.url).pathname;
	console.log(pathname);
	if(pathname.charAt(pathname.length - 1) === '/'){
		pathname += "index.html";
	}
	getFile(response, basePath + pathname);
}).listen(port);

console.log("server start at " + port + "\nThe basePath is " + basePath);

function getFile(res, path){
	fs.readFile(path, function (err, data) {
		if(err){
			res.writeHead(404);
			res.end(JSON.stringify(err));
			return;
		}
		var t = path.replace(/.*\.([\w]+)$/, "$1");
		res.writeHead(200, { 'Content-Type': mimeType[t.toLowerCase()] || mimeType["html"] });
		res.end(data);
	});
}