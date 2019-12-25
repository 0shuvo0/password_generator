function copyToClipboard(t) {
	if(t.trim() == ""){
		return;
	}
	var e = document.createElement("textarea");
	e.value = t.trim(), document.body.appendChild(e), e.select(), document.execCommand("copy"), document.body.removeChild(e)
}

function $(el, p = document){
	return p.querySelector(el);
}

var switches;
function initSwitch(){
	switches = document.querySelectorAll('.switch-input');
	for(var i = 0; i < switches.length; i++){
		var s = switches[i];
		s.setAttribute('val', (s.classList.toString().trim() == "switch-input")? 'off' : 'on');
		s.addEventListener("click", function(){
			var e = this;
			if(e.classList.toString().trim() == "switch-input"){
				e.classList = "switch-input active";
				e.setAttribute('val', 'on');
			}else{
				e.classList = "switch-input";
				e.setAttribute('val', 'off');
			}
		});
	}
}

function genArr(min, max){
	var arr = "";
	for(var i = min; i <= max; i++){
		arr += i.toString() + " ";
	}
	return arr;
}


function isOn(n){
	return (switches[n].getAttribute('val').trim() == "on")? true : false;
}

var UPPS = genArr(65, 90);
var LOWS = genArr(97, 122);
var NUMS = genArr(48, 57);
var SYMS = genArr(38, 47) + genArr(58, 65) + genArr(91, 96) + genArr(123, 126);
var pwds = localStorage.getItem('genedPwds') || "";

$("form").onsubmit = function(e){
	e.preventDefault();
}

$('.gen-btn').onclick = function(){
	generatePwd();
}

function generatePwd(){
	var charCodes = "";
	if(isOn(0)){
		charCodes += (UPPS);
	}
	if(isOn(1)){
		charCodes += (LOWS);
	}
	if(isOn(2)){
		charCodes += (NUMS);
	}
	if(isOn(3)){
		charCodes += (SYMS);
	}
	var len = parseInt($('.num-input input').value.trim());
	if(len < 1 || len > 50){
		len = 50;
	}
	var charCodesArr = charCodes.trim().split(" ");
	if(charCodesArr.length < 10){
		$('.prev #prev').value = "";
		return;
	}
	var pwd = "";
	for(var i = 0; i < len; i++){
		pwd += String.fromCharCode(charCodesArr[Math.floor(Math.random() * charCodesArr.length)]);
	}
	$('.prev #prev').value = pwd;
}

$('.copy').onclick = function(){
	ctrlClick(this);
}
$('.save').onclick = function(){
	ctrlClick(this);
}

function ctrlClick(_t){
	var it = _t.innerText.trim().toLowerCase();
	it = (it == "copy" || it == "copied!")? "copy" : "save";
	if(it == "copy"){
		if($('.prev #prev').value.trim() == ""){
			return;
		}
		copyToClipboard($('.prev #prev').value);
		_t.innerText = "copied!";
		setTimeout(function(){
			_t.innerText = "copy";
		}, 3000);
	}else{
		savePwd(_t);
	}
}

function savePwd(_t){
	var sa = $("#sa").value.trim();
	if(sa == ""){
		alert("Title is required!");
		return;
	}
	var p = $('.prev #prev').value.trim();
	if(p == ""){
		alert("Password is empty!");
		return;
	}
	pwds += "#-%-#title#-:-#" + sa + "[andpwd]pwd#-:-#" + p;
	localStorage.setItem('genedPwds', pwds);
	showPwd();
	$("#sa").value = "";
	_t.innerText = "saved!";
	setTimeout(function(){
		_t.innerText = "save";
	}, 3000);
}

function showPwd(){
	var e = $('.spwds');
	if(pwds.trim() == ""){
		e.innerHTML = '<ul><li>Nothing to show.</li></ul>';
		return;
	}
	var ps = pwds.substr(3).split('#-%-#');
	var str = "<ul>";
	for(var i = 0; i < ps.length; i++){
		str += "<li><ul>";
		str += "<li class='name'>" + ps[i].split("[andpwd]")[0].split("#-:-#")[1] + ":</li>";
		str += "<li>&nbsp;&nbsp;" + ps[i].split("[andpwd]")[1].split("#-:-#")[1] + "</li>";
		str += "</ul></li>"
	}
	str += '</ul><button class="btn" onClick="delpwds()">clear</button>';
	e.innerHTML = str;
}

function delpwds(){
	localStorage.removeItem('genedPwds');
	pwds = "";
	showPwd();
}

initSwitch();
//generatePwd();
showPwd();