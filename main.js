///VARS -------//////////////////////////////////////////////////////////
var json = {};
var map = document.getElementById("map");
var ctx = map.getContext("2d");
var xwin = window.innerWidth / 2;
var ywin = window.innerHeight / 2;
var userplayer = null;
var coredata = {};
var TeamSelected = null;
var serverMessage = null;
var serverMessageTimer = 0;
var serverMessageWindow = 0;
var serverTime = 6000
var playerHealth;


///// METHODS ///////////////////////////

function resize(){
	var sels = ["selBlue", "selRed", "selGreen", "selGold"]
	if (window.innerWidth < window.innerHeight){
		map.style.width = window.innerWidth + "px";
	} else {
		map.style.width = window.innerHeight+"px";
	}
}


function charAlg(code){
	block = code.split(".");
	yvalue = ((block[0] -1) * 64) + (((block[1]/2) - 1) * 16);
	anims = [0, 80, 160, 240, 320, 400, 480, 560, 640, 720, 800]
	if (block[2] < 10){
		xvalue = anims[0] + (block[2] * 16);
	}
	if (block[2] < 100 && block[2] > 9 ){
		prts=block[2].split("")
		xvalue = anims[prts[0]] + (prts[1] * 16);
	}
	if (block[2] < 1000 && block[2] > 99 ){
		prts=block[2].split("")
		xvalue = anims[prts[0]+prts[1]] + (prts[2] * 16);
	}
	return [charsprites,xvalue,yvalue,16,16];
}

function draw(){
	serverTime -= 1;
	if ( true ){
		//CLEAN canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.font='8px tiny';
		ctx.textAlign="left";
		// DRAW map ///////////////////////////////////
		ctx.drawImage(map1, 0, 0)
		//Get all sprite locations
		db = coredata;
		db.reverse();
		db.sort(function(a,b){return a.split(".")[4] - b.split(".")[4]})
		db.sort(function(a,b){return a.split(".")[5] - b.split(".")[5]})
		for (var code in db){
			blk = db[code].split(".");
			if (blk[0] == "18" && blk[2] == "113"){ console.log("play"); snd.play()}
			if (blk[0] == "18" && blk[2] == "3"){ console.log("play"); snd.play()}
			//Draw each sprite
			if (db[code].length > 0){
				image2draw = charAlg(db[code]);
				image2draw.push((blk[3] - campos[0] + 28)*2, (blk[4] - campos[1] + 28)*2, 16, 16);
				ctx.drawImage.apply(ctx, image2draw);
				// Next three lines are for watching the center of sprites
				//style = "rgba(0,21,211," + 1 + ")"
				//ctx.fillStyle=style;
				//ctx.fillRect(((blk[3] - campos[0] + 32)*2)-1, ((blk[4] - campos[1] + 32)*2)-1, 2, 2);
			};
		};
		// Draw the top layer of the map
		ctx.drawImage(map2, (32 - campos[0])*2 , (34 - campos[1])*2)

		//////////////////// TIME OF DAY SHADERS //////////////////////
		if (serverTime < 3400 && serverTime > 3000){
			ctx.globalCompositeOperation = "color-burn";
			percent = (40 - ((serverTime - 3000)/10))/100
			style = "rgba(0,21,211," + percent + ")"
			ctx.fillStyle=style;
			ctx.fillRect(0,0,128,128);
			ctx.globalCompositeOperation = "source-over";
		}

		if (serverTime <= 3000 && serverTime > 400){
			ctx.globalCompositeOperation = "color-burn";
			percent = 0.4
			style = "rgba(0,21,211," + percent + ")"
			ctx.fillStyle=style;
			ctx.fillRect(0,0,128,128);
			ctx.globalCompositeOperation = "source-over";
		}

		if (serverTime <= 400){
			ctx.globalCompositeOperation = "color-burn";
			percent = ((serverTime)/10)/100
			style = "rgba(0,21,211," + percent + ")"
			ctx.fillStyle=style;
			ctx.fillRect(0,0,128,128);
			ctx.globalCompositeOperation = "source-over";
		}

		//////////// UI stuff ////////////////////
		//Health
		ctx.drawImage.apply(ctx, [charsprites,400,560,80,16,-10,-5,80,16])
		ctx.fillStyle= "rgba(255,0,56,0.35)";
		ctx.fillRect(2,0, Math.round((playerHealth/playerMaxHealth)*30),6)
		ctx.fillStyle= "rgba(0,56,255,0.35)";
		ctx.fillRect(35,0, Math.round((playerMana/playerMaxMana)*23),6)
		var cor = Math.round((playerCor/playerMaxCor)*80) + 1
		ctx.drawImage.apply(ctx, [charsprites,560-cor,560,cor,16,70-cor,-5,cor,16])
		//ctx.fillText(selector[0]+"|"+selector[1]+"|"+(selector[1]+ (selector[0]*(selectorXlimit+1))), 70, 16);

		//Items
		ctx.fillStyle= "#282c34";
		image2draw = charAlg(weap0);
		image2draw.push(76, 0, 8, 8);
		ctx.drawImage.apply(ctx, image2draw);
		ctx.fillText("H", 70, 8);
		image2draw = charAlg(weap1);
		image2draw.push(91, 0, 8, 8);
		ctx.drawImage.apply(ctx, image2draw);
		ctx.fillText("J", 85, 8);
		image2draw = charAlg(weap2);
		image2draw.push(106, 0, 8, 8);
		ctx.drawImage.apply(ctx, image2draw);
		ctx.fillText("K", 100, 8);
		image2draw = charAlg(weap3);
		image2draw.push(119, 0, 8, 8);
		ctx.drawImage.apply(ctx, image2draw);
		ctx.fillText("L", 115, 8);
		//Dialog
		if (dialog != null && dialogType == "speech"){
			ctx.fillStyle= "rgba(15,15,15,0.85)"
			ctx.drawImage.apply(ctx, [charsprites,400,576,128,64,0,64,128,64])
			//ctx.fillRect(0,74,128,64);
			ctx.fillStyle= "#c1c1c1";
			ctx.fillText(dialog[0], 7, 82);
			ctx.fillText(dialog[1], 7, 92);
			ctx.fillText(dialog[2], 7, 102);
			ctx.fillText(dialog[3], 7, 112);
			ctx.fillText(dialog[4], 7, 122);
			ctx.fillText(">", 2, 81 + (10*selector[0]));
		}
		//loot
		if (dialog != null && dialogType == "loot"){
			ctx.drawImage.apply(ctx, [charsprites,656,560,128,80,0,48,128,80])
			ctx.fillStyle= "#c1c1c1";
			ctx.font='6px tinyest';
			for (var i = 0; i < dialog.length; i++){
				var image2draw = charAlg(dialog[i][2]);
				if (i < 10){
					image2draw.push(5+(12*i), 98, 8, 8);
					ctx.drawImage.apply(ctx, image2draw);
					if (dialog[i][1] > 1 ){if (dialog[i][1] < 10){ctx.fillText(dialog[i][1], 12+(12*i), 107);} else {ctx.fillText("+", 12+(12*i), 107);} }
				} else{
					image2draw.push(5+(12*(i-10)), 114, 8, 8);
					ctx.drawImage.apply(ctx, image2draw);
					if (dialog[i][1] > 1 ){if (dialog[i][1] < 10){ctx.fillText(dialog[i][1], 12+(12*(i-10)), 123);} else {ctx.fillText("+", 12+(12*(i-10)), 123);} }

				}
			}
			ctx.font='8px tiny';
			if (lootSpot1 !== null){
				ctx.beginPath();
				ctx.strokeStyle= "red"
				ctx.rect(5 + (12*lootSpot1[1]), 97 + (16*lootSpot1[0]), 10, 10);
				ctx.stroke();
			}
			ctx.fillStyle= "#c1c1c1";
			if (dialog[selector[1]+ (selector[0]*(selectorXlimit+1))][1] > 1){
				ctx.fillText(dialog[selector[1]+ (selector[0]*(selectorXlimit+1))][0] + "  x" + dialog[selector[1]+ (selector[0]*(selectorXlimit+1))][1], 7, 77);
			} else {
				ctx.fillText(dialog[selector[1]+ (selector[0]*(selectorXlimit+1))][0], 7, 77);
			};
			ctx.fillStyle= "#7B7B7B";
			ctx.fillText(dialog[selector[1]+ (selector[0]*(selectorXlimit+1))][6], 51, 63);
			if (dialog[selector[1]+ (selector[0]*(selectorXlimit+1))][4] !== 'undefined'){
			        ctx.fillText(dialog[selector[1]+ (selector[0]*(selectorXlimit+1))][4], 75, 63);
			}
			ctx.fillText(dialog[selector[1]+ (selector[0]*(selectorXlimit+1))][5], 103, 62);
			ctx.fillText(dialog[selector[1]+ (selector[0]*(selectorXlimit+1))][3], 7, 87);
			ctx.beginPath();
			ctx.strokeStyle= "orange"
			ctx.rect(5 + (12*selector[1]), 97 + (16*selector[0]), 10, 10);
			ctx.stroke();
			//ctx.fillText(">", 2 + (12*selector[1]), 102 + (16*selector[0]));
		}
		//Character UI inventory
		if (dialog != null && dialogType == "character"){
			ctx.drawImage.apply(ctx, [charsprites,784,528,128,112,0,16,128,112])
			ctx.fillStyle= "#c1c1c1";
			ctx.font='6px tinyest';
			for (var i = 0; i < dialog.length; i++){
				var image2draw = charAlg(dialog[i][2]);
				if (i < 10){
					image2draw.push(5+(12*i), 98, 8, 8);
					ctx.drawImage.apply(ctx, image2draw);
					if (dialog[i][1] > 1 ){if (dialog[i][1] < 10){ctx.fillText(dialog[i][1], 12+(12*i), 107);} else {ctx.fillText("+", 12+(12*i), 107);} }
				} else{
					image2draw.push(5+(12*(i-10)), 114, 8, 8);
					ctx.drawImage.apply(ctx, image2draw);
					if (dialog[i][1] > 1 ){if (dialog[i][1] < 10){ctx.fillText(dialog[i][1], 12+(12*(i-10)), 123);} else {ctx.fillText("+", 12+(12*(i-10)), 123);} }

				}
			}
			ctx.font='8px tiny';
			ctx.globalCompositeOperation = "soft-light";
			style = "rgba(220,220,170,0.100)"
			ctx.fillStyle=style;
			ctx.fillRect(6,98,8,8);
			ctx.fillRect(18,98,8,8);
			ctx.fillRect(30,98,8,8);
			ctx.fillRect(42,98,8,8);
			ctx.globalCompositeOperation = "source-over";

			if (lootSpot1 !== null){
				ctx.beginPath();
				ctx.strokeStyle= "red"
				ctx.rect(5 + (12*lootSpot1[1]), 97 + (16*lootSpot1[0]), 10, 10);
				ctx.stroke();
			}
			ctx.fillStyle= "#7B7B7B";
			ctx.font='6px tinyest';
			ctx.fillText("Health: "+playerHealth+"/"+playerMaxHealth, 7, 28);
			ctx.fillText("Mana: "+playerMana+"/"+playerMaxMana, 69, 28);
			ctx.fillText("Corruption: "+playerCor+"/"+playerMaxCor, 7, 34);
			ctx.font='8px tiny';
			ctx.fillStyle= "#c1c1c1";
			if (dialog[selector[1]+ (selector[0]*(selectorXlimit+1))][1] > 1){
				ctx.fillText(dialog[selector[1]+ (selector[0]*(selectorXlimit+1))][0] + "  x" + dialog[selector[1]+ (selector[0]*(selectorXlimit+1))][1], 7, 75);
			} else {
				ctx.fillText(dialog[selector[1]+ (selector[0]*(selectorXlimit+1))][0], 7, 75);
			};
			ctx.fillStyle= "#7B7B7B";
			ctx.fillText(dialog[selector[1]+ (selector[0]*(selectorXlimit+1))][6], 51, 63);
			if (dialog[selector[1]+ (selector[0]*(selectorXlimit+1))][4] !== 'undefined'){
			ctx.fillText(dialog[selector[1]+ (selector[0]*(selectorXlimit+1))][4], 75, 63);
			}
			ctx.fillText(dialog[selector[1]+ (selector[0]*(selectorXlimit+1))][5], 103, 62);
			ctx.fillText(dialog[selector[1]+ (selector[0]*(selectorXlimit+1))][3], 7, 85);
			ctx.beginPath();
			ctx.strokeStyle= "orange"
			ctx.rect(5 + (12*selector[1]), 97 + (16*selector[0]), 10, 10);
			ctx.stroke();
		}


		// If server message, display now
		if (serverMessage != null){
			if (serverMessageWindow > 20){
				serverMessageTimer += 1
			} else if (playerHealth > 0){
				serverMessageTimer -= 1
			}
			serverMessageWindow -= 1
			var message = serverMessage.split("|");
			ctx.textAlign="center";
			style = "rgba(15,15,15," + serverMessageTimer/40 + ")"
			ctx.fillStyle=style;
			ctx.fillRect(0,0,128,128);
			style = "rgba(255,255,255," + serverMessageTimer/20 + ")"
			ctx.fillStyle=style;
			ctx.font='8px small';
			ctx.fillText(message[0], 64, 62);
			ctx.font='8px tiny';
			ctx.fillText(message[1], 64, 72);
			if (serverMessageTimer <= 0) {
				serverMessageTimer = 0;
				serverMessage = null;
			console.log(serverMessageTimer)
			}
		}
	};
};

//ACTUAL GAME /////////////////////////////////////////

function startIT(){
	setInterval(function(){
	  var effects = []
		draw()
	  ///////////////
	  var datas = [];
	  //PLAYERS

	  //Bombs

	}, 32);
}

map1.onload = function () {
		console.log("StartedIT")
    startIT();
}


window.addEventListener("resize", function() {
	resize();
});
resize();
///// USER INPUT for player movement  ////////////////////////////   192

document.onkeydown= function(event) {
		var key= (event || window.event).keyCode;
		if (key == 72){ control("interact"); return };
		if (key == 74){ control("attack1"); return };
		if (key == 75){ control("attack2"); return };
		if (key == 76){ control("attack3"); return };
		if (key == 192){ console.log(serverTime, coredata, " currentDirKey ", currentDirKey); return };
		if (key == 73){ control("interact"); return };
		if (key == 85){ control("character"); return };
		//wasd
		if (key == 87){ control("2") };
		if (key == 68){ control("4") };
		if (key == 83){ control("6") };
		if (key == 65){ control("8") };
		// arrows
		if (key == 38){ event.preventDefault(); control("2") };
		if (key == 39){ event.preventDefault(); control("4") };
		if (key == 40){ event.preventDefault(); control("6") };
		if (key == 37){ event.preventDefault(); control("8") };
		if ([72, 74, 75, 76].indexOf(key) == -1){
			currentDirKey = key;
		}
};


document.onkeyup= function(event) {
		var key= (event || window.event).keyCode;
		if (key == currentDirKey){
			currentDirKey = null;
			currentDir = null;
			control("movenull");
		} else if ([74, 75, 76].indexOf(key) > -1){
			control("attacknull");
		};
};
