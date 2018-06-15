/**
 * 打开文件上传
 */
function openFileUploadInfo(id,path_id,file_id,callback) {
	if(openFileUploadInfo.isOpen==false){
		$("#fileUpload"+id).modal("show");
		return;
	}
	openFileUploadInfo.isOpen=false;
	$("#myModalFileUpload").remove();
	var fileUpload=
		'<div id="fileUpload'+id+'" class="modal hide fade" tabindex="-1" role="dialog">'+
		'	<div class="modal-header">'+
		'		<button type="button" class="close" data-dismiss="modal"'+
		'			aria-hidden="true">×</button>'+
		'		<h3 id="myModalLabel">附件上传</h3>'+
		'	</div>'+
		'	<iframe src="upload/uploadify/fileUpload.html?path_id='+path_id+'&file_id='+file_id+'" style="height: 250px; width: 99.5%;">'+
		'	</iframe>'+
		'</div>';
		$("body").append(fileUpload);
		$("#fileUpload"+id).modal("show");
		if(callback!=undefined){
			$("#fileUpload"+id).on("hidden.bs.modal",function(){
				findFileInfo(file_id,callback);
				//callback();
			});
		}
		openFileUploadInfo.isOpen=true;
}
/**
 * 查询附件
 * @param file_id
 */
function findFileInfo(file_id,callback){
	baseAjax("sfile/findFileInfo.asp",{file_id:file_id},function(data){
		if(callback!=undefined){
			callback(data);
		}
	});
}
/**
isViewImage.put(".png", "png");
		isViewImage.put(".jpg", "jpg");
		isViewImage.put(".jpeg", "jpeg");
		isViewImage.put(".bmp", "bmp");
		isViewImage.put(".gif", "gif");
 */

var isImage={".png": "png",".jpg": "jpg",".jpeg": "jpeg",".bmp": "bmp",".gif": "gif"};
/**
 * 默认的显示附件的函数
 * @param obj
 * @param data
 */
function defaultShowFileInfo(file_id,obj,data,isdel){
	isdel=isdel==undefined?false:true;
	if(typeof data =="object"&&typeof obj=="object"){
		obj.find("div[class^=fileInfo]").remove();
		obj.find("div.moreFileInfo").remove();
		obj.find("br").remove();
		obj.append("<div class='fileInfo130'></div>");
		var fileInfo=obj.find("div.fileInfo130");
		if(data.total<=0){
			return;
		}
		
		var hrefView="prefile/filePreView.jsp?p_=";
		
		for(var i=0;i<1;i++){
			if(isImage[data.rows[i]["FILE_TYPE"]]){
				hrefView="sfile/filePreView.asp?id=";
			}
			fileInfo.append("<div class='fileInfo' style='text-align: left;padding-left:4px;'><a title='"+data.rows[i]["FILE_NAME"]+"' href='sfile/fileDownLoad.asp?id="+data.rows[i]["ID"]+"'>"+data.rows[i]["FILE_NAME"]+"</a></div>"+
					//(data.rows[i]["IS_VIEW"]!=undefined?"<a target='_blank' title='点击预览' href='"+hrefView+data.rows[i]["ID"]+"'><img src='images/prefile.png'></a>":"")+
					("<a target='_blank' title='点击预览' href='"+hrefView+data.rows[i]["ID"]+"'><img src='images/prefile.png'></a>")+
					(isdel?"<img src='images/ltee_close_h.png' fileId='"+data.rows[i]["ID"]+"' title='删除附件'>":""));
		}
		
		if(data.total>1){
			obj.append("<div class='fileInfo' style='width:40px;'>&nbsp;<a>更多..</a></div><br>");
			obj.append("<div class='moreFileInfo'></div");
			initMoreFileInfo(obj);
			fileInfo=obj.find("div.moreFileInfo");
		}
		hrefView="prefile/filePreView.html?p_=";
		
		for(var i=1;i<data.total;i++){
			if(isImage[data.rows[i]["FILE_TYPE"]]){
				hrefView="sfile/filePreView.asp?id=";
			}
			fileInfo.append("<div class='fileInfo150'><div class='fileInfo' style='width:130px;'>"+
					"<a title='"+data.rows[i]["FILE_NAME"]+"' href='sfile/fileDownLoad.asp?id="+data.rows[i]["ID"]+"'>"+data.rows[i]["FILE_NAME"]+"</a></div>"+
					//(data.rows[i]["IS_VIEW"]!=undefined?"<a target='_blank' title='点击预览' href='"+hrefView+data.rows[i]["ID"]+"'><img src='images/prefile.png'></a>":"")+
					("<a target='_blank' title='点击预览' href='"+hrefView+data.rows[i]["ID"]+"'><img src='images/prefile.png'></a>")+
					(isdel?"<img src='images/ltee_close_h.png' fileId='"+data.rows[i]["ID"]+"' title='删除附件'>":""));
		}
		initDelFileInfo(file_id,obj,defaultShowFileInfo);
	}
}
/**
 * 默认的显示附件的函数(只读)
 * @param obj
 * @param data
 */
function defaultShowFileInfoRead(file_id,obj,data,isdel){
	isdel=isdel==undefined?false:true;
	if(typeof data =="object"&&typeof obj=="object"){
		obj.find("div[class^=fileInfo]").remove();
		obj.find("div.moreFileInfo").remove();
		obj.find("br").remove();
		obj.append("<div class='fileInfo130'></div>");
		var fileInfo=obj.find("div.fileInfo130");
		if(data.total<=0){
			return;
		}
		
		var hrefView="prefile/filePreView.jsp?p_=";
		
		for(var i=0;i<1;i++){
			if(isImage[data.rows[i]["FILE_TYPE"]]){
				hrefView="sfile/filePreView.asp?id=";
			}
			fileInfo.append("<div class='fileInfo' style='text-align: left;padding-left:4px;'><a title='"+data.rows[i]["FILE_NAME"]+"' href='sfile/fileDownLoad.asp?id="+data.rows[i]["ID"]+"'>"+data.rows[i]["FILE_NAME"]+"</a></div>"+
					//(data.rows[i]["IS_VIEW"]!=undefined?"<a target='_blank' title='点击预览' href='"+hrefView+data.rows[i]["ID"]+"'><img src='images/prefile.png'></a>":"")+
					("<a target='_blank' title='点击预览' href='"+hrefView+data.rows[i]["ID"]+"'><img src='images/prefile.png'></a>"));
		}
		
		if(data.total>1){
			obj.append("<div class='fileInfo' style='width:40px;'>&nbsp;<a>更多..</a></div><br>");
			obj.append("<div class='moreFileInfo'></div");
			initMoreFileInfo(obj);
			fileInfo=obj.find("div.moreFileInfo");
		}
		hrefView="prefile/filePreView.html?p_=";
		
		for(var i=1;i<data.total;i++){
			if(isImage[data.rows[i]["FILE_TYPE"]]){
				hrefView="sfile/filePreView.asp?id=";
			}
			fileInfo.append("<div class='fileInfo150'><div class='fileInfo' style='width:130px;'>"+
					"<a title='"+data.rows[i]["FILE_NAME"]+"' href='sfile/fileDownLoad.asp?id="+data.rows[i]["ID"]+"'>"+data.rows[i]["FILE_NAME"]+"</a></div>"+
					//(data.rows[i]["IS_VIEW"]!=undefined?"<a target='_blank' title='点击预览' href='"+hrefView+data.rows[i]["ID"]+"'><img src='images/prefile.png'></a>":"")+
					("<a target='_blank' title='点击预览' href='"+hrefView+data.rows[i]["ID"]+"'><img src='images/prefile.png'></a>")+
					(isdel?"<img src='images/ltee_close_h.png' fileId='"+data.rows[i]["ID"]+"' title='删除附件'>":""));
		}
		initDelFileInfo(file_id,obj,defaultShowFileInfo);
	}
}
/**
 * 更多附件
 * @param obj
 */
function initMoreFileInfo(obj){//contains('John')
	obj.find("div.fileInfo a:contains('更多..')").unbind("click");
	obj.find("div.fileInfo a:contains('更多..')").click(function(){
		obj.find(".moreFileInfo").toggle("normal");
	});
}
/**
 * 删除附件
 * @param file_id
 * @param obj
 * @param callback
 */
function initDelFileInfo(file_id,obj,callback){
	obj.find("img[fileId]").unbind("click");
	obj.find("img[fileId]").click(function(){
		var id = $(this).attr("fileId");
		nconfirm("确认删除文件",function(){
			delFileInfo(id,function(data){
				findFileInfo(file_id,function(data){
					callback(file_id,obj,data,true);
					obj.find("div.fileInfo a:contains('更多..')").click();
				});
			});
		});
	});
}
/**
 * 删除附件
 * @param id
 */
function delFileInfo(id,callback){
	baseAjax("sfile/delFileInfo.asp",{id:id},function(data){
		if(callback!=undefined){
			callback(data);
		}
	});
}
/**
 * 展示附件信息
 * @param fid 文件id
 * @param #objId 展示对象id
 */
function viewFileInfo(fid,objId){
	findFileInfo(fid,function(data){
		if(data.rows.length>0){
			defaultShowFileInfo(fid,$(objId),data);
		}else{
		}
	});
}