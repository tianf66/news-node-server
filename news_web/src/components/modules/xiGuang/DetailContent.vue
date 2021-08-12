<template>
	<div class="item_container">
		<div class="item">
			<p class="title">{{detail.news_title}}</p>
			<p class="author"><span>{{detail.site_name}}</span><span>{{detail.pub_times}}</span></p>
			<div style="width: 100%;" v-if="ads.detailNewsStart && ads.detailNewsStart.id">
				<ads-block :aid="ads.detailNewsStart.id" :adsType="'detailNewsStart'" :immediate="true" type="detail"></ads-block>
			</div>
		</div>
		<div class="item_conent">
			<div class="conent_html" v-for="item in contentHTML">
				<p v-if="item.type == 'text'">{{item.data}}</p>
				<p v-if="item.type == 'img'"><img :src=item.data></p>
				<ads-block v-if="item.slot" :aid="item.slot" :adsType="'detailNewsMiddle'"></ads-block>
			</div>
		</div>
	</div>
</template>

<script>
import AdsBlock from '@/components/ads/AdsBlock.vue';
import dataCenter from '@/store/index.js';
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
        }
	},
	mounted() {
		this.loadContent();
	},
	methods: {
		loadContent() {
			setTimeout(() => {
				this.$nextTick(() => {
					let HTMLlist = this.detail.content;

					for(let i = 0; i < HTMLlist.length; i++) {

						this.contentHTML.push(HTMLlist[i]);
					}
					//暂时将content中部广告插入第二个片段后;
					if(this.ads.detailNewsMiddle && this.ads.detailNewsMiddle.id) {
						let adsObj = {slot : this.ads.detailNewsMiddle.id};
						this.contentHTML.splice(2, 0, adsObj);
					}
				});
				dataCenter.xiGuangReceiveLog({
					action_type: 1,
					data:[{
						id: this.detail.id,
						rtype: 'news'
					}]
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
	text-indent: 2 !important;
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
</style>