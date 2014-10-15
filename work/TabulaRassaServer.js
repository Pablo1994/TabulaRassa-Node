/*
	Realizado por: Juan Pablo Arias Zúñiga <jpaz199448@gmail.com>
*/
// Simple server with connection to mongodb:/teams
// Modules
var http = require('http');
var url= require('url');
var fs = require('fs');
var pm = require('path');
var qs = require('querystring');
// Server parameters
var port = 8085;
// Controller paths
var default_path='/',
    default_page='tabula_rassa.html';
    bring_path='/bring';
    update_path='/update';
// Opens connection
// handler for mongodb 
var mongoTeams;
var mongoCamps;
   // Simple Server serving db teams
try{
   mongoTeams= require('./query_teams_from_mongo.js');
} catch(e){
	console.log(e);
   	mongoTeams ={};
}
try{
   mongoCamps= require('./query_camps_from_mongo.js');
} catch(e){
	console.log(e);
   	mongoCamps ={};
}
   // Por ejemplo si la DB no esta disponible

// Controller handlers
function serve_JSON(req,res){
	var query= url.parse(req.url,true).query;
	switch(query.thing){	
		case "tabla":
			mongoTeams.res = res; 
			mongoTeams.req = req;
			mongoTeams.error = null;
			mongoTeams.query={};

			mongoTeams.handler=mongoTeams;
			mongoTeams.done=function(){
				var equipos= mongoTeams.getTeams();
				res.writeHead(200, {'Content-Type': 'application/json'});
				res.write(JSON.stringify({teams: equipos}));
				res.end();
			};
			mongoTeams.db();
			break;
		case "camp":
			mongoCamps.res = res; 
			mongoCamps.req = req;
			mongoCamps.error = null;
			mongoCamps.query={};

			mongoCamps.handler=mongoCamps;
			mongoCamps.done=function(){
				var champs= mongoCamps.getCamps();
				res.writeHead(200, {'Content-Type': 'application/json'});
				console.log(JSON.stringify(champs));
				res.write(JSON.stringify({camps: champs}));
				res.end();
			};
			mongoCamps.db();
			break;
	}
}
function updateDB(req,res){
	var query= url.parse(req.url,true).query;
	console.log(query.equipo);
	mongoTeams.req= req;
	mongoTeams.res= res;
	mongoTeams.error= null;
	mongoTeams.query= {};
	mongoTeams.handler=mongoTeams;
	mongoTeams.done=function(){
		mongoTeams.updateTeams(query);
		var equipos= mongoTeams.getTeams();
		res.writeHead(200, {'Content-Type': 'application/json'});
		res.write(JSON.stringify({teams: equipos}));
		res.end();
	};
	mongoTeams.db();
}
function handleInvalidPath(req, res, options){
        var status=500, 
		    msg='Invalid Path Requested';
		if(options){
           res.statusCode = options["status"] || status;
		   msg = options["msg"] || msg;
		};
        res.setHeader('content-type', 'application/json');
		var data = {hints:['server error'+msg]};
		res.write(JSON.stringify(data));
		res.end();
};

function handle_default_page(req, res){
   fs.readFile(default_page, function(err, file) {
            if(err){
			  handleInvalidPath(req, res);
			  return;
			};
            res.writeHead(200, {'Content-Type': 'text/html'})
            res.write(file.toString())
            res.end()
     });
};
function handleFileToServe(path, req, res){
   path=path.substring(1, path.length);
   console.log("Trying to serve "+__dirname+path);
   var type=null, enc="utf8";
   if(htmlReg.test(path)){
      type='text/html';
   }else if(cssReg.test(path)){
      type='text/css';
   }else if(jsReg.test(path)){
      type='text/javascript';
   }else if(pdfReg.test(path)){
      type='application/pdf';
   }else if(pngReg.test(path)){
      type='image/png';
	  enc=null;
   }else if(jpgReg.test(path)){
      enc=null;
      type='image/jpg';
   }else{
      handleInvalidPath(req, res, {status:400, msg:'Invalid type'});
	  return;
   };
   console.log("type ="+type);
   var filename=pm.join(__dirname, path);
   console.log("getting: "+filename);
   var file;
   try{
     if(enc)
       file=fs.readFileSync(filename, enc);
     else
      file=fs.readFileSync(filename);
   }catch(e){
      console.log(e);
      handleInvalidPath(req, res, {status:400, msg:'Not found'});
	  return;
   };
   console.log("file was read");
   res.writeHead(200, {'Content-Type': type});
   res.write(file);
   res.end();
   return;
   
};
// Accepted types
var files_to_serve_regex = /^.*\.(html|pdf|css|png|jpg|js)$/;
var htmlReg =/^.*\.(htm|html)$/;
var cssReg =/^.*\.css$/;
var jsReg =/^.*\.js$/;
var pdfReg =/^.*\.pdf$/;
var pngReg =/^.*\.png$/;
var jpgReg =/^.*\.jpg$/;

// create and start server
http.createServer(function(req, res){
	var urlObj = url.parse(req.url);
	console.log("REQUESTED URL:"+urlObj.pathname);
	switch(urlObj.pathname){
	  case update_path: updateDB(req,res);return;
	  case bring_path: serve_JSON(req,res);return;
	  case default_path: handle_default_page(req, res);return;
	  default: if (files_to_serve_regex.test(urlObj.pathname)){
	              handleFileToServe(urlObj.pathname, req, res); return; }
	           else handleInvalidPath(req, res);return;
	};
    
}).listen(port);
console.log('Names server running'); 
