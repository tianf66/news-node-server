<template>
<section class="x-wrapper x-frame" :style="styleObj">
    <iframe v-if="!bdUnionAd && active && iframeSrc" height="100%" scrolling="no" :src="iframeSrc"></iframe>
    <iframe v-if="!bdUnionAd && active && !iframeSrc" ref="ifm" scrolling="no" height="100%"></iframe>
    <div v-if="bdUnionAd" :id="bdUnionId" :style="openSlotStyle"></div>
    <div id="item"></div>
    <!-- 广告点击封禁蒙层 -->
    <div class="ad-mask" ref="clkMask" v-show="adMask"></div>

    <!-- 广告概率禁止点击蒙层 -->
    <div style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; z-index: 9999" v-if="showMask"></div>

    <!-- 广告下线刷新蒙层 -->
    <div style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; z-index: 99999" v-show="adDownStatusMask" ref="adDownMask"></div>
    <adstuia-sdk v-if="ads.subtype == 28" :ads="ads" :adsType="adsType"></adstuia-sdk>
</section>
</template>

<script>
function stopDefaultEvent(e) {
    e.preventDefault();
}
import utils from '@/utils';
import dataCenter from '@/store/index.js';
import imgTrack from '../imgTrack.js';
import storage from '@/utils/storage.js';
// import AdstuiaSdk from '@/components/ads/item/AdsTuiaSdk.vue';
import store from '@/vuex/index.js';

window.loadTencent = false;
window.TencentGDT = window.TencentGDT || [];

window.handleAdEventTBS = function(){
    const evt = arguments[0];
    if (evt === 'CLOSE') {//关闭事件处理
        store.commit({
            type: "SETISPOPADLAYER",
            isPopAdLayer: false
        });
    }
};
export default {
    name: 'adsFrame',
    components: {
        // AdstuiaSdk
    },
    props: ['ads', 'active', 'adsType', 'adMaskShow', 'clickCount'],
    data() {
        return {
            iframeSrc: '',
            styleObj: {},
            bdUnionAd: false,
            bdUnionId: '',
            showMask: 0,
            adMask: false,
            adDownStatusMask: false,
            openSlotStyle: {}
        };
    },
    mounted() {
        this.reset();
        this.initialize();

        this.$nextTick(() => {
            this.touchMask(this.$refs.clkMask, () => {

                let storagePos = storage.get(`${this.adsType}_${this.ads.slot}_${this.did}`) || null;
                let adClkNum = storagePos ? JSON.parse(storagePos.data) : 0;
                let loadFlag = storage.setAdClk(`${this.adsType}_${this.ads.slot}_${this.did}`, adClkNum += 1, parseInt(this.clickCount), this.prohibitTime);
                if(loadFlag == 'reload') {
                    return location.reload();
                }
                //广告点击logger上报
                OUPENGLOGGER({
                    action: 'ad_click',
                    payload: {
                        "ads_id": this.adsType,
                        "type": this.ads.subtype == 11 ? 'huoyan' : 'baidu',
                        "slot_id": this.ads.slot,
                        "ad_status": storage.getAdStatus(`${this.adsType}_${this.ads.slot}_${this.did}`, this.clickCount) ? 'prohibit' : 'normal'
                    }
                });
                //广告点击平台上报
                if(this.ads.clk_track) {
                    imgTrack(this.ads.clk_track);
                }
                this.adMask = this.getAdsMask();;
                
                setTimeout(() => {
                    this.adMask = true;
                }, 350);
            });

            this.touchMask(this.$refs.adDownMask, () => {
                this.adDownStatusMask = false;

                setTimeout(() => {
                    this.adDownStatusMask = true;
                }, 350);
            }, 'adDownMask');
        });
    },
    watch: {
        ads: function(val) {
            if(this.ads.subtype == 4 ) return;
            this.initialize();
        },
        active(val) {
          if(this.ads.subtype == 4 ) val = false;
            if(val) {
                this.initialize();
            } else {
                this.iframeSrc = '';
            }
        },
        adMaskShow(val) {
            if(this.showMask && val) {
                // dataCenter.adLayerShow(this.did, this.adsType);
            }
        }
    },
    computed: {
        did() {
            return utils.getDID();
        },
        showChance() {
            //先找到广告位ID的索引，对应就是广告位蒙层概率索引;
            let slotId = this.ads.slot,
                slotInfo = config.adList[this.adsType],
                adlayerProbability = slotInfo.adlayerProbabilitys.split(","),
                slotIdIndex = slotInfo.id.split(",").indexOf(slotId.toString()),
                probability = adlayerProbability[slotIdIndex];
                console.log(probability)
            return parseInt(probability) || 0;
        },
        prohibitTime() {
            let slotId = this.ads.slot,
                slotInfo = config.adList[this.adsType],
                prohibitTime = slotInfo.prohibitTime.split(","),
                slotIdIndex = slotInfo.id.split(",").indexOf(slotId.toString()),
                time = prohibitTime[slotIdIndex];
                console.log(time);
            return parseInt(time) || 1440;
        }
    },
    methods: {
        setAdMask() {
            if(this.clickCount && parseInt(this.clickCount) > 0) {
                this.adMask = true;
            }
        },
        setAdDownStatusMask() {
            //广告点击刷新蒙层:1 启用 / 2 禁用;
            let adLayerStatus = config.adDownLayerStatus || 2;
            if(adLayerStatus == 1) {
                this.adDownStatusMask = true;
            }
        },
        reset() {
            this.iframeSrc = '';
            this.styleObj = {};
            this.bdUnionAd = false;
            this.bdUnionId = '';
        },
        initialize() {
            let ads = this.ads;
            let html = ads.html;
            let width = ads.width;
            let height = ads.height;
            let aRatio = 1;

            let detailCon = this.$el;
            let itemWidth = detailCon.offsetWidth;

            if( width && height) {
                aRatio = width / height;
            }

            this.styleObj = {
                width: `${itemWidth}px`,
                height: `${itemWidth / aRatio}px`
            };

            if(this.adsType === 'listTopFloat' || this.adsType === 'detailTopFloat') {
            //列顶详情浮层存储计算广告高度
                store.commit({
                    type: 'SETADHEIGHT',
                    styleHeight: `${itemWidth / aRatio}`
                })
            }

            let cpro_id = (typeof html == 'string') && html.match(/cpro_id\s*=\s*"(u\d+)"/);

            if(cpro_id) {
                if(this.did == '1138347837101182976') return;
                // 百度联盟广告
                this.styleObj.width = '100%';
                this.styleObj.height = 'auto';
                this.bdUnionAd = true;
                // this.bdUnionId = `cpro_${cpro_id}`;
                this.bdUnionId = `unBodyTop_${utils.getUid()}`;
                this.showMask = this.showChance && Math.ceil(Math.random() * 100) < this.showChance;
                // console.log(this.showChance, this.showMask);
                this.bdUnion(html);
                return;
            }

            if(ads.subtype == 1) {//搜狗Js
                this.setAdDownStatusMask();
            }

            if(ads.subtype == 10) {//新的百度异步js
                if(this.did == '1138347837101182976') return;
                this.styleObj.width = '100%';
                this.styleObj.height = 'auto';
                this.bdUnionAd = true;
                // this.adMask = true;
                this.setAdMask();
                this.setAdDownStatusMask();
                this.getAdsMask();
                if(!this.clickCount) this.showMask = this.showChance && Math.ceil(Math.random() * 100) < this.showChance;
                let jsSrc = html.match(/src\s*=\s*"((http(s)?:)?\/\/.*\.js)"/)[1];
                let id = html.match(/id\s*:\s"(.*)"\s*/)[1];
                let s = "_" + Math.random().toString(36).slice(2);
                this.bdUnionId = s;
                this.$nextTick(() => {
                    (window.slotbydup = window.slotbydup || []).push({
                        id: id,
                        container:  s
                    });
                    utils.loadScript(jsSrc, true);
                });
                return;
            }

            if(ads.subtype == 11) {
                this.bdUnionId = `unBodyTop_${utils.getUid()}`;
                this.bdUnionAd = true;
                this.styleObj.width = '100%';
                this.styleObj.height = 'auto';
                this.$nextTick(() => {
                    let src = html.match(/src\s*=\s*"(.*.js)"/)[1];
                    let count = html.match(/count\s*=\s*"(\d)"/)[1];
                    let layout = html.match(/layout\s*=\s*"(\d)"/)[1];
                    utils.loadScript(src, false, () => {
                        window.HuoYan.RequestAjax(layout, count, this.bdUnionId);
                    });
                });
                return;
            }

            if(ads.subtype == 14) {// 天河js
                this.bdUnionAd = true;
                this.bdUnionId = `unBodyTop_${utils.getUid()}`;
                this.styleObj.width = '100%';
                this.styleObj.height = 'auto';
                this.$nextTick(() => {
                    let _href = html.match(/src\s*=\s*"(.*.js)"/)[1];
                    let script = document.createElement('script');
                    script.src = _href;
                    script.setAttribute('data-yn', html.match(/data-yn\s*=\s*"((\w*=*&*)*)"/)[1]);
                    let container = document.getElementById(this.bdUnionId);
                    container.innerHTML = '';
                    container.appendChild(script);
                });
                return;
            }

            if(ads.subtype == 7) {//广点通
                this.styleObj.width = '100%';
                this.styleObj.height = 'auto';
                this.bdUnionAd = true;
                let placement_id = eval(html.match(/placement_id:\s*'\d+'/)[0]);
                let app_id = eval(html.match(/app_id:\s*'\d+'/)[0]);
                let type = eval(html.match(/type:\s*'.*'/)[0]);
                let display_type = eval(html.match(/display_type:\s*'.*'/)) ? eval(html.match(/display_type:\s*'.*'/)[0]) : null;

                let jsonObj = {
                    placement_id: placement_id,
                    app_id: app_id,
                    type: type
                };

                if(type == 'banner') {
                    let fill_type = eval(html.match(/fill_type:\s*'.*'/)[0]);
                    this.bdUnionId = `unBodyTop_${utils.getUid()}`;
                    jsonObj.containerid = this.bdUnionId;
                    jsonObj.fill_type = fill_type;
                }


                if(type == 'native') {
                    if(display_type) {

                        if(display_type == 'banner') {// 广告播放类型: banner广告
                            this.bdUnionId = `unBodyTop_${utils.getUid()}`;
                            jsonObj.display_type = 'banner';
                            jsonObj.carousel = '5000';
                            jsonObj.containerid = this.bdUnionId;
                            jsonObj.onComplete = function(res) {
                                console.log(res.ret);
                                if (res.ret == 0) {
                                    console.log('广告播放成功');
                                } else {
                                    console.log('广告播放失败');
                                }
                            };
                        } else {
                            jsonObj.display_type = display_type;
                            jsonObj.count = 1;
                            jsonObj.onComplete = (res) => {
                                if (res && res.ret === 0) {
                                    TencentGDT.NATIVE.renderAd(res.data[0]);
                                    if(Math.ceil(Math.random() * 100) < this.showChance) {//加蒙层
                                        let container = document.querySelector('#gdt_template_interstitial_wrap');
                                        let oDiv = document.createElement("div");
                                        oDiv.style = "position:fixed;left:50%;top:50%;transform: translate(-65%, -50%);-webkit-transform: translate(-65%, -50%);width: 2.98rem;height: 2.4rem;z-index: 999999;"
                                        container.appendChild(oDiv);
                                    }
                                } else {
                                    console.log(res.ret);
                                }
                            };
                        }
                        window.TencentGDT.push(jsonObj);
                    } else {
                        window.containerArr = window.containerArr || [];
                        this.bdUnionId = `unBodyTop_${utils.getUid()}`;
                        window.containerArr.push(this.bdUnionId);
                        if(window.tencentAds && window.tencentAds.length) {
                            this.$nextTick(() => {

                                // console.log(window.tencentAds[0], this.bdUnionId, '------');
                                window.TencentGDT.NATIVE.renderAd(window.tencentAds[0], this.bdUnionId);
                                window.tencentAds.shift();
                                // console.log(window.tencentAds.length, '--------');
                                if(window.tencentAds.length <= 1) {//剩余1条数据时，继续拉取数据;
                                    window.TencentGDT.NATIVE.loadAd(placement_id);
                                    window.loadTencent = false;
                                } else {
                                    return;
                                }
                            });
                        }
                        if(window.loadTencent) return;//限制页面只请求一次代码，重复请求不出现广告
                        window.loadTencent = true;
                        window.tencentAds = window.tencentAds || [];
                        jsonObj.count = 10;
                        jsonObj.onComplete = (res) => {
                            if (res && res.constructor === Array) {
                                window.tencentAds = [].concat([], res);
                                // 广告请求结束之后一次性填多个位置的广告
                                window.containerArr.map((item, index) => {
                                    window.TencentGDT.NATIVE.renderAd(window.tencentAds[0], item);
                                    // console.log(window.tencentAds[0], item, '======');
                                    window.tencentAds.shift();
                                });
                                window.containerArr = [];
                            } else {
                                // 此次回调中没有广告信息，开发者自行决定是否填充自己的广告
                            }
                        };

                        window.TencentGDT.push(jsonObj);
                    }
                }
                if(type == 'interstitial') {
                    jsonObj.show_mask = true;
                    let _this = this;
                    jsonObj.onClose = function() {
                        console.log('close');
                        $('body').css({"height": 'auto', 'overflow': 'auto'});
                    };
                    // jsonObj.onFail = true;
                    jsonObj.onInterstitialLoaded = function() {
                        $('body').css({"height": `${window.innerHeight}px`, 'overflow': 'hidden'});
                        //更改弹框容器style
                        _this.$nextTick(() => {
                            $('#gdt_inter_popup_wrap')[0].style.position = 'fixed';
                            $('#gdt_mask')[0].style.position = 'fixed';
                        });
                        GDT.showWindow();
                    };

                    window.TencentGDT.push(jsonObj);
                }
                // console.log(window.TencentGDT);
                if(window.TencentGDT.length <= 1) {
                    // H5 SDK接入全局只需运行一次
                    setTimeout(() => {
                        (function () {
                            let doc = document,
                                h = doc.getElementsByTagName('head')[0],
                                s = doc.createElement('script');
                            s.async = true;
                            s.src = '//qzs.qq.com/qzone/biz/res/i.js';
                            h && h.insertBefore(s, h.firstChild);
                        })();
                    }, 1500);
                }

                // if(type == 'native') {
                //     let display_type = eval(html.match(/display_type:\s*'.*'/)[0]) ? eval(html.match(/display_type:\s*'.*'/)[0]) : null;
                //     if(display_type) {
                //         jsonObj.display_type = display_type;
                //         jsonObj.count = 1;
                //         jsonObj.onComplete = (res) => {
                //             if (res && res.ret === 0) {
                //                 TencentGDT.NATIVE.renderAd(res.data[0]);
                //             } else {
                //                 console.log(res.ret);
                //             }
                //         };
                //     } else {
                //         window.containerArr = window.containerArr || [];
                //         this.bdUnionId = `unBodyTop_${utils.getUid()}`;
                //         window.containerArr.push(this.bdUnionId);
                //         if(window.tencentAds && window.tencentAds.length) {
                //             this.$nextTick(() => {
                //                 window.TencentGDT.NATIVE.renderAd(window.tencentAds[0], this.bdUnionId);
                //                 window.tencentAds.shift();
                //             });
                //             return;
                //         }
                //         if(window.loadTencent) return;//限制页面只请求一次代码，重复请求不出现广告
                //         window.loadTencent = true;
                //         window.tencentAds = [];
                //         jsonObj.count = 10;
                //         jsonObj.onComplete = (res) => {
                //             if (res && res.constructor === Array) {
                //                 window.tencentAds = [].concat([], res);
                //                 // 广告请求结束之后一次性填多个位置的广告
                //                 window.containerArr.map((item, index) => {
                //                     window.TencentGDT.NATIVE.renderAd(window.tencentAds[0], item);
                //                     window.tencentAds.shift();
                //                 });
                //                 window.containerArr = [];
                //             } else {
                //                 // 此次回调中没有广告信息，开发者自行决定是否填充自己的广告
                //             }
                //         };
                //     }
                // }

                // if(type == 'interstitial') {
                //     jsonObj.show_mask = true;
                //     let _this = this;
                //     jsonObj.onClose = function() {
                //         console.log('close');
                //         // 释放部分浏览器默认滑屏事件
                //         $('body').css({"height": 'auto', 'overflow': 'inherit'});
                //         document.removeEventListener("touchmove", stopDefaultEvent, {passive: false});
                //     };
                //     // jsonObj.onFail = true;
                //     jsonObj.onInterstitialLoaded = function() {
                //         _this.$nextTick(() => {
                //             //更改弹框容器style
                //             $('#gdt_inter_popup_wrap')[0].style.position = 'fixed';
                //             $('#gdt_inter_popup_wrap')[0].style.zIndex = '999999';
                //             $('#gdt_mask')[0].style.position = 'fixed';
                //             $('#gdt_mask')[0].style.zIndex = '999998';
                //             $('#gdth_popup_wrap').append("<span class='gdt_close' onClick='GDT.closeWindow(this)'>关闭</span>");
                //         });
                //         // 释放部分浏览器默认滑屏事件
                //         $('body').css({"height": `${window.innerHeight}px`, 'overflow': 'hidden'});
                //         document.addEventListener("touchmove", stopDefaultEvent, {passive: false});
                //         GDT.showWindow();
                //     };
                // }

                // window.TencentGDT = [];
                // window.TencentGDT.push(jsonObj);
                // utils.loadScript('//qzs.qq.com/qzone/biz/res/i.js', true);
                return;
            }

            if(ads.subtype == 4) {//推啊红包js
                let _this = this;
                let html = _this.ads.html;
                this.bdUnionId = `unBodyTop_${utils.getUid()}`;
                this.bdUnionAd = true;
                this.styleObj.width = '100%';
                this.styleObj.height = 'auto';
                if(!html.type || html.type == 'openScreen') this.openSlotStyle.height = `${window.innerHeight}px`;
                utils.loadScript('//yun.tuisnake.com/h5-mami/short-link/v1.1.1/short-link.min.js', false, () => {
                    _this.$nextTick(() => {
                        Tsdk.init({
                            appKey: html.appKey,
                            slotId: html.adslotId,
                            deviceId: utils.getCookie('news_uid'),
                            dom: `#${_this.bdUnionId}`,
                        });
                    });
                });
                return;
            }

            if(ads.subtype == 17) {//豆盟红包
                let appkey = JSON.parse(html).appkey;
                let adSpaceKey = JSON.parse(html).adSpaceKey;
                let adType = JSON.parse(html).type || null;
                let head = document.getElementsByTagName('head')[0];
                let script = document.createElement('script');
                script.setAttribute('id', 'myScript');
                script.setAttribute('appkey', appkey);
                script.setAttribute('adSpaceKey', adSpaceKey);
                script.src = '//sdkjs.adoumob.cn/static/redEnvelopes.js';
                if(this.adsType == 'openscreen') {
                    script.onload = script.onreadystatechange = function(){
                        window.createElement();
                    };
                }
                if(adType) {
                    this.styleObj.width = '100%';
                    this.styleObj.height = 'auto';
                    this.bdUnionAd = true;
                    this.bdUnionId = `unBodyTop_${utils.getUid()}`;

                    this.$nextTick(() => {
                        let container = document.getElementById(this.bdUnionId);
                        let adImg = document.createElement('img');
                        adImg.onclick = () => {
                            window.createElement();
                        };
                        if(adType == 'feed') {
                            let numFeed = Math.floor(Math.random()*(1 - 3) + 3);
                            adImg.src = `//i.opfed.com/opgirl/adRedIcon/redAdFeed${numFeed}.jpg`;
                            adImg.style = 'width: 100%;';
                            container.style = 'padding: 0 10px;'
                        }
                        if(adType == 'banner') {
                            let numBanner = Math.floor(Math.random()*(1 - 5) + 5);
                            let suffix = numBanner == 4 || numBanner == 5 ? 'png' : 'gif';
                            adImg.src = `//i.opfed.com/opgirl/adRedIcon/redAdBanner${numBanner}.${suffix}`;
                            adImg.style = 'width: 100%;';
                        }
                        container.innerHTML = '';
                        container.appendChild(adImg);
                    });
                }
                head.insertBefore( script, head.firstChild );
                return;
            }

            if(ads.subtype == 18) {//范式js

                this.styleObj.width = '100%';
                this.styleObj.height = 'auto';
                this.bdUnionAd = true;
                this.bdUnionId = `unBodyTop_${utils.getUid()}`;
                let srcJs = html.match(/src\s*=\s*"(.*.js)"/)[1];

                this.$nextTick(() => {
                    let container = document.getElementById(this.bdUnionId);
                    let script = document.createElement('script');
                        script.type = "text/javascript";
                        script.src = srcJs;
                        container.appendChild(script);
                });
                /*this.bdUnionId = `_4paradigm_WAP_${utils.getUid()}_render`;
                this.styleObj.width = '100%';
                this.styleObj.height = 'auto';
                this.bdUnionAd = true;
                // this.adMask = true;
                this.setAdMask();
                let srcJs = html.match(/src\s*=\s*"(.*.js)"/)[1];
                let wap = html.match(/_4paradigm_(\S*)_render/)[1];
                this.$nextTick(() => {
                    let container = document.getElementById(this.bdUnionId);
                    utils.loadScript(srcJs, false, () => {

                        let script = document.createElement('script');
                        script.innerHTML = `ParadigmAllianceAdSDK.render('${this.bdUnionId}', '${wap}')`;
                        container.appendChild(script);
                    });
                });*/
                return;
            }

            if(ads.subtype == 19) { //代理百度
                this.bdUnionId = `unBodyTop_${utils.getUid()}`;
                this.styleObj.width = '100%';
                this.styleObj.height = 'auto';
                this.bdUnionAd = true;
                // this.adMask = true;
                this.setAdMask();
                this.getAdsMask();
                if(!this.clickCount) this.showMask = this.showChance && Math.ceil(Math.random() * 100) < this.showChance;
                let srcJs = html.match(/src\s*=\s*"(.*.js)"/)[1];
                let smua = html.match(/smua=\s*"((\w*=*&*:*)*)/)[1];
                this.$nextTick(() => {
                    let container = document.getElementById(this.bdUnionId);
                    let script = document.createElement('script');
                        script.setAttribute('type', 'text/javascript');
                        script.setAttribute('smua', smua);
                        script.setAttribute('src', srcJs);
                        container.innerHTML = '';
                        container.appendChild(script);
                });
                return;
            }

            if(ads.subtype == 20) {//旺脉js  height:315
                this.styleObj.width = '100%';
                //无法在'Document'上执行'write'！！
                this.$refs.ifm.contentDocument.write(html);
                this.$refs.ifm.contentDocument.close();
                return;
            }

            if(ads.subtype == 21) {// 推广Appjs
                this.styleObj.width = '100%';
                this.styleObj.height = 'auto';
                this.bdUnionAd = true;
                this.bdUnionId = `unBodyTop_${utils.getUid()}`;
                this.$nextTick(() => {
                    let src = html.match(/src\s*=\s*"(.*.js)"/)[1];
                    let type = html.match(/type\s*=\s*"(\d)"/)[1];

                    utils.loadScript(src, true, () => {
                        window.OperaRandomApp.RequestAjax(type, this.bdUnionId);
                    });
                });
                return;
            }

            if(ads.subtype == 22) {//变现猫红包js
                this.styleObj.width = '100%';
                this.styleObj.height = 'auto';
                this.bdUnionAd = true;
                this.bdUnionId = `unBodyTop_${utils.getUid()}`;
                let hm = document.createElement('script');
                let posId = html.match(/\((.+?)\)/g)[2].split(',')[1].split(')')[0].replace(/'/g, "").replace(/\s*/g, "");
                hm.src ='//m.cudaojia.com/dist/floatModel/adMateri.js';
                hm.id = 'BxmExbannerScript';
                hm.setAttribute('data-adPositionId', posId);
                hm.setAttribute('data-bannerContainer', `${this.bdUnionId}`);
                this.$nextTick(() => {
                    let container = document.getElementById(this.bdUnionId);
                    container.appendChild(hm);
                });
                return;
            }

            if(ads.subtype == 24) {//犀光js
                this.bdUnionId = `unBodyTop_${utils.getUid()}`;
                this.styleObj.width = '100%';
                this.styleObj.height = 'auto';
                this.bdUnionAd = true;
                this.$nextTick(() => {
                    let container = document.getElementById(this.bdUnionId);
                    let script = document.createElement('script');
                        script.setAttribute('type', 'text/javascript');
                        script.setAttribute('src', 'https://lobby.qiyu3.com/banner/qiyu-ad.js?app_id=meitu');
                        container.appendChild(script);
                });
                return;
            }

            if(ads.subtype == 25) {//代理广点通JS
                this.bdUnionId = `unBodyTop_${utils.getUid()}`;
                this.bdUnionAd = true;
                this.styleObj.width = '100%';
                this.styleObj.height = 'auto';
                let src = html.match(/src\s*=\s*"(.*.js)"/)[1];
                this.$nextTick(() => {
                    let container = document.getElementById(this.bdUnionId);
                    let script = document.createElement('script');
                        script.setAttribute('type', 'text/javascript');
                        script.setAttribute('src', src);
                        container.appendChild(script);
                });
                return;
            }

            if(ads.subtype == 27) {//谷歌代理
                this.bdUnionId = `unBodyTop_${utils.getUid()}`;
                this.styleObj.width = '100%';
                this.styleObj.height = 'auto';
                this.bdUnionAd = true;
                let srcJs = html.match(/src\s*=\s*"(.*.js)"/)[1];
                this.$nextTick(() => {
                    let container = document.getElementById(this.bdUnionId);
                    let oDiv = document.createElement('div');
                    oDiv.setAttribute('class', 'adGoogle');

                    let script = document.createElement('script');
                        script.setAttribute('type', 'text/javascript');
                        script.setAttribute('src', srcJs);
                        oDiv.appendChild(script);
                        container.innerHTML = '';
                        container.appendChild(oDiv);
                });
                return;
            }

            if(ads.subtype == 28) {// 推啊SDK
                this.styleObj.width = '100%';
                // this.styleObj.height = `${window.innerHeight}`px;
                this.bdUnionAd = true;
                return;
            }

            if(ads.subtype == 29) {//末易代理
                this.bdUnionId = `unBodyTop_${utils.getUid()}`;
                this.styleObj.width = '100%';
                this.bdUnionAd = true;
                let srcJs = html.match(/src\s*=\s*"(.*.js)"/)[1];
                utils.loadScript(srcJs, true);
                let sid = html.match(/sid\s*:\s*"([a-zA-Z0-9]*)"/)[1];
                let pid = html.match(/pid\s*:\s*"([a-zA-Z0-9]*)"/)[1];
                (window.TaurusWULI = window.TaurusWULI || []).push({
                    sid: sid,
                    pid: pid,
                    el: this.bdUnionId, //填写标签元素的id
                });
                return;
            }

            if(ads.subtype == 30) {//腾讯tbs.js
                this.styleObj.width = '100%';
                this.styleObj.height = 'auto';
                this.bdUnionAd = true;
                this.bdUnionId = `unBodyTop_${utils.getUid()}`;
                let adHtml = JSON.parse(html);
                this.$nextTick(() => {
                    let container = document.getElementById(this.bdUnionId);
                    let script = document.createElement('script');
                        script.setAttribute('adkey', adHtml.adkey);
                        if(adHtml.type == 'video') {
                            script.setAttribute('posid', '100329');
                        }
                        script.src = 'https://tbsad.imtt.qq.com/tbs/jssdk/js/formal/TBSJSSDK.js?rand='+Math.random();
                        script.setAttribute("onAdEvent", "handleAdEventTBS");
                        container.innerHTML = '';
                        container.appendChild(script);
                });
                return;
            }

            if(ads.subtype == 31) {//通用js
                this.styleObj.width = '100%';
                this.styleObj.height = 'auto';
                this.bdUnionAd = true;
                this.bdUnionId = `unBodyTop_${utils.getUid()}`;
                let srcJs = html.match(/src=\s*"(.*)"/)[1];
                this.$nextTick(() => {
                    let container = document.getElementById(this.bdUnionId);
                    let script = document.createElement('script');
                        script.type = 'text/javascript';
                        script.src = srcJs;
                        container.innerHTML = '';
                        container.appendChild(script);
                });
                return;
            }

            if(ads.subtype == 32) {//美点Js(代理TBS)
                this.bdUnionId = `unBodyTop_${utils.getUid()}`;
                this.bdUnionAd = true;
                this.styleObj.width = '100%';
                this.styleObj.height = 'auto';
                let adHtml = JSON.parse(html);
                this.$nextTick(() => {
                    let _this = this;
                    let head = document.getElementsByTagName('head')[0];
                    let script = document.createElement('script');
                    script.type = 'text/javascript';
                    if(adHtml.genre == 'self') {
                        script.setAttribute('id', 'coral_tbs_js');
                        script.src = 'https://webcdn.m.qq.com/webcdn/gmall/sdk/coral-x5-adv-sdk-v2.min.js';
                    } else {
                        script.setAttribute('id', 'coral_js');
                        script.src = 'https://webcdn.m.qq.com/webcdn/gmall/sdk/coral-x5-adv-sdk.min.js?v=2';
                    }
                    script.setAttribute('env', 'pro');
                    script.setAttribute('appid', adHtml.appid);
                    script.onload = script.onreadystatechange = function(){
                        if((!script.readyState || script.readyState === "loaded" || script.readyState === "complete")){
                            // new CoralAdv(_this.bdUnionId, {// ad-test-1为页面中某个dom元素的id
                            //     type: adHtml.type, // 9:大图广告  10：图文广告  11：视频广告  12：左文右图  13：左图右文
                            //     handleAdEventName: '', //广告回调事件名称，可不传，默认为handleAdEvent
                            //     handleAdErrorName: '', //广告加载出错事件名称，可不传，默认为handleAdError
                            //     advShowCb: function(){}, //广告渲染后回调事件
                            //     advClickCb: function(){}, //广告点击后回调事件
                            //     advCloseCb: function(){
                                    // _this.$store.commit({
                                    //     type: "SETISPOPADLAYER",
                                    //     isPopAdLayer: false
                                    // });
                            //     }, //广告关闭后回调事件
                            //     advErrorCb: function(errorno){} //广告加载出错回调事件
                            // });
                            if(adHtml.genre == 'self') {
                                new CoralTBSAdv(_this.bdUnionId, {// ad-test-1为页面中某个dom元素的id
                                    type: adHtml.type, // 9:大图广告  10：图文广告  11：视频广告  12：左文右图  13：左图右文
                                    target: adHtml.target || 6,
                                    handleAdEventName: '', //广告回调事件名称，可不传，默认为handleAdEvent
                                    handleAdErrorName: '', //广告加载出错事件名称，可不传，默认为handleAdError
                                    advShowCb: function(){}, //广告渲染后回调事件
                                    advClickCb: function(){}, //广告点击后回调事件
                                    advCloseCb: function(e){
                                        console.log(e);
                                        _this.$store.commit({
                                            type: "SETISPOPADLAYER",
                                            isPopAdLayer: false
                                        });
                                    }, //广告关闭后回调事件
                                    advErrorCb: function(errorno){} //广告加载出错回调事件
                                });
                            } else {
                                new CoralAdv(_this.bdUnionId, {// ad-test-1为页面中某个dom元素的id
                                    type: adHtml.type, // 9:大图广告  10：图文广告  11：视频广告  12：左文右图  13：左图右文
                                    target: adHtml.target || 6,
                                    handleAdEventName: '', //广告回调事件名称，可不传，默认为handleAdEvent
                                    handleAdErrorName: '', //广告加载出错事件名称，可不传，默认为handleAdError
                                    advShowCb: function(){}, //广告渲染后回调事件
                                    advClickCb: function(){}, //广告点击后回调事件
                                    advCloseCb: function(e){
                                        console.log(e);
                                        _this.$store.commit({
                                            type: "SETISPOPADLAYER",
                                            isPopAdLayer: false
                                        });
                                    }, //广告关闭后回调事件
                                    advErrorCb: function(errorno){} //广告加载出错回调事件
                                });
                            }
                        }
                    };
                    // Use insertBefore instead of appendChild  to circumvent an IE6 bug.
                    head.insertBefore( script, head.firstChild );
                });
                return;
            }

            if(ads.subtype == 33) {//黑五Js
                this.bdUnionId = `unBodyTop_${utils.getUid()}`;
                this.bdUnionAd = true;
                this.styleObj.width = '100%';
                this.styleObj.height = 'auto';
                let adHtml = JSON.parse(html);
                utils.loadScript('//static.mediav.com/js/feed_ts.js', false, () => {
                    NEWS_FEED({
                        w: window.innerWidth,
                        placeholderId: this.bdUnionId, // 指定插入位置
                        showid: adHtml.showId, // 需要替换showid
                        inject: 'cads',
                    //  noCSS: true, //是否不加载默认css， 默认为false（加载默认css）。
                        pureAdNum: 3, //一次请求的广告条数，建议值设置为 N 或 N+1 （N为一屏所容纳的广告条数）
                        useCapture: true,
                    //  displayType: 'singleImage', //固定单图样式展现
                    //  onFailSign: 'test', //媒体可自定义属性和值，用作本次加载的标记
                    //  userConf: { //前端样式配置，按需使用
                    //      titleFontSize: 14,
                    //      titleFontColor: "#34c75f",
                    //      titleHover: "#f00",
                    //      titleFontFamily: "Microsoft Yahei",
                    //      contentBackground: "#a69898"
                    //  },
                        onFail: function(param){ //广告加载失败时触发的回调（仅在函数调用触发了请求时才能响应onFail）
                            /*param：参数为NEWS_FEED调用时的入参*/
                            console.log(param, '广告加载失败时触发了回调');
                        }
                    });
                });
                return;
            }

            if(ads.subtype == 36) {//神马热词
                this.bdUnionId = `unBodyTop_${utils.getUid()}`;
                this.bdUnionAd = true;
                this.styleObj.width = '100%';
                this.styleObj.height = 'auto';
                this.$nextTick(() => {
                    // let src = html.match(/src\s*=\s*"(.*.js)"/)[1];
                    let src = "http://172.16.11.117:8000/sm_hot_word.js";
                    utils.loadScript(src, false, () => {
                        window.OUPENGSMHOTWORD.RequestAjax(this.bdUnionId);
                    });
                });
                return;
            }


            if(utils.isURL(html)) {
                this.iframeSrc = html;
            } else {
                // 使用data:来做src
                // this.iframeSrc = 'data:text/html;charset=utf-8,' + encodeURIComponent(html);
                // this.$el.querySelector('iframe').contentDocument.body.innerHTML = ''

                this.$nextTick(() => {
                    if(this.$refs.ifm && this.$refs.ifm.contentDocument) {
                        this.$refs.ifm.contentDocument.write(html);
                        this.$refs.ifm.contentDocument.close();

                        // //默认广告样式处理;
                        // this.bdUnionId = `unBodyTop_${utils.getUid()}`;
                        // utils.createStyle(`${this.bdUnionId}-fix`, `#${this.bdUnionId}\{ margin-left: -0.1rem;\}`);
                    }
                });
            }
        },
        bdUnion(html) {
            let cpro_id = html.match(/cpro_id\s*=\s*"(u\d+)"/)[1];
            let src = html.match(/src\s*=\s*"((http(s)?:)?\/\/.*\.js)"/)[1];
            let id = this.bdUnionId;

            let cssText = `#${id}\{background-color:white!important;\}`;
            utils.createStyle(`${id}-fix`, cssText);

            let srcJs = src;

            if(src.indexOf('http') === 0) srcJs = src.split(':')[1];
            /*(window.cpro_mobile_slot = window.cpro_mobile_slot || []).push({
                id: cpro_id
            });
            utils.loadScript(src);*/

            utils.loadScript(srcJs, false, () => {
                BAIDU_CLB_fillSlot && BAIDU_CLB_fillSlot(cpro_id, id);
            });
        },
        getTimer(startTime, endTime){

            let minute = 1000 * 60;
            let hour = minute *60;
            let day = hour *24;
            let week = day * 7;
            let timeStart = Date.parse(new Date(endTime));//当前的时间戳
            let timeEnd = Date.parse(new Date(startTime));//指定时间的时间戳
            let time = timeStart - timeEnd;

            let result = false;
            if(time / hour >= 2 || time / day >= 1) {
                result = true;
            } else {
                result = false;
            }
            return result;
        },
        touchMask(el, fn, type) {
            let startPoint = {};
            el.addEventListener('touchstart', (e) => {
                startPoint = {
                    x: e.changedTouches[0].pageX,
                    y: e.changedTouches[0].pageY
                };
            });
            el.addEventListener('touchend', (e) => {
                let endPoint = {
                    x: e.changedTouches[0].pageX,
                    y: e.changedTouches[0].pageY
                };
                if(Math.abs(endPoint.x - startPoint.x) < 1 && Math.abs(endPoint.y - startPoint.y) < 1) {
                    if(type == 'adDownMask') {
                        let storageSystemInfo = storage.get('systemInfo') || null;
                        dataCenter.getSystemInfo().then((currentTime) => {
                            if(this.getTimer(storageSystemInfo, currentTime)) {
                                location.reload();
                                storage.remove('systemInfo');
                            } else {
                                fn && fn.call(el, e);
                            }
                        });
                    } else {
                        fn && fn.call(el, e);
                    }
                }
            });
        },
        getAdsMask() {
            let flag = false;
            if(this.clickCount && this.showChance) {
                let adInfo = storage.get(`${this.adsType}_${this.ads.slot}_${this.did}`),
                    count = adInfo && adInfo.data;
                if(count === parseInt(this.clickCount)) {
                    flag = this.showChance && Math.ceil(Math.random() * 100) < this.showChance;
                }
            }
            return flag;
        }
    }
};
</script>

<style lang="scss">
.x-frame {
    position: relative;
    iframe {
        border:0;
        width:100%;
        /* height:100%; */
    }
}
.gdt_close {
    display: block;
    color: rgb(255, 255, 255);
    position: absolute;
    right: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.6);
    width: 40px;
    height: 30px;
    line-height: 30px;
    z-index: 999999;
}
.ad-mask {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 999
}
</style>
