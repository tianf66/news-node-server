<template>
	<div class="news-relate">
		<div class="news-word">
			<h3>{{siteType == 2 ? '热门图集' : '热点新闻'}}</h3>
		</div>
		<template v-for="(item, index) in lists">
			<div class="news-item" @click="hanldeItem(item)" v-if="!item.slot">
				<div class="layout" v-if="item.imgList && item.imgList.length < 3">
					<div class="layout-img" v-if="!item.imgList.length == 0">
						<div v-for="(image, index) in item.imgList" v-if="index < 1" class="item_image" :style="{backgroundImage: 'url(' + image + ')'}"></div>
					</div>
					<div class="layout-title" :style="item.imgList && item.imgList.length ? 'width: 66.7%' : 'width: 100%'">
						<p class="nr-title" style="-webkit-box-orient: vertical;">{{ item.title}}</p>
						<div class="n-desc">
							<span>{{ item.author }}</span>
							<span style="margin-left: 0.1rem;">{{ item.createTime }}</span>
						</div>
					</div>
				</div>
				<div class="laouyts" v-if="item.imgList && item.imgList.length >=3">
					<div class="nr-title" style="-webkit-box-orient: vertical;">{{ item.title }}</div>
					<div class="n-img-wrapper">
						<div v-for="(image, index) in item.imgList" v-if="index < 3" class="item_image" :style="{backgroundImage: 'url(' + image + ')'}"></div>
					</div>
					<div class="n-desc">
						<span>{{ item.author }}</span>
						<span style="margin-left: 0.1rem;">{{ item.createTime }}</span>
					</div>
				</div>
			</div>
			<div v-if="item.slot">
				<ads-block :aid=item.slot :active="true" :clickCount="item.clickCount" :adsType="'detailFeed'"></ads-block>
			</div>
		</template>
		<div class="prompt" v-show="isDownFeed">{{prompt}}</div>
	</div>
</template>

<script>
import AdsBlock from '@/components/ads/AdsBlock.vue';
import storage from '@/utils/storage.js';
export default {
    name: 'newsRelate',
    components: {
        AdsBlock
    },
    data () {
        return {
        	loading: true,
        	isDownFeed: config.feedStatus === 1,
        	prompt: '加载中...'
        };
    },
    props: {
		siteType: Number
	},
    computed: {
        lists() {
        	return this.$store.state.detail.newsRelateList;
        },
        params() {
        	return this.$route.params;
        },
        did() {
        	return this.$route.query.did;
        }
    },
    mounted() {
        this.getData();
        window.addEventListener('scroll', this.loadData, false);
    },
    methods: {
        getData() {
        	let params = {did: this.did, newsCount: window.config.detailRecommendNewsCount};

        	/*淘粉吧CPS2 定制 start*/
        	if(window.config.did == '1229680885536333824') {
        		params.newsCount = 4;
        	}
        	/*淘粉吧CPS2 定制 end*/

        	this.loading = true;
            this.$store.dispatch('loadNewRelate', params).then((data) => {
                this.loading = data.length == 0 ? true : false;
                this.prompt = data.length == 0 ? '暂无更多数据' : '加载中...';
            });
        },
        hanldeItem(item) {
        	OUPENGLOGGER({
		        action: 'feed_click',
		        payload: {
		            id: this.getCode(this.params.cid),
		            title: this.getTitle(this.params.cid),
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
		    window.location.href = `/detail/cid/${item.channelId}/tid/${item.id}/?did=${this.did}&first=off&ipopIndex=${popIndex}`;
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
        loadData() {
        	if(this.$route.name !== 'detail') return;

            if(!this.loading && this.isDownFeed) {
                let bodyTop = document.body.getBoundingClientRect().top;
                let bodyOffsetHeight = document.body.offsetHeight;
                let innerHeight = window.innerHeight;
                if(bodyOffsetHeight - Math.abs(bodyTop) <= 1.5 * innerHeight) {
                    this.getData();
                    OUPENGLOGGER({
		                action: 'feed_load',
		                payload: {
		                    id: this.getCode(this.params.cid),
		                    title: this.getTitle(this.params.cid),
		                    type: 'channel',
		                    pos: 'detail'
		                }
		            });
                }
            }
        }
    },
    destroyed(){
	    window.removeEventListener('scroll', this.loadData, false);
	}
};
</script>

<style lang="scss">
.news-relate {
	width: 100%;
	padding: 0rem 0 .8rem;
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
		font-size: 0.14rem;
	}
}
</style>
