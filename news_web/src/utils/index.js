let uid = 0;
let utils = {
    noop() {/* empty function */},
    getDID() {
        // return Number(this.getParameterByName('did'));
        return window.config.did;
    },
    getCode() {
        return window.config.code;
    },
    getScrollTop() {
        return document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
    },
    // 列表页每页数据量
    getPageLimit() {
        let navInfo = window.navInfo || {};
        return navInfo.limit || 30;
    },
    totalPageLimit() {
        return 20;
    },
    getIndex: function (el) {
        return [].indexOf.call(el.parentNode.children, el);
    },
    getCookie(key) {
        let arr,
            reg = new RegExp("(^| )" + key + "=([^;]*)(;|$)");

        if(arr = document.cookie.match(reg)) {
            return unescape(arr[2]);
        }

        return null;
    },
    observer: {},
    listen: function (key, func) {
        if(this.observer.hasOwnProperty(key)){
            this.observer[key].push(func);
        }else{
            this.observer[key] = [func];
        }
    },
    trigger: function (key, args) {
        if(this.observer.hasOwnProperty(key)){
            let i = 0,
                len = this.observer[key].length;
            for( ; i < len; i++){
                this.observer[key][i].apply(null, args);
            }
        }
    },
    buildParams: function (data) {
        let i,
            params = [];
        for(i in data){
            if(data.hasOwnProperty(i)){
                params.push(`${i}=${data[i]}`);
            }
        }

        return params.join('&');
    },
    creatElement: function (tag, option, content) {
        let el = document.createElement(tag),
            i;
        for ( i in option) {
            if(option.hasOwnProperty(i)){
                el.setAttribute(i, option[i]);
            }
        }

        if(content){
            el.innerHTML = content;
        }
        return el;
    },
    getParameterByName: function(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        let regex = new RegExp(`[\\?&]${name}=([^&#]*)`),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    },
    transitionEvent() {
        let t,
            el = document.createElement('surface'),
            transitions = {
                'transition':'transitionend',
                'OTransition':'oTransitionEnd',
                'MozTransition':'transitionend',
                'WebkitTransition':'webkitTransitionEnd'
            };
        for(t in transitions) {
            if( el.style[t] !== undefined ) {
                return transitions[t];
            }
        }
    },
    /* eslint-disable prefer-rest-params, comma-spacing */
    setImmediate(handle) {
        setImmediate ? setImmediate(handle) : (function(handle) {
            let args = Array.prototype.slice.call(arguments, 1);
            let invoke = function() {
                handle.apply(this, args);
            }.bind(this);
            if(window.Promise) {
                Promise.resolve().then(invoke);
            } else if(!-[1,]) {
                let head = document.documentElement.firstChild;
                let script = document.createElement("script");
                script.onreadystatechange = function() {
                    script.onreadystatechange = null;
                    head.removeChild(script);
                    invoke();
                };
                head.appendChild(script);
            } else {
                setTimeout(invoke);
            }
        })(handle);
    },
    /* eslint-enable prefer-rest-params, comma-spacing */
    // bubblingToEle: function (target, type, value) {
    //     while(target){

    //         switch (type){
    //             case 'id':
    //                 if(target.id === value){
    //                     return target;
    //                 }
    //                 break;

    //             case 'nodeName':
    //                 if(target.nodeName === value){
    //                     return target;
    //                 }
    //                 break;

    //             case 'className':
    //                 if(target.classList.contains(value)){
    //                     return target;
    //                 }
    //                 break;

    //             default :
    //                 break;
    //         }

    //         target = target.parentNode;

    //         if(target.nodeName === 'HTML' || target.nodeName === '#document'){
    //             break;
    //         }
    //     }
    //     return null;
    // },
    isInterger(num) {
        // return typeof num === 'number' && num % 1 === 0;
        // return Number.isInterger(num)
        return Math.floor(num) === num;
    },
    getUid: function() {
        return uid++;
    },
    isURL: function(str) {
        // 暂时只需要判断以http://或https://开头的字符串，认定为链接
        return /^http(s)?:\/\//.test(str);
    },
    loadScript: function(xyUrl, async, callback){
        let head = document.getElementsByTagName('head')[0];
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = xyUrl;
        if(async) script.setAttribute('async', true);
        //借鉴了jQuery的script跨域方法
        script.onload = script.onreadystatechange = function(){
            if((!script.readyState || script.readyState === "loaded" || script.readyState === "complete")){
                callback && callback();
                // Handle memory leak in IE
                script.onload = script.onreadystatechange = null;
                if ( head && script.parentNode ) {
                    head.removeChild( script );
                }
            }
        };
        // Use insertBefore instead of appendChild  to circumvent an IE6 bug.
        head.insertBefore( script, head.firstChild );
    },
    jsonp: (function () {
        return function (url, success, fail, config) {
            let callback = 'jsonpCallback_' + utils.getUid(),
                jsonp = (config && config.jsonp) || 'callback',
                params = (config && config.data) ? '&' + utils.buildParams(config.data) : '',
                limeter = url.indexOf('?') + 1 ? '&' : '?',
                _url = url + limeter + jsonp + '=' + callback + params + '&_=' + Date.now(),
                s = this.creatElement("script", {"src": _url});
            window[callback] = function (data) {
                success && success(data);
                s.parentNode.removeChild(s);
                window[callback] = null;
            };
            document.getElementsByTagName('head')[0].appendChild(s);

            s.onerror = function() {
                fail && fail("ERROR");
                s.parentNode.removeChild(s);
                window[callback] = null;
            };

        };
    }()),
    createStyle: function(id, cssStr) {
        if(document.getElementById(id)) return;

        let style = document.createElement("style");
        style.setAttribute("type", "text/css");
        style.setAttribute("id", id);

        if (style.styleSheet) {
            style.styleSheet.cssText = cssStr;
        } else {
            let cssText = document.createTextNode(cssStr);
            style.appendChild(cssText);
        }

        let header = document.getElementsByTagName("head")[0];
        header.appendChild(style);
    },
    trim(str) {
        return null == str ? "" : String.prototype.trim.call(str);
    },
    escapeHtml(str) {
        return str.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    },
    domReady: function(callback){
        // don't use "interactive" on IE <= 10 (it can fired premature)
        if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
            setTimeout(callback, 0);
        } else {
            let handler = function() {
                document.removeEventListener("DOMContentLoaded", handler, false);
                window.removeEventListener("load", handler, false);
                callback();
            };
            document.addEventListener("DOMContentLoaded", handler, false);
            window.addEventListener("load", handler, false);
        }
    },
    setUid() {
        let s = [];
        let hexDigits = "0123456789abcdef";
        for (let i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        let uid = s.join("");
        // document.cookie = ("news_uid=" + uid)
        let date = new Date();
        date.setTime(date.getTime() + 36500 * 24 * 60 * 60 * 1000); //设置date为当前时间加一百年

        document.cookie = `news_uid=${uid}; path=/; expires=${date.toGMTString()}`;
        return uid;
    },
    randomString() {
        let $chars = '0123456789';
        let maxPos = $chars.length;
        let str = new String();
        for (let i = 0; i < 9; i++) {
            str += $chars.charAt(Math.floor(Math.random() * maxPos));
    　　}

        return str;
    },
     formatMsgTime(timestamp) {
        function zeroize( num ) {
            return (String(num).length == 1 ? '0' : '') + num;
        }

        let curTimestamp = parseInt(new Date().getTime() / 1000); //当前时间戳
        let timestampDiff = curTimestamp - timestamp; // 参数时间戳与当前时间戳相差秒数
        let curDate = new Date( curTimestamp * 1000 ); // 当前时间日期对象
        let tmDate = new Date( timestamp * 1000 );  // 参数时间戳转换成的日期对象
        let Y = tmDate.getFullYear(), m = tmDate.getMonth() + 1, d = tmDate.getDate();

        let H = tmDate.getHours(), i = tmDate.getMinutes(), s = tmDate.getSeconds();

        if ( timestampDiff < 60 ) { // 一分钟以内
            return "刚刚";
        } else if( timestampDiff < 3600 ) { // 一小时前之内
            return Math.floor( timestampDiff / 60 ) + "分钟前";
        } else if ( curDate.getFullYear() == Y && curDate.getMonth()+1 == m && curDate.getDate() == d ) {
            return '今天' + zeroize(H) + ':' + zeroize(i);
        } else {
            let newDate = new Date( (curTimestamp - 86400) * 1000 ); // 参数中的时间戳加一天转换成的日期对象
            if ( newDate.getFullYear() == Y && newDate.getMonth()+1 == m && newDate.getDate() == d ) {
                return '昨天' + zeroize(H) + ':' + zeroize(i);
            } else if ( curDate.getFullYear() == Y ) {
                return  zeroize(m) + '月' + zeroize(d) + '日 ' + zeroize(H) + ':' + zeroize(i);
            } else {
                return  Y + '年' + zeroize(m) + '月' + zeroize(d) + '日 ' + zeroize(H) + ':' + zeroize(i);
            }
        }
    },
};
//生成uid
if(document.cookie.indexOf('news_uid') < 0) utils.setUid();

export default utils;
