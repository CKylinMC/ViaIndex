var ToolsJS;
if (!ToolsJS == true) {
	console.warn('工具包js未能正常加载，页面可能无法正常显示。');
	console.info('尝试页面初始化...');
	try {
		init();
	} catch (e) {
		console.error('页面引导出错：' + e.message);
	}
}
var d = document;

var version = "1.2";

var primaryColor = "#1e88e5";
var bgimg = 'http://www.dujin.org/sys/bing/1366.php';
var searchEngine = 'https://www.baidu.com/s?wd=';
var bigtitle = 'auto';
var params = '&';
var timeout;
var isVia = false;
var firstOpen = true;
var alwaysTip = false;
//var site = location.href;
var URLdata = parseURL(location.href);
var site = URLdata.protocol+'://'+URLdata.host;
//var site = 'file:///H:/w网站/Projects[]/ViaIndex/index.html';
var weathercity = 'ip';
var weathercityname = '地球';
var weatherapi = 'http://api.yytianqi.com/observe';
//?city='+weathercity+'&key=m44rbu8ibsv1il13
var weatherquery = { 'city': weathercity, 'key': 'm44rbu8ibsv1il13', 'random': Math.random() };
var weatherdata;
var weatherbody;
var weatherstatus = 'unload';
var daynight = '0';
var changed = false;
//var newsdata;
//var newsapi;
var histtorydata;
var historyapi = 'http://www.ipip5.com/today/api.php';
var historyquery = { 'type': 'json' };

function setSearchIco() {
	document.getElementById('search-button').style.display = 'block'
	document.getElementById('search-button').style.opacity = "0";
	document.getElementById('search-button').style.filter = "alpha(opacity=0)";
	var se = searchEngine;
	var bd = 'https://www.baidu.com/s?wd=';
	var gg = 'https://www.google.com.hk/search?q=';
	var fy = 'http://m.iciba.com/';
	var map = 'http://map.sogou.com/#&lq=';
	setTimeout((function () {
		if (se == bd) {
			document.getElementById('search-button').className = 'fa fa-search';
		} else if (se == gg) {
			document.getElementById('search-button').className = 'fa fa-google';
		} else if (se == fy) {
			document.getElementById('search-button').className = 'fa fa-language';
		} else if (se == map) {
			document.getElementById('search-button').className = 'fa fa-map';
		} else {
			document.getElementById('search-button').className = 'fa';
			document.getElementById('search-button').innerHTML = '';
			document.getElementById('search-button').style.backgroundImage = getFavicon(se);
		}
		document.getElementById('search-button').style.opacity = "100";
		document.getElementById('search-button').style.filter = "alpha(opacity=100)";
	}), 360);
}

function makeQR(value) {
	if(isEmpty(value)){
		autohideTip('二维码内容为空');
		return false;
	}
	console.log('Run QR Maker - '+value);
	var qr = qrcode.QRCode(10, 'H');
	qr.addData(value);
	qr.make();
	document.getElementById('qrcontent').innerHTML = '<center>'+qr.createImgTag(3)+'<hr>'+value+'<br><i class="fterror"> 长按可以保存二维码 </i></center>';
	document.getElementById('qrframe').style.display = 'block';
	document.getElementById('qrframe').scrollIntoView(true);
	return true;
}

function qrclose(){
	document.getElementById('qrframe').style.display = 'none';
}

function getHistory() {
	/*
	httpget(historyapi,{},(function(data){
		//success
		histtorydata = parseJson(data);
		document.getElementById('history').innerHTML = '历史上的今天 - ' + histtorydata.today;
		var historybody = '<ul>';
		for(var i = 0, len = historydata.result.length; i < len; i++){
			historybody = historybody + '<li>' + historydata.result[i] + '</li>';
		}
		var historybody = historybody + '</ul>';
		document.getElementById('history-content').innerHTML = historybody;
	}),(function(e){
		//error
		if(e=="0") e = '网络连接错误';
		console.error('历史上的今天 获取出现错误:' + e);
		document.getElementById('history').innerHTML = '时光飞逝';
		document.getElementById('history-content').innerHTML = '<center>在你生命中的每一天都是特别的<br><i class="fterror">(E-2)' + e + '</i></center>';
	}));
	*/
	jsonp(historyapi, historyquery, (function (data) {
		histtorydata = parseJson(data);
		if (histtorydata.today == undefined) {
			//error
			document.getElementById('history').innerHTML = '时光飞逝';
			document.getElementById('history-content').innerHTML = '<center>在你生命中的每一天都是特别的<br><i class="fterror">(E-3)数据解析失败</i></center>';
			return;
		}
		//success
		document.getElementById('history').innerHTML = '历史上的今天 - ' + histtorydata.today;
		var historybody = '<ul>';
		for (var i = 0, len = historydata.result.length; i < len; i++) {
			historybody = historybody + '<li>' + historydata.result[i] + '</li>';
		}
		var historybody = historybody + '</ul>';
		document.getElementById('history-content').innerHTML = historybody;
		return;
	}));
}

function getWeather() {
	document.getElementById('city').innerHTML = '天气预报';
	document.getElementById('weather').innerHTML = '正在获取...';
	console.log('获取天气：' + weathercity);
	weatherquery = { 'city': weathercity, 'key': 'm44rbu8ibsv1il13', 'random': Math.random() };
	var weatherbody = '正在获取...';
	weatherstatus = 'loading';
	//console.log(weatherquery);
	httpget(weatherapi, weatherquery, (function (data) {
		weatherstatus = 'loaded';
		weatherdata = parseJson(data);
		//console.log(weatherdata);
		if (weatherstatus == 'failed') { return; }
		if (weatherdata.msg !== "Sucess") {
			document.getElementById('weather').innerHTML = '没能找到天气信息袄...<br><i class="fterror">(E-1)' + weatherdata.msg + ' ' + weatherdata.directions + '</i>';
			document.getElementById('city').innerHTML = '天气预报';
			return;
		}
		weathercityname = weatherdata.data.cityName;
		document.getElementById('city').innerHTML = weathercityname;
		d = weatherdata.data;
		var weatherbody = '';
		weatherbody = weatherbody + '<i class="fterror">最后更新时间：' + d.lastUpdate + '</i>';
		weatherbody = weatherbody + '<br><h1>' + d.tq + ' ' + d.qw + '℃</h1>';
		weatherbody = weatherbody + '<img style="display:block" src="imgs/' + d.numtq + '_' + daynight + '.png" width="120px"/>';
		weatherbody = weatherbody + '<br><p id="weather-detile">' + d.fx + ' ' + d.fl + '<br>当前湿度：' + d.sd + '</p>';
		document.getElementById('weather').innerHTML = weatherbody;
	}), (function (e) {
		if (e == "0") e = '网络连接错误';
		weatherstatus = 'failed';
		console.error('天气获取错误：' + e);
		document.getElementById('city').innerHTML = '气象万千';
		document.getElementById('weather').innerHTML = '每一天都有好心情！<br><i class="fterror">(E-2)' + e + '</i>';
	}));
}

function resetall() {
	var primaryColor = "#1e88e5";
	var bgimg = 'http://www.dujin.org/sys/bing/1366.php';
	var searchEngine = 'https://www.baidu.com/s?wd=';
	var bigtitle = 'auto';
	var params = '&';
}

function coverSettings() {
	var pc = getUrlParam('primaryColor');
	var bi = getUrlParam('bgimg');
	var se = getUrlParam('searchEngine');
	var bt = getUrlParam('bigtitle');
	var wc = getUrlParam('weathercity');
	if (pc !== null) {
		changed = true;
		var pc = pc.replace('!', '#');
		setColor(pc);
		updateColor();
	}
	if (bi !== null) {
		changed = true;
		setbg(bi);
		updatebg();
	}
	if (se !== null) {
		changed = true;
		searchEngine = se;
	}
	if (bt !== null) {
		changed = true;
		setBigTitle(bt);
		UpdateBigTitle();
	}
	if (wc !== null) {
		changed = true;
		changeCity(wc);
		getWeather();
	}
	updateSettingsUrl();
	if (changed) {
		displayTip('已应用自定义设置');
	}
}

function genSettingsUrl() {
	updateSettingsUrl();
	return site + '?' + params;
}

function updateSettingsUrl() {
	params = genNewSettingsUrl();
}

function genNewSettingsUrl() {
	var settingsparams = '&';
	if (primaryColor !== "#1e88e5") {
		var pcolor = primaryColor.replace('#', '!');
		settingsparams = settingsparams + '&primaryColor=' + encodeURI(pcolor);
	}
	if (bgimg !== "http://www.dujin.org/sys/bing/1366.php") {
		settingsparams = settingsparams + '&bgimg=' + encodeURI(bgimg);
	}
	if (searchEngine !== "https://www.baidu.com/s?wd=") {
		settingsparams = settingsparams + '&searchEngine=' + encodeURI(searchEngine);
	}
	if (bigtitle !== "auto") {
		settingsparams = settingsparams + '&bigtitle=' + encodeURI(bigtitle);
	}
	if (weathercity !== "ip") {
		settingsparams = settingsparams + '&weathercity=' + encodeURI(weathercity);
	}
	return settingsparams;
}

function changeCity(city) {
	if (!city) {
		weathercity = 'ip';
		var weatherquery = { 'city': weathercity, 'key': 'm44rbu8ibsv1il13' };
		getWeather();
		updateSettingsUrl();
		return;
	}
	if (isEmpty(city)) {
		weathercity = 'ip';
		var weatherquery = { 'city': weathercity, 'key': 'm44rbu8ibsv1il13' };
		getWeather();
		updateSettingsUrl();
		return;
	}
	weathercity = city;
	var weatherquery = { 'city': weathercity, 'key': 'm44rbu8ibsv1il13' };
	getWeather();
	updateSettingsUrl();
	return;
}

function searchnow() {
	//触发大标题更新
	UpdateBigTitle();
	//搜索框操作
	var keywords = document.getElementById('search-input').value;
	if (isEmpty(keywords)) {
		console.log('搜索词为空');
		displayTip('搜索词为空,输入-直接打开搜索引擎');
		return;
	}
	//MARK:switch
	if (checkCommands(keywords)) return;
	console.log('开始搜索' + keywords);
	displayTip('正在搜索...');
	location.href = searchEngine + encodeURI(keywords);
	return;
}

function cleanInput(text) {
	if (!text) var text = '';
	document.getElementById('search-input').value = text;
}

function hourscheck(hour) {
	var tip;
	if (hour >= 4 && hour < 6) {
		//tip = "凌晨";
		daynight = '0';
		tip = "早起的鸟有虫吃";
	} else if (hour >= 6 && hour < 8) {
		//tip = "早上";
		daynight = '0';
		tip = "新的一天开始了哟~";
	} else if (hour >= 8 && hour < 11) {
		daynight = '0';
		tip = "上午好！";
	} else if (hour >= 11 && hour < 12) {
		daynight = '0';
		//tip = "临近中午";
		tip = "马上就开饭了袄~";
	} else if (hour >= 12 && hour < 13) {
		daynight = '0';
		//tip = "中午";
		tip = "午饭可不能亏了自己";
	} else if (hour >= 13 && hour < 14) {
		daynight = '0';
		//tip = "下午";
		tip = "何不睡个懒觉";
	} else if (hour >= 14 && hour < 18) {
		daynight = '0';
		//tip = "下午";
		tip = "下午好！";
	} else if (hour >= 18 && hour < 20) {
		daynight = '0';
		//tip = "傍晚";
		tip = "傍晚的云彩最美";
	} else if (hour >= 20 && hour < 22) {
		daynight = '1';
		tip = "晚上好！";
	} else if (hour >= 22) {
		daynight = '1';
		//tip = "深夜";
		tip = "我欲修仙";
	}
	return tip;
}

//命令判断
function checkCommands(k) {
	var k = k.toLowerCase();
	if (k == '-') {
		console.info('转到搜索引擎');
		displayTip('正在打开搜索引擎...');
		location.href = searchEngine;
		return true;
	}
	switch (k) {
		case ':testtip':
			displayTip('Tips Test Success');
			cleanInput();
			return true;
			break;
		case ':hidetip':
			displayTip('Start Hidden.');
			hideTip();
			resetTip();
			cleanInput();
			return true;
			break;
		case ':reset':
			resetall();
			displayTip('已重置');
			cleanInput();
			location.href = site;
			return true;
			break;
		case ':reload':
			displayTip('重新加载中...');
			cleanInput();
			location.href = genSettingsUrl();
			return true;
			break;
		case ':settitle':
			var title = prompt('输入你想要的大标题，输入auto恢复默认');
			setBigTitle(title);
			autohideTip('大标题已设置');
			cleanInput();
			return true;
			break;
		case ':setbg':
			var bg = prompt('输入你想要的背景图片地址，输入auto恢复默认');
			setbg(bg);
			autohideTip('背景已经设置');
			cleanInput();
			return true;
			break;
		case ':setcolor':
			var color = prompt('输入颜色代码，输入auto恢复默认');
			autohideTip('<font color="' + color + '">颜色</font>已设置')
			setColor(color);
			cleanInput();
			return true;
			break;
		case ':setpos':
			var pos = prompt('输入你的【坐标】 ，输入auto或者ip使用自动识别');
			autohideTip('位置已设置，若获取出错请恢复自动识别')
			changeCity(pos);
			cleanInput();
			return true;
			break;
		case ':showurl':
			var a = prompt('当前所有设置保存在这个URL中，收藏即可保存设置', genSettingsUrl());
			cleanInput();
			return true;
			break;
		///////////
		case ':reinit':
			autohideTip('重新初始化...');
			cleanInput();
			init();
			return true;
			break;
		case ':getbg':
			prompt('当前背景下载地址', bgimg);
			cleanInput();
			return true;
			break;
		case ':ver':
			autohideTip('当前版本：' + version);
			cleanInput();
			return true;
			break;
	}
	var oneletter = k.substring(0, 2);
	var twoletter = k.substring(0, 3);
	var threeletter = k.substring(0, 4);
	//console.log(oneletter+";"+threeletter);
	if (oneletter == ':g') {
		searchEngine = "https://www.google.com.hk/search?q=";
		document.getElementById('search-input').placeholder = 'Google';
		autohideTip('谷歌搜索');
		updateSettingsUrl();
		setSearchIco()
		cleanInput();
		return true;
	}
	if (oneletter == ':t') {
		searchEngine = "http://m.iciba.com/";
		autohideTip('翻译模式');
		document.getElementById('search-input').placeholder = '翻译模式';
		updateSettingsUrl();
		setSearchIco()
		cleanInput();
		return true;
	}
	if (threeletter == ':map') {
		searchEngine = "http://map.sogou.com/#&lq=";
		autohideTip('地图搜索');
		document.getElementById('search-input').placeholder = '地图搜索';
		updateSettingsUrl();
		setSearchIco()
		cleanInput();
		return true;
	}
	if (oneletter == ':b') {
		searchEngine = "https://www.baidu.com/s?wd=";
		autohideTip('返回默认百度搜索');
		document.getElementById('search-input').placeholder = '';
		updateSettingsUrl();
		setSearchIco()
		cleanInput();
		return true;
	}
	if (twoletter == ':av') {
		var kwd = k.replace(" ", "");
		var av = kwd.substring(3);
		if (isEmpty(av)) {
			autohideTip('忘了输入AV号了吧！');
			return true;
		}
		Openbilibili(av);
		autohideTip('正在打开客户端 | <a class="tiplink" href="javascript:void 0" onclick="webBilibili(' + av + ')">使用网页版?</a>', 10000);
		cleanInput();
		return true;
	}
	if (twoletter == ':qr') {
		//console.log('Try run qr maker');
		var qrcontent = k.replace(":qr","");
		var qrcontent = qrcontent.replace(":qr ","");
		var result = makeQR(qrcontent);
		if(result )cleanInput();
		//console.log('Run qrcode end.');
		return true;
	}
	return false;
}

function autohideTip(text, sec) {
	if (!sec) var sec = 5000;
	displayTip(text);
	//setTimeout(hideTip(),5000);
	clearTimeout(timeout);
	timeout = setTimeout(function () {
		hideTip();
	}, sec);
}

function displayTip(tip) {
	if (!tip) var tip = '';
	document.getElementById('search-tip').style.visibility = "visible";
	document.getElementById('search-tip').innerHTML = "<font color='white'>" + tip + "</font>";
	document.getElementById('search-tip').style.opacity = "100";
	document.getElementById('search-tip').style.filter = "alpha(opacity=100)";
	return true;
}

function setTip(tip) {
	if (!tip) var tip = '';
	document.getElementById('search-tip').innerHTML = "<font color='white'>" + tip + "</font>";
	return true;
}

function resetTip() {
	document.getElementById('search-tip').innerHTML = "<font color='white'>Powered by Baidu</font>";
	return true;
}

function hideTip() {
	document.getElementById('search-tip').style.visibility = "hidden";
	document.getElementById('search-tip').style.opacity = "0";
	document.getElementById('search-tip').style.filter = "alpha(opacity=0)";
	return true;
}

function setBigTitle(title) {
	if (!title) {
		bigtitle = 'auto';
		UpdateBigTitle();
		updateSettingsUrl();
		return;
	}
	if (isEmpty(title)) {
		bigtitle = 'auto';
		UpdateBigTitle();
		updateSettingsUrl();
		return;
	}
	bigtitle = title;
	UpdateBigTitle();
	updateSettingsUrl();
	return;
}

function UpdateBigTitle() {
	if (bigtitle !== 'auto') { document.getElementById('big-title').innerHTML = bigtitle; return true }
	var datedata = new Date();
	var hours = datedata.getHours();
	console.log("现在是" + hours + "点");
	document.getElementById('big-title').innerHTML = hourscheck(hours);
	return true;
}

function setColor(color) {
	if (!color) {
		primaryColor = '#1e88e5';
		updateColor();
		updateSettingsUrl();
		return;
	}
	if (isEmpty(color) || color == 'auto') {
		primaryColor = '#1e88e5';
		updateColor();
		updateSettingsUrl();
		return;
	}
	primaryColor = color
	updateColor();
	updateSettingsUrl();
}

function updateColor() {
	addStyle(".card-header {color:" + primaryColor + ";}");
	addStyle(".block-name {color:" + primaryColor + ";}");
	addStyle("button {color:" + primaryColor + ";}");
	if (primaryColor !== "#1e88e5") {
		var m = document.createElement("meta");
		m.name = "theme-color";
		m.content = primaryColor;
		document.getElementsByTagName("head").item(0).appendChild(m);
	}
}

function setbg(url) {
	if (!url) {
		bgimg = 'http://www.dujin.org/sys/bing/1366.php';
		updatebg();
		updateSettingsUrl();
		return;
	}
	if (isEmpty(url) || url == 'auto') {
		bgimg = 'http://www.dujin.org/sys/bing/1366.php';
		updatebg();
		updateSettingsUrl();
		return;
	}
	bgimg = url;
	updatebg();
	updateSettingsUrl();
}

function updatebg() {
	document.getElementById('header').style.background = "url(" + bgimg + ") no-repeat center center";
	document.getElementById('header').style.backgroundSize = "cover";
}

function HowToFixPosErr() {
	x0p('位置不对的解决方法', '请获取您的坐标或者城市码，然后通过 :setpos 命令和 :reload 命令校正地址！');
}
function getPosZB() {
	x0p({
		text: '从百度坐标拾取获取你的坐标',
		title: '现在前往？',
		buttons: [
			{
				type: 'error',
				text: '取消',
			},
			{
				type: 'info',
				text: '立刻前往'
			}
		]
	}).then(function (data) {
		if (data.button == 'info') {
			location.href = "http://api.map.baidu.com/lbsapi/getpoint/";
		}
	});
}
function getPosDM() {
	x0p({
		text: '从YY天气获取你的城市短码',
		title: '现在前往？',
		buttons: [
			{
				type: 'error',
				text: '取消',
			},
			{
				type: 'info',
				text: '立刻前往'
			}
		]
	}).then(function (data) {
		if (data.button == 'info') {
			location.href = "http://www.yytianqi.com/citys/1.html";
		}
	});
}

/*
function Openbilibili(av) {
	var f = document.createElement('iframe');
	f.src = 'bilibili://video'+av;
	f.style.display = 'none';
	document.body.appendChild(f);
}
*/

function Openbilibili(av) {
	window.location.href = "bilibili://video/" + av;
}

function webBilibili(av) {
	var url = 'http://www.bilibili.com/av' + av;
	location.href = url;
}

function loadFavicons() {
	var d = document;
	d.getElementById('ico-baidu').src = getFavicon('https://www.baidu.com');
	d.getElementById('ico-google').src = getFavicon('https://www.google.com');
	d.getElementById('ico-bilibili').src = getFavicon('https://www.bilibili.com');
	d.getElementById('ico-github').src = getFavicon('https://www.github.com');
}

function init() {
	try {
		firstOpen = false;
		//设置背景
		document.getElementById('header').style.background = "url(" + bgimg + ") no-repeat center center";
		document.getElementById('header').style.backgroundSize = "cover";
		//设置标题
		UpdateBigTitle();
		document.title = "首页";
		//应用主题色
		updateColor();
		coverSettings();
		getWeather();
		//getHistory();
		loadFavicons();
		setSearchIco()
		console.log('Loaded.');
	} catch (e) {
		console.error('初始化页面时出错：' + e.message);
	}
}
if (!ToolsJS == true) {
	console.warn('工具包加载失败，document.ready函数已禁用。');
} else {
	document.ready(init());
}
window.onfocus = (function () {
	cleanInput();
	hideTip();
});