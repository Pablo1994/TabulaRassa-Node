/*
	Realizado por: Juan Pablo Arias Zúñiga <jpaz199448@gmail.com>
*/

var setup;
	
$(function(){
	setup = new setupApp();	   
});

function setupApp(){
   // Create MVC objects
   this.model = new Model();
   this.view = new View();
   this.controller = new Controller();
   // Init model
   // bind events (connect M-V-C)
   this.triggerElement=$(".opcFunc");
   this.observe(this.view.locate(".opcFunc"), {"click": this.controller.clickHandler});
   this.observe(this.triggerElement, {"query": this.model.queryHandler});
   this.observe(this.view.locate("#webmstr"), {"click": this.controller.clickHandler});
   this.observe(this.view.locate("#tabla tbody tr"), {"click": this.controller.tableHandler});
};
setupApp.prototype.observe=function(observedElement, eventsActions){
   $.each(eventsActions, function(event, action){
      observedElement.on(event, action);
   });
};
setupApp.prototype.trigger=function(name, e){
    e = e  || {};
    var event = $.Event(name);
	$.extend(event, {targetName:e.targetName, targetValue:e.targetValue});
	this.triggerElement.trigger(event);
};
setupApp.prototype.triggerRender=function(opc){
   var me= this;
   me.view.fillTable(me.model.buscaCamps("camp1"),me.model.getTeams("camp1",opc));
};

setupApp.prototype.triggerUpdate=function(which,array,opc){
   switch(which){
	case "teams":
		this.model.updateTeams(array,opc);
		break;
	case "camps":
		this.model.updateCamps(array);
		break;
   }
};
setupApp.prototype.updateDB=function(eq1,eq2){
	this.controller.updateDB(eq1,eq2);
};
setupApp.prototype.dataTable=function(which){
	this.model.prepareDataTable(which);
};
setupApp.prototype.triggerRenderChart=function(data,which){
	this.view.renderChart(data,which);
};
