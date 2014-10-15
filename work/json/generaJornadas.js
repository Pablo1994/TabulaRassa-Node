var equipos= [1,2,3,4,5,6,7,8,9,10,11,12];

function getNextSequence(name) {
   var ret = db.counters.findAndModify(
          {
            query: { _id: name },
            update: { $inc: { seq: 1 } },
            new: true
          }
   );

   return ret.seq;
}

function genera(eqs){
	var arrDummy= [];
	arrDummy= equipos.concat(arrDummy);
	arrDummy.reverse();
	var nj=eqs.length;
	while(nj>0){
		unaJornada(eqs,arrDummy);
		var p= arrDummy.shift();
		arrDummy.push(p);
		nj--;
	}
}
function buscarArr(arr,arr1){
	for(var i=0;i<arr.length;i++){
		if(arr[i][0]==arr1[0]&&arr[i][1]==arr1[1]){
			return 1;
		}
	}
	return -1;
}
function unaJornada(eqs,eqs1){
	arrArr= [];
	for(var i=0;i<eqs.length;i++){		
		if(arrArr.length>0){			
			if(eqs[i]!=eqs1[i]){		
				if(buscarArr(arrArr,[eqs1[i], eqs[i]])==-1){
					arrArr.push([eqs[i],eqs1[i]]);
				}
			}
		} else {
			if(eqs[i]!=eqs1[i]){
				arrArr.push([eqs[i],eqs1[i]]);
			}
		}
	}
	db.jornadas.insert({_id: getNextSequence("jornID"),partidos:arrArr, camp_id:"camp1"});
}
db.counters.drop()
db.counters.insert({_id: "jornID", seq:0})
db.jornadas.drop()
genera(equipos)
