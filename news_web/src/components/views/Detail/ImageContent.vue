<template>
	<div class="item_container">
		<div class="item">
			<p class="title">{{detail.title}}</p>
			<p class="img"><img :src="detail.imgList[0]"></p>
		</div>
	</div>
</template>

<script>
export default {
	components: {},
	data() {
		return {}
	},
	props: {
		detail: Object
	},
	computed: {
		//
	},
	mounted() {
		//
	},
	methods: {
		//
	}
}
</script>

<style lang="scss" scoped>
.item_container {
	width: 100%;
	.item {
		width: 100%;
        letter-spacing: 0.015rem;
        .title {
        	font-size: 20px;
			padding: 0.12rem;
        	font-weight: 600;
        	line-height: 0.3rem;
        }
        .img {
        	display: block;
        	width: 95%;
        	margin: 0 auto;
        	img {
        		display: block;
        		width: 100%;
        		height: 100%;
        	}
        }
	}
}
</style>