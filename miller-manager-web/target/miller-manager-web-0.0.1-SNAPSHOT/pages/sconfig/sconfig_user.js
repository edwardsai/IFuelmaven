//通用ajax方法
function baseAjax(url, param, callback, async) {
	$.ajax({
		type : "post",
		url : url,
		async : async == undefined ? true : false,
				data : param,
				dataType : "json",
				success : function(msg) {
					callback(msg);
				},
				error : function() {
					callback();
				}
	});
}

//按钮方法
function initUserButtonEvent(){
	$("#saveCUser").click(function(){
		var user_max = $("#user_max").val();
		var user_now = $("#user_now").val();
		
		numbermax = new Number(user_max);
		numbernow = new Number(user_now);
		if(numbermax<numbernow){
			alert("当前用户限制值过大");
			return ;
		}
		
		var params ={"user_now":user_now};
		baseAjax("SConfig/updateConUser.asp",params, function(data) {
			if (data != undefined&&data!=null&&data.result=="true") {
				alert("修改成功");
			}else{
				alert("修改失败");
			}
		});
	});
}

//加载数据
function initQueryConUser(){
	var parms = {};
	baseAjax("SConfig/queryConUser.asp",parms,function(data){
		for ( var k in data) {
			$("input[name='SC." + k + "']").val(data[k]);
		}
	});
}

initUserButtonEvent();
initQueryConUser();
