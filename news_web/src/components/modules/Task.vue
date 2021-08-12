<template>
	<div class="task-box" v-if="words">
		<div v-if="!isOkTask">
			<div class="task" v-if="constSouGouDid">
				<!-- 普通提示语 -->
				<p v-if="isconstSouGouShow">还需体验{{timeCount}}秒</p>
				<p v-if="isconstSouGouShow">完成后获取更多奖励</p>
				<!-- 广告命中率比较高的提示语 -->
				<p v-if="!isconstSouGouShow">点击2次广告后获取更多金币</p>
				<p v-if="!isconstSouGouShow">还需体验{{timeCount}}秒</p>
			</div>
			<div class="task" v-if="did == '1199626744223174656'">
				<!-- 惠头条 -->
				<p>点击2篇文章或2次广告后获取更多金币</p>
				<p>已体验{{timeCount}}秒</p>
			</div>
			<div class="task" v-if="did == '1192351664439058432'">
				<!-- 阅读60s非定制版本 -->
				<p>还需体验{{timeCount}}S获取更多奖励</p>
			</div>
			<div class="task" v-if="words">
				<p>{{speechcraftContent}}</p>
				<p>还需体验{{timeCount}}秒</p>
			</div>
		</div>
		<p v-if="isOkTask">任务已完成</p>
	</div>
</template>

<script>
import storage from '@/utils/storage.js';
export default {
	name: 'Task',
	data() {
		return {
			taskNews: storage.getSession('taskNews') || 0,
			timeCount: storage.getSession('taskTime') == null ? 60 : storage.getSession('taskTime'),
			timer: null,
			isDown: true,
			isOkTask: false,
			isconstSouGouShow: true
		};
	},
	computed: {
		did() {
            return config.did;
        },
        words() {//定制底部任务栏 全部渠道did
        	// let did = this.did;
        	// let constDidList = ['1234392389649268736', '1234392433337180160', '1199626744223174656', '1192351664439058432', '1209739253827522560', '1216675817157677056', '1202163185784422400', '1231466140354314240', '1253611439520567296', '1253611471980150784', '1270966429490495488'];
        	// return constDidList.indexOf(did) > -1;
        	// let speechcraftStatus;
        	// if(config.did === '1245923128911712256' && config.speechcraftStatus === 1) {
        	// 	if(Math.ceil(Math.random() * 100) < 50) {
        	// 		speechcraftStatus = true;
        	// 	} else {
        	// 		speechcraftStatus = false;
        	// 	}
        	// } else {
        	// 	speechcraftStatus = config.speechcraftStatus && config.speechcraftStatus === 1 ? true : false;
        	// }
        	// return speechcraftStatus;
        	let flag = false,
        		status = config.speechcraftStatus || 2,
        		chance = config.speechcraftChance || 0;
        	if(status && status === 1 && (Math.floor(Math.random() * 100)+1 <= chance)) {
        		flag = true;
        	}
        	return flag;
        },
        constSouGouDid() {//定制底部任务栏 搜狗渠道did
        	let did = this.did;
        	let constSouGouDidList = ['1209739253827522560'];//惠头条SG4
        	return constSouGouDidList.indexOf(did) > -1;
        },
        speechcraftContent() {
        	return window.config.speechcraftContent || '需点击2次广告后完成任务';
        }
	},
	mounted() {

		this.resetHandle();

		if(this.taskNews == 3 && this.timeCount == 0) {
			this.isOkTask = true;
		}

		let CONSTSHOW = storage.getSession('CONSTSHOW');
		if(CONSTSHOW) {
			return this.isconstSouGouShow = CONSTSHOW;
		}

		if(Math.ceil(Math.random() * 100) < Number(50)) {
			this.isconstSouGouShow = true;
			storage.setSession('CONSTSHOW', this.isconstSouGouShow);
		} else {
			this.isconstSouGouShow = false;
			storage.setSession('CONSTSHOW', this.isconstSouGouShow);
		}
	},
	watch: {
		$route(_new, _old) {
			this.taskNews = storage.getSession('taskNews');

			if(this.taskNews == 3 && this.timeCount == 0) {
				this.isOkTask = true;
			}
		},
	},
	updated() {
	},
	methods: {
		resetHandle() {

			if(this.words) {
				if(this.isDown && this.timeCount > 0) {
	            	this.timer = setInterval(() => {
		                this.timeCount--;
		                storage.setSession('taskTime', this.timeCount);
		                if(this.timeCount == 0) {
		                	this.clearTimer();
		                	if(this.taskNews == 3) this.isOkTask = true;
		                }
		            }, 1000);
	            } else {
	            	this.clearTimer();
	            }
			}
        },
        clearTimer() {
        	clearInterval(this.timer);
        }
	}
};
</script>

<style scoped lang="scss">
	.task-box {
		width: 100%;
		color: white;
		padding: 0.08rem 0;
   		border-radius: 5px;
   		text-align: center;
		background-color: rgba(0, 0, 0, 0.5);
		.task {
			display: flex;
			justify-content: space-around;
		}
		p {
			font-size: 0.13rem;
			letter-spacing: 0.015rem;
		}
	}
</style>