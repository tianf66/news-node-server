<template>
	<div class="item_container" @click="handleClick">
		<div class="item" v-if="item.imgList.length < 3">
			<div v-if="item.imgList.length" class="item_image" :style="{backgroundImage: 'url(' + item.imgList[0] + ')'}"></div>
			<div class="item_text" :style="item.imgList.length ? 'width: 60%' : 'width: 100%'">
				<p class="title" style="-webkit-box-orient: vertical;">{{item.title}}</p>
				<p class="bar" v-if="item.siteType != 2">
					<span>{{item.author}}</span>
					<!-- <span v-show="!(did == '1367777574511112192' || did == '1366614353280253952')">{{item.createTime}}</span> -->
				</p>
			</div>
		</div>
		<div class="layouts" v-if="item.imgList.length >=3">
			<div class="title" :class="item.siteType == 2 ? 'title-line':''" style="-webkit-box-orient: vertical;">{{ item.title }}</div>
			<div class="img-wrapper">
				<div v-for="(image, index) in item.imgList" v-if="index <=2" class="item_image" :style="{backgroundImage: 'url(' + image + ')'}"></div>
			</div>
			<p class="bar" v-if="item.siteType != 2">
				<span>{{item.author}}</span>
				<!-- <span v-show="!(did == '1367777574511112192' || did == '1366614353280253952')">{{item.createTime}}</span> -->
			</p>
		</div>
	</div>
</template>

<script>
import storage from '@/utils/storage.js';
export default {
	name: 'channelItem',
	data() {
		return {

		}
	},
	props: {
		item: Object,
		index: Number
	},
	computed: {
		did() {
			return this.$route.query.did
		},
		cid() {
			return this.$route.params.cid;
		}
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
        getCode(id) {
            let code = '';
            let data = this.$store.state.common.channels;
            for(let cid in data) {
                if(id == data[cid].id)
                    code = data[cid].code;
            }
            return code;
        },
		handleClick() {

			if(window.speechcraftContentFlat) {
				let taskNews = storage.getSession('taskNews') || null;
                let taskNewsNum = taskNews ? taskNews : 0;
                if(taskNewsNum < window.taskCount) {
                    storage.setSession('taskNews', taskNewsNum += 1);
                }
			}

			OUPENGLOGGER({
                action: 'list_to_detail',
                payload: {
                    id: this.getCode(this.cid),
                    title: this.getTitle(this.cid),
                    type: 'channel',
                    pos: 'list'
                }
            });

			/**  	中青 渠道定制 start */
			if(config.did === '1422083489825128448') {
				let a = [], b = [], c = [], index = parseInt(this.index);
				for(let i = 1; i < 200; i++) {
					a.push((i - 1) * 3);
					b.push((i - 1) * 3 + 1);
					c.push((i - 1) * 3 + 2);
				}
				if(a.indexOf(index) > -1) {
					location.href = `https://v2.opgirl.cn/?did=620`;
				}
				if(b.indexOf(index) > -1) {
					location.href = `https://v2.opgirl.cn/?did=621`;
				}
				if(c.indexOf(index) > -1) {
					location.href = `https://v2.opgirl.cn/?did=622`;
				}
				return;
			}
			/**   中青 渠道定制 end */

			// this.$router.push({name: 'detail', params: {cid: this.cid, tid: this.item.id}, query: {did: this.did, first: 'off'}});
			setTimeout(() => {
				window.location.href = `/detail/cid/${this.cid}/tid/${this.item.id}/?did=${this.did}&first=off`;
			}, 10);
		}
	},
	mounted() {
	}
}
</script>

<style lang="scss" scoped>
.item_container {
	width: 100%;
	background: #FFFFFF;
	.item {
		padding: 0 0.1rem;
		height: 1.1rem;
		display: flex;
		justify-content: center;
		align-items: center;
		border-bottom: 5px solid #F7F7F7;
	}
	.item_text {
		width: 60%;
		height: 1rem;
		position: relative;
		padding: 0.15rem 0.15rem 0;
		font-family: DroidSansFallback;
		font-size: 0.15rem;
		color: #212121;
        letter-spacing: 0.015rem;
	}
	.title {
        font-size: 0.16rem;
        overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
    }
    .title-line {
    	-webkit-line-clamp: 1 !important;
    }
    .bar {
        font-size: 0.1rem;
        position: absolute;
        bottom: 0.15rem;
        font-family: DroidSansFallback;
		font-size: 0.11rem;
		color: #A1A0A0;
		letter-spacing: 0.005rem;
    }
	.item_image {
		width: 31.5%;
        height: .9rem;
        position: relative;
        background-repeat: no-repeat;
        background-position: center center;
        background-size:cover ;
        background-color: #EEEEEE;
	}
	.layouts {
		border-bottom: 5px solid #F7F7F7;
		.title {
			padding: 0.15rem 0.15rem 0;
		}
		.bar {
			position: static;
			padding: 0 0.15rem 0.15rem;
		}
	}
	.img-wrapper {
		/* width: 100%; */
		padding: 0 0.08rem 0.15rem;
		height: 0.9rem;
		margin-top: 0.1rem;
		display: flex;
		justify-content: space-around;
	}
}
</style>