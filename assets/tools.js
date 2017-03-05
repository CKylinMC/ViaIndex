// Collection of many useful js functions.


//From Bilibili | parse httpget params
function getUrlParam(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        try {
            return decodeURIComponent(r[2]);
        } catch (e) {
            return null;
        }
    }
    return null;
}

//From Unknow | parse json
function parseJsons(json) {
    return eval("(" + json + ")");;
}

//From zhihu | add style rules to html
function addStyle(str_css){
	var style=document.createElement("style");
	style.type="text/css";
	style.innerHTML=str_css;
	document.getElementsByTagName("head").item(0).appendChild(style);
}

//From CKylin | if input is empty
function isEmpty(key){
	if(!key||key==''||key==' '||key=='   '||key=='undefined'||key=='{}'){
		return true;
	}
	return false;
}

//From CKylin | random keys
var random = {};
random.key = (function(){
	return Math.random();
});
random.number = (function(){
	return Math.ceil(Math.random());
});
random.range = (function(min,max){
	if(!min) return false;
	if(!max) return false;
	return Math.floor(Math.random()*(max-min+1)+min);
});
random.half = (function(){
	var r = Math.random();
	if(r>=.5){
		return true;
	}
	return false;
});

//From Unknow | add document.ready();
(function () {
  var ie = !!(window.attachEvent && !window.opera);
  var wk = /webkit\/(\d+)/i.test(navigator.userAgent) && (RegExp.$1 < 525);
  var fn = [];
  var run = function () { for (var i = 0; i < fn.length; i++) fn[i](); };
  var d = document;
  d.ready = function (f) {
    if (!ie && !wk && d.addEventListener)
      return d.addEventListener('DOMContentLoaded', f, false);
    if (fn.push(f) > 1) return;
    if (ie)
      (function () {
        try { d.documentElement.doScroll('left'); run(); }
        catch (err) { setTimeout(arguments.callee, 0); }
      })();
    else if (wk)
      var t = setInterval(function () {
        if (/^(loaded|complete)$/.test(d.readyState))
          clearInterval(t), run();
      }, 0);
  };
})();


//Check if tools.js is loaded.
var ToolsJS = true;
console.info('Tools.js loaded.');