/*
	Realizado por: Juan Pablo Arias Zúñiga <jpaz199448@gmail.com>
*/
var MongoClient = require('mongodb').MongoClient;
var dbName="TabulaRassaDB";
var server="localhost";
var mongoPort="27017";
var connectionString="mongodb://"+server+":"+mongoPort+"/"+dbName;
var collectionName="teams";

var getDB= function(obj){
  try{
     obj.client.connect(connectionString, function(err, db){
	 if(!err && db) obj._obj.db = db;
	 else obj.error=err;
	 obj.db_done();
	});
  } catch(e){
    throw e;
  };
};
var getTeams=function(obj){
  try{
    obj._obj.db.collection(collectionName, function(err, collection) {
	  if(!err) obj._obj.teams=collection;
	  else obj.error=err;
	  obj.collect_done();
	});
  } catch(e){
    throw e;
  }
};
var updateTeams=function(obj,q){
	getTeams(obj);	
	w=(q.w)?parseInt(q.w):0;
	l=(q.l)?parseInt(q.l):0;
	t=(q.t)?parseInt(q.t):0;
	f=(q.f)?parseInt(q.f):0;
	c=(q.c)?parseInt(q.c):0;
	obj._obj.teams.update(
		{  nombre: q.equipo  },
		{
		   nombre: q.equipo,
		   win: w,
		   lose: l,
		   tie: t,
		   fav: f,
		   con: c
		},
		{  upsert: true  },
		function(err,updated){
			w:1;
		}
	);
}
module.exports={client:MongoClient,
                error:null, 
		query:{},
                _obj:{db:null,    // objeto de conexion a la db
                      teams:null, // objeto de acceso a colleccion
                      array:[]	  // array con toda la coleccion			  
			    },
				getTeams:function(){
				   return this._obj.array;
				},
				db_done: function(){
				   //console.log("Db done ");
				   if(this.error){
				     //this.errorHandler();
				     return;
				   };
				   this.collection();
				},
				collect_done:function(){
				   //console.log("Collection done ");
				   if(this.error){
				     //this.errorHandler();
				     return;
				   };
				   this.asArray();
				},
				done:function(){
				     // Dummy, la idea es setearla desde afuera
				},
                		db:function(){
				    getDB(this);
				    
				},
				updateTeams: function(q){
					updateTeams(this,q);
				},
				collection: function(){
				    getTeams(this);
				},
				asArray: function(){ // Consulta todos y los fuerza en un array
				    that=this;
				    if(this._obj.teams){
					    this._obj.teams.find().toArray(function(err, array){
					    if(err) throw err;
						that._obj.array=array;
						//console.log("As array Done");
						that.done();
					    });
					};
				}
};
