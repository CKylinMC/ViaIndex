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
var primaryColor = "#1e88e5";
var bgimg = 'http://www.dujin.org/sys/bing/1366.php';
var searchEngine = 'https://www.baidu.com/s?wd=';
var bigtitle = 'auto';
var params = '&';
//var site = location.href;
var site = 'http://ckylintest.esy.es';
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
var newsdata;
var newsapi;

function getWeather() {
	console.log('获取天气：' + weathercity);
	weatherquery = { 'city': weathercity, 'key': 'm44rbu8ibsv1il13', 'random': Math.random() };
	var weatherbody = '正在获取...';
	weatherstatus = 'loading';
	console.log(weatherquery);
	httpget(weatherapi, weatherquery, (function (data) {
		weatherstatus = 'loaded';
		weatherdata = parseJson(data);
		console.log(weatherdata);
		if (weatherstatus == 'failed') { return; }
		if (weatherdata.msg !== "Sucess") {
			document.getElementById('weather').innerHTML = '没能找到天气信息袄...<br>(E-1)' + weatherdata.msg + ' ' + weatherdata.directions;
			document.getElementById('city').innerHTML = '天气预报';
			return;
		}
		weathercityname = weatherdata.data.cityName;
		document.getElementById('city').innerHTML = weathercityname;
		d = weatherdata.data;
		var weatherbody = '';
		weatherbody = weatherbody + '最后更新时间：' + d.lastUpdate;
		weatherbody = weatherbody + '<br><h1>' + d.tq + ' ' + d.qw + '℃</h1>';
		weatherbody = weatherbody + '<img style="display:block" src="imgs/' + d.numtq + '_' + daynight + '.png" width="120px"/>';
		weatherbody = weatherbody + '<br><p id="weather-detile">' + d.fx + ' ' + d.fl + '<br>当前湿度：' + d.sd + '</p>';
		document.getElementById('weather').innerHTML = weatherbody;
	}), (function (e) {
		weatherstatus = 'failed';
		console.error('天气获取错误：' + e);
		document.getElementById('city').innerHTML = '天气预报';
		document.getElementById('weather').innerHTML = '没能找到天气信息袄...<br>(E-2)' + e;
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
		settingsparams = settingsparams + '&primaryColor=' + encodeURI(primaryColor);
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
	if (keywords == '-') {
		console.info('转到搜索引擎');
		displayTip('正在打开搜索引擎...');
		location.href = searchEngine;
		return;
	}
	switch (keywords) {
		case ':testtip':
			displayTip('Tips Test Success');
			cleanInput();
			return;
			break;
		case ':hidetip':
			displayTip('Start Hidden.');
			hideTip();
			resetTip();
			cleanInput();
			return;
			break;
		case ':use google':
			searchEngine = "https://www.google.com.hk/search?q=";
			displayTip('已临时切换到谷歌香港搜索');
			cleanInput();
			return;
			break;
		case ':fanyi':
			searchEngine = "http://m.iciba.com/";
			displayTip('翻译模式，请输入词句');
			cleanInput();
			return;
			break;
		case ':reset':
			resetall();
			displayTip('已重置');
			cleanInput();
			location.href = site;
			return;
			break;
		case ':reload':
			displayTip('重新加载中...');
			cleanInput();
			location.href = genSettingsUrl();
			return;
			break;
		case ':settitle':
			var title = prompt('输入你想要的大标题，输入auto恢复默认');
			setBigTitle(title);
			cleanInput();
			return;
			break;
		case ':setbg':
			var bg = prompt('输入你想要的背景图片地址，输入auto恢复默认');
			setbg(bg);
			cleanInput();
			return;
			break;
		case ':setcolor':
			var color = prompt('输入颜色代码，输入auto恢复默认');
			displayTip('<font color="' + color + '">颜色</font>已设置')
			setColor(color);
			cleanInput();
			return;
			break;
		case ':setpos':
			var pos = prompt('输入你的【坐标】 ，输入auto或者ip使用自动识别');
			displayTip('位置已设置，若获取出错请恢复自动识别')
			changeCity(pos);
			cleanInput();
			return;
			break;
		case ':showurl':
			var a = prompt('当前所有设置保存在这个URL中，收藏即可保存设置', genSettingsUrl());
			cleanInput();
			return;
			break;
	}
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
	addStyle(".card-header{color:" + primaryColor + "}");
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

function getNews(){
	//TODO
}

function init() {
	try {
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
