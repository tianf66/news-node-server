<template>
	<div class="item_container" @click="handleClick">
		<div class="item" v-if="item.list_images.length < 3">
			<div v-if="item.list_images.length" class="item_image" :style="{backgroundImage: 'url(' + item.list_images[0] + ')'}"></div>
			<div class="item_text" :style="item.list_images.length ? 'width: 60%' : 'width: 100%'">
				<p class="title" style="-webkit-box-orient: vertical;">{{item.news_title}}</p>
				<p class="bar">
					<span>{{item.news_source}}</span>
					<span>{{item.pub_times}}</span>
				</p>
			</div>
		</div>
		<div class="layouts" v-if="item.list_images.length >=3">
			<div class="title" style="-webkit-box-orient: vertical;">{{ item.news_title }}</div>
			<div class="img-wrapper">
				<div v-for="(image, index) in item.list_images" v-if="index <=2" class="item_image" :style="{backgroundImage: 'url(' + image + ')'}"></div>
			</div>
			<p class="bar">
				<span>{{item.news_source}}</span>
				<span>{{item.pub_times}}</span>
			</p>
		</div>
	</div>
</template>

<script>
import dataCenter from '@/store/index.js';
export default {
	name: 'channelItem',
	data() {
		return {
			sendedLog: false,
		}
	},
	props: {
		item: Object
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
		handleClick() {
			OUPENGLOGGER({
                action: 'list_to_detail',
                payload: {
                    id: this.cid,
                    title: this.cid,
                    type: 'channel',
                    pos: 'list'
                }
            });

            dataCenter.xiGuangReceiveLog({
				action_type: 2,
				data:[{
					id: this.item.id,
					rtype: 'news'
				}]
			});
			// this.$router.push({name: 'detail', params: {cid: this.cid, tid: this.item.id}, query: {did: this.did, first: 'off'}});
			window.location.href = `/detail/cid/${this.cid}/tid/${this.item.id}/?did=${this.did}&first=off`;
		},
		sendLog() {
            if(this.sendedLog) {
                window.removeEventListener('scroll', this.sendLog);
                this.sendedLog = false;
                return;
            }
            let $el = this.$el;
            let offsetViewTop = $el.getBoundingClientRect().top;
            if(offsetViewTop <= window.innerHeight && this.name !== 'detail') {
                this.$nextTick(() => {
                    this.imgTrack();
                });
            }
        },
        imgTrack() {
			this.sendedLog = true;
			// console.log(this.item.id, this.item.news_title)
			dataCenter.xiGuangReceiveLog({
				action_type: 1,
				data:[{
					id: this.item.id,
					rtype: 'news'
				}]
			});
        },
	},
	beforeDestroy() {
        window.removeEventListener('scroll', this.sendLog);
    },
	mounted() {
		this.sendLog();
        window.addEventListener('scroll', this.sendLog);
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
			padding: 0.15rem;
		}
	}
	.img-wrapper {
		/* width: 100%; */
		padding: 0 0.08rem;
		height: 0.9rem;
		margin-top: 0.1rem;
		display: flex;
		justify-content: space-around;
	}
}
</style>