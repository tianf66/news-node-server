<template>
    <div>
        <div class="nav_container" ref="nav_container" v-if="navContainer">
            <!-- 列表页顶部浮层广告 start -->
            <section v-if="ads.listTopFloat && ads.listTopFloat.id">
                <ads-block :aid="ads.listTopFloat.id" :adsType="'listTopFloat'" :clickCount="ads.listTopFloat.adClickTime" :immediate="true"></ads-block>
            </section>
            <!-- 列表页顶部浮层广告 end -->
            <div class="container" v-if="!constNavDid">
                <ul class="slide-items" ref="navSwiper">
                    <li v-for="(item, index) in navList"
                        :key="item.i"
                        @click="handleClick($event, item)">
                        <p :class="{'nav-active': currCid == item.id}">{{item.title}}</p>
                    </li>
                </ul>
            </div>
            <!-- 渠道定制 start -->
            <div class="container" v-if="constNavDid">
                <ul class="" style="width:100%; text-align: center;">
                    <li v-for="(item, index) in navList"
                        :key="item.i">
                        <p style="font-size: 0.2rem; color: #FF6309;font-weight: bold; 0.05rem;    letter-spacing: 0.05rem;">{{item.title}}</p>
                    </li>
                </ul>
            </div>
            <!-- 渠道定制 end -->
        </div>
        <div id="nav_after" style=""></div>
    </div>
</template>
<script>import {mapState} from 'vuex';
// import Swiper from 'swiper';
// import 'swiper/dist/css/swiper.min.css';
import Swiper from '@/utils/swiper.js';
import storage from '@/utils/storage.js';
import AdsBlock from '@/components/ads/AdsBlock.vue';
export default {
    name: 'NavView',
    components: {
        AdsBlock
    },
    data() {
        return {
        	navContainer: true,
            currIndex: '',
            constNavDid: config.did == '1227499231300411392' || config.did == '1281552157760880640'
        };
    },
    computed: {
        ...mapState({
        	//
        }),
        currCid() {
            return this.$route.params.cid;
        },
        navList() {
            return config.channelList;
        },
        ads() {
            return this.$store.state.common.adConfig;
        }
    },
    watch: {
        '$route': function(_new, _old) {
            // this.iniTabSwiper();
        },
    },
    mounted() {
        // this.iniTabSwiper();
        this.$nextTick(() => {
            ////只配置一个频道时，渠道不显示导航
            if(this.$store.state.common.channels.length === 1) {
                this.navContainer = false;
            }
            setTimeout(() => {
                if(this.$refs.navSwiper) {
                    new Swiper(this.$refs.navSwiper, false);
                }
            }, 300);

            if(this.ads.listTopFloat && this.ads.listTopFloat.id && this.navContainer) {
                let timer = setInterval(() => {
                    let navHeight = this.$refs.nav_container.offsetHeight;
                    let styleHeight = parseInt(this.$store.state.ads.styleHeight) || null;
                    document.getElementById("nav_after").style.height = `${navHeight + styleHeight}px`;
                    if(navHeight && styleHeight) {
                        clearInterval(timer);
                    }
                }, 100);
            }
        });
    },
    methods: {
        handleClick(e, nav) {
            OUPENGLOGGER({
                action: 'tab_click',
                payload: {
                    id: nav.code,
                    title: nav.title,
                    type: 'channel',
                    pos: 'list'
                }
            });
            let did = this.$route.query.did;
            storage.set('isTabAlertAd', true);

            storage.setSession('navTransform', this.$refs.navSwiper.style.cssText);
            // this.$router.push({name: 'channel', params: {cid: nav.id}, query: {did: did, first: 'off'}});
            window.location.href = `/channel/cid/${nav.id}/?did=${did}&first=off`;
        },
        // iniTabSwiper() {
        //     let channels = this.navList;
        //     channels.forEach((item, index) => {
        //         if(item.id == this.currCid) {
        //             this.currIndex = index;
        //         }
        //     });
        //     new Swiper('#swiper', {
        //         direction: 'horizontal',
        //         slidesPerView: 'auto', //'auto',
        //         freeMode : true,
        //         initialSlide: this.currIndex - 1,
        //     });
        // },
    }
};
</script>

<style lang="scss">
.nav_container{
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    line-height: 0.44rem;
    background-color: #FFFFFF;
    overflow: hidden;
    border: 5px solid #F7F7F7;
    /* .swiper-container {
        width: 95%;
        margin-top: 0.05rem;
    }
    .swiper-wrapper {
        width: 1000%;
    }
    .nav-item {
        text-align: center;
        font-family: DroidSansFallback;
		color: #A6A6A6;
        float: left;
        height: 0.42rem;
        line-height: 0.38rem;
        font-size: 0.16rem;
    } */
    .container {
        height: 0.44rem;
        position: relative;
        /* margin-left: 0.24rem; */
        overflow: hidden;
        .slide-items {
            display: flex;
            position: absolute;
            li {
                display: inline-block;
                -ms-flex: 0 0 1.66rem;
                flex: 0 0 0.6rem;
                height: 0.44rem;
                position: relative;
                text-align: center;
                font-family: DroidSansFallback;
                color: #A6A6A6;
                font-size: 0.16rem;
            }
        }
    }
    .nav-active {
    	font-weight: 800;
        font-family: DroidSansFallback;
 		color: #212121;
        &::after {
            width: 50%;
            content: "\30";
            display: block;
            position: relative;
            top: -0.02rem;
            margin: 0 auto;
            height: 0.03rem;
            border-radius: 20px;
            overflow: hidden;
            background-color: #FF283D;
            z-index: 998;
        }
    }
    .swiper-slide {
         width: auto;
         padding: 0 0.18rem;
    }
}
</style>