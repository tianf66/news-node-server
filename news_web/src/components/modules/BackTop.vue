<template>
<div class="back-top" v-show="show" @click="backTop">
    <i class="icon-backTop"></i>
</div>
</template>

<script>
export default {
    name: 'BackTop',
    data() {
        return {
            show: false,
            params: {}
        };
    },
    computed: {
        cid() {
            return this.$route.params.cid;
        },
        name() {
            return this.$route.name;
        }
    },
    mounted() {
        window.addEventListener('scroll', this.scrollEndFallback);
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
        backTop() {
            window.scrollTo(0, 0);
            OUPENGLOGGER({
                action: 'top_click',
                payload: {
                    id: this.getCode(this.cid),
                    title: this.getTitle(this.cid),
                    type: 'channel',
                    pos: this.name == 'channel' ? 'list' : 'detail'
                }
            });
        },
        scrollEndFallback() {
            let bodyTop = Math.abs(document.body.getBoundingClientRect().top);
            let distance = window.innerHeight / 2;
            if(bodyTop > distance) {
                this.show = true;
            } else {
                this.show = false;
            }
        },
    }
};
</script>

<style lang="scss">
.back-top {
    z-index: 999;
    position: fixed;
    right: 0.14rem;
    bottom: 1.2rem;
    width: 0.4rem;
    height: 0.4rem;
    font-size: 0;
    text-align: center;
    vertical-align: middle;
    white-space: nowrap;
    border-radius: 50%;
    background-color: #fff;
    -webkit-box-shadow: 1px 1px 20px 3px rgba(0,0,0,0.5);
    box-shadow: 1px 1px 20px 3px rgba(0,0,0,0.5);
}

.icon-backTop {
    position: relative;
    display: inline-block;
    top: 0.05rem;
    width: 0.24rem;
    height: 0.3rem;
    vertical-align: middle;
}

.icon-backTop:before {
    content: "";
    position: absolute;
    left: 0.12rem;
    top: 0.03rem;
    width: 0.02rem;
    height: 0.24rem;
    background-color: #616161;
}

.icon-backTop:after {
    content: "";
    position: absolute;
    left: 0.04rem;
    top: 0.05rem;
    width: 0.16rem;
    height: 0.16rem;
    border: 2px solid #616161;
    border-right: none;
    border-bottom: none;
    transform: rotate(45deg);
    -webkit-transform: rotate(45deg)
}

</style>