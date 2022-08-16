function addOperaCallback(data) {
    try {
        if(window.OperaCallback && typeof OperaCallback.getIMEIMD5 === 'function'){
            data.imei_md5 = window.OperaCallback.getIMEIMD5();
        }
        if(window.OperaCallback && typeof OperaCallback.magicGdi === 'function'){
            data.refer = 'op12';
            data.device = window.OperaCallback.magicGdi();
        }
    } catch(e) {/**/}
}

function addMeizuDeviceInfo(data) {
    let deviceInfo = {};
    let base64 = window.btoa ? true : false;
    let imei = '';

    try {
        if(window.MzJavascriptInterface && MzJavascriptInterface.getIMEI && typeof MzJavascriptInterface.getIMEI === 'function') {
            imei = MzJavascriptInterface.getIMEI();
        }

        if(imei) {
            deviceInfo["imei"] = window.btoa(imei);
            deviceInfo["base64"] = base64;

            data.refer = 'mz';
            // meizu浏览器不能直接JSON.parse一个object，fuck!
            data.device = encodeURIComponent(JSON.stringify(deviceInfo));

        }
    } catch(e) {/**/}
}

export default function addDeviceInfo(data) {
    addOperaCallback(data);
    addMeizuDeviceInfo(data);
}