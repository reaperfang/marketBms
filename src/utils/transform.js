/* 数据转换类工具 */

/**
 * rgb转16进制
 *
 * @export
 * @param {*} color
 * @returns
 */
export function colorRGB2Hex(color) {
  if (!color) {
    return ''
  };
  var rgb = color.split(',');
  var r = parseInt(rgb[0].split('(')[1]);
  var g = parseInt(rgb[1]);
  var b = parseInt(rgb[2].split(')')[0]);

  var hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  return hex;
}

/**
 * 16进制转rgb
 *
 * @export
 * @param {*} color
 * @returns
 */
export function colorHex2RGB(color) {
  var sColor = color.toLowerCase();
    //十六进制颜色值的正则表达式
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    // 如果是16进制颜色
    if (sColor && reg.test(sColor)) {
        if (sColor.length === 4) {
            var sColorNew = "#";
            for (var i=1; i<4; i+=1) {
                sColorNew += sColor.slice(i, i+1).concat(sColor.slice(i, i+1));    
            }
            sColor = sColorNew;
        }
        //处理六位的颜色值
        var sColorChange = [];
        for (var i=1; i<7; i+=2) {
            sColorChange.push(parseInt("0x"+sColor.slice(i, i+2)));    
        }
        return "[" + sColorChange.join(",") + ",0.6]";
    }
    return sColor;
}


/* 格式化数字*/
export function formatNumber(num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

/**
 * 数值百分比转换
 * @param value 
 * @param fmt string , 转换格式
 * demo ->  {{data | percent(2)}}
 */
export function percent(value, fmt) {
  return `${((value || 0) * 100).toFixed(fmt || 2)}%`;
}

/**
 * 首字母大写
 *
 * @export
 * @param {*} name
 */
export function titleCase(name = '') {
  let str = name.replace(/\b\w+\b/g, function (word) {
    return word.substring(0, 1).toUpperCase() + word.substring(1);
  });
  return str;
}

//扁平数据解析成为树形结构
export function buildTree(data) {
  let parents = data.filter(value => value.navType == 0)
  let children = data.filter(value => value.navType !== 0)
  let translator = (parents, children) => {
      parents.forEach((parent) => {
          children.forEach((current, index) => {
              if (current.parentId*1 === parent.id) {
                  let temp = JSON.parse(JSON.stringify(children))
                  temp.splice(index, 1)
                  translator([current], temp)
                  typeof parent.children !== 'undefined' ? parent.children.push(current) : parent.children = [current]
              }
          })
      })
  }
  translator(parents, children)
  return parents
}

//缺0补位
export function prefixInteter(num) {
    return (Array(2).join(0) + num).slice(-2);
}