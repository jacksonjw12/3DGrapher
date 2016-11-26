var canvas = {"element":null, "context":null, "height":500, "width":1000}
var camera = {"position":new point3d(-300,-800,400),"rotation":new point3d(Math.PI/2-.2,0,-.4),"fov":Math.PI/2}
var aspectRatio = canvas.width/canvas.height;
var funcRange = 10;
var funcStep = 1;
var func = [

]
var equationString = "z=0"
var eq = new Equation(equationString);

function getFunctionPoints(range, step){
	func = [];
	funcRange = range;
	funcStep = step;
	for(var y = -range; y<range; y+=step){
		var row = []
		for(var x = -range; x<range; x+=step){



			row.push(new point3d(x,y,eq.evaluate(x,y)))




		}
		func.push(row)
	}
}

var keys = new Keyboard();

function main(){
	
	keys.initialize(keys);
	canvas.element = document.getElementById("Canvas");
	canvas.element.height = canvas.height
	canvas.element.width = canvas.width
	canvas.context = canvas.element.getContext("2d");

	canvas.context.fillStyle = "#000000";
	canvas.context.fillRect(0,0,canvas.width,canvas.height);
	
	
	setTimeout(step,20);

	
	
}
function doMovement(){
	var movement = new point3d(0,0,0)
	if(keys.keysDown.indexOf("Q") > -1){
		//camera.position.z+=10;
		movement.z++;

	}
	if(keys.keysDown.indexOf("E") > -1){
		//camera.position.z-=10;
		movement.z--;

	}

	if(keys.keysDown.indexOf("W") > -1){
		//camera.position.y+=10;
		movement.y++;

	}

	if(keys.keysDown.indexOf("S") > -1){
		//camera.position.y-=10;
		movement.y--;
	}
	if(keys.keysDown.indexOf("A") > -1){
		//camera.position.x+=10;
		movement.x++;
	}
	if(keys.keysDown.indexOf("D") > -1){
		//camera.position.x-=10;
		movement.x--;
	}

	if(keys.keysDown.indexOf("&") > -1){
		camera.rotation.x+=.05;
		
	}
	if(keys.keysDown.indexOf("(") > -1){
		camera.rotation.x-=.05;
		
	}
	if(keys.keysDown.indexOf("%") > -1){
		camera.rotation.z-=.05;
		
	}
	if(keys.keysDown.indexOf("'") > -1){
		camera.rotation.z+=.05;
		
	}
	//console.log(keys.keysDown)

	movement.normalize();
	var speed = -10

	var forward = new point3d(-Math.cos(Math.PI/2-camera.rotation.z)*Math.sin(camera.rotation.x),Math.sin(Math.PI/2-camera.rotation.z)*Math.sin(camera.rotation.x),Math.sin(-Math.PI/2+camera.rotation.x));
	var left = new point3d(-Math.cos(-camera.rotation.z)*Math.sin(camera.rotation.x),Math.sin(-camera.rotation.z)*Math.sin(camera.rotation.x),0);
	var up = new point3d(-Math.cos(Math.PI/2-camera.rotation.z)*Math.sin(camera.rotation.x+Math.PI/2),Math.sin(Math.PI/2-camera.rotation.z)*Math.sin(camera.rotation.x+Math.PI/2),Math.sin(camera.rotation.x));

	var deltaf = forward//.scale(movement.x)
	deltaf.scale(speed*-movement.y)
	camera.position.add(deltaf);
	var deltal = left
	deltal.scale(speed*movement.x)
	camera.position.add(deltal)
	var deltau = up
	deltau.scale(speed*-movement.z)
	camera.position.add(deltau)

}

function step(){
	if(document.getElementById("equation").value != equationString){
		eq = new Equation(document.getElementById("equation").value);
	}

	canvas.context.fillStyle = "#000000";
	canvas.context.fillRect(0,0,canvas.width,canvas.height)
	t+=tStep;
	if(t>1.3){
		tStep = -.01
	}
	if(t<-1){
		tStep = .01
	}
	getFunctionPoints(200,10)
	render();
	doMovement();
	
	setTimeout(step,20)
}
var t = 0;
var tStep = .01;
function equation1(x,y){
	return Math.sin(x/20 +15*t)*20+Math.sin(y/20+t*15)*20//x*y/100;//(x*x+y*y)/300;
}

function render(){
	canvas.context.fillStyle = "#ffffff";
	//canvas.context.fillText(JSON.stringify(camera.rotation),10,10);
	canvas.context.fillStyle = "#ff00ff";
	var xAxis1 = (new point3d(-200,0,0)).project();
	var xAxis2 = (new point3d(200,0,0)).project();
	var yAxis1 = (new point3d(0,-200,0)).project();
	var yAxis2 = (new point3d(0,200,0)).project();
	//console.log(xAxis2)
	canvas.context.beginPath();
	canvas.context.moveTo(xAxis1.x,xAxis1.y);
	canvas.context.lineTo(xAxis2.x,xAxis2.y);
	canvas.context.stroke();
	canvas.context.beginPath();
	canvas.context.moveTo(yAxis1.x,yAxis1.y);
	canvas.context.lineTo(yAxis2.x,yAxis2.y);
	canvas.context.stroke();



	var origin = new point3d(0,0,0)
	var originProject = origin.project();
	canvas.context.fillRect(originProject.x,originProject.y,5,5)
	//console.log(originProject)
	canvas.context.fillStyle = "#000000";

	for(var y = 0; y<func.length; y++){
		for(var x = 0; x<func[0].length; x++){
			var point = func[y][x].project();
			//canvas.context.fillRect(point.x,point.y,1,1)


		}
		
	}

	

	function changeColor(){
		if(canvas.context.fillStyle == "#44ff00"){
			canvas.context.fillStyle = "#009900";
		}
		else if(canvas.context.fillStyle == "#009900"){
			canvas.context.fillStyle = "#44ff00";
		}
		else{
			canvas.context.fillStyle = "#44ff00";
		}
	}

	var polys = []

	for(var y = 0; y<func.length-1; y++){
		for(var x = 0; x<func[0].length-1; x++){
			changeColor()
			polys.push(new Polygon(func[y][x],func[y+1][x],func[y+1][x+1],func[y][x+1]));

		}
		
	}

	//console.log(polys[0].z)
	polys.sort(function(a,b){return b.z-a.z});

	for(var i = 0; i<polys.length;i++){
		if(polys[i].a.z > -20 || polys[i].b.z>-20 ||polys[i].c.z > -20 || polys[i].d.z>-20){

		}
		else{
			canvas.context.fillStyle = polys[i].color;
			canvas.context.beginPath();
			canvas.context.moveTo(polys[i].a.x, polys[i].a.y)
			canvas.context.lineTo(polys[i].b.x, polys[i].b.y)
			canvas.context.lineTo(polys[i].c.x, polys[i].c.y)
			canvas.context.lineTo(polys[i].d.x, polys[i].d.y)
			canvas.context.lineTo(polys[i].a.x, polys[i].a.y)

			canvas.context.closePath();

			canvas.context.fill();
		}
		
	}

	

}







main();



