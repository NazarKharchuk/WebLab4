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
		info.x = anim.offsetWidth/2-settings.diametr/2 + main.offsetLeft-5;
		info.y = anim.offsetHeight/2-settings.diametr/2 + main.offsetTop-5;
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
		
		let circle = document.getElementById("circle");
		circle.style.left = `${anim.offsetWidth/2-settings.diametr/2  + main.offsetLeft-5}px`;
		circle.style.top = `${anim.offsetHeight/2-settings.diametr/2  + main.offsetTop-5}px`;

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
	switch (info.direction) {
		case "left":
			circle.style.left = `${--info.x}px`; break;
		case "right":
			circle.style.left = `${++info.x}px`; break;
		case "down":
			circle.style.top = `${--info.y}px`; break;
		case "up":
			circle.style.top = `${++info.y}px`; break;
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
        if (info.y < (anim.offsetHeight+main.offsetTop-5) && info.y > (-settings.diametr+main.offsetTop-5) && !info.isStop && !info.isReload) {
			move();
		}
        if (!(document.getElementById("reloadB")) && !(info.y+settings.diametr < (anim.offsetHeight+main.offsetTop) && info.y > main.offsetTop)) {
                document.getElementById("messages").innerHTML = settings.borderMesage;
				let date = new Date();
				storage.setItem(`${storage.length}`, `${settings.borderMesage} : ${date.toLocaleTimeString()}`);

				buttons.lastChild.id = "reloadB";
                buttons.lastChild.onclick = reload;
                buttons.lastChild.innerHTML = settings.reloadText;
            }
		if (info.y >= (anim.offsetHeight+main.offsetTop-5) || info.y <= (-settings.diametr+main.offsetTop-5)) {
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

	let controls = document.createElement("div")
	controls.id = "controls"
    controls.className = "controls"
	controls.width = work.offsetWidth
	controls.style.height = `${settings.forControls}px`
	work.append(controls)

	let buttons = document.createElement("div")
	buttons.id = "buttons"
    buttons.className = "buttons"
	controls.append(buttons)

	let anim = document.createElement("div")
	anim.id = "anim"
    anim.className = "anim"
	anim.style.minWidth = `${work.offsetWidth - settings.forBorder}px`
	anim.style.minHeight= `${work.offsetHeight - settings.forControls}px`
	anim.style.margin = "auto"
	anim.style.border = `5px solid ${settings.borderColor}`
	anim.style.backgroundImage = `url(${settings.img})`
	anim.style.backgroundPosition = "center center"
	work.append(anim)

	let closeButton = document.createElement("button")
	closeButton.id = "closeB"
	closeButton.onclick = close
	closeButton.innerHTML = settings.closeText
	buttons.appendChild(closeButton)

	let startButton = document.createElement("button")
	startButton.id = "startB"
	startButton.onclick = start
	startButton.innerHTML = settings.startText
	buttons.appendChild(startButton)

    let messages = document.createElement("div")
	messages.id = "messages"
    messages.className = "messages"
	messages.innerHTML = 'For message'
	controls.append(messages)

	info.x = anim.offsetWidth/2-settings.diametr/2 + main.offsetLeft-5
	info.y = anim.offsetHeight/2-settings.diametr/2 + main.offsetTop-5
	let circle = document.createElement("div")
	circle.id = "circle"
	circle.style.minWidth = circle.style.minHeight = `${settings.diametr}px`
	circle.style.marginTop = `${settings.forControls}px`
	circle.style.left = `${info.x}px`
	circle.style.top = `${info.y}px`
    circle.style.position = "fixed"
	circle.style.backgroundColor = settings.circleColor
	circle.style.borderRadius = `${settings.radiys}px`
	anim.append(circle)
}

delete info;
delete settings;


