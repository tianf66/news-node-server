<template>
<section>
    <div class="cpu-feeds-block" data-site-id="274303240" data-block-id="12743"></div>
</section>
</template>

<script src="//cpro.baidustatic.com/cpro/ui/cm.js"></script>
<script>
export default {
    name: 'adsCpuFeeds',
    props: {
        //
    },
    data() {
        return {
            //
        };
    },
    mounted() {
        this.cpuFeeds();
    },
    methods: {
        cpuFeeds() {
            // (function(){
            //     let c = "//cpu.baidu.com";
            //     let a = function(){
            //         let e = document.createElement("script");
            //         e.id = "cpu-block-entry";
            //         e.src = c+"/js/cb.js";
            //         document.head.appendChild(e);
            //     };
            //     let b=function(g){
            //         let h = {
            //             msg:g.toString()||"no err msg", line:g.lineno||-1
            //         };
            //         let f = document.createElement("img");
            //         f.src=c+"/msg?m=block&e="+encodeURIComponent(JSON.stringify(h));
            //     };
            //     try {
            //           window.feedsbycpu=window.feedsbycpu||[];
            //           window.feedsbycpu.push({siteId:'269855008', blockId:'2832', display:"auto"});
            //           document.getElementById("cpu-block-entry")||a();
            //       }
            //     catch(d) {
            //         b(d);
            //     }
            // })();
            (function() {
                let url = "//cpu.baidu.com";
                let getEntry = function(){
                    let script = document.createElement("script");
                    script.id = "cpu-block-entry";
                    script.src = url+"/js/cb.js";
                    let scriptTag = document.getElementsByTagName("script")[0];
                    scriptTag.parentNode.insertBefore(script, scriptTag);
                };
                let sentMsg = function(e){
                    let msg = {msg:e.toString()||"no err msg", line:e.lineno||-1};
                    let img = document.createElement("img");
                    img.src = url+"/msg?m=block&e="+encodeURIComponent(JSON.stringify(msg));
                };
                try {
                    window.feedsbycpu=window.feedsbycpu||[];
                    window.feedsbycpu.push({siteId:"274303240", blockId:"12743", display:"auto"});
                    document.getElementById("cpu-block-entry")||getEntry();
                }
                catch(e) {
                    sentMsg(e);
                }
            })();
        }
    }
};
</script>
