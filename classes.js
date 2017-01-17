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



function Equation(str){
	//sin(x)+cos(x)*5
	

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
						if(["+","-","*","/","^","=", " "].indexOf(this.str.charAt(j)) > -1){
							startIndex = j+1;
							break;
						}
					}

					var endIndex = str.length;
					for(var j=i+1;j<this.str.length;j++){

						if([")","+","-","*","/","^","="].indexOf(this.str.charAt(j)) > -1){
							endIndex = j;
							break;
						}


					}

					var base = this.str.slice(startIndex,i)
					var exponent = this.str.slice(i+1,endIndex)
					console.log("base: " + base);
					console.log("exponent: " + exponent);
					cosnoel.log(endIndex);

					this.str = this.str.slice(0,startIndex) 
					this.str+= "Math.pow(" + base + ", " + exponent + ")" + this.str.slice(endIndex)



				}
			}
		}
		


	}
	this.setup(str);

	this.evaluate = function(x,y){
		var z = -1;
		//document.getElementById("errorPlace").innerHTML = this.str;
		try{
			eval(this.str);
		}catch(err){
			//console.log(err);
			
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



