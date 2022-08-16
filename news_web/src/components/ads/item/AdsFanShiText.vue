<template></template>

<script>
import dataCenter from '@/store/index.js';
import imgTrack from '@/components/ads/imgTrack.js';

export default {
	props: {
		aid: '',
	},
	mounted() {
		dataCenter.getAds(this.aid, false, 'detailFanshiWenzilian').then((ads) => {
			let impr_track = ads.impr_track[0],
				clk_track = ads.clk_track[0];

			window.onload = this._xuexianJsSDK(impr_track, clk_track);
       	}, () => {
       	    // TODO
       	});
	},
	methods: {
		getTitle(id) {
            let title = '';
            let data = this.$store.state.common.channels;
            for(let cid in data) {
                if(id == data[cid].id)
                    title = data[cid].title;
            }
            return title;
        },
		_xuexianJsSDK(impr_track, clk_track) {
			let _this = this;
			let script = document.createElement("script"),
			    date = (new Date).getTime(),
			  	tid = this.$route.params.tid,
				cid = this.getTitle(this.$route.params.cid);

			script.src = "https://nbrecsys.4paradigm.com/resource/cus/xuexian/xuexian.min.js?random=" + date;

			script.onload = () => {
				//范式JS 回调
				/*
					tid文章ID,
					cid频道ID,需为中文
					5000070是媒体ID
				*/
				XueXian("", tid, "5000070", cid);

				//获取所有超链接的class
				setTimeout(() => {
					let el = document.querySelectorAll(".lk-texthref");

					if(el.length) {

						if(impr_track) {//这里上报广告展示
							imgTrack(impr_track);
						}

						el.forEach((item, index) => {
							item.addEventListener('click', () => { // 这里上报广告点击
								imgTrack(clk_track);
							});
						});
					}

				}, 1500);
			},
			document.head.appendChild(script);
		}
	}
}
</script>