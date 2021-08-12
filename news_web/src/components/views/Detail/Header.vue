<template>
    <div>
        <div class="header-box" ref="header_box">
            <header class="detail-header">
                <div class="back" @click="backHandler">
                    <!-- <span class="sprite back-icon"></span> -->
                    <img class="back-icon" src="//i.opfed.com/news/return.png">
                </div>
            </header>
            <!-- 详情页顶部浮层广告 start -->
            <section v-if="ads.detailTopFloat && ads.detailTopFloat.id">
                <ads-block :aid="ads.detailTopFloat.id" :adsType="'detailTopFloat'" :immediate="true" :clickCount="ads.detailTopFloat.adClickTime"></ads-block>
            </section>
            <!-- 详情页顶部浮层广告 end -->
        </div>
        <div id="detailHeader" style=""></div>
    </div>
</template>

<script>
import AdsBlock from '@/components/ads/AdsBlock.vue';
export default {
    name: 'HeaderView',
    components: {
        AdsBlock
    },
    computed: {
        // query() {
        //     return this.$route.query;
        // }
        cid() {
            return this.$route.params.cid;
        },
        ads() {
            return this.$store.state.common.adConfig;
        }
    },
    mounted() {
        this.$nextTick(() => {
            if(this.ads.detailTopFloat && this.ads.detailTopFloat.id) {
                let timer = setInterval(() => {
                    let headerHeight = this.$refs.header_box.offsetHeight;
                    let styleHeight = parseInt(this.$store.state.ads.styleHeight) || null;
                    document.getElementById("detailHeader").style.height = `${headerHeight + styleHeight}px`;

                    if(headerHeight && styleHeight) {
                        clearInterval(timer);
                    }
                }, 100);
            } else {
                let headerHeight = this.$refs.header_box.offsetHeight;
                document.getElementById("detailHeader").style.height = `${headerHeight}px`;
            }
        });
    },
    methods: {
        getTitle(id) {
            let title = '';
            let data = this.$store.state.common.channels;
            for(let cid in data) {
                if(id == data[cid].id)
                    title = data[cid].title;
            }
            return title;
        },
        getCode(id) {
            let code = '';
            let data = this.$store.state.common.channels;
            for(let cid in data) {
                if(id == data[cid].id)
                    code = data[cid].code;
            }
            return code;
        },
        backHandler() {
            this.$store.commit({
                type: 'SETDETAILPRS',
                detailPrs: -1
            });
            OUPENGLOGGER({
                action: 'back_click',
                payload: {
                    id: this.getCode(this.cid),
                    title: this.getTitle(this.cid),
                    type: 'channel',
                    pos: 'detail'
                }
            });
           this.$router.go(-1);
        },
    }
};
</script>

<style lang="scss">
.header-box {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 97;
    width: 100%;
    background-color: #FFFFFF;
}
.detail-header {
    width: 100%;
    height: 0.44rem;
    line-height: 0.44rem;
    padding: 0 0.6rem 0 0.4rem;
    color: #fff;
    .back {
        width: 0.4rem;
        height: 0.44rem;
        position: absolute;
        left: 0;
        top: 0;
    }
    .back-icon {
        position: absolute;
        top: 0.14rem;
        left: 0.1rem;
        display: inline-block;
        width: 0.19rem;
        height: 0.16rem;
        vertical-align: text-top;
        background-size: 2.26rem auto;
        background-position: -0.3rem -2.52rem;
    }
}
</style>