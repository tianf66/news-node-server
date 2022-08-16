<template>
	<div class="task-box" v-if="words && isShow">
		<div v-if="!isOkTask">
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
			taskNewsTimer: null,
			isDown: true,
			isOkTask: false,
			isconstSouGouShow: true
		};
	},
	computed: {
		did() {
            return config.did;
        },
		isShow() {
			return window.config.speechcraftStatus == 1;
		},
        words() {
        	let constTaskFlag = storage.getSession("CONSTTASKFLAG") || 0,
        		status = config.speechcraftStatus || 2,
        		chance = config.speechcraftChance || 0;
        	if(status && status === 1 && constTaskFlag === 0) {
				if((Math.floor(Math.random() * 100)+1 <= chance)) storage.setSession('CONSTTASKFLAG', 1);
        		else storage.setSession('CONSTTASKFLAG', 2);
        	}
        	return storage.getSession("CONSTTASKFLAG") === 1 ? true : false;
        },
        speechcraftContent() {
			let text = "";
			window.speechcraftContentFlat = window.config.speechcraftContent.indexOf("/") > -1 ? true : false;
			if(window.speechcraftContentFlat) {
				let list = window.config.speechcraftContent.split("/");
				window.taskCount = list[1].charAt(0);
				text = `${list[0].substr(0, list[0].length - 1)}${this.taskNews}/${list[1]}`;
			} else {
				text = window.config.speechcraftContent;
			}
        	return text || '需点击2次广告后完成任务';
        }
	},
	mounted() {

		this.resetHandle();

		if(this.taskNews == window.taskCount && this.timeCount == 0) {
			this.isOkTask = true;
		}

		if(window.speechcraftContentFlat) {
			this.watchTaskNews();
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

			if(this.taskNews == window.taskCount && this.timeCount == 0) {
				this.isOkTask = true;
			}
		}
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
		                	clearInterval(this.timer);
		                	if(this.taskNews == window.taskCount) this.isOkTask = true;
		                }
		            }, 1000);
	            } else {
	            	clearInterval(this.timer);
	            }
			}
        },
		watchTaskNews() {
			if(this.words) {
				if(!this.isOkTask) {
	            	this.taskNewsTimer = setInterval(() => {
		                this.taskNews = storage.getSession('taskNews') || 0;
		            }, 100);
	            } else {
	            	clearInterval(this.taskNewsTimer);
	            }
			}
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