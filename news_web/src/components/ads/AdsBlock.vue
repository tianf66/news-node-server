<template>
    <div>
        <shanhu-js-sdk v-if="ads.type == 10 && ads.subtype == 34" :ads="ads" :active="active" :adsType="adsType"></shanhu-js-sdk>
        <ads-media v-else-if="ads.type" :active="active" :ads="ads" :immediate="immediate" :adsType="adsType" :type="type" :clickCount="clickCount"></ads-media>
    </div>
</template>

<script>

import AdsMedia from '@/components/ads/AdsMedia.vue';
import ShanhuJsSdk from './item/AdsShanHuJsSdk.vue';
import dataCenter from '@/store/index.js';
// import {mapActions} from 'vuex';

export default {
    name: 'AdsBlock',
    components:{
        AdsMedia,
        ShanhuJsSdk
    },
    props: {
        aid: NaN,
        type: '',
        detail: {
            type: Boolean,
            default: false
        },
        active: {
            type: Boolean,
            default: true
        },
        adsId: {
            type: String,
            default: ''
        },
        pos: {
            type: String,
            default: 'null'
        },
    	immediate: {
    		type: Boolean,
    		default: false
    	},
        adsType: String,
        clickCount: String
    },
    data() {
        return {
           ads: {}
        };
    },
    beforeMount() {
        this.update();
    },
    watch: {
        // 'aid': function(val) {
        //     if(this.page || this.cid) return;
        //     this.update();
        // }
        '$route': function(_new, _old) {
            // console.log(_new.name, _old.name, this.type)
            if(_new.name == 'detail' && _old.name == 'detail' && this.type == 'detail') {
                this.update();
            }
            if(_new.name == 'channel' && _old.name == 'channel') {
                this.update();
            }
            if(_new.name == 'detail' && _old.name == 'channel' && this.type == 'detail') {
                this.update();
            }
        }
    },
    methods: {
        update() {
            let flag = this.adsType == 'detailPop';
            let aid = parseInt(this.aid);
            dataCenter.getAds(aid, flag, this.adsType, this.clickCount).then((ads) => {
                this.ads = ads;
            }, () => {
                // TODO
            });
        },
    }
};

</script>
