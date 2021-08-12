<template>
    <div class="nav_container">
        <div class="container">
            <ul class="slide-items" ref="navSwiper">
                <li v-for="(item, index) in navList"
                    :key="item.tab_id"
                    @click="handleClick($event, item)">
                    <p :class="{'nav-active': currCid == item.name}">{{item.name}}</p>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>import {mapState} from 'vuex';
import Swiper from '@/utils/swiper.js';
import storage from '@/utils/storage.js';
export default {
    name: 'NavView',
    data() {
        return {
        	customNav: true,
            currIndex: ''
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
            return this.$store.state.common.xiGuangChannels;
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.getNavInfo();
            setTimeout(() => {
                if(this.$refs.navSwiper) {
                    new Swiper(this.$refs.navSwiper, false);
                }
            }, 300);
        });
    },
    methods: {
        handleClick(e, nav) {
            OUPENGLOGGER({
                action: 'tab_click',
                payload: {
                    id: '',
                    title: nav.name,
                    type: 'channel',
                    pos: 'list'
                }
            });
            let did = this.$route.query.did;
            storage.set('isTabAlertAd', true);
            storage.setSession('navTransform', this.$refs.navSwiper.style.cssText);
            // this.$router.push({name: 'channel', params: {cid: nav.id}, query: {did: did, first: 'off'}});
            window.location.href = `/channel/cid/${nav.name}/?did=${did}&first=off`;
        },
        getNavInfo() {
            this.$store.dispatch('setXiGuangNavInfo');
        }
    }
};
</script>

<style lang="scss" scoped>
.nav_container{
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 998;
    line-height: 0.44rem;
    background-color: #FFFFFF;
    overflow: hidden;
    border-bottom: 5px solid #F7F7F7;
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