import utils from '@/utils/index.js';
import {base64Encode} from '@/utils/base64.js';
// import storage from 'utils/storage.js';

// online
// const PRD = '//logger.oupeng.com/joke';
// beta
// const BETA = '//logger.bj.oupeng.com/joke';

// const LOGGERURL = (process.env.NODE_ENV === 'production') ? PRD : BETA;

const LOGGERURL = '/';
const LOGGERSLOTURL = '/';

let counter = 0;
const sendLogger = function(params = {}, func = utils.noop) {
    let callback = `sendLogger_${counter++}`;
    let payload = base64Encode(JSON.stringify(params));
    // let _url = `${LOGGERURL}/${callback}/${payload}`;
    let _href = (params.action == 'ad_show' || params.action == 'ad_click') ? LOGGERSLOTURL: LOGGERURL;
    let _url = `${_href}/${callback}/${payload}`;
    let s = utils.creatElement("script", {"src": _url});

    window[callback] = function(data) {
        func(data);
        s.parentNode.removeChild(s);
        window[callback] = null;
    };

    document.getElementsByTagName('head')[0].appendChild(s);

    s.onerror = function() {
        func("ERROR");
        s.parentNode.removeChild(s);
        window[callback] = null;
    };
};


let base = {
    referer: document.referrer,
    channel: utils.getCode(),
};

window.OUPENGLOGGER = function(p = {}, callback) {
    let w = window.screen.width,
        h = window.screen.height;
    // let ua_type = navigator.userAgent.toLowerCase().indexOf('windows') > -1 && (w > 500 || h > 1000) ? 'pc' : 'mobile';
    let ua_type = navigator.userAgent.toLowerCase().indexOf('mobile') > -1 ? 'mobile' : 'pc';
    if(p.hasOwnProperty('payload')) {
        p.payload.ua_type = ua_type;
        p.payload.ip = ip;
        p.payload.area = ipLocation;
        p.payload.w = window.screen.width;
        p.payload.h = window.screen.height;
    } else {
        p.payload = {
            ua_type,
            ip,
            area: ipLocation,
            w: window.screen.width,
            h: window.screen.height
        };
    }
    try {
        let uid = utils.getCookie('news_uid');
        let params = Object.assign({
            uid,
            created: Math.ceil(Date.now() / 1000)
        }, base, p);
        // console && console.info(JSON.stringify(params));

        /*   --const 1187289889406447616-- start */
        if(window.config.did == '1187289889406447616') {
            if(params.action == 'ad_show' || params.action == 'ad_click') {
                _hmt.push(['_trackEvent', params.action, params.payload.ads_id, params.payload.slot_id]);
            }
            return;
        }
        /*   --const 1187289889406447616-- end */

        // sendLogger(params, callback);
    } catch(e) {
        console.log(e);
    }
};
