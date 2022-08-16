<template>
    <section class="x-flot-point">
    	<div @click="adHanlde">
    		<img :src="adImgUrl" alt="">
    	</div>
	</section>
</template>

<script>
export default {
    name: 'adsFlot',
    data() {
        return {
        	adImgUrl: '',
        };
    },
    mounted() {
    	this.adImgUrl = `http://i.opfed.com/news/adAlert${Math.floor(Math.random() * 6 + 1)}.gif`;
    },
    methods: {
    	adHanlde() {
            let head = document.getElementsByTagName('head')[0];
            let script = document.createElement('script');
            script.setAttribute('id', 'myScript');
            script.setAttribute('appkey', 'ecb095f4152afc880d97a46e8a64df79');
            script.setAttribute('adSpaceKey', '8c95763d0d7477f37c30fa5e8a4f7fa4');
            script.src = '//activity.alitech.online/static/redEnvelopes.js';
            script.onload = script.onreadystatechange = function(){
                window.createElement();
                document.getElementById('iframeBox').style.zIndex = '999';
            };
            head.insertBefore( script, head.firstChild );
    	}
    }
};
</script>
<style lang="scss">
    .x-flot-point {
    	position: fixed;
    	top: 2.5rem;
    	right: 0.1rem;
        width: .6rem;
        z-index: 999;
        img {
            width: 100%;
            height: 100%;
        }
    }
</style>
