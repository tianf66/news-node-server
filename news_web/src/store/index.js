import axios from 'axios';
// axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
// axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest';
import config from './../config.js';

import utils from '@/utils/';
import storage from '@/utils/storage.js';
import addDeviceInfo from '@/utils/deviceInfo.js';
let urls = config.urls;
let did = utils.getDID();
let navConfig = window;
let count = navConfig.config.newsShowCount || 15;
let store = {
    navConfig
};
/*   --const 1187289889406447616-- start */
let constAdList = [
    {clk_track: [],height: 6,html: "<script type=\"text/javascript\" smua=\"d=m&s=b&u=u3605555&h=20:6\" src=\"https://www.sinawap.com/smu/o.js\"></script>",impr_track: [],slot: 3597299,subtype: 19,type: 10,width: 20},
    {clk_track: [],height: 6,html: "<script type=\"text/javascript\" smua=\"d=m&s=b&u=u3605717&h=20:6\" src=\"https://www.sinawap.com/smu/o.js\"></script>",impr_track: [],slot: 3597567,subtype: 19,type: 10,width: 20},
    {clk_track: [],height: 6,html: "<script type=\"text/javascript\" smua=\"d=m&s=b&u=u3605657&h=20:6\" src=\"https://www.sinawap.com/smu/o.js\"></script>",impr_track: [],slot: 3597598,subtype: 19,type: 10,width: 20},
    {clk_track: [],height: 6,html: "<script type=\"text/javascript\" smua=\"d=m&s=b&u=u3605657&h=20:6\" src=\"https://www.sinawap.com/smu/o.js\"></script>",impr_track: [],slot: 35975981,subtype: 19,type: 10,width: 20},
    {clk_track: [],height: 6,html: "<script type=\"text/javascript\" smua=\"d=m&s=b&u=u3605657&h=20:6\" src=\"https://www.sinawap.com/smu/o.js\"></script>",impr_track: [],slot: 35975982,subtype: 19,type: 10,width: 20},
    {clk_track: [],height: 6,html: "<script type=\"text/javascript\" smua=\"d=m&s=b&u=u3605657&h=20:6\" src=\"https://www.sinawap.com/smu/o.js\"></script>",impr_track: [],slot: 35975983,subtype: 19,type: 10,width: 20},
    {clk_track: [],height: 6,html: "<script type=\"text/javascript\" smua=\"d=m&s=b&u=u3605657&h=20:6\" src=\"https://www.sinawap.com/smu/o.js\"></script>",impr_track: [],slot: 35975984,subtype: 19,type: 10,width: 20},
    {clk_track: [],height: 6,html: "<script type=\"text/javascript\" smua=\"d=m&s=b&u=u3605657&h=20:6\" src=\"https://www.sinawap.com/smu/o.js\"></script>",impr_track: [],slot: 35975985,subtype: 19,type: 10,width: 20},
    {clk_track: [],height: 6,html: "<script type=\"text/javascript\" smua=\"d=m&s=b&u=u3605657&h=20:6\" src=\"https://www.sinawap.com/smu/o.js\"></script>",impr_track: [],slot: 35975986,subtype: 19,type: 10,width: 20},
    {"banner":"https://i.opfed.com/opgirl/adRedIcon/redAdBanner4.png","clk_track":[],"clk_url":"https://interaction.clotfun.online/sheep?appkey=22d0779713c506efa909578355a2f800&adSpaceKey=df5bd46ef27b10c0e8c2ad25914098a1&from=H5&1=1","clk_url_have_macro":false,"impr_track":[],"slot":87654321,"type":2}
]
/*   --const 1187289889406447616-- end */
/*
	@param slot 广告ID
*/
let adFundamental = (slot, banned, adsType, clickCount, resolve, reject) => {
    //slot 广告位ID
    //banned 表示是否对该用户惩罚，true表示惩罚
    //adsType 广告类型
    //clickCount JS广告点可击次数
    let data = {slot};
    data.count = 2;
    addDeviceInfo(data);

    let storagePos = storage.getAdStatus(`${adsType}_${slot}_${did}`, clickCount) || false;
    if(storagePos) banned = true;

    /*   --const 1187289889406447616-- start */
    if(window.config.did == '1187289889406447616') {
        if(banned) {
            resolve(Object.assign({}, {"banner":"https://i.opfed.com/opgirl/adRedIcon/redAdBanner6.png","clk_track":[],"clk_url":"https://interaction.clotfun.online/sheep?appkey=22d0779713c506efa909578355a2f800&adSpaceKey=df5bd46ef27b10c0e8c2ad25914098a1&from=H5&1=1","clk_url_have_macro":false,"impr_track":[],"slot": 0,"type":2}));
        } else if(!banned) {
            /* 3597094 3597096 3597119*/
            constAdList.forEach((item, index) => {
                if(item.slot === slot) {
                    resolve(Object.assign({}, item));
                }
            });
        }
        return;
    }
    /*   --const 1187289889406447616-- end */
    utils.jsonp(urls.ads, function(data) {
        if(data instanceof Array) {
            if(data.length == 0) {
                reject();
            } else if(data.length == 1) {
                if(banned && (data[0].subtype == 10 || data[0].subtype == 19)) reject();
                else resolve(Object.assign({}, data[0]));
            } else {
                let baiduAd, ad;
                for(let i in data) {
                    if(banned && data[i].subtype != 10 && data[i].subtype != 19) {
                        // 禁封该用户访问非百度广告
                        ad = Object.assign({}, data[i]);
                        break;
                    } else if(!banned) {
                        if(window.config.did == '1253611471980150784' || window.config.did == '1253611439520567296') {
                            console.log(window.config.did);
                            //渠道定制， 按平台竞价出广告类型
                            ad = Object.assign({}, data[0]);
                            break;
                        } else {
                            // 非禁封该用户访问百度广告
                            if(data[i].subtype == 10 || data[i].subtype == 19) {
                                baiduAd = Object.assign({}, data[i]);
                                break;
                            } else {
                                ad = Object.assign({}, data[i]);
                            }
                        }
                    }
                }
                if(baiduAd) resolve(baiduAd);
                else if(ad) resolve(ad);
            }
        } else {
            resolve(Object.assign({}, data));
        }
    }, function() {
        reject();
    }, {
        jsonp: 'cb',
        data
    });
};

store.getAds = (slot, flag, adsType, clickCount) => new Promise((resolve, reject) => {
    if(flag) {
        adFundamental(slot, false, adsType, clickCount, resolve, reject);
        return;
    }
    axios({
        url: urls.isAdForbidden,
        params: {
            did: window.config.did,
            ad: adsType,
            uid: utils.getCookie('news_uid')
        }
    }).then((res) => {
        if(res.status == 200) {
            let data = res.data;
            adFundamental(slot, false, adsType, clickCount, resolve, reject);
        }
    }).catch((e) => {
        //
    });
});

/*
    @param
*/
store.getChannelList = (params) => {
    let page = params.page,
        start = (page - 1) * count,
        end = page * count - 1;
    let data = {
        ...params,
        // start,
        count
    };
    let url = urls.channleList;
    //天气网奇闻 \ 海豚天气渠道定制;
    if(window.config.did == '1367777574511112192' || window.config.did == '1366614353280253952') {
        url = urls.relateNews;
        data.newsCount = 15;
    }
    return new Promise((resolve, reject) => {
        axios({
            url: url,
            timeout: 5000,
            params: data
        }).then((response) => {
            let res = response.data;
            console.log(res);
            if(res.code === 1) {
                resolve(res.data);
            }
        }).catch((res) => {
            reject(res.status);
        });
    });
};

store.getDetail = (params) => {
    return new Promise((resolve, reject) => {
        axios({
            url: urls.detail,
            timeout: 5000,
            params: params
        }).then((response) => {
            let res = response.data;
            if(res.code === 1) {
                resolve(res.data);
            }
        }).catch((res) => {
            reject(res.status);
        });
    });
}

store.getRelateNews = (params) => new Promise((resolve, reject) => {
    axios({
        url: urls.relateNews,
        timeout: 3000,
        params: params
    }).then((response) => {
        let res = response.data;
        if(res.code === 1) {
            if(res.data) {
                resolve(res.data);
            } else {
                reject();
            }
        } else {
            reject();
        }
    }).catch((err) => {
        reject();
    });

});

/*计算时间戳*/
store.p = (s) => {
    return s < 10 ? '0' + s : s
}

store.getSystemInfo = () => new Promise((resolve, reject) => {
    /*axios({
        url: urls.getSystemInfo,
        timeout: 3000
    }).then((response) => {
        let res = response.data;
        if(res.code === 0) {
            if(res.data) {
                resolve(res.data);
            } else {
                reject();
            }
        } else {
            reject();
        }
    }).catch((err) => {
        reject();
    });*/
    const d = new Date();
    const resDate = d.getFullYear() + '-' + store.p((d.getMonth() + 1)) + '-' + store.p(d.getDate());
    const resTime = store.p(d.getHours()) + ':' + store.p(d.getMinutes()) + ':' + store.p(d.getSeconds());
    resolve(`${resDate} ${resTime}`);

});

/*请求用户信息*/
store.getUserInfo = () => new Promise((resolve, reject) => {
   axios({
        url: "/api/util/soso"
    }).then((res) => {
        if(res.status == 200) {
            let data = res.data;
            if(data.code == 1) {
                resolve(data.data);
            }
        }
    });
});

/*
    ---------------对接犀光api---------------
*/

/*  频道信息列表  */
store.xiGuangNavInfo = (params) => {
    return new Promise((resolve, reject) => {
        axios({
            url: urls.xiGuangNavInfo,
            timeout: 5000,
            params: {
                app_id: 'meitu',
                log_id: utils.randomString()
            }
        }).then((response) => {
            let res = response.data;
            if(res.errno === 0) {
                resolve(res.data);
            }
        }).catch((res) => {
            reject(res.status);
        });
    });
};

/*  频道列表  */
store.xiGuangChannelList = (params) => {
    params.app_id = 'meitu';
    params.user_id = utils.getCookie('news_uid');
    params.log_id = utils.randomString();
    params.size = 10;
    params.res_type = 'news';
    return new Promise((resolve, reject) => {
        axios({
            url: urls.xiGuangChannelList,
            timeout: 5000,
            params: params
        }).then((response) => {
            let res = response.data;
            if(res.errno === 0) {
                let data = res.data;
                resolve(data.data);
            }
        }).catch((res) => {
            reject(res.status);
        });
    });
};

/* 详情页api*/
store.xiGuangDetail = (params) => {
    params.app_id = 'meitu';
    params.user_id = utils.getCookie('news_uid');
    params.log_id = utils.randomString();
    return new Promise((resolve, reject) => {
        axios({
            url: urls.xiGuangDetail,
            timeout: 5000,
            params: params
        }).then((response) => {
            let res = response.data;
            if(res.errno === 0) {
                resolve(res);
            }
        }).catch((res) => {
            reject(res.status);
        });
    });
};

/*详情页相关推荐*/
store.xiGuangDetailRelate = (params) => {
    params.app_id = 'meitu';
    params.log_id = utils.randomString();
    params.size = 30;
    return new Promise((resolve, reject) => {
        axios({
            url: urls.xiGuangDetailRelate,
            timeout: 5000,
            params: params
        }).then((response) => {
            let res = response.data;
            if(res.errno === 0) {
                let data = res.data;
                resolve(data);
            }
        }).catch((res) => {
            reject(res.status);
        });
    });
}

/*上报api*/
store.xiGuangReceiveLog = (params) => {
    params.log_id = utils.randomString();//每次请求时唯一标识，可以随机生成
    params.app_id = 'meitu';//分配给客户的唯一标识。和其它接口中app_id含义一致
    params.user_id = utils.getCookie('news_uid');//用户唯一标识
    params.timestamp = parseInt(new Date().getTime() / 1000);//调用接口发生的时间戳，秒单位

    let data = {data: params};
    axios({
        url: urls.xiGuangReceiveLog,
        params: data
    })
};

export default store;