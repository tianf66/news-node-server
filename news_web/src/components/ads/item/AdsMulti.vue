<template>
<section class="x-wrapper x-multi">
    <div v-for="(item, index) in ads.meta_group" class="item">
        <a :href="item.link" class="link">
            <img :src="item.img" :alt="item.text" />
            <p class="ellipsis">{{item.text}}</p>
        </a>
    </div>
    <div class="x-tips">广告</div>
</section>
</template>

<script>
export default {
    name: 'adsMulti',
    props: {
        ads: Object
    }
};
</script>

<style lang="scss">
.x-multi {
    position: relative;
    &::after {
        clear: both;
        content: "\20";
        display: block;
    }
    .item {
        float: left;
        width: 32%;
        margin: 0 2% 7px 0;
        overflow: hidden;
        &:nth-child(3n) {
            margin-right: 0;
        }
    }
    .link {
        position: relative;
        display: block;
        // img {
        //     width: 100%;
        //     height: 100%;
        // }
        p {
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 0.2rem;
            line-height: 0.2rem;
            background: rgba(0, 0, 0, 0.7);
            color: #fff;
            text-align: center;
            font-size: 0.12rem;
        }
    }
}
</style>