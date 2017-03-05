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
function parseJson(json) {
    return eval("(" + json + ")");;
}

//From zhihu | add style rules to html
function addStyle(str_css) {
    var style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = str_css;
    document.getElementsByTagName("head").item(0).appendChild(style);
}

//From CKylin | if input is empty
function isEmpty(key) {
    if (!key || key == '' || key == ' ' || key == '   ' || key == 'undefined' || key == '{}') {
        return true;
    }
    return false;
}

//From CKylin | random keys
var random = {};
random.key = (function () {
    return Math.random();
});
random.number = (function () {
    return Math.ceil(Math.random());
});
random.range = (function (min, max) {
    if (!min) return false;
    if (!max) return false;
    return Math.floor(Math.random() * (max - min + 1) + min);
});
random.half = (function () {
    var r = Math.random();
    if (r >= .5) {
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

//From RankBill | Packaged ajax
function Ajax(type, url, data, success, failed) {
    // 创建ajax对象
    var xhr = null;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP')
    }

    var type = type.toUpperCase();
    // 用于清除缓存
    var random = Math.random();

    if (typeof data == 'object') {
        var str = '';
        for (var key in data) {
            str += key + '=' + data[key] + '&';
        }
        data = str.replace(/&$/, '');
    }

    if (type == 'GET') {
        if (data) {
            xhr.open('GET', url + '?' + data, true);
        } else {
            xhr.open('GET', url + '?t=' + random, true);
            console.log(url + '?t=' + random);
        }
        xhr.send();

    } else if (type == 'POST') {
        xhr.open('POST', url, true);
        // 如果需要像 html 表单那样 POST 数据，请使用 setRequestHeader() 来添加 http 头。
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(data);
    }

    // 处理返回数据
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                success(xhr.responseText);
            } else {
                if (failed) {
                    failed(xhr.status);
                }
            }
        }
    }
}

function httpget(url, data, success, failed) {
    return Ajax('get', url, data, success, failed);
}

function httppost(url, data, success, failed) {
    return Ajax('post', url, data, success, failed);
}

//From jb51.net | Url parse
function parseURL(url) {
    var a = document.createElement('a');
    a.href = url;
    return {
        source: url,
        protocol: a.protocol.replace(':', ''),
        host: a.hostname,
        port: a.port,
        query: a.search,
        params: (function () {
            var ret = {},
                seg = a.search.replace(/^\?/, '').split('&'),
                len = seg.length, i = 0, s; //len = 2
            //alert(a.search)
            for (; i < len; i++) {
                if (!seg[i]) { continue; }
                s = seg[i].split('=');
                ret[s[0]] = s[1];
            }
            return ret;
        })(),
        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
        hash: a.hash.replace('#', ''),
        path: a.pathname.replace(/^([^\/])/, '/$1'),
        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
        segments: a.pathname.replace(/^\//, '').split('/')
    };
}

function getFavicon(url){
    if(!url) return false;
    var domain = parseURL(url);
    console.log(domain);
    //return "http://statics.dnspod.cn/proxy_favicon/_/favicon?domain="+domain.host;
    return "http://api.byi.pw/favicon/?url="+domain.host;
}

//Check if tools.js is loaded.
var ToolsJS = true;
console.info('Tools.js loaded.');