<template>
	<div class="channel_container">
		<nav-view></nav-view>
		<div v-if="ads.switchChannelPop && ads.switchChannelPop.id && isGDTcp">
			<ads-block :aid="ads.switchChannelPop.id" :adsType="'switchChannelPop'" :immediate="true"></ads-block>
		</div>
		<div @touchmove.prevent class="channel-adpop" v-if="ads.switchChannelPopRenderself && ads.switchChannelPopRenderself.id && isPopAdLayer && isGDTcp">
			<div class="close-ad" @click="closePopAd">+</div>
			<ads-block class="adpop" :adsType="'switchChannelPopRenderself'" :aid="ads.switchChannelPopRenderself.id" :clickCount="ads.switchChannelPopRenderself.adClickTime" :immediate="true"></ads-block>
		</div>
		<div :class="{'channel_item': constNavMargin}">
			<div class="adColor" v-if="ads.listTop && ads.listTop.id && listTopSlot">
				<template v-for="itemAd in adslistTop">
					<ads-block :aid="itemAd.id" :immediate="true" :adsType="'listTop'" :clickCount="itemAd.clickCount"></ads-block>
				</template>
			</div>
			<template v-for="(item, index) in lists">
				<channel-item v-if="!item.slot && (newsApiUpstream == 'oupeng' || newsApiUpstream == '')" :item="item" :index="index"></channel-item>
				<div class="list-center-ad adColor" v-if="item.slot">
					<ads-block v-if="item.slot" :adsType="item.pos" :aid="item.slot" :clickCount="item.clickCount" :active="active"></ads-block>
				</div>
			</template>
		</div>
		<div class="loading" v-if="loading">{{loadOrerror}}</div>
		<div class="bottom_ads">
			<task-view></task-view>
			<div style="background: #FFF;" v-if="listBottomAd && showBottomAd && $route.name == 'channel'" >
				<!-- <div class="ad_close" @click="closeAds">关闭</div> -->
				<ads-block :aid="listBottomAd" :clickCount="ads.listBottomFloat.adClickTime" :immediate="true" :adsType="'listBottomFloat'"></ads-block>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import NavView from '@/components/modules/Nav.vue';
import AdsBlock from '@/components/ads/AdsBlock.vue';
import ChannelItem from '@/components/views/Channel/ChannelItem.vue';
import storage from '@/utils/storage.js';
import TaskView from '@/components/modules/Task.vue';

export default {
	name: 'channel',
	components: {
		NavView,
		AdsBlock,
		ChannelItem,
		TaskView,
	},
	data() {
		return {
			page: 0,
			loading: true,
			active: true,
			showBottomAd: true,
			listTopSlot: true,
			loadOrerror: '加载中...',
			isGDTcp: storage.get('isTabAlertAd')
		}
	},
	watch: {
		'$route': function(to, from) {
		 	if(from.name == 'channel' && to.name == 'channel') {
		 		this.page = 0;
		 		this.showBottomAd = true;
		 		this.listTopSlot = true;
		 		this.$store.commit('CLEARLIST');
		 		this.loadItems();
				this.showBottomAd = !!this.listBottomAd;
		 	}

		 	if(to.name == 'channel' && from.name == 'detail') {
		 		this.listTopSlot = false;
		 	}
        },
	},
	computed: {
		...mapState({
            index: (state) => state.channel.index,
            lists: (state) => state.channel.channleList,
        }),
        did() {
        	return this.$route.query.did;
        },
        cid() {
        	return this.$route.params.cid;
        },
        ads() {
        	return this.$store.state.common.adConfig;
        },
        listBottomAd() {
          let lbAd = this.ads.listBottomFloat && this.ads.listBottomFloat.id ? this.ads.listBottomFloat.id : null;
          return lbAd ? lbAd : null;
        },
        newsApiUpstream() {
        	return window.config.newsApiUpstream;
        },
        constNavMargin() {
        	//只配置一个频道时， 不显示css样式;
        	return !(this.$store.state.common.channels.length === 1) && (this.ads.listTopFloat && !this.ads.listTopFloat.id);
        },
        adslistTop() {
        	let adsList = this.ads.listTop.id.split(','),
        		adClickCount = this.ads.listTop.adClickTime.split(','),
        		list = [];
        	adsList.forEach((item, index) => {
        		list.push({id: item, clickCount: adClickCount[index]});
        	});
        	return list;
        },
        isPopAdLayer() {
        	return this.$store.state.common.isPopAdLayer;
        },
        newsShowCount() {
        	return window.config.newsShowCount;
        }
	},
	beforeMount () {
        this.loadItems();
        storage.set('isTabAlertAd', false);
    },
	methods: {
		loadItems() {
			this.loading =  true;
			this.getItem();
		},
		getItem() {
			let params = {
				did: this.did,
				channelId: this.cid,
				page: this.page
			};
			this.$store.dispatch('fetch', params).then((data) => {
				// this.loading = data.length == 0 ? true : false;
				if(data.length == 0 ) {
					this.loadOrerror = '暂无更多数据';
					this.loading = true;
				} else {
					this.loading = false;
					this.loadOrerror = '加载中...';
				}
            });
		},
		getTitle(id) {
            let title = '';
            let data = this.$store.state.common.channels;
            for(let cid in data) {
                if(id == data[cid].id)
                    title = data[cid].title;
            }
            return title;
        },
        getCode(id) {
            let code = '';
            let data = this.$store.state.common.channels;
            for(let cid in data) {
                if(id == data[cid].id)
                    code = data[cid].code;
            }
            return code;
        },
		closeAds() {
			this.showBottomAd = false;
		},
		closePopAd() {
			this.$store.commit({
	            type: "SETISPOPADLAYER",
	            isPopAdLayer: false
	        });
		}
	},
	mounted() {

		window.addEventListener('scroll', (e) => {
        	if(!this.loading && (this.newsShowCount == 0 || !this.newsShowCount)) {
                let bodyTop = document.body.getBoundingClientRect().top;
                let bodyOffsetHeight = document.body.offsetHeight;
                let innerHeight = window.innerHeight;
                if(bodyOffsetHeight - Math.abs(bodyTop) <= 2 * innerHeight && this.$route.name == 'channel') {
                    this.page += 1;
                    this.loadItems();
                }
            }
        });

        setTimeout(() => {
        	storage.removeSession('RETURNHOME');
        }, 2200);
    },
    activated() {
        this.active = true;
    },
    deactivated() {
        this.active = false;
    }
}
</script>

<style lang="scss">
.channel_container {
	/* margin-top: 0.5rem; */
}
.channel_item {
	margin-top: 0.5rem;
}
.adColor {
	background: #fff;
}
.loading {
	width: 100%;
	text-align: center;
}
.list-center-ad {
	padding: 0 0.015rem;
}
.bottom_ads {
	width: 100%;
	position: fixed;
	bottom: 0;
	left: 0;
	z-index: 1000;
	/* background: #FFF; */
	.ad_close {
		width: 0.3rem;
	    line-height: 0.2rem;
	    height: 0.2rem;
	    text-align: center;
	    position: absolute;
	    top: 0;
	    right: 0;
	    background: rgb(0, 0, 0);
	    z-index: 99999;
	    color: rgb(255, 255, 255);
	    font-size: 0.1rem;
	}
}
.channel-adpop {
	width: 100%;
	height: 100%;
	z-index: 99;
	display: table;
	position: fixed;
	top: 0;
	left: 0;
	background-color: rgba(0, 0, 0, .5);
	.adpop {
		display:table-cell;
		vertical-align:middle;
	}
	.close-ad {
		/* position: absolute;
	    top: 0;
	    right: 0;
	    padding: 0.05rem 0.06rem;
	    font-size: 0.1rem;
	    background-color: rgba(0, 0, 0, 0.5);
		color: #FFF; */
		position: absolute;
		/* right: 46%;
        top: 50%; */
        top: 12px;
    	right: 12px;
		font-size: 40px;
		color: #fff;
		transform: rotate(-45deg);
		width: 20px;
		height: 20px;
		line-height: 20px;
		text-align: center;
	}
}
</style>