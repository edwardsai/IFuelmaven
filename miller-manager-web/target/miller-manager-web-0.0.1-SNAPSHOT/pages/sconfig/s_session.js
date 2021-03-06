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
function initSessionButtonEvent(){
	$("#saveCSession").click(function(){
		var session_now = $("#session_now").val();
		var params ={"session_now":session_now};
		baseAjax("SConfig/updateConSession.asp",params, function(data) {
			if (data != undefined&&data!=null&&data.result=="true") {
				alert("修改成功");
			}else{
				alert("修改失败");
			}
		});
	});
}

//加载数据
function initQueryConSession(){
	var parms = {};
	baseAjax("SConfig/queryConSession.asp",parms,function(data){
		for ( var k in data) {
			$("input[name='SC." + k + "']").val(data[k]);
		}
	});
}

initSessionButtonEvent();
initQueryConSession();
