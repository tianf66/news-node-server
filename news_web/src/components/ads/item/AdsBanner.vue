<template>
<section class="x-wrapper x-banner">
    <a @click="adsClick">
         <!-- :href="adsClick_url" -->
        <img class="__ximg__" :src="ads_banner" />
        <div v-show="loaded" class="x-tips">广告</div>
    </a>
</section>
</template>

<script>
export default {
    name: 'adsBanner',
    props: {
        ads: Object
    },
    data() {
        return {
            loaded: false,
            ads_banner: '',
            adsClick_url: ''
        };
    },
    mounted() {
        let banner = this.ads.banner;
        let img = new Image();
        img.onload = function() {
            this.loaded = true;
        }.bind(this);

        this.ads_banner = banner;
        this.adsClick_url = this.ads.clk_url;
        // if(this.ads.clk_url.indexOf('http') === 0) this.adsClick_url = this.ads.clk_url.split(':')[1];
        if(banner.indexOf('http') === 0) this.ads_banner = banner.split(':')[1];

        img.src = this.ads_banner;
    },
    methods: {
        adsClick() {
            // 定制统计点击UV,暂时拿url判断！
            let constUrl = '//m.51yangsheng.com/gza-sdkp/m6/cafajgilopqr/pqppov/dbt/754574.html';
            if(this.adsClick_url.indexOf(constUrl) > -1) {
                let _hmt = _hmt || [];
                (function() {
                  let hm = document.createElement("script");
                  hm.src = "https://hm.baidu.com/hm.js?2e78716cab03164bb38a132eb01a338a";
                  let s = document.getElementsByTagName("script")[0];
                  s.parentNode.insertBefore(hm, s);

                  let cnzzScript = document.createElement("script");
                  cnzzScript.type = "text/javascript";
                  cnzzScript.src = "https://v1.cnzz.com/z_stat.php?id=1278710989&web_id=1278710989";
                  s.parentNode.insertBefore(cnzzScript, s);
                })();
            }

            setTimeout(() => {
                location.href = this.adsClick_url;
            }, 50);
          }
    }
};
</script>

<style>
.x-banner a{
    display: block;
    position: relative;
}
</style>