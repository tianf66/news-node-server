<template>
    <section class="x-flot-point">
    <a :href="ads.clk_url">
        <img :src="ads_icon" />
    </a>
</section>
</template>

<script>
export default {
    name: 'adsFlotPoint',
    props: {
        ads: Object
    },
    data() {
        return {
            loaded: false,
            ads_icon: ''
        };
    },
    mounted() {
        let icon = this.ads.icon;
        let img = new Image();
        img.onload = function() {
            this.loaded = true;
        }.bind(this);

        this.ads_icon = icon;
        if(icon.indexOf('http') === 0) this.ads_icon = icon.split(':')[1];

        img.src = this.icon;
    }
};
</script>
<style lang="scss">
    .x-flot-point {
        width: .6rem;
        img {
            width: 100%;
            height: 100%;
        }
    }
</style>
