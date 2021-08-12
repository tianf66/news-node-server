<template>
	<div class="news-relate">
		<div ref="loadFanShiItem"></div>
		<div class="news-word">
			<h3>热点新闻</h3>
		</div>
		<template v-for="(item, index) in lists">
			<div v-if="!item.slot" class="news-item" @click="hanldeItem(item)">
				<div class="layout" v-if="item.cover_url.length < 3">
					<div class="layout-img" v-if="!item.cover_url.length == 0">
						<div v-for="(image, index) in item.cover_url" v-if="index < 1" class="item_image" :style="{backgroundImage: 'url(' + image + ')'}"></div>
					</div>
					<div class="layout-title" :style="item.cover_url.length ? 'width: 66.7%' : 'width: 100%'">
						<p class="nr-title" style="-webkit-box-orient: vertical;">{{ item.title}}</p>
						<div class="n-desc">
							<span>{{ item.author }}</span>
							<span style="margin-left: 0.1rem;">{{ item.createTime }}</span>
						</div>
					</div>
				</div>
				<div class="laouyts" v-if="item.cover_url.length >=3">
					<div class="nr-title" style="-webkit-box-orient: vertical;">{{ item.title }}</div>
					<div class="n-img-wrapper">
						<div v-for="(image, index) in item.cover_url" v-if="index < 3" class="item_image" :style="{backgroundImage: 'url(' + image + ')'}"></div>
					</div>
					<div class="n-desc">
						<span>{{ item.author }}</span>
						<span style="margin-left: 0.1rem;">{{ item.createTime }}</span>
					</div>
				</div>
			</div>
			<div v-if="item.slot">
				<ads-block :aid=item.slot :active="true" :adsType="'detailFeed'"></ads-block>
			</div>
		</template>
		<div class="prompt">{{prompt}}</div>
	</div>
</template>

<script>
import AdsBlock from '@/components/ads/AdsBlock.vue';
// import dataCenter from '@/store/index.js';
import storage from '@/utils/storage.js';

let ads = window.config.adList;
let listCount = 0, adIndex = 0, nowIndex = 0;
let listFirst = ads.detailFeed && ads.detailFeed.id ? ads.detailFeed.id.split(',') : null;
let listCenter = null;
let listAdInterval = 0;
let firstAdInterval = listFirst && ads.detailFeed.interval ? ads.detailFeed.interval : 0;
let adInterval = listAdInterval;
if(listFirst && firstAdInterval) adInterval = firstAdInterval;

export default {
    name: 'newsRelate',
    components: {
        AdsBlock
    },
    data () {
        return {
        	loading: true,
        	prompt: '暂无更多数据',
        	lists: []
        };
    },
    computed: {
    	params() {
    		return this.$route.params;
    	},
    	query() {
    		return this.$route.query;
    	}
    },
    mounted() {
        this.getData();
    },
    methods: {
    	getListSlotId() {
		    if(listFirst) {
		        let maxAds = ads.detailFeed.showCount.split(',');
		        for(let i = 0; i < maxAds.length; i++) {
		            maxAds[i] = Number(maxAds[i]);
		        }
		        if(adIndex >= maxAds[nowIndex]) {
		            nowIndex++;
		            adIndex = 0;
		            if(nowIndex >= maxAds.length) {
		                listFirst = null;
		                firstAdInterval = 0;
		                nowIndex = 0;
		            }
		        }
		        if(listFirst) {
		            adIndex++;
		            listCount = 0;
		            if(nowIndex == maxAds.length -1 && adIndex >= maxAds[nowIndex]) {
		                adInterval = listAdInterval;
		            }
		            return {id: listFirst[nowIndex], pos: 'listStart'};
		        }
		    }
		    if(!listFirst && listCenter) {
		        if(adIndex >= listCenter.length) adIndex = 0;
		        return {id: listCenter[adIndex++], pos: 'listMiddle'};
		    }
		},
        getData() {
        	let _this = this;
        	let params = {id: this.tid};

        	this.loading = true;

        	let el = this.$refs.loadFanShiItem;
        	let script = document.createElement('script');
        	script.charset = "utf-8";
        	script.id = "ParadigmSDKv3";
        	script.src = "https://nbrecsys.4paradigm.com/sdk/js/ParadigmSDK_v3.js";
			el.appendChild(script);

        	let div = document.createElement('div');
        	div.id = "83f29927df7b403eb77f1fd3569275db";
        	el.appendChild(div);
        	this.$nextTick(() => {
        		setTimeout(() => {
        			ParadigmSDKv3.init("76a3e29eedd141b08a81ad56e5f7db33");//###SDK初始化
				    ParadigmSDKv3.getRecommItems(9793, 16167).then(function(recommItems) {
				        //#####请在这里处理推荐结果#####
				        // console.log(recommItems);
				        let columns = [], listCount = 0;

				        if(config.did == '1202163185784422400' || config.did == '1206855742204223488' || config.did =='1206857076424855552' || config.did == '1209739253827522560' || config.did == '1210443863084814336' || config.did == '1210445359906304000' || config.did == '1215216609719369728') {//惠头条SG 定制为3条推荐内容
				        	recommItems = recommItems.slice(1, 4);
				        }

				        if(config.did == '1216915316370079744') {
				        	recommItems = recommItems.slice(1, 6);
				        }

					    for(let i = 0; i < recommItems.length; i++) {
					        listCount++;
					        recommItems[i].cover_url = recommItems[i].cover_url ? recommItems[i].cover_url.split(',') : '';
					        columns.push(recommItems[i]);
					        if(listCount % adInterval === 0) {
					            let getSlot = _this.getListSlotId();
					            columns.push({
					                slot: getSlot.id
					            });
					        }
					    }
					    // console.log(columns);
    					_this.lists = columns;
				    });
        		}, 500);
        	});
        },
        hanldeItem(item) {
        	OUPENGLOGGER({
		        action: 'feed_click',
		        payload: {
		            id: '',
		            title: this.params.cid,
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

		    // this.$router.replace({name: 'detail', params: {cid: item.channelId, tid: item.id}, query: {did: this.did, first: 'off'}});
		    let popIndex = parseInt(this.$route.query.ipopIndex) || 0;
	        popIndex++;
	        let urls = item.url.split('/');
	        let _url = `${window.location.origin}/detail/cid/${urls[5]}/tid/${urls[7].split('?')[0]}/?did=${this.query.did}&first=off`;
	        window.location.href = _url;
		    // window.location.href = `/detail/cid/${this.cid}/tid/${item.id}/?did=${this.did}&first=off&ipopIndex=${popIndex}`;
        },
        // loadData() {
        // 	if(this.$route.name !== 'detail') return;

        //     if(!this.loading) {
        //         let bodyTop = document.body.getBoundingClientRect().top;
        //         let bodyOffsetHeight = document.body.offsetHeight;
        //         let innerHeight = window.innerHeight;
        //         if(bodyOffsetHeight - Math.abs(bodyTop) <= 1.5 * innerHeight) {
        //             this.getData();
        //             OUPENGLOGGER({
		      //           action: 'feed_load',
		      //           payload: {
		      //               id: '',
		      //               title: this.params.cid,
		      //               type: 'channel',
		      //               pos: 'detail'
		      //           }
		      //       });
        //         }
        //     }
        // }
    },
    destroyed(){
	    // window.removeEventListener('scroll', this.loadData, false);
	}
};
</script>

<style lang="scss">
.news-relate {
	width: 100%;
	padding: 0rem 0 0.2rem;
	background-color: #fff;
	.news-word {
		margin: 0.1rem 0.2rem;
		border-bottom: 2px solid #EDEDED;
		h3 {
			width: 25%;
			text-align: center;
			height: 0.3rem;
			border-bottom: 2px solid #EE5455;
		}
	}
	.nr-title {
		font-weight: 700;
		width: 100%;
		font-size: 0.18rem;
	    max-height: 0.48rem;
	    line-height: 0.24rem;
	    padding: 0 0.05rem;
	    color: rgb(33, 33, 33);
	    display: -webkit-box;
	    -webkit-line-clamp: 2;
	    -webkit-box-orient: vertical;
	    white-space: normal;
	    overflow: hidden;
	    word-break: break-word;
	}
	.n-img-wrapper {
		width: 100%;
		height: 0.8rem;
		margin-top: 0.05rem;
		display: flex;
		justify-content: space-around;
	}
	.n-desc {
		font-size: 0.12rem;
		padding: 0 0.05rem;
		margin-top: 0.1rem;
    	color: rgb(153, 153, 153);
	}
	.layout {
		display: flex;
	    /* justify-content: center; */
	    align-items: center;
	    /* padding: 0.2rem 0; */
		.layout-img {
			width: 33.3%;
			height: 0.8rem;
			.item_image {
				width: 100%;
			}
		}
	}
	.layout-title {
		padding-left: 0.05rem;
		width: 66.7%;
		.n-desc {
			margin-top: 0.15rem;
		}
	}
	.item_image {
		width: 31%;
        height: 100%;
        position: relative;
        background-repeat: no-repeat;
        background-position: center center;
        background-size:cover ;
        background-color: #EEEEEE;
	}
	.news-item{
		display: block;
		padding: 0.1rem;
	}
	.prompt {
		text-align: center;
		font-size: 0.17rem;
	}
}
</style>
