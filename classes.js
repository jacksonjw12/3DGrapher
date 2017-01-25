function Polygon(a,b,c,d){
		


		this.color = shadeColor1(canvas.context.fillStyle,t*a.latestProject.x*t/25 * Math.pow(Math.abs(b.z-a.z)*Math.abs(c.z-d.z)*Math.abs(a.z-d.z)*Math.abs(b.z-c.z), .25)/-5 * (c.z-d.z)/(Math.abs(c.z-d.z)+.1) );

		this.a = a.latestProject;
		this.b = b.latestProject;
		this.c = c.latestProject;
		this.d = d.latestProject;
		this.z = -this.a.z;
}



function shadeColor1(color, percent) { 
    var num = parseInt(color.slice(1),16), amt = Math.round(2.55 * percent), R = (num >> 16) + amt, G = (num >> 8 & 0x00FF) + amt, B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
}

function point2d(x,y){
	this.x = x;
	this.y = y;
}

function point3d(x,y,z){
	this.x = x;
	this.y = y;
	this.z = z;
	this.latestProject;
	this.project = function(cameraData){
		projectX = Math.cos(camera.rotation.y) * (Math.sin(camera.rotation.z) * (this.y - camera.position.y) + Math.cos(camera.rotation.z) * (this.x - camera.position.x)) - Math.sin(camera.rotation.y) * (this.z - camera.position.z);
		projectY = Math.sin(camera.rotation.x) * (Math.cos(camera.rotation.y) * (this.z - camera.position.z) + Math.sin(camera.rotation.y) * (Math.sin(camera.rotation.z) * (this.y - camera.position.y) + Math.cos(camera.rotation.z) * (this.x - camera.position.x))) + Math.cos(camera.rotation.x) * (Math.cos(camera.rotation.z) * (this.y - camera.position.y) - Math.sin(camera.rotation.z) * (this.x - camera.position.x)) ;
		projectZ = Math.cos(camera.rotation.x) * (Math.cos(camera.rotation.y) * (this.z - camera.position.z) + Math.sin(camera.rotation.y) * (Math.sin(camera.rotation.z) * (this.y - camera.position.y) + Math.cos(camera.rotation.z) * (this.x - camera.position.x))) - Math.sin(camera.rotation.x) * (Math.cos(camera.rotation.z) * (this.y - camera.position.y) - Math.sin(camera.rotation.z) * (this.x - camera.position.x));
		var ez = 1 / Math.tan(camera.fov / 2);
		var screenX = (projectX ) * (ez / projectZ) ;
		var screenY = -(projectY) * (ez / projectZ);
		screenX *= canvas.height;
		screenY *= -canvas.height;
		screenX += canvas.width/2
		screenY += canvas.height/2

		if(projectZ > 0 ){
			this.latestProject = new point3d(-100,-100,-100)
		}
		else{
			this.latestProject = new point3d(screenX,screenY,projectZ)
		}
		return this.latestProject;
		
	}

	this.normalize = function(){
		var magnitude = Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z);
		if(magnitude != 0){
			this.x = this.x/magnitude;
			this.y = this.y/magnitude;
			this.z = this.z/magnitude;
		}
		

	}
	this.add = function(otherpoint){
		this.x += otherpoint.x;
		this.y += otherpoint.y;
		this.z += otherpoint.z;
	}
	this.times = function(otherpoint){
		return new point3d(this.x*otherpoint.x,this.y*otherpoint.y,this.z*otherpoint.z)
	}
	this.scale = function(scalar){
		this.x *=scalar;
		this.y *=scalar;
		this.z *=scalar;
	}

}

function isLetter(str) {
	return str.match(/[a-z]/i);
}
function isNumber(str) {
	return str.match(/[0-9]/i);
}
function isOperand(str){
	return str.match(/[+\-*/^=,]/i);
}
function isTerminator(str){
	 return str.match(/[() ]/i);

}


function splice(str,start,end){
	//console.log(start)
	var startString = str.substring(end,str.length);
	console.log(startString)
	// var end = str.slice(end-1,str.length)s
	
	return startString;
}

function Equation(string){
	//sin(x)+cos(x)*5
	//console.log("New Equation")
	this.functions = [{"name":"pow","replacement":"Math.pow"},{"name":"sin","replacement":"Math.sin"},{"name":"cos","replacement":"Math.cos"},{"name":"pi","replacement":"Math.PI"},{"name":"e","replacement":"Math.E"},{"name":"sqrt","replacement":"Math.sqrt"},{"name":"abs","replacement":"Math.abs"}]
	this.setupNew = function(string){
		var terms = []//{"type":"terminator","value":"("}]	
		stepCount = 0;
		var str = string
		while(str.length > 0 && stepCount < 100){
			console.log(str)
			stepCount++;
			//can be either variable, function(trig, ln, etc) number, operand, ()
			var c = str.charAt(0);
			if(isLetter(c)){//either a variable or a function
				var isFunction = false;
				for(var f = 0; f< this.functions.length; f++){
					//console.log(str.indexOf(this.functions[f].name))

					if(str.indexOf(this.functions[f].name) == 0){
						//console.log("function")
						terms.push({"type":"function","value":str.substring(0,this.functions[f].name.length),"replacement":this.functions[f].replacement});
						//charNum+=this.functions[f].name.length;
						str = splice(str,0,this.functions[f].name.length)
						isFunction = true;
						//console.log(str.charAt(charNum))
						break;
					}
				}
				if(!isFunction){
					terms.push({"type":"variable","value":str.substring(0,1)});
					str = splice(str,0,1);
				}
			}
			else{//number or operand or ()=

				if(isNumber(c)){
					var places = 1;
					while( str.length > places && isNumber(str.charAt(places))){
						places++
					}
					var num = str.substring(0,places);
					str = splice(str,0,places);
					terms.push({"type":"number","value":num});
				}
				else if(isOperand(c)){
					terms.push({"type":"operator","value":str.substring(0,1)});
					str = splice(str,0,1);
				}
				else if(isTerminator(c)){
					terms.push({"type":"terminator","value":str.substring(0,1)});
					str = splice(str,0,1);
				}	
				else{
					str = ""
					terms = []
					console.log("character in equation not recognized")

				}


			}

		}
		terms.push({"type":"terminator","value":" "});

		console.log("equation parsed")
		console.log(JSON.stringify(terms))
		var usedVariables = ["x","y","z","t"]
		var equationString = "";

		//now we handle ^
		for(var t = 0; t<terms.length; t++){
			if(terms[t].value =="^"){
				terms[t].value = ","
				terms[t].type = "operator"
				//console.log(123)
				var parensDeep = 0;
				for(var b = t-1; b> -1; b--){
					if( b -1 > -1 && terms[b-1].value == "(" && parensDeep == 0){
						console.log("111111111")
						terms.splice(b, 0, {"type":"terminator","value":"("});
						terms.splice(b, 0, {"type":"function","replacement":"Math.pow","value":"pow"});
						break;
					}
					if(terms[b].value == " "){
						b--;
					}
					if(terms[b].value == ")"){
						parensDeep++;
					}
					else if(terms[b].value == "("){
						parensDeep--

					}
					if(parensDeep == 0){

						if(terms[b-1] != undefined && terms[b-1].type == "function"){
							//b-=2;
							//t+=2;
							//terms.splice(b-1, 0, {"type":"terminator","value":"{"});
							terms.splice(b-1, 0, {"type":"function","replacement":"Math.pow","value":"pow"});
						}
						else{
							//terms.splice(b-1, 0, {"type":"terminator","value":"{"});
							terms.splice(b, 0, {"type":"function","replacement":"Math.pow","value":"pow"});
						}
						

						t+=2;
						
						break;
					}
				}

				parensDeep = 0;
				var termsPassed = 0;

				for(var e = t; e< terms.length; e++){
					console.log("exponent terms")
					console.log(terms[e].value)
					termsPassed++;
					if(terms[e].value == " " || terms[e].type == "function"){
						//termsPassed++;
						continue;

					}
					
					if(terms[e].value == "("){
						parensDeep++;
					}
					else if(terms[e].value == ")"){
						parensDeep--
						e++;

					}
					

					if(parensDeep == 0){
						console.log(e)
						//terms.splice(t+2, 0, {"type":"operator","value":"*"});
						console.log(t+termsPassed + " :termspassed")
						terms.splice(t+termsPassed, 0, {"type":"other","value":"}"});
						//t++;
						
						break;
					}
				}



			}
		}



		equationString = this.solveParens(terms,0,terms.length);
		//equationString = equationString.substring(2,equationString.length-2)//strip outside
		console.log("done")
		console.log(equationString)
		this.str = equationString;
		
		console.log("done")
		console.log(equationString)
		console.log(JSON.stringify(terms))


	}
	this.usedVariables = ["x","y","z","t"]
	this.sp = "  "
	this.bar = "|"
	this.solveParens = function(terms,start,end){

		var parenString = " "
		for(var t = start; t<end; t++){
			
			if(terms[t].type == "variable" && this.usedVariables.indexOf(terms[t].value) > -1 || terms[t].type == "number"){
				var termString = terms[t].value;
				if(t+1 < terms.length){//check for other stuff
					if(terms[t+1].type == "number" || terms[t+1].type == "function"|| terms[t+1].type == "variable"){
						termString+=" * ";
					}
					else if(terms[t+1].type=="terminator" && terms[t+1].value=="("){
						termString += " * ";

					}
					parenString+=termString;
					
				}
			}
			else if(terms[t].type == "function"){
				var termString = terms[t].replacement;
				//make it work for stuff like sinx as opposed to sin(x)
				if(terms[t+1] != undefined && terms[t+1].value != "(" && terms[t].value != "pow"){
					termString+="("
					termString+=terms[t+1].value;
					termString+=")"
					t++;
					parenString+=termString;
				}
				else{
					parenString+=termString + "(";
				}
				
			}
			else if(terms[t].type == "operator" && terms[t].value != "^"){
				var termString = this.sp + terms[t].value + this.sp;
				terms[t].index = parenString.length;
				parenString+=termString;
			}
			else if(terms[t].value == "="){
				var termString = this.sp + terms[t].value + this.sp;
				parenString+=termString;
			}
			
			else if(terms[t].value == "}"){
				parenString += " ) "
			}
			else if(terms[t].value == "{"){
				parenString += " ( "
			}
			else if(terms[t].value == ")"){
				parenString += " ) "
			}
			else if(terms[t].value == "("){
				var termString = ""
				var rStart = t+1;
				var parensInside = 0;
				var rEnd = -1
				//console.log("looking in paren")
				for(i = rStart; i<end; i++){
					//console.log(i)
					//console.log(terms[i].value)
					if(terms[i].value == ")" && parensInside == 0){
						rEnd = i;
						//console.log("found")
						break;
					}
					else if(terms[i].value == ")" && parensInside != 0){
						parensInside--;
					}
					else if(terms[i].value == "("){
						parensInside++;
					}
				}
				//console.log("done looking in paren")
				if(rEnd > -1){
					
					t = rEnd-1
					
					//console.log(termString)
					
					
					termString +=  this.solveParens(terms,rStart,rEnd);
					console.log("termString " + termString)
					parenString += termString
				}
				else{
					console.log("paren not closed")
				}
			}
			
		}
		console.log("parenstring" + parenString)
		return parenString ;

	}
	

	this.setup = function(str){
		console.log(123);
		this.str = str;
		this.str = this.str.replace(/sin/g,"Math.sin")
		this.str = this.str.replace(/cos/g,"Math.cos")
		this.str = this.str.replace(/tan/g,"Math.tan")
		this.str = this.str.replace(/pi/g,"Math.PI")
		this.str = this.str.replace(/sqrt/g,"Math.sqrt")
		this.str = this.str.replace(/abs/g,"Math.abs")
		this.str = this.str.replace(/e/g,"Math.E")
		if(this.str.indexOf("^") > -1){
			for(var i = 0; i<this.str.length; i++){//Math.pow
				if(this.str.charAt(i) == "^" && i != 0 && i != this.str.length-1){
					//get base--basically run left until ) or operand(+-*/)
					var startIndex = 0;
					for(var j=i-1;j>=0;j--){
						if(["=", " "].indexOf(this.str.charAt(j)) > -1){
							startIndex = j+1;
							break;
						}
					}

					var endIndex = str.length;
					for(var j=i+1;j<this.str.length;j++){

						if([")","+","-","*","/","="].indexOf(this.str.charAt(j)) > -1){
							endIndex = j;
							break;
						}


					}

					var base = this.splice(str,startIndex,i)
					var exponent = this.splice(str,i+1,endIndex)
					/*console.log("base: " + base);
					console.log("exponent: " + exponent);
					console.log(endIndex);*/
					console.log(this.splice(str,exponent))
					this.str = this.splice(str,0,startIndex) 
					this.str+= "Math.pow(" + base + ", " + exponent + ")" + this.splice(str,endIndex)



				}
			}
		}
		


	}
	this.setupNew(string);

	

	this.evaluate = function(x,y){
		//console.log("ayyy")
		var z = -1;
		//document.getElementById("errorPlace").innerHTML = this.str;
		try{
			eval(this.str);
		}catch(err){
			console.log(err);
			
			/*if(document.getElementById("errorPlace").innerHTML != err){
				console.log(err);
				document.getElementById("errorPlace").innerHTML = err;
			}*/

			//document.getElementById("errorPlace").innerHTML = this.str;
		}

		return z;
	}



}






function Keyboard(){
	this.keysDown = [];
	this.initialize = function(keys){
		document.addEventListener('keydown', function(event){
		
			var keyChar = String.fromCharCode(event.keyCode);
			if(keys.keysDown.indexOf(keyChar) == -1){
				
				keys.keysDown.push(keyChar);
			}


			});

		document.addEventListener('keyup', function(event){
			
			var keyChar = String.fromCharCode(event.keyCode);
			
			if(keys.keysDown.indexOf(keyChar) > -1){

				keys.keysDown.splice(keys.keysDown.indexOf(keyChar),1);
			}


		})
	}

	




}



