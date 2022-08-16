<template>
<section class="x-interstitial">
    <a :href="ads.clk_url">
        <img :src="ads.interstitial"/>
        <div class="x-tips" ref="tips" v-show="showAdTips">广告</div>
    </a>
</section>
</template>

<script>
export default {
    name: 'adsInterstitial',
    props: {
        ads: Object
    },
    data() {
        return {
            showAdTips: false
        };
    },
    mounted() {
        setTimeout(() => {
            this.showAdTips = true;
        }, 1000);
    }
};
</script>

<style>
.x-interstitial a {
    display: block;
    position: relative;
}
.x-interstitial img {
    width: 100%;
}
</style>