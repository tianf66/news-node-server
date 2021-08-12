<template>
    <section class="const-flot-point" v-if="did == '0'">
    <a href="https://interaction.clotfun.online/dragon?appkey=d398c3e7cfaf7e0986b5ff9f7623a601&adSpaceKey=6bd5a3816806ad7599132bcbf9201acc&from=H5&1=1">
        <img src="//i.opfed.com/news/150-150.png" />
    </a>
</section>
</template>

<script>
export default {
    name: 'constFloatAd',
    data() {
        return {};
    },
    computed: {
        did() {
            return config.did;
        },
    },
    mounted() {}
};
</script>
<style lang="scss">
    .const-flot-point {
        position: fixed;
        bottom: 1.7rem;
        z-index: 999999;
        right: 0;
        width: .6rem;
        img {
            width: 100%;
            height: 100%;
        }
    }
</style>
