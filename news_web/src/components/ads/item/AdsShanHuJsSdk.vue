<template>
    <section class="shanhu-box">
        <div @click="jumpUrlHandle" v-if="adObj.appName">
            <!-- class="flex"  -->
            <div style="width: 100%;" v-if="html && html.type == '4'">
                <!-- <p><img :src=adObj.img></p> -->
                <img style="width: 100%;" :src=feedImg>
                <!-- p>
                    <span class="appname">{{adObj.appName}}</span><br/>
                    <span class="title">{{adObj.title}}</span>
                </p> -->
            </div>
            <div style="width: 100%; text-align: center;" v-if="html && html.type == 'pop'">
                <p style="width: 90%;margin: 0 auto;"><img style="width: 100%;" :src=popImg></p>
                <!-- <p style="width: 30%;margin: 0 auto;"><img style="width: 100%;" src="http://static.yximgs.com/udata/pkg/535d9d0907414216869c9568608364ef.png"></p> -->
                <!-- <p style="color: #fff;">
                    <span style="display: block; margin: 0.01rem 0;" class="title">{{adObj.title}}</span><br/>
                    <span style="" class="appname">{{adObj.appName}}</span>
                </p> -->
            </div>
            <div v-if="html && html.type == 'float'">
                <!-- <img style="width: 90%;" src="http://static.yximgs.com/udata/pkg/535d9d0907414216869c9568608364ef.png"> -->
                <img  style="width: 90%;" src="//s.opfed.com/news/xn5tewr9sy.gif">
            </div>
        </div>

        <div v-if="adId" :id="adId"></div>
        <!-- <p class="ad">广告</p> -->
    </section>
</template>

<script>
import axios from 'axios';
import utils from '@/utils/';
import {base64Decode} from '@/utils/base64.js';
import storage from '@/utils/storage.js';
import imgTrack from '../imgTrack';
let coralAdv;
export default {
    name: 'AdsShanHuJsSdk',
    props: ['ads', 'active', 'adsType'],
    components: {
    },
    data() {
        return {
            adData: null,
            html: JSON.parse(this.ads.html),
            styleObj: {},
            adObj: {},
            adId: '',
            adShowCb: false,
            info: JSON.parse(base64Decode(storage.get('soso'))),
            popImg: `//s.opfed.com/news/pop${Math.floor(Math.random()*(1 - 3) + 3)}.jpg`,
            feedImg: `//s.opfed.com/news/feed${Math.floor(Math.random()*(1 - 5) + 5)}.jpg`
        };
    },
    computed: {
        did() {
            return utils.getDID();
        }
    },
    mounted() {
        this.initialize();
    },
    watch: {
        ads: function(val) {
            this.initialize();
        },
        $route(_new, old) {
            if(_new.name == 'channel' && old.name == 'detail')
                this.initialize();
        }
    },
    methods: {
        closeHandle() {
            this.adShowCb = false;
            // coral.statCoupon(9, this.adData.statCtx);
        },
        jumpUrlHandle() {
            imgTrack(this.ads.clk_track[0]);
            // if(this.adObj.jumpUrl) {
            //     location.href = this.adObj.jumpUrl;
            // } else {
            //     window.open(this.adObj.appDownloadUrl);
            //     setTimeout(() => {
            //         coralAdv.statAdvertise(4, 5, this.adObj.statCtx);
            //         coralAdv.statAdvertise(4, 6, this.adObj.statCtx);
            //     }, 1000);
            // }
            coralAdv.statAdvertise(4,4,this.adObj.statCtx);
            location.href = this.adObj.jumpUrl;
        },
        initialize() {
            let html = this.ads.html;
            this.bdUnion(html);
        },
        bdUnion(html) {
            /**对接文档 https://www.showdoc.cc/674109141104814?page_id=3903992163773251
            */
            let adHtml = JSON.parse(html);
            let script = document.createElement('script');
            if(!document.getElementById("coral_js")) {
                let head = document.getElementsByTagName('head')[0];
                script.type = 'text/javascript';
                script.src = 'https://webcdn.m.qq.com/webcdn/gmall/sdk/coral-adv-sdk-v2.min.js';
                script.setAttribute('id', 'coral_js');
                script.setAttribute('env', 'pro');
                script.setAttribute('appid', adHtml.appid);
                head.insertBefore( script, head.firstChild );

                script.onload = () => {
                    this.loadBuildSign(adHtml);
                };
            } else {
                setTimeout(() => {
                    this.readyAd();
                }, 500);
            }
        },
        /* 生成随机串 */
        randomString(len) {
         　　len = len || 32;
         　　let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
         　　let maxPos = $chars.length;
         　　let pwd = '';
         　　for (let i = 0; i < len; i++) {
         　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
         　　}
         　　return pwd;
        },
        loadBuildSign(adHtml) {
            /*8981: https://v2.opgirl.cn/shanhuAd/buildSign 蜜蜂淘劵
            9017: https://v2.opgirl.cn/shanhuAd/buildSign2 健康走
            8783: https://v2.opgirl.cn/shanhuAd/buildSign3 蜜果*/
            let signSrc;
            if(adHtml.appid == '8981') signSrc = 'https://v2.opgirl.cn/shanhuAd/buildSign';
            if(adHtml.appid == '9017') signSrc = 'https://v2.opgirl.cn/shanhuAd/buildSign2';
            if(adHtml.appid == '8783') signSrc = 'https://v2.opgirl.cn/shanhuAd/buildSign3';
            let noncestr = this.randomString(16),
                ts = parseInt(new Date().getTime() / 1000),
                url = encodeURIComponent(location.href);
            var params = 'noncestr='+noncestr+'&timestamp='+ts+'&url='+encodeURIComponent(location.href)+'';
            axios.post(signSrc, params, {
                timeout: 5000,
                headers: {
                    "Content-type": "application/x-www-form-urlencoded"
                }
            }).then((response) => {
                let data = response.data;
                this.loadAd(data, adHtml, noncestr, ts, url);
            });
        },
        loadAd(data, adHtml, noncestr, ts, url) {
            if(data.status === 0) {
                let sign = data.daata;
                coralAdv = new CoralAdv({
                    appId: adHtml.appid,     // 必填，产品id，请找对接同学分配
                    // appId: 9017,     // 必填，产品id，请找对接同学分配
                    timestamp: ts,   // 必填，生成签名的时间戳
                    nonceStr: noncestr,  // 必填，生成签名的随机串
                    signature: data.data,    // 必填，签名
                    userParams: {
                        account_id: 7146933,
                        login_openid: '',//微信公众号或小程序，传参用户的openid
                        login_appid: '' //传参微信公众号或小程序的appid
                    },
                    guidInfo: {
                        plat: 2,         //2为安卓，3为ios
                        product: 13,     //Android固定为13，ios固定为118
                        imei: this.info.imei,         //设备imei
                        guid: this.info.imei,    //guid(如果为手管系guid，guidInfo的其它参数可不填)
                        sdk: 26,     //可固定为26
                        ua: this.info.m,             //设备型号，如Honor 6X
                        mac: '',  //设备的mac地址
                        firmware: '',  //ios固件版本
                        androidID: '',  //安卓系统的androidId
                        idfa: '',  //ios专有设备标识，ios必带
                        oaid: ''  //安卓专有设备标识，imei和oaid必须有一个
                    },
                    advParams: {
                        target: 1      //广告场景，不填时默认为1
                    }
                });

                let readTimer = setInterval(() => {
                    if(coralAdv && coralAdv.ready) {
                        clearInterval(readTimer);
                        this.readyAd();
                    }
                }, 100);
            }
        },
        readyAd() {
            coralAdv.ready(async () => {
                //拉取广告
                 // const videoAdv = await coralAdv.getAdvertise(1);
                 // console.log("视频广告", videoAdv);
                 // const bannerAdv = await coralAdv.getAdvertise(2);
                 // console.log("大图广告", bannerAdv);
                 // const downloadAdv = await coralAdv.getAdvertise(3);
                 // console.log("下载广告", downloadAdv);
                 let couponAdv = await coralAdv.getAdvertise(4);
                 if(couponAdv && couponAdv.appDownloadUrl) {
                    let timer = setInterval(() => {
                        couponAdv = coralAdv.getAdvertise(4);
                        this.adObj = couponAdv;
                        if(!couponAdv.appDownloadUrl) clearInterval(timer);
                    }, 10);
                 } else if(couponAdv.jumpUrl) {
                    this.adObj = couponAdv;
                 } else {
                    if(config.did == '1356897155398049792' && this.html.type != 'float') {
                        this.initShanHuad();
                    }
                 }
                 console.log("卡券广告", couponAdv, this.adObj);
                 // const adv = await coralAdv.getAdvertise(18);
                 // console.log("原生图广告", adv);
                 //上报广告
                 if(this.adObj.statCtx) {
                    coralAdv.statAdvertise(4, 3, this.adObj.statCtx);
                    imgTrack(this.ads.impr_track);
                 }
                 // coralAdv.statAdvertise(18, 3, adv.statCetx);
                 //coralAdv.getAdvertise(16);
            });
        },
        initShanHuad() {
            this.adId = `shanhuId${utils.getUid()}`;
            let _this = this;
            let head = document.getElementsByTagName('head')[0];
            let script = document.createElement('script');
                script.type = 'text/javascript';
                script.setAttribute('id', 'coral_tbs_js');
                script.src = 'https://webcdn.m.qq.com/webcdn/gmall/sdk/coral-x5-adv-sdk-v2.min.js';
                script.setAttribute('env', 'pro');
                script.setAttribute('appid', 8784);

            script.onload = script.onreadystatechange = function(){
            if((!script.readyState || script.readyState === "loaded" || script.readyState === "complete")){
                    new CoralTBSAdv(_this.adId, {// ad-test-1为页面中某个dom元素的id
                        type: 9, // 9:大图广告  10：图文广告  11：视频广告  12：左文右图  13：左图右文
                        target: 220,
                        handleAdEventName: '', //广告回调事件名称，可不传，默认为handleAdEvent
                        handleAdErrorName: '', //广告加载出错事件名称，可不传，默认为handleAdError
                        advShowCb: function(){}, //广告渲染后回调事件
                        advClickCb: function(){}, //广告点击后回调事件
                        advCloseCb: function(e){}, //广告关闭后回调事件
                        advErrorCb: function(errorno){} //广告加载出错回调事件
                    });
                }
            };
            // Use insertBefore instead of appendChild  to circumvent an IE6 bug.
            head.insertBefore( script, head.firstChild );
        }
    }
};
</script>


<style scoped>
.shanhu-box {
    width: 100%;
    padding: 0.09rem 0;
    position: relative;
}
.shanhu-box .ad {
    position: absolute;
    bottom: 0.09rem;
    right: 0.08rem;
    font-size: 0.13rem;
    color: #fff;
    background: rgba(0, 0, 0, 0.2);
    padding: 0.01rem;
}
.flex {
    display: flex;
    padding: 0 0.08rem;
}
.flex .appname {
    display: inline-block;
    font-size: 0.15rem;
    padding: 0.15rem 0 0 0.1rem;
}
.flex .title {
    display: inline-block;
    font-size: 0.13rem;
    padding: 0.15rem 0 0 0.1rem;
    color: #ccc;
}
</style>