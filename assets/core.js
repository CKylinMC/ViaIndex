var ToolsJS;
if (!ToolsJS === true) {
    console.warn('工具包js未能正常加载，页面可能无法正常显示。');
    console.info('尝试页面初始化...');
    try {
        init();
    } catch (e) {
        console.error('页面引导出错：' + e.message);
    }
}
var d = document;
var Window = Windowise.Window;
var Modal = Windowise.Modal;
var Nft = Windowise.Nft;
var Push = Windowise.Push;
var Progress = Windowise.Progress;
var Input = Windowise.Input;
var version = "1.6";
var c = cookie = Cookies;
var primaryColor = "#1e88e5";
var bgimg = 'http://www.dujin.org/sys/bing/1366.php';
var searchEngine = 'https://www.baidu.com/s?wd=';
var bigtitle = 'auto';
var params = '&';
var titlemode = 'TIPS';// TIPS | WORDS
var timeout;
var isVia = false;
var firstOpen = true;
var alwaysTip = false;
var URLdata = parseURL(location.href);
// var site = location.href;
var site = URLdata.protocol + '://' + URLdata.host; //正式发布
// var site = 'file:///F:/w%E7%BD%91%E7%AB%99/Projects[]/ViaIndex-master/index.html'; //本地测试
var weathercity = 'ip';
var weathercityname = '地球';
var weatherapi = 'http://api.yytianqi.com/observe';
//?city='+weathercity+'&key=m44rbu8ibsv1il13
var weatherquery = { 'city': weathercity, 'key': 'm44rbu8ibsv1il13', 'random': Math.random() };
var weatherdata;
var weatherraw;
var weatherbody;
var weatherstatus = 'unload';
var daynight = '0';
var enableOneWord = false;
var onewordapi = 'http://api.hitokoto.cn/';
var changed = false;
//var newsdata;
//var newsapi;
var histtorydata;
var historyapi = 'http://www.ipip5.com/today/api.php';
var historyquery = { 'type': 'json' };
var urlmode = false;
var settingsPrefix = 'viaindexSettings';
var cards = ['model-welcome', 'model-usage'];
var hitokotodata;


function getSettings(setting, prefix = settingsPrefix ) {
    return Cookies.get(prefix + '-' + setting);
}

function setSettings(label, value, prefix = settingsPrefix) {
    return Cookies.set(prefix + '-' + label, value, { expires: 999 });
}

function unsetSettings(setting) {
    if (setting === 'all') {
        Cookies.remove(settingsPrefix + '-' + 'primaryColor');
        Cookies.remove(settingsPrefix + '-' + 'bgimg');
        Cookies.remove(settingsPrefix + '-' + 'searchEngine');
        Cookies.remove(settingsPrefix + '-' + 'bigtitle');
        Cookies.remove(settingsPrefix + '-' + 'weathercity');
        Cookies.remove(settingsPrefix + '-' + 'titlemode');
        Cookies.remove(settingsPrefix + '-' + 'Hitokoto');
        return true;
    } else {
        return Cookies.remove(settingsPrefix + '-' + setting);
    }
}

function loadSettings() {
    var pc = getSettings('primaryColor');
    var bi = getSettings('bgimg');
    var se = getSettings('searchEngine');
    var bt = getSettings('bigtitle');
    var wc = getSettings('weathercity');
    var tm = getSettings('titlemode');
    var hk = getSettings('Hitokoto');
    if (pc !== undefined) {
        changed = true;
        setColor(pc);
        updateColor();
        console.log('PrimaryColor set to ' + pc);
    }
    if (bi !== undefined) {
        changed = true;
        setbg(bi);
        updatebg();
        console.log('BackgroundImage set to ' + bi);
    }
    if (se !== undefined) {
        changed = true;
        searchEngine = se;
        console.log('SearchEngine set to ' + se);
    }
    if (bt !== undefined) {
        changed = true;
        setBigTitle(bt);
        UpdateBigTitle();
        console.log('Title set to ' + bt);
    }
    if (tm !== undefined) {
        if(tm === 'WORDS'){
            titlemode = tm;
            changed = true;
        }
        console.log('Title mode set to' + tm);
    }
    if (hk !== undefined) {
        if(hk !== false){
            enableOneWord = hk;
            changed = true;
            console.log('Hitokoto enabled');
        }
    }
    if (pc !== undefined) {
        changed = true;
        setColor(pc);
        updateColor();
        console.log('PrimaryColor set to ' + pc);
    }
    if (wc !== undefined) {
        changed = true;
        changeCity(wc);
        getWeather();
        console.log('City set to ' + wc);
    }
    saveAllSettings();
    if (changed) {
        displayTip('已应用自定义设置');
        console.log('All settings applied.');
    }
}

function saveAllSettings() {
    var modified = false;
    if (primaryColor !== "#1e88e5") {
        setSettings('primaryColor', pcolor);
        modified = true;
    } else {
        unsetSettings('primaryColor');
    }
    if (bgimg !== "http://www.dujin.org/sys/bing/1366.php") {
        setSettings('bgimg', bgimg);
        modified = true;
    } else {
        unsetSettings('bgimg');
    }
    if (searchEngine !== "https://www.baidu.com/s?wd=") {
        setSettings('searchEngine', searchEngine);
        modified = true;
    } else {
        unsetSettings('searchEngine');
    }
    if (bigtitle !== "auto") {
        setSettings('bigtitle', bigtitle);
        modified = true;
    } else {
        unsetSettings('bigtitle');
    }
    if (weathercity !== "ip") {
        setSettings('weathercity', weathercity);
        modified = true;
    } else {
        unsetSettings('weathercity');
    }
    if (titlemode !== "TIPS") {
        setSettings('titlemode', titlemode);
        modified = true;
    } else {
        unsetSettings('titlemode');
    }
    if (enableOneWord !== false) {
        setSettings('Hitokoto', enableOneWord);
        modified = true;
    } else {
        unsetSettings('Hitokoto');
    }
    if (modified) {
        console.log('Changes saved.');
    }
    return modified;
}

function updateSettings() {
    if (urlmode) {
        updateSettingsUrl();
    } else {
        saveAllSettings();
    }
}

function closeCard(cardid) {
    var e = document.getElementById(cardid).style.display = 'none';
    setSettings('card-' + cardid, 'closed');
}

function loadCards() {
    for (var i = 0, len = cards.length; i < len; i++) {
        var cardsetting = getSettings('card-' + cards[i]);
        if (cardsetting !== 'closed') {
            document.getElementById(cards[i]).style.display = 'block';
            // console.log(cardsetting);
        } else {
            document.getElementById(cards[i]).style.display = 'none';
            console.log('Skip load card: ' + cards[i]);
        }
    }
    return true;
}

function setSearchIco() {
    document.getElementById('search-button').style.display = 'block'
    document.getElementById('search-button').style.opacity = "0";
    document.getElementById('search-button').style.filter = "alpha(opacity=0)";
    var se = searchEngine;
    var bd = 'https://www.baidu.com/s?wd=';
    var gg = 'https://www.google.com.hk/search?q=';
    var fy = 'http://m.iciba.com/';
    var map = 'http://map.sogou.com/#&lq=';
    setTimeout((function() {
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
    if (isEmpty(value)) {
        autohideTip('二维码内容为空');
        return false;
    }
    console.log('Run QR Maker - ' + value);
    var qr = qrcode.QRCode(10, 'H');
    qr.addData(value);
    qr.make();
    document.getElementById('qrcontent').innerHTML = '<center>' + qr.createImgTag(3) + '<hr>' + value + '<br><i class="fterror"> 长按可以保存二维码 </i></center>';
    document.getElementById('qrframe').style.display = 'block';
    document.getElementById('qrframe').scrollIntoView(true);
    return true;
}

function qrclose() {
    document.getElementById('qrframe').style.display = 'none';
}

function hitokoto(){
    var htip = getSettings("hitokotip");
    var r = Math.ceil(Math.random()*10);
    if((!htip)&&r>8&&enableOneWord===false){
        var c = Card("尝试“一言”","hitokototip","<pre>一言网(Hitokoto.cn)创立于2016年，隶属于萌创Team，目前网站主要提供一句话服务。\n" +
            "\n" +
            "动漫也好、小说也好、网络也好，不论在哪里，我们总会看到有那么一两个句子能穿透你的心。我们把这些句子汇聚起来，形成一言网络，以传递更多的感动。如果可以，我们希望我们没有停止服务的那一天。\n" +
            "\n" +
            "简单来说，一言指的就是一句话，可以是动漫中的台词，也可以是网络上的各种小段子。\n" +
            "或是感动，或是开心，有或是单纯的回忆。来到这里，留下你所喜欢的那一句句话，与大家分享，这就是一言存在的目的。\n" +
            "*:本段文本源自hitokoto.us</pre><br>",true);
        document.getElementById("topmodels").appendChild(c);
        addButton(c,"现在开启“一言”",'',"enablehitokoto()");
        addButton(c,"忽略",'',"disablehitokoto()");
        return;
    }
    if(enableOneWord!==false) {
        httpget(onewordapi, {
            c: enableOneWord
        }, function (data) {
            var json = parseJson(data);
            hitokotodata = json;
            var text = "<i style='font-size:large'>" + json.hitokoto + "</i><br><span style='float:right;font-size:small'>—— " + json.from + "</span>";
            var top = document.getElementById('topmodels');
            var card = Card('', 'hitokoto', text);
            top.appendChild(card);
            addButton(card, "查看这条“一言”", 'seehitokoto', 'goHitokoto()');
        }, function (data) {
            console.warn("Cannot get hitokoto: " + data);
        });
    }
}

function goHitokoto(){
    open("https://hitokoto.cn?id="+hitokotodata.id);
}

function enablehitokoto(){
    var m = new Push({
        type: 'info',
        content: '请选择您希望的一言类型',
        position: 'bottom',
        buttons: [
            {
                id: 'all',
                text: '全部'
            },
            {
                id: 'a',
                text: '动画'
            },
            {
                id: 'b',
                text: '漫画'
            },
            {
                id: 'c',
                text: '游戏'
            },
            {
                id: 'd',
                text: '小说'
            },
            {
                id: 'e',
                text: '原创'
            },
            {
                id: 'f',
                text: '来自网络'
            },
            {
                id: 'g',
                text: '其他'
            },
            {
                id: 'no',
                text: '取消'
            }
        ],
        overlay: true
    });
    m.open();
    m.getPromise().then(function(value,id){
        if(id!=='no'){
            setSettings("hitokotip",true);
            var tp = document.getElementById("card-hitokototip");
            if(tp) tp.style.display = "none";
            setSettings('Hitokoto',id);
            enableOneWord = id;
            new Modal({
                title: '已启用“一言”('+value+')',
                text: '现在开始，每次刷新将会显示一条一言。搜索框输入":disablehitokoto"可以关闭一言功能。'
            }).open();
            hitokoto();
        }
    });
}

function disablehitokoto(){
    setSettings("hitokotip",true);
    setSettings('Hitokoto',false);
    enableOneWord = false;
    document.getElementById("card-hitokototip").style.display = "none";
    document.getElementById("card-hitokoto").style.display = "none";
    new Modal({
        title: '停止使用“一言”',
        text: '此页面已停止显示“一言”卡片。您可以输入":enablehitokoto"来手动开启一言。'
    }).open();
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
    jsonp(historyapi, historyquery, (function(data) {
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
        historybody = historybody + '</ul>';
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
    httpget(weatherapi, weatherquery, (function(data) {
        weatherraw = data;
        weatherstatus = 'loaded';
        weatherdata = parseJson(data);
        //console.log(weatherdata);
        if (weatherstatus == 'failed') {
            if (getSettings('hasData', 'weather')) {
                weatherdata = getSettings('Data', 'weather');
                console.warn('天气获取失败，读取离线缓存数据。');
                document.getElementById('refreshwe').style.color = 'red';
                document.getElementById('refreshwe').innerHTML = '刷新天气(加载天气时出错)';
            }
            // return;
        }
        if (weatherdata.msg !== "Sucess") {
            if (getSettings('hasData', 'weather')) {
                console.warn('天气获取失败，读取离线缓存数据。');
                document.getElementById('refreshwe').style.color = 'red';
                document.getElementById('refreshwe').innerHTML = '刷新天气(加载天气时出错)';
                console.log('(E-1)' + weatherdata.msg + ' ' + weatherdata.directions);
                weatherdata = getSettings('Data', 'weather');
            } else {
                document.getElementById('weather').innerHTML = '没能找到天气信息袄...<br><i class="fterror">(E-1)' + weatherdata.msg + ' ' + weatherdata.directions + '</i>';
                document.getElementById('city').innerHTML = '天气预报';
                return;
            }
        }
        if (weatherdata.msg == "Sucess") {
            document.getElementById('refreshwe').style.color = primaryColor;
            document.getElementById('refreshwe').innerHTML = '刷新天气';
            setSettings('Data', data, 'weather');
            setSettings('hasData', true, 'weather');
            console.log('天气数据已经写入缓存');
        }
        // console.debug('1:' + weatherdata);
        setWeather();
    }), (function(e) {
        if (e == "0") e = '网络连接错误';
        weatherstatus = 'failed';
        console.error('天气获取错误：(E-2)' + e);
        if (getSettings('hasData', 'weather')) {
            weatherdata = getSettings('Data', 'weather');
            console.warn('天气获取失败，读取离线缓存数据。');
            setWeather();
        } else {
            document.getElementById('city').innerHTML = '气象万千';
            document.getElementById('weather').innerHTML = '每一天都有好心情！<br><i class="fterror">(E-2)' + e + '</i>';
        }
        document.getElementById('refreshwe').style.color = 'red';
        document.getElementById('refreshwe').innerHTML = '刷新天气(加载天气时出错)';
    }));
}

function setWeather() {
    if (typeof(weatherdata) !== 'object') {
        weatherdata = parseJson(weatherdata);
    }
    // console.debug('2:' + weatherdata);
    weathercityname = weatherdata.data.cityName;
    document.getElementById('city').innerHTML = weathercityname;
    d = weatherdata.data;
    var weatherbody = '';
    weatherbody = weatherbody + '<i class="fterror">最后更新时间：' + d.lastUpdate + '</i>';
    weatherbody = weatherbody + '<br><h1>' + d.tq + ' ' + d.qw + '℃</h1>';
    weatherbody = weatherbody + '<img style="display:block" src="imgs/' + d.numtq + '_' + daynight + '.png" width="120px"/>';
    weatherbody = weatherbody + '<br><p id="weather-detile">' + d.fx + ' ' + d.fl + '<br>当前湿度：' + d.sd + '</p>';
    document.getElementById('weather').innerHTML = weatherbody;
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
        pc = pc.replace('!', '#');
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
        weatherquery = { 'city': weathercity, 'key': 'm44rbu8ibsv1il13' };
        getWeather();
        updateSettings();
        return;
    }
    if (isEmpty(city)) {
        weathercity = 'ip';
        weatherquery = { 'city': weathercity, 'key': 'm44rbu8ibsv1il13' };
        getWeather();
        updateSettings();
        return;
    }
    weathercity = city;
    weatherquery = { 'city': weathercity, 'key': 'm44rbu8ibsv1il13' };
    getWeather();
    updateSettings();
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
    if (!text) text = '';
    document.getElementById('search-input').value = text;
}

function hourscheck(hour) {
    var tip;
    var tm = titlemode==='TIPS';
    if (hour >= 4 && hour < 6) {
        //tip = "凌晨";
        daynight = '0';
        if(tm) tip = "早起的鸟有虫吃"; else tip = "凌晨";
    } else if (hour >= 6 && hour < 8) {
        //tip = "早上";
        daynight = '0';
        if(tm) tip = "新的一天开始了哟~"; else tip = "早上";
    } else if (hour >= 8 && hour < 11) {
        daynight = '0';
        if(tm) tip = "上午好！"; else tip = "上午";
    } else if (hour >= 11 && hour < 12) {
        daynight = '0';
        //tip = "临近中午";
        if(tm) tip = "马上就开饭了袄~"; else tip = "上午";
    } else if (hour >= 12 && hour < 13) {
        daynight = '0';
        //tip = "中午";
        if(tm) tip = "午饭可不能亏了自己"; else tip = "中午";
    } else if (hour >= 13 && hour < 14) {
        daynight = '0';
        //tip = "下午";
        if(tm) tip = "何不睡个懒觉"; else tip = "下午";
    } else if (hour >= 14 && hour < 18) {
        daynight = '0';
        //tip = "下午";
        if(tm) tip = "下午好！"; else tip = "下午";
    } else if (hour >= 18 && hour < 20) {
        daynight = '0';
        //tip = "傍晚";
        if(tm) tip = "傍晚的云彩最美"; else tip = "傍晚";
    } else if (hour >= 20 && hour < 22) {
        daynight = '1';
        if(tm) tip = "晚上好！"; else tip = "晚上";
    } else if (hour >= 22) {
        daynight = '1';
        //tip = "深夜";
        if(tm) tip = "我欲修仙"; else tip = "深夜";
    }
    return tip;
}

//命令判断
function checkCommands(k) {
    k = k.toLowerCase();
    if (k === '-') {
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
        case ':hidetip':
            displayTip('Start Hidden.');
            hideTip();
            resetTip();
            cleanInput();
            return true;
        case ':reset':
            unsetSettings('all');
            displayTip('已重置');
            cleanInput();
            return true;
        case ':reload':
            loadSettings();
            displayTip('重新加载中...');
            cleanInput();
            return true;
        case ':settitle':
            var title = prompt('输入你想要的大标题，输入auto恢复默认');
            setBigTitle(title);
            autohideTip('大标题已设置');
            cleanInput();
            return true;
        case ':setbg':
            var bg = prompt('输入你想要的背景图片地址，输入auto恢复默认');
            setbg(bg);
            autohideTip('背景已经设置');
            cleanInput();
            return true;
        case ':setcolor':
            var color = prompt('输入颜色代码，输入auto恢复默认');
            autohideTip('<font color="' + color + '">颜色</font>已设置')
            setColor(color);
            cleanInput();
            return true;
        case ':setpos':
            var pos = prompt('输入你的【坐标】 ，输入auto或者ip使用自动识别');
            autohideTip('位置已设置，若获取出错请恢复自动识别')
            changeCity(pos);
            cleanInput();
            return true;
        case ':eh':
            enablehitokoto();
            return true;
        case ':dh':
            disablehitokoto();
            return true;
        case ':showurl':
            var a = prompt('当前所有设置保存在这个URL中，收藏即可保存设置', genSettingsUrl());
            cleanInput();
            return true;
            ///////////
        case ':reinit':
            autohideTip('重新初始化...');
            cleanInput();
            init();
            return true;
        case ':getbg':
            prompt('当前背景下载地址', bgimg);
            cleanInput();
            return true;
        case ':ver':
            autohideTip('当前版本：' + version);
            cleanInput();
            return true;
    }
    var nocommand = k.substring(0, 1);
    var oneletter = k.substring(0, 2);
    var twoletter = k.substring(0, 3);
    var threeletter = k.substring(0, 4);
    //console.log(oneletter+";"+threeletter);
    if (oneletter == ':g') {
        searchEngine = "https://www.google.com.hk/search?q=";
        document.getElementById('search-input').placeholder = 'Google';
        autohideTip('谷歌搜索');
        updateSettings();
        setSearchIco()
        cleanInput();
        return true;
    }
    if (oneletter == ':t') {
        searchEngine = "http://m.iciba.com/";
        autohideTip('翻译模式');
        document.getElementById('search-input').placeholder = '翻译模式';
        updateSettings();
        setSearchIco()
        cleanInput();
        return true;
    }
    if (threeletter == ':map') {
        searchEngine = "http://map.sogou.com/#&lq=";
        autohideTip('地图搜索');
        document.getElementById('search-input').placeholder = '地图搜索';
        updateSettings();
        setSearchIco()
        cleanInput();
        return true;
    }
    if (oneletter == ':b') {
        searchEngine = "https://www.baidu.com/s?wd=";
        autohideTip('返回默认百度搜索');
        document.getElementById('search-input').placeholder = '';
        updateSettings();
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
        var qrcontent = k.replace(":qr", "");
        qrcontent = qrcontent.replace(":qr ", "");
        var result = makeQR(qrcontent);
        if (result) cleanInput();
        //console.log('Run qrcode end.');
        return true;
    }
    if (nocommand == ':') {
        autohideTip('未知命令，使用搜索引擎搜索？ | <a href="' + searchEngine + k + '">搜索</a>', 'auto', (function() {
            cleanInput();
        }));
        return true;
    }
    return false;
}

function autohideTip(text, sec, callback) {
    if (!sec || sec == 'auto') sec = 5000;
    displayTip(text);
    //setTimeout(hideTip(),5000);
    clearTimeout(timeout);
    timeout = setTimeout(function() {
        hideTip();
        if (callback) callback(text);
    }, sec);
}

function onType() {
    clearTimeout(timeout);
    hideTip();
}

function displayTip(tip) {
    if (!tip) tip = '';
    document.getElementById('search-tip').style.visibility = "visible";
    document.getElementById('search-tip').innerHTML = "<font color='white'>" + tip + "</font>";
    document.getElementById('search-tip').style.opacity = "100";
    document.getElementById('search-tip').style.filter = "alpha(opacity=100)";
    return true;
}

function setTip(tip) {
    if (!tip) tip = '';
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
        updateSettings();
        return;
    }
    if (isEmpty(title)) {
        bigtitle = 'auto';
        UpdateBigTitle();
        updateSettings();
        return;
    }
    bigtitle = title;
    UpdateBigTitle();
    updateSettings();
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
        updateSettings();
        return;
    }
    if (isEmpty(color) || color === 'auto') {
        primaryColor = '#1e88e5';
        updateColor();
        updateSettings();
        return;
    }
    primaryColor = color;
    updateColor();
    updateSettings();
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
        updateSettings();
        return;
    }
    if (isEmpty(url) || url === 'auto') {
        bgimg = 'http://www.dujin.org/sys/bing/1366.php';
        updatebg();
        updateSettings();
        return;
    }
    bgimg = url;
    updatebg();
    updateSettings();
}

function updatebg() {
    if (checkURL(bgimg)) {
        asyncload(bgimg, (function() {
            document.getElementById('header').style.background = "url(" + bgimg + ") no-repeat center center";
            document.getElementById('header').style.backgroundSize = "cover";
        }), (function() {
            autohideTip('背景加载失败，使用纯色', 2);
            setColor(primaryColor);
        }));
        // document.getElementById('header').style.background = "url(" + bgimg + ") no-repeat center center";
        // document.getElementById('header').style.backgroundSize = "cover";
    } else {
        document.getElementById('header').style.background = bgimg;
        //setColor(bgimg);
    }
}

function HowToFixPosErr() {
    new Modal({
        type: 'info',
        title: '位置不对的解决方法',
        text: '请获取您的坐标或者城市码，然后通过 :setpos 命令和 :reload 命令校正地址！'
    }).open();
}

function getPosZB() {
    var m = new Modal({
        type: 'caution',
        text: '从百度坐标拾取获取你的坐标',
        title: '现在前往？',
        buttons: [{
                text: '取消',
                normal: true
            },
            {
                text: '立刻前往'
            }
        ]
    });
    m.open();
    m.getPromise().then(function(data) {
        if (data === '立刻前往') {
            open("http://api.map.baidu.com/lbsapi/getpoint/");
        }
    });
}

var async = {};
async.result = 'unknow';
async.callback = (function() { console.log('Load success'); });
async.failback = (function() { console.log('Load failed'); });

function asyncload(url, callback, failback) {
    if (typeof(callback) === 'function') {
        async.callback = callback;
    }
    if (typeof(failback) === 'function') {
        async.failback = failback;
    }
    var i = new Image();
    i.src = url;
    i.onload = (function() {
        async.result = true;
        async.callback();
    });
    i.onerror = (function() {
        async.result = false;
        async.failback();
    });
}

function getPosDM() {
    var m = new Modal({
        type: 'caution',
        text: '从YY天气获取你的城市短码',
        title: '现在前往？',
        buttons: [{
                text: '取消',
                normal: true
            },
            {
                text: '立刻前往'
            }
        ]
    });
    m.open();
    m.getPromise().then(function(data) {
        if (data === '立刻前往') {
            open("http://www.yytianqi.com/citys/1.html");
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
    d.getElementById('ico-github').src = getFavicon('https://github.com');
}

function checkifnew() {
    var loggedver = getSettings('version');
    if (loggedver === undefined) {
        //First time;
        new Modal({
            title: '欢迎~~~',
            text: '感谢选择ViaIndex作为你的主页！偷偷告诉你，这个主页的搜索框不简单哦！'
        }).open();
    } else if (loggedver > version) {
        //updated;
        var m = new Modal({
            type: 'info',
            title: '主页版本已更新到 v' + version,
            text: 'ViaIndex 已经在您的设备中更新。',
            buttons: [
                {
                    id: 'history',
                    text: '更新历史',
                    normal: true
                },
                {
                    id: 'yes',
                    key: 13,
                    text: '确定'
                },
            ],
            keepOverlay: true
        });
        m.open();
        m.getPromise().then(function(data) {
            if (data == '更新历史') {
                open("https://github.com/Cansll/ViaIndex/commits/master");
            }
        });
    }
    setSettings('version', version);
}

function Card(title = "", id = "", content = ""){
    var e = document.createElement('div');
    var ch = document.createElement('div');
    var cc = document.createElement('div');
    if(id===""||id===" "||id==="."){
        id = Math.ceil(Math.random(11111,99999)*100000);
    }
    id = "card-"+id;
    e.id = id;
    e.className = 'card';
    ch.className = 'card-header';
    ch.id = id + '-header';
    ch.innerHTML = title;
    cc.className = 'card-content';
    cc.innerHTML = content;
    cc.id = id + '-content';
        var span = document.createElement('span');
        span.className = 'menubutton';
        span.id = id + '-buttons';
        cc.innerHTML+= "<br>";
        cc.appendChild(span);
    e.appendChild(ch);
    e.appendChild(cc);
    return e;
}

function addButton(card = false, text = '', id = '', onclick = 'return false;', eclass = ''){
    if(!card) return false;
    var mainid = card.id;
    var buttonspan = document.getElementById(mainid + "-buttons");
    if(id===""||id===" "||id==="."){
        id = Math.ceil(Math.random(11111,99999)*100000);
    }
    buttonspan.appendChild(CardButton(mainid + "-buttons" + id, onclick, text, eclass));
    return true;
}

function CardButton(id = '', onclick = 'return false;', text = '', eclass = ''){
    var b = document.createElement('button');
    if(id===""||id===" "||id==="."){
        id = 'button' + Math.ceil(Math.random(11111,99999)*100000);
    }
    b.id = id;
    b.onclick = function(){eval(onclick)};
    b.innerHTML = text;
    b.className = eclass;
    return b;
}

function init() {
    try {
        firstOpen = false;
        //设置背景
        asyncload(bgimg, (function() {
            document.getElementById('header').style.background = "url(" + bgimg + ") no-repeat center center";
            document.getElementById('header').style.backgroundSize = "cover";
        }), (function() {
            autohideTip('背景加载失败，使用纯色', 2);
            setColor(primaryColor);
        }));
        // document.getElementById('header').style.background = "url(" + bgimg + ") no-repeat center center";
        // document.getElementById('header').style.backgroundSize = "cover";
        //设置标题
        UpdateBigTitle();
        document.title = "首页";
        //应用主题色
        updateColor();
        if (urlmode) {
            coverSettings();
        } else {
            loadSettings();
        }
        loadCards();
        getWeather();
        //getHistory();
        loadFavicons();
        setSearchIco();
        hitokoto();
        checkifnew();
        console.log('Loaded.');
    } catch (e) {
        console.error('初始化页面时出错：' + e.message);
    }
}
if (!ToolsJS === true) {
    console.warn('工具包加载失败，document.ready函数已禁用。');
} else {
    document.ready(init());
}
window.onfocus = (function() {
    cleanInput();
    hideTip();
});