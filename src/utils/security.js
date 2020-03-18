/* 安全相关工具，比如加解密转码等 */
import CryptoJS from 'crypto-js';


//对字符串进行加密(偏移加密)     
export function compileStr1(code) {
  var c = String.fromCharCode(code.charCodeAt(0) + code.length);
  for (var i = 1; i < code.length; i++) {
    c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1));
  }
  return escape(c);
}

//对字符串进行解密(偏移解密)     
export function uncompileStr1(code) {
  code = unescape(code);
  var c = String.fromCharCode(code.charCodeAt(0) - code.length);
  for (var i = 1; i < code.length; i++) {
    c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1));
  }
  return c;
}
//对字符串进行加密(无偏移)     
export function compileStr(code) {
  return escape(code);
}

//对字符串进行解密(无偏移)     
export function uncompileStr(code) {
  return unescape(code);
}

/**
 * AES加密
 *
 * @export
 * @param {*} string
 * @returns
 */
export function aesEncryption(key= '', string=''){
      var key = CryptoJS.enc.Utf8.parse(key);
      // ECB加密
      var options={
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7
      }
      var encryptedData = CryptoJS.AES.encrypt(string, key, options);
      var encryptedBase64Str = encryptedData.toString();
      return encryptedBase64Str;
}

/**
 * AES解密
 *
 * @export
 * @param {*} string
 * @returns
 */
export function aesDecryption(key= '', string=''){
    var encryptedBase64Str = string;
    var options = {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    };
    var key = CryptoJS.enc.Utf8.parse(key);
    // 解密
    var decryptedData = CryptoJS.AES.decrypt(encryptedBase64Str, key, options);
    // 解密后，需要按照Utf8的方式将明文转位字符串
    var decryptedStr = decryptedData.toString(CryptoJS.enc.Utf8);
    return decryptedStr;
}