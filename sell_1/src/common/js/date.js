//js模块方法编程的思想，这里的方法可以是公用的
export function formatDate(date,fmt){
 //可以用正则表达式做
  if(/(y+)/.test(fmt)){
    //RegExp.$1 表示匹配到了括号里的
    fmt = fmt.replace(RegExp.$1,(date.getFullYear()+'').substr(4-RegExp.$1.length));
    let o = {
      'M+':date.getMonth() + 1,
      'd+':date.getDate(),
      'h+':date.getHours(),
      'm+':date.getMinutes(),
      's+':date.getSeconds()
    };
    for(let k in o){
      if(new RegExp(`(${k})`).test(fmt)){
        let str = o[k] + '';
        fmt = fmt.replace(RegExp.$1,(RegExp.$1.length === 1)?str:padLeftZero(str));
      }
    }
    return fmt;
  }
  function padLeftZero(str){
    return ('00' + str).substr((str.length));
  }
}
