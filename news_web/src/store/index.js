import axios from 'axios';
// axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
// axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest';
import config from './../config.js';
import detailData from '../../static/data/detail.json';

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
let listPageRandomList = [1,2,3,4,5,6].sort(function () {
    return Math.random() - 0.5
  });

/*   --const 2-- start */
let constAdList = [
    {"clk_track":[],"height":6,"html":"<div class=\"_45uzsbmfp6i\"></div>\n    <script type=\"text/javascript\">\n        (window.slotbydup = window.slotbydup || []).push({\n            id: \"u6841393\",\n            container: \"_45uzsbmfp6i\",\n            async: true\n        });\n    </script>\n    <!-- 多条广告如下脚本只需引入一次 -->\n    <script type=\"text/javascript\" src=\"//cpro.baidustatic.com/cpro/ui/cm.js\" async=\"async\" defer=\"defer\" >\n    </script>","impr_track":[],"slot":6841393,"subtype":10,"type":10,"width":20},
    {"clk_track":[],"height":6,"html":"<div class=\"_46uzsbmfp6i\"></div>\n    <script type=\"text/javascript\">\n        (window.slotbydup = window.slotbydup || []).push({\n            id: \"u6841394\",\n            container: \"_46uzsbmfp6i\",\n            async: true\n        });\n    </script>\n    <!-- 多条广告如下脚本只需引入一次 -->\n    <script type=\"text/javascript\" src=\"//cpro.baidustatic.com/cpro/ui/cm.js\" async=\"async\" defer=\"defer\" >\n    </script>","impr_track":[],"slot":6841394,"subtype":10,"type":10,"width":20},
    {"clk_track":[],"height":6,"html":"<div class=\"_47uzsbmfp6i\"></div>\n    <script type=\"text/javascript\">\n        (window.slotbydup = window.slotbydup || []).push({\n            id: \"u6841396\",\n            container: \"_47uzsbmfp6i\",\n            async: true\n        });\n    </script>\n    <!-- 多条广告如下脚本只需引入一次 -->\n    <script type=\"text/javascript\" src=\"//cpro.baidustatic.com/cpro/ui/cm.js\" async=\"async\" defer=\"defer\" >\n    </script>","impr_track":[],"slot":6841396,"subtype":10,"type":10,"width":20},
    {"clk_track":[],"height":6,"html":"<div class=\"_48uzsbmfp6i\"></div>\n    <script type=\"text/javascript\">\n        (window.slotbydup = window.slotbydup || []).push({\n            id: \"u6841398\",\n            container: \"_48uzsbmfp6i\",\n            async: true\n        });\n    </script>\n    <!-- 多条广告如下脚本只需引入一次 -->\n    <script type=\"text/javascript\" src=\"//cpro.baidustatic.com/cpro/ui/cm.js\" async=\"async\" defer=\"defer\" >\n    </script>","impr_track":[],"slot":6841398,"subtype":10,"type":10,"width":20},
]
/*   --const 2-- end */

/*   --const 3-- start */
let constAdList3 = [
    {"clk_track":[],"height":6,"html":"<div class=\"_45uzsbmfp6i\"></div>\n    <script type=\"text/javascript\">\n        (window.slotbydup = window.slotbydup || []).push({\n            id: \"u6841728\",\n            container: \"_45uzsbmfp6i\",\n            async: true\n        });\n    </script>\n    <!-- 多条广告如下脚本只需引入一次 -->\n    <script type=\"text/javascript\" src=\"//cpro.baidustatic.com/cpro/ui/cm.js\" async=\"async\" defer=\"defer\" >\n    </script>","impr_track":[],"slot":6841728,"subtype":10,"type":10,"width":20},
    {"clk_track":[],"height":6,"html":"<div class=\"_46uzsbmfp6i\"></div>\n    <script type=\"text/javascript\">\n        (window.slotbydup = window.slotbydup || []).push({\n            id: \"u6841730\",\n            container: \"_46uzsbmfp6i\",\n            async: true\n        });\n    </script>\n    <!-- 多条广告如下脚本只需引入一次 -->\n    <script type=\"text/javascript\" src=\"//cpro.baidustatic.com/cpro/ui/cm.js\" async=\"async\" defer=\"defer\" >\n    </script>","impr_track":[],"slot":6841730,"subtype":10,"type":10,"width":20},
    {"clk_track":[],"height":6,"html":"<div class=\"_47uzsbmfp6i\"></div>\n    <script type=\"text/javascript\">\n        (window.slotbydup = window.slotbydup || []).push({\n            id: \"u6841731\",\n            container: \"_47uzsbmfp6i\",\n            async: true\n        });\n    </script>\n    <!-- 多条广告如下脚本只需引入一次 -->\n    <script type=\"text/javascript\" src=\"//cpro.baidustatic.com/cpro/ui/cm.js\" async=\"async\" defer=\"defer\" >\n    </script>","impr_track":[],"slot":6841731,"subtype":10,"type":10,"width":20},
    {"clk_track":[],"height":6,"html":"<div class=\"_48uzsbmfp6i\"></div>\n    <script type=\"text/javascript\">\n        (window.slotbydup = window.slotbydup || []).push({\n            id: \"u6841732\",\n            container: \"_48uzsbmfp6i\",\n            async: true\n        });\n    </script>\n    <!-- 多条广告如下脚本只需引入一次 -->\n    <script type=\"text/javascript\" src=\"//cpro.baidustatic.com/cpro/ui/cm.js\" async=\"async\" defer=\"defer\" >\n    </script>","impr_track":[],"slot":6841732,"subtype":10,"type":10,"width":20},
]
/*   --const 3-- end */

/*   --const 4-- start */
let constAdList4 = [
    {"clk_track":[],"height":6,"html":"<div class=\"_45uzsbmfp6i\"></div>\n    <script type=\"text/javascript\">\n        (window.slotbydup = window.slotbydup || []).push({\n            id: \"u6842154\",\n            container: \"_45uzsbmfp6i\",\n            async: true\n        });\n    </script>\n    <!-- 多条广告如下脚本只需引入一次 -->\n    <script type=\"text/javascript\" src=\"//cpro.baidustatic.com/cpro/ui/cm.js\" async=\"async\" defer=\"defer\" >\n    </script>","impr_track":[],"slot":6842154,"subtype":10,"type":10,"width":20},
    {"clk_track":[],"height":6,"html":"<div class=\"_46uzsbmfp6i\"></div>\n    <script type=\"text/javascript\">\n        (window.slotbydup = window.slotbydup || []).push({\n            id: \"u6842155\",\n            container: \"_46uzsbmfp6i\",\n            async: true\n        });\n    </script>\n    <!-- 多条广告如下脚本只需引入一次 -->\n    <script type=\"text/javascript\" src=\"//cpro.baidustatic.com/cpro/ui/cm.js\" async=\"async\" defer=\"defer\" >\n    </script>","impr_track":[],"slot":6842155,"subtype":10,"type":10,"width":20},
]
/*   --const 4-- end */
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
    /*   --const 2-- start */
    if(window.config.did == '2') {
        if(banned) {
            resolve(Object.assign({}, {}));
        } else if(!banned) {
            constAdList.forEach((item, index) => {
                if(item.slot === slot) {
                    resolve(Object.assign({}, item));
                }
            });
        }
        return;
    }
    /*   --const 2-- end */

    /*   --const 3-- start */
    if(window.config.did == '3') {
        if(banned) {
            resolve(Object.assign({}, {}));
        } else if(!banned) {
            constAdList3.forEach((item, index) => {
                if(item.slot === slot) {
                    resolve(Object.assign({}, item));
                }
            });
        }
        return;
    }
    /*   --const 3-- end */

    /*   --const 4-- start */
    if(window.config.did == '4') {
        if(banned) {
            resolve(Object.assign({}, {}));
        } else if(!banned) {
            constAdList4.forEach((item, index) => {
                if(item.slot === slot) {
                    resolve(Object.assign({}, item));
                }
            });
        }
        return;
    }
    /*   --const 4-- end */
    
};

store.getAds = (slot, flag, adsType, clickCount) => new Promise((resolve, reject) => {
    if(flag) {
        adFundamental(slot, false, adsType, clickCount, resolve, reject);
        return;
    }
    // axios({
    //     url: urls.isAdForbidden,
    //     params: {
    //         did: window.config.did,
    //         ad: adsType,
    //         uid: utils.getCookie('news_uid')
    //     }
    // }).then((res) => {
    //     if(res.status == 200) {
    //         let data = res.data;
    //         adFundamental(slot, false, adsType, clickCount, resolve, reject);
    //     }
    // }).catch((e) => {
    //     //
    // });
    adFundamental(slot, false, adsType, clickCount, resolve, reject);
});

/*
    @param
*/
store.getChannelList = (params) => {
    let page = params.page,
        start = (page - 1) * count,
        end = page * count;
    let data = {
        ...params,
        // start,
        count
    };
    let pageIndex = listPageRandomList[page] ? listPageRandomList[page] : 7;
    let url = `/static/data/list${pageIndex}.json`;
    return new Promise((resolve, reject) => {
        axios({
            url: url,
            timeout: 5000,
            params: data
        }).then((response) => {
            let res = response.data;
            if(res.code === 1) {
                let data = res.data;
                data.forEach((item) => {
                    let list = [];
                    item.imgList.forEach((img) => {
                        list.push(`/static/images/${img.split("/")[11]}`);
                    })
                    item.imgList = list;
                });
                resolve(data);
            }
        }).catch((res) => {
            reject(res.status);
        });
    });
};

store.getDetail = (params) => {
    /*return new Promise((resolve, reject) => {
        axios({
            url: urls.detail,
            timeout: 5000,
            params: params
        }).then((response) => {
            let res = response.data;
            if(res.code === 1) {
                let data = res.data, detailObj;
                data.forEach((item) => {
                    if(item.id == params.newsId) {
                        let time = item.createTime.split("-");
                        let replaceUrl = new RegExp(`https://gallery.opgirl.cn/news/${item.siteId}/${time[0]}/${time[1]}/${time[2].split(" ")[0]}/${item.id}`,"g");
                        let resContent = item.content.replace(replaceUrl, '/static/images');  
                        item.content = resContent;
                        detailObj = item;
                    } 
                })
                resolve(detailObj);
            }
        }).catch((res) => {
            reject(res.status);
        });
    });*/
    return new Promise((resolve, reject) => {
        let data = detailData.data, detailObj;
        data.forEach((item) => {
            if(item.id == params.newsId) {
                let time = item.createTime.split("-");
                let replaceUrl = new RegExp(`https://gallery.opgirl.cn/news/${item.siteId}/${time[0]}/${time[1]}/${time[2].split(" ")[0]}/${item.id}`,"g");
                let resContent = item.content.replace(replaceUrl, '/static/images');
                item.content = resContent;
                detailObj = item;
            } 
        })
        resolve(detailObj);
    })
    console.log(detailData);
}

store.getRelateNews = (params) => new Promise((resolve, reject) => {
    let pageIndex = listPageRandomList[utils.randomNum(0,6)];
    let relateNewsUrl = `/static/data/list${pageIndex}.json`;
    axios({
        url: relateNewsUrl,
        timeout: 5000,
        params: params
    }).then((response) => {
        let res = response.data;
        if(res.code === 1) {
            if(res.data) {
                let data = res.data;
                data.forEach((item) => {
                    let list = [];
                    item.imgList.forEach((img) => {
                        list.push(`/static/images/${img.split("/")[11]}`);
                    })
                    item.imgList = list;
                })
                let dataList = data.slice(0, 9);
                resolve(dataList);
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
   /*axios({
        url: "/api/util/soso"
    }).then((res) => {
        if(res.status == 200) {
            let data = res.data;
            if(data.code == 1) {
                resolve(data.data);
            }
        }
    });*/
});

store.getAppMenuConfigList = (param) => new Promise((resolve, reject) => {
    axios({
         url: urls.config,
         params: param
     }).then((res) => {
         if(res.status == 200) {
            let data = res.data, did = param.did;
            if(data[did]) {
                resolve(data[did]);
            } else {
                resolve(data[1]);
                // location.href = `/?did=2`;
            }
         }
     });
 }); 
 
export default store;