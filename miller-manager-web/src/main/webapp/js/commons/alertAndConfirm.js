/**
 * 重新window的alert函数
 */
window.alert=function(msg){
	  $.Zebra_Dialog(msg, {
          'type':     'close',
          'title':    '提示',
          'buttons':  ['确定'],
          'onClose':  function(caption) {
            if (caption=="确定") {
      		}else{
      		}
          }
      });
};

/**
 * 重写window的confirm函数
 */
nconfirm=function(msg,callback){
//window.confirm=function(msg){
	 $.Zebra_Dialog(msg, {
         'type':     'close',
         'title':    '提示',
         'buttons':  ['确定','取消'],
         'onClose':  function(caption) {
           if (caption=="确定"&&callback) {
        	   callback();
     		}else{
     		}
         }
     });
};
