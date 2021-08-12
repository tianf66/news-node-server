import utils from '@/utils';

// http://blog.csdn.net/fudesign2008/article/details/6772108
let sendPv = function (pv) {
    let data = window['__imgLogData__'] || (window['__imgLogData__'] = {});
    let img = new Image();
    let uid = `img-${utils.getUid()}`;

    let imprPv = pv;

    if(pv.indexOf('http') === 0) imprPv = pv.split(':')[1];

    // 赋值给全局变量
    data[uid] = img;

    img.onload = img.onerror = function () {
        //销毁一些对象
        img.onload = img.onerror = null;
        img = null;
        delete data[uid];
    };

    img.src = imprPv;
};


let imgTrack = function (track) {
    if (typeof track === 'string') {
        sendPv(track);
    } else if (Object.prototype.toString.call(track) === '[object Array]') {
        let i = 0,
                len = track.length;
        for (; i < len; i++) {
            sendPv(track[i]);
        }
    }
};

export default imgTrack;