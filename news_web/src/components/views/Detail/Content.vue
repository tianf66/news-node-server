<template>
	<div class="item_container">
		<div class="item">
			<p class="title">{{detail.title}}</p>
			<p class="author"><span>{{detail.author}}</span><span v-show="!(did == '1367777574511112192' || did == '1366614353280253952')">{{detail.createTime}}</span></p>
			<div style="width: 100%;" v-if="ads.detailNewsStart && ads.detailNewsStart.id">
				<template v-for="(itemAd, index) in AdsDetailNewsStart">
					<ads-block :aid="itemAd.id" :clickCount="itemAd.clickCount" :adsType="'detailNewsStart'" :immediate="true" type="detail"></ads-block>
				</template>
			</div>
		</div>
		<div class="item_conent">
			<div v-show="false" v-html="detail.content" ref="element"></div>
			<template v-for="item in contentHTML">
				<div v-if="item.p" v-html="item.p" class="conent_html" ref="conent_html"></div>
				<template v-if="item.adsArray" v-for="(itemAd, index) in item.adsArray">
					<ads-block v-if="itemAd" :aid="itemAd.id" :clickCount="itemAd.clickCount" :adsType="'detailNewsMiddle'"></ads-block>
				</template>
			</template>
		</div>
	</div>
</template>

<script>
import AdsBlock from '@/components/ads/AdsBlock.vue';
export default {
	components: {
		AdsBlock
	},
	data() {
		return {
			contentHTML: []
		}
	},
	props: {
		detail: Object
	},
	watch: {
		'$route': function(to, from) {
			this.contentHTML = [];
			if(to.name == 'detail' && from.name == 'channel')
				this.loadContent();
			if(to.name == 'detail' && from.name =='detail')
				this.loadContent();
        }
	},
	computed: {
		ads() {
        	return this.$store.state.common.adConfig;
        },
        AdsDetailNewsStart() {
        	let adsNewsStart = this.ads.detailNewsStart;
        	let adsList = adsNewsStart && adsNewsStart.id && adsNewsStart.id.split(','),
        		clickCountList = adsNewsStart && adsNewsStart.adClickTime && adsNewsStart.adClickTime.split(','),
        		list = [];
        	adsList.forEach((item, index) => {
        		list.push({id: item, clickCount: clickCountList[index]});
        	});
        	return list;
        },
        did() {
			return this.$route.query.did
		}
	},
	mounted() {
		this.loadContent();
	},
	methods: {
		loadContent() {
			setTimeout(() => {
				this.$nextTick(() => {
					let HTMLlist = this.$refs.element.children;
					let adConstIndex = 0;
					if(HTMLlist.length == 1) {
						HTMLlist = HTMLlist[0].children;
					}

					for(let i = 0; i < HTMLlist.length; i++) {

						let item = new Object();

						item.p = HTMLlist.item(i).outerHTML;
						this.contentHTML.push(item);

						if(config.did == '1323206074580066304') {
							if(adConstIndex <= 4 && (!HTMLlist.item(i).outerHTML.indexOf('img') > -1 || HTMLlist.item(i).outerHTML.length > 50) && i % 2 === 1) {
								adConstIndex++;
								this.contentHTML.push({
									adsArray: ['-582781515', '2147456423']
								});
							}
						}
					}
					//暂时将content中部广告插入第二个片段后;
					if(this.ads.detailNewsMiddle && this.ads.detailNewsMiddle.id) {
						let adsList = this.ads.detailNewsMiddle.id.split(','),
							clickCountList = this.ads.detailNewsMiddle.adClickTime.split(','),
				        	adNewsMiddlelist = [];
				        adsList.forEach((item, index) => {
				        	adNewsMiddlelist.push({id: item, clickCount: clickCountList[index]});
				        });
						let adsObj = {adsArray : adNewsMiddlelist};
						this.contentHTML.splice(2, 0, adsObj);
					}
					// console.log(this.contentHTML);
				});
			}, 1000);
		}
	}
}
</script>

<style lang="scss" scoped>
.item_container {
	width: 100%;
	.item {
        letter-spacing: 0.015rem;
        .title {
        	font-size: 20px;
			padding: 0.12rem;
        	font-weight: 600;
        	line-height: 0.3rem;
        }
        .author span {
			padding: 0.12rem;
        	font-family: PingFangSC-Regular;
			font-size: 12px;
			color: #C0C0C0;
        }
	}
	.item_conent {
		width: 100%;
		position: relative;
		margin-top: 0.2rem;
		.conent_html {
			font-size: 16px;
			font-family: PingFangSC-Regular;
			color: #333333;
			line-height: 0.25rem;
			letter-spacing: 0.01rem;
			padding: 0 0.12rem;
		}
	}
}
</style>

<style>
.conent_html img {
	width: 100% !important;
	height: auto !important;
}
.conent_html p {
	text-indent: 0 !important;
}
.conent_html .openText {
	display: none;
}
.conent_html div {
	padding: 0 !important;
}
.conent_html p {
	line-height: 0.3rem;
}
.ql-align-justify {
	font-size: 0.17rem !important;
}
</style>