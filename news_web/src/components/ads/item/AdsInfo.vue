<template>
<section class="x-wrapper x-info">
    <a :href="ads_url">
        <!-- ads_url -->
        <p class="wrapper"><img class="__ximg__ icon" :src="ads.icon" :alt="ads.title"/></p>
        <div class="text">
            <div class="title">{{ads.title}}</div>
            <div class="intro">{{ads.snippets}}</div>
        </div>
        <div class="x-tips">广告</div>
    </a>
</section>
</template>

<script>
export default {
    name: 'adsInfo',
    props: {
        ads: Object
    },
    data() {
        return {
            ads_url: '',
        };
    },
    mounted() {
        this.ads_url = this.ads.clk_url;
        if(this.ads.clk_url.indexOf('http') === 0) this.ads_url = this.ads.clk_url.split(':')[1];
    }
};
</script>

<style lang="scss">
.x-info {
    padding: 0.1rem;
    a {
        display: block;
        position: relative;
        overflow: hidden;
    }

    .wrapper {
        float: left;
        border-radius: 5px;
        width: 0.5rem;
        overflow: hidden;
    }

    .text {
        overflow: hidden;
        padding: 0 0.1rem;
        line-height: 1.5;
        text-align: left;
    }

    .title {
        font-size: 0.16rem;
        color: #333;
        /* @include ellipsis; */
    }

    .intro {
        font-size: 0.12rem;
        color: #8e8e8e;
        /* @include ellipsis; */
    }
}
</style>