const URL = 'https://tvdhout.com/ericrosen/get/'

function getSubs(){
	return fetch(URL, {method: "GET"})
	.then((resp) => resp.text())
	.then(function(data){
		data = data.toLowerCase();
		subs = data.split(" ");
		return subs;
	});
}

function setNameColors(){
	getSubs()
	.then(function(subs){
		var challenges = document.getElementsByClassName("challenge");

		for (var i = 0; i < challenges.length; i++) {
			challengerName = challenges[i].getElementsByClassName("user-link")[0].innerText.split(" ")[0].toLowerCase();
			if(subs.includes(challengerName)){
				challenges[i].getElementsByClassName("user-link")[0].style.color = "#9e84ce";
			}
		}
	})
	.catch(function(error){
		console.log(error);
	});
}

function acceptChallenge() {
	var challenges = document.getElementsByClassName("challenge");
	var challenge = challenges[Math.floor(Math.random() * challenges.length)]
	challenge.getElementsByClassName("accept")[0].click();
}

function acceptSubChallenge() {
	/**
	Function and service by Stockvis.
	Queries the database of IMRosen subs with their lichess handles and filters challenges .
	**/
	var challenges = document.getElementsByClassName("challenge");

	getSubs()
	.then(function(subs){
		
		var subChallenges = [];

		for (var i = 0; i < challenges.length; i++) {
			challengerName = challenges[i].getElementsByClassName("user-link")[0].innerText.split(" ")[0].toLowerCase();
			if(subs.includes(challengerName)){
				subChallenges.push(challenges[i]);
			}
		}

		if(subChallenges.length > 0){
			var challenge = subChallenges[Math.floor(Math.random() * subChallenges.length)];
			challenge.getElementsByClassName("accept")[0].click();
		}

	})
	.catch(function(error){
		console.log(error);
	})
}


function init(container) {
	var div = document.createElement("div");
	div.innerText = "Accept random challenge";
	div.id = "lichess-arc";
	div.onclick = acceptChallenge;
	container.prepend(div);

	var subdiv = document.createElement("div");
	subdiv.innerText = "Accept subscriber challenge";
	subdiv.id = "lichess-arc-sub";
	subdiv.onclick = acceptSubChallenge;
	container.prepend(subdiv);
}

function loadContainer() {
	e = document.getElementById('challenge-toggle');
	e.click(); // open challanges menu
	e.click(); // close challanges menu
}

function initWhenContainerLoaded() {
	var container = document.getElementById("challenge-app");
	if (container.className.indexOf("rendered") > 0) {
		init(container);
	} else {
		// loadContainer();
		setTimeout(initWhenContainerLoaded, 100);
	}
	document.getElementById('challenge-toggle').addEventListener("click", setNameColors);
	document.getElementById("challenge-app").addEventListener("mouseenter", setNameColors);
}

initWhenContainerLoaded();