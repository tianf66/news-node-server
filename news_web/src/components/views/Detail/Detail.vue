<template>
	<div class="detail_container" :style="ads.detailBottomFloat && ads.detailBottomFloat.id ? 'margin-bottom: 57px;' : 'margin:0'">
		<ads-block v-if="ads.detailPop && ads.detailPop.id" :adsType="'detailPop'" :aid="detailPopAd" :immediate="true"></ads-block>
		<!-- 详情页弹窗 自渲染  start -->
		<div @touchmove.prevent class="detail-adpop" v-if="isPopAdLayer && ads.detailPopRenderself && ads.detailPopRenderself.id && isShowAdsPopDerself">
			<div class="close-ad" @click="closePopAd">关闭</div>
			<ads-block class="adpop" :adsType="'detailPopRenderself'" :aid="ads.detailPopRenderself.id" :clickCount="ads.detailPopRenderself.adClickTime" :immediate="true"></ads-block>
		</div>
		<!-- 详情页弹窗 自渲染  end -->
		<detail-header></detail-header>
		<!-- <ads-flot v-if="did == '1134019964852768768'"></ads-flot> -->
		<!-- 详情页conent内容 start -->
		<div class="conent">
			<!-- 详情页顶部广告 detailTop -->
			<div v-if="ads.detailTop && ads.detailTop.id">
				<template v-for="(itemAd, index) in adsDetailTop">
					<ads-block :aid="itemAd.id" :clickCount="itemAd.clickCount" type="detail" :adsType="'detailTop'"></ads-block>
				</template>
			</div>
			<!-- <ads-block v-if="ads.detailTop && ads.detailTop.id" :adsType="'detailTop'" :aid="ads.detailTop.id" :immediate="true"></ads-block> -->
			<!-- 详情页顶部广告 detailTop  end-->

			<!-- 详情页图集组件 start -->
			<template v-if="detail.siteType == 2">
				<detail-image-content :detail="detail"></detail-image-content>
			</template>
			<!-- 详情页图集组件 end -->
			<template v-if="detail.siteType && detail.siteType == 1 && did != '1323206074580066304'">

				<!-- 详情页新闻组件 start -->
				<div v-if="" :style="styleObj">
					<!-- 犀光详情页组件 start -->
					<x-detail-content v-if="newsApiUpstream == 'xiguang'" :detail="detail"></x-detail-content>
					<!-- 犀光详情页组件 end -->

					<!-- 详情页内容组件 start -->
					<detail-conent v-else :detail="detail"></detail-conent>
					<!-- 详情页内容组件 end -->
				</div>

				<!-- 详情页新闻组件 end -->

				<!-- 进入详情页默认3/2屏,点击查看全文 start -->
				<div v-if="view_all" class="view_all" @click="viewAll">
					<p>查看全文<img src="//i.opfed.com/news/expandRed.png" alt=""></p>
				</div>
				<!-- 进入详情页默认3/2屏,点击查看全文 end -->
			</template>

			<!--					(渠道定制)  								-->
			<!-- 1323206074580066304 老子搜书3 不显示查看全文功能，默认展开全部 -->
			<div v-if="did == '1323206074580066304'">
				<x-detail-content v-if="newsApiUpstream == 'xiguang'" :detail="detail"></x-detail-content>
				<detail-conent v-else :detail="detail"></detail-conent>
			</div>
			<!--					(渠道定制)  								-->
			<!-- 1323206074580066304 老子搜书3 不显示查看全文功能，默认展开全部 -->
		</div>
		<!-- 详情页conent内容 end -->

		<!-- 详情页文章尾部广告 start -->
		<div v-if="ads.detailNewsEnd && ads.detailNewsEnd.id">
			<template v-for="(itemAd, index) in adsDetailNewsEnd">
				<ads-block :aid="itemAd.id" :clickCount="itemAd.clickCount" type="detail" :adsType="'detailNewsEnd'"></ads-block>
			</template>
		</div>
		<!-- 详情页文章尾部广告 end -->

		<!-- 详情页底部翻页 start -->
		<div class="detail-bar">
			<p @click="returnHome">回首页</p>
			<p @click="nextDetail" v-if="detail.nextId">下一篇</p>
		</div>
		<!-- 详情页底部翻页 end -->


		<!-- 详情页翻页下广告 start -->
		<div v-if="ads.detailNextPageDown && ads.detailNextPageDown.id">
			<!-- <ads-block :aid="ads.detailNextPageDown.id" type="detail" :immediate="true" :adsType="'detailNextPageDown'"></ads-block> -->
			<template v-for="(itemAd, index) in adsDetailNextPageDown">
				<ads-block :aid="itemAd.id" :clickCount="itemAd.clickCount" type="detail" :immediate="true" :adsType="'detailNextPageDown'"></ads-block>
			</template>
		</div>
		<!-- 详情页翻页下广告 end -->

		<!-- 详情页推荐 start -->
		<detail-relate v-if="isRecommend == 'oupeng' || isRecommend == ''" :siteType="detail.siteType"></detail-relate>
		<!-- 详情页推荐end -->

		<!-- 详情页浮层广告 start -->
		<div class="detail-slot-bottom">
			<task-view></task-view>
			<div style="background: #FFF;" v-if="ads.detailBottomFloat && ads.detailBottomFloat.id && showDetailBottomAds">
				<!-- <div class="ad_close" @click="closeAds">关闭</div> -->
				<ads-block :aid="ads.detailBottomFloat.id" :clickCount="ads.detailBottomFloat.adClickTime" type="detail" :immediate="true" :adsType="'detailBottomFloat'"></ads-block>
			</div>
		</div>
		<!-- 详情页浮层广告 end -->

		<!-- 微信分享title -->
		<div v-wechat-title="detail.title" img-set="detail.imgList[0]"></div>

		<div class="const-time" v-if="timeCountModel">浏览点击感兴趣的新闻广告{{constTimeCount}}</div>
	</div>
</template>

<script>
import DetailHeader from '@/components/views/Detail/Header.vue';
import DetailConent from '@/components/views/Detail/Content.vue';
import DetailImageContent from '@/components/views/Detail/ImageContent.vue';
import DetailRelate from '@/components/views/Detail/NewsRelate.vue';
import AdsBlock from '@/components/ads/AdsBlock.vue';
import AdsFlot from '@/components/ads/item/AdsFlot.vue';
import storage from '@/utils/storage.js';
import TaskView from '@/components/modules/Task.vue';

export default {
	name: 'detail',
	components: {
		DetailHeader,
		DetailConent,
		DetailImageContent,
		DetailRelate,
		AdsBlock,
		AdsFlot,
		TaskView
	},
	data() {
		return {
			showDetailBottomAds: true,
			view_all: true,
			styleObj: {
				height: `${window.innerHeight/ 1.7 }px`,
				overflow: `hidden`
			},
			isShowAdsPopDerself: true,
			constTimeCount: 60,
			timeCountModel: false,
			timer: null
		}
	},
	watch: {
		'$route': function(to, from) {
		 	this.view_all = true;
		 	this.styleObj = {
				height: `${window.innerHeight}px`,
				overflow: `hidden`
			};
			if(to.name == 'detail' && from.name == 'detail' ) {
				this.$store.commit('CLEARDETAIL');
				this.$store.commit('CLEARNEWSLATE');
				this.loadItems();
			}
        },
        // 'detail.content'() {
        	// this.$nextTick(() => {
        		// let html_container = document.getElementById('conent_html');
				// this.view_all = html_container.offsetHeight > window.innerHeight ? true : false;
	        // });
        // }
	},
    computed: {
    	detail() {
    		return this.$store.state.detail.detailObj;
    	},
    	did() {
    		return this.$route.query.did;
    	},
        cid() {
        	return this.$route.params.cid;
        },
        tid() {
        	return this.$route.params.tid;
        },
        ads() {
        	return this.$store.state.common.adConfig;
        },
        detailPopAd() {

        	let popAd = this.ads.detailPop.id.split(',');
        	let ipopIndex = parseInt(this.$route.query.ipopIndex) || 0;

        	if(popAd.length - popAd.indexOf(popAd[ipopIndex]) == 1) {
        		let query = this.$route.query;
        		let name = this.$route.name;
        		let params = this.$route.params;
        		query.ipopIndex = -1;
        		this.$router.replace({name: name, params, query});
        	}
        	return popAd[ipopIndex] || popAd[0];
        },
        newsApiUpstream() {
        	return window.config.newsApiUpstream;
        },
        isRecommend() {
        	return window.config.detailRecommendApiUpstream;
        },
        adsDetailNewsEnd() {
        	let adsList = this.ads.detailNewsEnd.id.split(','),
        		clickCountList = this.ads.detailNewsEnd.adClickTime.split(','),
        		list = [];
        	adsList.forEach((item, index) => {
        		list.push({id: item, clickCount: clickCountList[index]});
        	});
        	return list;
        },
        adsDetailTop() {
        	let adsList = this.ads.detailTop.id.split(','),
        		clickCountList = this.ads.detailTop.adClickTime.split(','),
        		list = [];
        	adsList.forEach((item, index) => {
        		list.push({id: item, clickCount: clickCountList[index]});
        	});
        	return list;
        },
        adsDetailNextPageDown() {
        	let adsList = this.ads.detailNextPageDown.id.split(','),
        		clickCountList = this.ads.detailNextPageDown.adClickTime.split(','),
        		list = [];
        	adsList.forEach((item, index) => {
        		list.push({id: item, clickCount: clickCountList[index]});
        	});
        	return list;
        },
        isPopAdLayer() {
        	return this.$store.state.common.isPopAdLayer;
        }
	},
	beforeMount () {
        // this.loadItems();
    },
    beforeRouteEnter (to, from, next) {
        // 在渲染该组件的对应路由被 confirm 前调用
        // 不！能！获取组件实例 `this`
        // 因为当钩子执行前，组件实例还没被创建
        next((vm) => {
            // 通过 `vm` 访问组件实例
            vm.$store.commit('CLEARDETAIL');
            vm.loadItems();
            window.scrollTo(0, 0);
        });
    },
    beforeRouteLeave(to, from, next) {
    	let detailPrs = this.$store.state.detail.detailPrs;
    	if(detailPrs == 0) {
    		OUPENGLOGGER({
	            action: 'back_click',
	            payload: {
	                id: this.getCode(this.cid),
	                title: this.getTitle(this.cid),
	                type: 'channel',
	                pos: 'detail'
	            }
	        });
    	}
        next();
    },
    beforeRouteUpdate (to, from, next) {
        // 在当前路由改变，但是改组件被复用时调用
        // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
        // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
        // 可以访问组件实例 `this`
        window.scrollTo(0, 0);
        next();
    },
    mounted() {
    	this.$nextTick(() => {

    		if(this.did == '1342427079651483648' || this.did == '1344126430308216832') {
    			this.timeCountModel = true;
    			this.timeCountModelHandle();
    		}

    		setTimeout(() => {
    			if(this.detail.siteType && this.detail.siteType == 2) return;
    			let conentHeight = document.querySelector('.item_conent').offsetHeight;

    			if(conentHeight < window.innerHeight + 50) {
    				this.view_all = false;
    				this.styleObj = {
						height: 'auto',
						overflow: 'auto'
					}
    			}
    		}, 2000);
    	});

    },
	methods: {
		timeCountModelHandle() {
			if(this.constTimeCount > 0) {
	            this.timer = setInterval(() => {
		            this.constTimeCount--;
		            if(this.constTimeCount == 0) {
		               	this.clearTimer();
		               	this.timeCountModel = false;
		            }
		        }, 1000);
	        } else {
	          	this.clearTimer();
	        }
		},
		clearTimer() {
        	clearInterval(this.timer);
        },
		getDetailItem() {
			let params = {
				did: this.did,
				newsId: this.tid,
				channelId: this.cid
			};
			this.$store.dispatch('getDetailItem', params).then((data) => {
				this.$store.commit({
                   type: 'SETDETAILPRS',
                   detailPrs: 0
                });
            });
		},
		getXiGuangDetailItem() {
			let params = {
				id: this.tid,
			};
			this.$store.dispatch('getXiGuangDetailItem', params).then((data) => {
				this.$store.commit({
                   type: 'SETDETAILPRS',
                   detailPrs: 0
                });
            })
		},
		loadItems() {
			if(this.newsApiUpstream == 'xiguang') this.getXiGuangDetailItem();
			else this.getDetailItem();
		},
		viewAll() {
			this.styleObj = {
				height: 'auto',
				overflow: 'auto'
			}
			this.view_all = false;
			OUPENGLOGGER({
	            action: 'fulltext_click',
	            payload: {
	                id: this.getCode(this.cid),
	                title: this.getTitle(this.cid),
	                type: 'channel',
	                pos: 'detail'
	            }
	        });
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
		getTitle(id) {
            let title = '';
            let data = this.$store.state.common.channels;
            for(let cid in data) {
                if(id == data[cid].id)
                    title = data[cid].title;
            }
            return title;
        },
		// closeAds() {
		// 	this.showDetailBottomAds = false;
		// }
		returnHome() {
			storage.setSession('RETURNHOME', true);
			storage.set('isTabAlertAd', true);
			let channels = this.$store.state.common.channels;
			OUPENGLOGGER({
	            action: 'backhome_click',
	            payload: {
	                id: this.getCode(this.cid),
	                title: this.getTitle(this.cid),
	                type: 'channel',
	                pos: 'detail'
	            }
	        });
	        window.scrollTo(0, 0);

            setTimeout(() => {
		        let origin = window.location.origin;
	            window.location.href = origin + `/?did=${this.did}&first=off`;
            }, 300);
			// this.$router.push({name: 'channel', params: {cid: channels[0].id}, query: {did: this.did, first: 'off'}});
		},
		nextDetail() {
			OUPENGLOGGER({
	            action: 'next_click',
	            payload: {
	                id: this.getCode(this.cid),
	                title: this.getTitle(this.cid),
	                type: 'channel',
	                pos: 'detail'
	            }
	        });

			if(config.did == '1199626744223174656' || config.did == '1202163185784422400') {
				let taskNews = storage.getSession('taskNews') || null;
                let taskNewsNum = taskNews ? taskNews : 0;
                if(taskNewsNum < 3) {
                    storage.setSession('taskNews', taskNewsNum += 1);
                }
			}

	        let popIndex = parseInt(this.$route.query.ipopIndex) || 0;
	        popIndex++;
	        window.location.href = `/detail/cid/${this.cid}/tid/${this.detail.nextId}/?did=${this.did}&first=off&ipopIndex=${popIndex}`;
			// this.$router.replace({name: 'detail', params: {cid: this.cid, tid: this.detail.nextId}, query: {did: this.did, first: 'off'}});
		},
		closePopAd() {
			this.isShowAdsPopDerself = false;
		}
	},
	activated() {
        this.active = true;
    },
    deactivated() {
        this.active = false;
    }
}
</script>

<style lang="scss" scoped>
.detail_container {
	width: 100%;
	background: #FFFFFF !important;
}

.conent {
	width: 100%;
	/* margin-top: 0.44rem; */
	position: relative;
}

.detail-slot-bottom {
	display: block;
	width: 100%;
	position: fixed;
	bottom: 0;
	left: 0;
	z-index: 99;
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
	    z-index: 99;
	    color: rgb(255, 255, 255);
	    font-size: 0.1rem;
	}
}

.view_all {
	width: 100%;
	position: absolute;
	bottom: 0;
	height: 0.6rem;
	text-align: center;
	line-height: 0.6rem;
	background: linear-gradient(rgba(255,255,255,0.00) 0%, #FFFFFF 60%);
	background: -webkit-linear-gradient(rgba(255,255,255,0.00) 0%, #FFFFFF 60%);
	font-family: PingFangSC-Medium;
	font-size: 0.16rem;
	color: #EE5455;
	letter-spacing: 0;
	z-index: 5;
	p{
		font-family: PingFangSC-Medium;
		z-index: 9;
		img {
			width: 0.12rem;
			height: 0.1rem;
			margin-left: 0.05rem;
			vertical-align:middle;
		}
	}
}
.detail-bar {
	padding: 0.2rem;
	display: flex;
	justify-content: space-around;
	p {
		width: 42.7%;
		height: 0.35rem;
		border: 1px solid #EE5455;
		border-radius: 100px;
		font-family: DroidSansFallback;
		font-size: 0.14rem;
		color: #EE5455;
		text-align: center;
		line-height: 0.35rem;
	}
}

.detail-adpop {
	width: 100%;
	height: 100%;
	z-index: 98;
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
		position: absolute;
		/* right: 46%;
        top: 50%; */
        right: 0;
        top: 0;
		/* font-size: 40px; */
		color: #fff;
		/* transform: rotate(-45deg); */
		/* width: 20px; */
		background: rgba(0, 0, 0, 0.5);
		padding: 0.05rem 0.1rem;
		height: 20px;
		line-height: 20px;
		text-align: center;
	}
}
.const-time {
	width: 100%;
	font-size: 14px;
    color: rgb(0, 0, 205);
	text-align: center;
	position: fixed;
	bottom: 1rem;
	left: 0;
}
</style>