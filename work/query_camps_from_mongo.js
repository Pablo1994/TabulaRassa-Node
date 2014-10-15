/*
	Realizado por: Juan Pablo Arias Zúñiga <jpaz199448@gmail.com>
*/
var MongoClient = require('mongodb').MongoClient;
var dbName="TabulaRassaDB";
var server="localhost";
var mongoPort="27017";
var connectionString="mongodb://"+server+":"+mongoPort+"/"+dbName;
var collectionName="campeonatos";

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
var getCamps=function(obj){
  try{
    obj._obj.db.collection(collectionName, function(err, collection) {
	  if(!err) obj._obj.camps=collection;
	  else obj.error=err;
	  obj.collect_done();
	});
  } catch(e){
    throw e;
  }
};

module.exports={client:MongoClient,
                error:null, 
                _obj:{db:null,    // objeto de conexion a la db
                      camps:null, // objeto de acceso a colleccion
                      array:[]	  // array con toda la coleccion			  
			    },
				getCamps:function(){
				   return this._obj.array;
				},
				db_done: function(){
				   //console.log("Db done ");
				   if(this.error){
				     this.errorHandler();
				     return;
				   };
				   this.collection();
				},
				collect_done:function(){
				   //console.log("Collection done ");
				   if(this.error){
				     this.errorHandler();
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
				collection: function(){
				    getCamps(this);
				},
				asArray: function(){ // Consulta todos y los fuerza en un array
				    that=this;
				    if(this._obj.camps){
					    this._obj.camps.find().toArray(function(err, array){
					    if(err) throw err;
						that._obj.array=array;
						//console.log("As array Done");
						that.done();
					    });
					};
				}
};
