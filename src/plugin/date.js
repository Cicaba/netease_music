const newDate = str => {
  if(str === null) return null;
  if(str === undefined) return new Date();
  if(str.constructor != String) return new Date(str);
  let $ = str.match(/^\s*(\d+)-(\d+)-(\d+)T(\d+):(\d+):(\d+)\s*$/);
  return $ && new Date($[1], $[2]-1, $[3], $[4], $[5], $[6]) || new Date(str);
}
/**
 *  * 格式化时间
 *
 * @param {String} str
 * @param {String} fmt  "yyyy-MM-dd hh:mm:ss"  "yyyy-MM-dd"
 * @returns 格式化后的时间
 */
const formatDate = (str,fmt) => {
  if(!Boolean(str)){
    return ""
  }
  const now = newDate(str);
  let o = {
    "M+" : now.getMonth()+1,                 //月份
    "d+" : now.getDate(),                    //日
    "h+" : now.getHours(),                   //小时
    "m+" : now.getMinutes(),                 //分
    "s+" : now.getSeconds(),                 //秒
    "q+" : Math.floor((now.getMonth()+3)/3), //季度
    "S"  : now.getMilliseconds()             //毫秒
  };
  if(/(y+)/.test(fmt)) {
    fmt=fmt.replace(RegExp.$1, (now.getFullYear()+"").substr(4 - RegExp.$1.length));
  }
  for(let k in o) {
    if(new RegExp("("+ k +")").test(fmt)){
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    }
  }
  return fmt;
}
export {formatDate, newDate}