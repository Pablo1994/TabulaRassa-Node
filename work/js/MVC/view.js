/*
	Realizado por: Juan Pablo Arias Zúñiga <jpaz199448@gmail.com>
*/
// View
function View(model){
  this.model=model;
};
View.prototype.locate=function(path){
   return $(path);
}; 
View.prototype.fillTable= function(camp,teams){
	var tabla= $("#tabla");
	$("#tabla tbody").remove();
	var body= tabla.append("<tbody/>");
	if(!tabla.caption){
		tabla.append($("<caption/>").html(camp.name));
	}	
	var i=0;
	for(i in teams){
        var teamObj = teams[i];
	var tr = $("<tr/>").appendTo(body);
	var labels = [teamObj.nombre, (teamObj.win + teamObj.lose + teamObj.tie), teamObj.win, teamObj.lose, teamObj.tie,teamObj.fav,teamObj.con,(teamObj.fav-teamObj.con),((teamObj.win*3)+teamObj.tie)];
	$.each(labels, function(i, v){
	   	tr.append($("<td/>").text(v));
	});
	}
	$("#chart_div").css("display","none");
	$(tabla).css("visibility","visible");	
};
View.prototype.renderChart= function(data,which){
	$("#tabla").css("visibility","hidden");
	var options;
	switch(which){
		case "goal":
			options = {'title':'Promedio de goles anotados por partido',
                     	'width':400,
                     	'height':300};
			break;
		case "goaled":
			options = {'title':'Promedio de goles recibidos por partido',
                     	'width':400,
                     	'height':300};
			break;		
	}
	var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
        chart.draw(data, options);
	$("#chart_div").css("display","inline");
};
