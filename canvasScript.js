let settings = new Object;
const storage = window.localStorage;
storage.clear();
let info = new Object;
info.x = 0;
info.y = 0;
info.direction = "left";
info.isStop = false;
info.isReload = false;
info.allPash = 1;
info.Pash = 0;

async function read() {
	let res = await fetch("settings.json");
	let json = await res.json();
	settings.startText = json["startText"];
	settings.stopText = json["stopText"];
	settings.closeText = json["closeText"];
	settings.reloadText = json["reloadText"];
	settings.startMesage = json["startMesage"];
	settings.closeMesage = json["closeMesage"];
	settings.stopMesage = json["stopMesage"];
	settings.reloadMesage = json["reloadMesage"];
	settings.borderMesage = json["borderMesage"];
	settings.outMesage = json["outMesage"];
	settings.borderColor = json["borderColor"];
	settings.circleColor = json["circleColor"];
	settings.forBorder = json["forBorder"];
	settings.forControls = json["forControls"];
	settings.diametr = json["diametr"];
	settings.radiys = json["radiys"];
	settings.step = json["step"];
	settings.img = json["img"];
}
read();

function start(){
	document.getElementById("messages").innerHTML = settings.startMesage;
	let date = new Date();
	storage.setItem(`${storage.length}`, `${settings.startMesage} : ${date.toLocaleTimeString()}`);

	buttons.lastChild.id = "stopB";
	buttons.lastChild.onclick = stop;
	buttons.lastChild.innerHTML = settings.stopText;

	if (info.isReload) {
        info.x = anim.width/2;
        info.y = anim.height/2;
		info.allPash = 1;
		info.Pash = 0;
		info.direction = "left";
	}
	info.isStop = false;
	info.isReload = false;
	move();
}

function stop() {
	document.getElementById("messages").innerHTML = settings.stopMesage;
	let date = new Date();
	storage.setItem(`${storage.length}`, `${settings.stopMesage} : ${date.toLocaleTimeString()}`);
	
	info.isStop = true;
	buttons.lastChild.id = "startB";
	buttons.lastChild.onclick = start;
	buttons.lastChild.innerHTML = settings.startText;
}

function reload() {
	document.getElementById("messages").innerHTML = settings.reloadMesage;
	let date = new Date();
	storage.setItem(`${storage.length}`, `${settings.reloadMesage} : ${date.toLocaleTimeString()}`);
	info.isReload = true;
	setTimeout(() => {
		buttons.lastChild.id = "startB";
		buttons.lastChild.onclick = start;
		buttons.lastChild.innerHTML = settings.startText;
		
        info.x = anim.width/2;
        info.y = anim.height/2;
        var canvas = document.getElementById("anim");
        var circle = canvas.getContext("2d");
        circle.clearRect(0, 0, canvas.width, canvas.height);
        circle.beginPath();
        circle.arc(info.x, info.y, settings.radiys, 0, Math.PI * 2, false);
        circle.closePath();
        circle.fillStyle = settings.circleColor;
        circle.fill();

	}, 100)
}

function close(){
	let date = new Date();
	storage.setItem(`${storage.length}`, `${settings.closeMesage} : ${date.toLocaleTimeString()}`);    
	while (main.lastChild) {
		main.removeChild(main.lastChild);
	}
	let text = ""
	for (let i = 0; i < storage.length; i++) {
		text += `${storage.getItem(i)}<br>`;
	}
	document.getElementById("forText").innerHTML = text;
}

function direction(){
    var canvas = document.getElementById("anim");
	var circle = canvas.getContext("2d");
    circle.clearRect(0, 0, anim.width, anim.height)
	switch (info.direction) {
		case "left":
            info.x -= 1;
            circle.beginPath();
            circle.arc(info.x, info.y, settings.radiys, 0, Math.PI * 2, false);
            circle.closePath();
            circle.fillStyle = settings.circleColor;
            circle.fill();
            break;
		case "right":
            info.x += 1;
            circle.beginPath();
            circle.arc(info.x, info.y, settings.radiys, 0, Math.PI * 2, false);
            circle.closePath(); 
            circle.fillStyle = settings.circleColor;
            circle.fill();
            break;
		case "down":
            info.y -= 1;
            circle.beginPath();
            circle.arc(info.x, info.y, settings.radiys, 0, Math.PI * 2, false);
            circle.closePath(); 
            circle.fillStyle = settings.circleColor;
            circle.fill();
            break;
		case "up":
            info.y += 1;
            circle.beginPath();
            circle.arc(info.x, info.y, settings.radiys, 0, Math.PI * 2, false);
            circle.closePath();
            circle.fillStyle = settings.circleColor;
            circle.fill();
            break;
	}
	info.Pash += 1;
	if (info.Pash >= info.allPash) {
		switch (info.direction) {
			case "left":
				info.direction = "up"; break;
			case "right":
				info.direction = "down"; break;
			case "down":
				info.direction = "left"; break;
			case "up":
				info.direction = "right"; break;
		}
		info.allPash += settings.step;
		info.Pash = 0;
	}
}

function move() {
    setTimeout(() => {
        direction();
        if (info.y < anim.height+settings.diametr && info.y > -settings.diametr && !info.isStop && !info.isReload) {
            move();
        }
        if (!(document.getElementById("reloadB")) && !(info.y < anim.height && info.y > 0)) {
                document.getElementById("messages").innerHTML = settings.borderMesage;
				let date = new Date();
				storage.setItem(`${storage.length}`, `${settings.borderMesage} : ${date.toLocaleTimeString()}`);

				buttons.lastChild.id = "reloadB";
                buttons.lastChild.onclick = reload;
                buttons.lastChild.innerHTML = settings.reloadText;
        }
		if (info.y >= anim.height+settings.diametr || info.y <= (-settings.diametr)) {
			document.getElementById("messages").innerHTML = settings.outMesage;
			let date = new Date();
			storage.setItem(`${storage.length}`, `${settings.outMesage} : ${date.toLocaleTimeString()}`);
		}
    }, 10);
}

function play() {
	info.x = 0;
	info.y = 0;
	info.direction = "left";
	info.isStop = false;
	info.isReload = false;
	info.allPash = 1;
	info.Pash = 0;

    while (main.lastChild) {
		main.removeChild(main.lastChild);
	}

	let work = document.createElement("div");
	work.id = "work";
    work.className = "work";
	work.style.display = "grid";
	work.style.gridTemplateRows = `${settings.forControls}px 1fr`;
	main.append(work);

	let controls = document.createElement("div");
	controls.id = "controls";
    controls.className = "controls";
	controls.width = work.offsetWidth;
	controls.style.height = `${settings.forControls}px`;
	work.append(controls);

	let buttons = document.createElement("div");
	buttons.id = "buttons";
    buttons.className = "buttons";
	controls.append(buttons);

	let canvas = document.createElement("canvas");
	canvas.id = "anim";
    canvas.className = "anim";
	canvas.width = work.offsetWidth - settings.forBorder;
	canvas.height= work.offsetHeight - settings.forControls;
	canvas.style.margin = "auto";
	canvas.style.border = `5px solid ${settings.borderColor}`;
	canvas.style.backgroundImage = `url(${settings.img})`;
	canvas.style.backgroundPosition = "center center";
	work.append(canvas);

	let closeButton = document.createElement("button");
	closeButton.id = "closeB";
	closeButton.onclick = close;
	closeButton.innerHTML = settings.closeText;
	buttons.appendChild(closeButton);

	let startButton = document.createElement("button");
	startButton.id = "startB";
	startButton.onclick = start;
	startButton.innerHTML = settings.startText;
	buttons.appendChild(startButton);

    let messages = document.createElement("div");
	messages.id = "messages";
    messages.className = "messages";
	messages.innerHTML = 'For message';
	controls.append(messages);

	info.x = anim.width/2;
	info.y = anim.height/2;

    let circle = canvas.getContext('2d');
    circle.beginPath();
    circle.arc(info.x, info.y, settings.radiys, 0, Math.PI * 2, false);
    circle.closePath();
    circle.fillStyle = settings.circleColor;
    circle.fill();
}

delete info;
delete settings;

