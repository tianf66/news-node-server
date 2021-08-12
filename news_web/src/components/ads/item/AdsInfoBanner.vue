<template>
<section class="x-wrapper x-info-banner">
    <a  @click="adsClick">
        <!-- ads.clk_url,  :href="ads_url" -->
        <div class="info clearfix" :class="{'info-no-icon': !ads.icon}">
            <img class="icon" v-if="ads.icon" :src="ads.icon" :alt="ads.title"/>
            <div class="text">
                <div class="title">{{ads.title}}</div>
                <div class="intro">{{ads.snippets}}</div>
            </div>
        </div>
        <img class="__ximg__" :src="ads_banner" :alt="ads.title"/>
    </a>
    <div class="x-tips" v-if="!baidu">广告</div>
    <div class="x-tips-bd" v-if="baidu">
        <img class="ad-flag lflag" src="//i.opfed.com/opgirl/mob_adicon.png" />
        <img class="ad-flag rflag" src="//i.opfed.com/opgirl/bd-logo4.png" />
    </div>
</section>
</template>

<script>
export default {
    name: 'adsInfoBanner',
    props: {
        ads: Object
    },
    data() {
        return {
            ads_url: '',
            ads_banner: ''
        };
    },
    mounted() {
        this.ads_url = this.ads.clk_url;
        this.ads_banner = this.ads.banner;
        // if(this.ads.clk_url.indexOf('http') === 0) this.ads_url = this.ads.clk_url.split(':')[1];
        if(this.ads.banner.indexOf('http') === 0) this.ads_banner = this.ads.banner.split(':')[1];
    },
    computed: {
        baidu() {
            return this.ads.a_d_s === 'bd';
        },
    },
    methods: {
        adsClick() {
            // 定制统计点击UV,暂时拿url判断！
            let constUrl = '//m.51yangsheng.com/gza-sdkp/m6/cafajgilopqr/pqppov/dbt/754574.html';
            if(this.ads_url.indexOf(constUrl) > -1) {
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
                location.href = this.ads_url;
            }, 50);
        }
    }
};
</script>

<style lang="scss">
.x-info-banner {
    position: relative;
    .info {
        padding: 0.1rem;
        .icon {
            float: left;
            border-radius: 5px;
            width: 0.5rem!important;
        }
        .text {
            overflow: hidden;
            padding: 0 0.1rem;
            line-height: 1.5;
            text-align: left;
            .title {
                font-size: 0.16rem;
                color: #333;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .intro {
                font-size: 0.12rem;
                color: #8e8e8e;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;  
            }
        }
    }
    .info-no-icon {
        padding: 0.1rem 0;
    }

    .ad-flag {
        position: absolute;
        bottom: 0.05rem;
    }
    .ad-flag.lflag {
        width: 0.25rem!important;
        height: 0.13rem!important;
        left: 0.05rem;
    }
    .ad-flag.rflag {
        width: 0.2rem!important;
        height: 0.21rem!important;
        right: 0.05rem;
    }
    .ad-flag.advlflag {
        width: 0.25rem!important;
        height: 0.13rem!important;
        left: 0.05rem;
    }
    .ad-flag.advrflag {
        width: 0.7rem!important;
        height: 0.2rem!important;
        right: 0.05rem;
    }

}
</style>