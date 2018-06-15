var empSkillZTreeObj;
/*
  * 设置评价树的tid
	 * @param node
	 */
	function setConfigNodeTId(node) {
		var nid = node.id;
		initSkillConfigTree["data"][nid]=node;
		if (node==undefined||node.children == undefined) {
			return;
		}
		for (var i = 0; i < node.children.length; i++) {
			setConfigNodeTId(node.children[i]);
		}
	}
	function initSkillConfigTree() {
		var setting = {
			async : {
				enable : true,
				url : "SkillConfig/queryAllskillconfig.asp",
				contentType : "application/json",
				type : "get"
			},
			view : {
				dblClickExpand : false,
				showLine : true,
				selectedMulti : false
			},
			data : {
				simpleData : {
					enable : true,
					idKey : "id",
					pIdKey : "pid",
					rootPId : ""
				}
			},
			callback : {
				onAsyncSuccess: function(){
					var treeObj = $.fn.zTree.getZTreeObj("treeSkillConfigManager");
					treeObj.expandNode(treeObj.getNodeByTId("treeSkillConfigManager_1"), true, false, true);
					var menus=treeObj.getNodes();
					if(menus!=undefined){
						initSkillConfigTree["data"]={};
						for(var i=0;i<menus.length;i++){
							setConfigNodeTId(menus[i]);
						}
					}
				},
				onClick : function(event, treeId, treeNode) {
					//初始化路径
					path={};
					pathId="";
					pathName="";
					var parents = getAllSkillParentNodeId(treeNode);
					$("#projectOptDiv").show();
					baseAjax(
							"SkillConfig/queryoneskillconfig.asp",
							{
								skill_num : treeNode.id
							},
							function(data) {
								var supNode=initSkillConfigTree["data"][data["pre_skill_num"]];
								if(supNode!=undefined){
									$("input[name='MBD.pre_skill_name']").val(supNode.name);
									$("input[name='MBD.pre_skill_num']").val(supNode.id);
								}else{
									$("input[name='MBD.pre_skill_name']").val("");
									$("input[name='MBD.pre_skill_num']").val("");
								}
								for ( var k in data) {
									if(k=='skill_type'){
										var vals=data[k];
										var arr=vals.split(",");
										var obj = $("#Mskill_type").select2({
										placeholder:"请选择"
										});
										obj.val(arr).trigger("change");
									}else if(k=='prof_level'){
										var vals=data[k];
										var arr=vals.split(",");
										var obj = $("#Mprof_level").select2({
										placeholder:"请选择"
										});
										obj.val(arr).trigger("change");
									}else{
									$("input[name='MBD." + k + "']").val(data[k]);
									}
								}
								data['skill_num'] != undefined ? $("input[name='MBD.old_skill_num']").val(data['skill_num']) : "";
								data['marks'] != undefined ? $("textarea[name='MBD.marks']").val(data['marks']) : "";
							});
				
				}
			}
		};
		$.fn.zTree.init($("#treeSkillConfigManager"), setting);
		empSkillZTreeObj = $.fn.zTree.getZTreeObj("treeSkillConfigManager");
	}
	function updateORaddForSkill(url, msg,haveId) {
		if(vlidate($("#valititleskillConfig"),"",true)){//手动通过验证方法:vlidate($("#menu_form"))--->true
			var inputs = $("input[name^='MBD.']");
			var params = {"menu_level":'0'};
			for (var i = 0; i < inputs.length; i++) {
				var obj = $(inputs[i]);
				params[obj.attr("name").substr(4)] = obj.val();
			}
			var texts = $("textarea[name^='MBD.']");
			for (var i = 0; i < texts.length; i++) {
				var obj = $(texts[i]);
				params[obj.attr("name").substr(4)] = obj.val();
			}
			var selects = $("tr").find("select[name^='MBD.']");
			for (var i = 0; i < selects.length; i++) {
				var obj = $(selects[i]);
				params[obj.attr("name").substr(4)] = obj.val();
			}
			
			if(params["pre_skill_num"]!=undefined&&$.trim(params["pre_skill_num"])){
				var treeNode=initSkillConfigTree["data"][params["pre_skill_num"]];
				if(treeNode!=undefined&&treeNode.level!=undefined){
					params["menu_level"]=treeNode.level+1;
				}
			}
			//获取下拉选中选中的内容
			var skill_type = $("#Mskill_type").select2('data');
			//下拉选中选中的文本
			var skill_type_id="";
			var skill_type_name = "";
			for(var i=0;i<skill_type.length;i++){
				skill_type_name+=(skill_type[i].text+",");
				skill_type_id+=(skill_type[i].id+",");
			}
			
			//获取下拉选中选中的内容
			var prof_level = $("#Mprof_level").select2('data');
			//下拉选中选中的文本
			var prof_level_id="";
			var prof_level_name = "";
			for(var i=0;i<prof_level.length;i++){
				prof_level_name+=(prof_level[i].text+",");
				prof_level_id+=(prof_level[i].id+",");
			}
			params["skill_type"] = skill_type_id.substring(0, skill_type_id.length-1);
			params["skill_type_name"] = skill_type_name.substring(0, skill_type_name.length-1);
			params["prof_level"] =prof_level_id.substring(0, prof_level_id.length-1);
			params["prof_level_name"] = prof_level_name.substring(0, prof_level_name.length-1);
			if(undefined!=haveId){
				params["haveId"]=haveId;
			}
			baseAjax(url, params, function(data) {
				if (data != undefined && data != null && data.result == "true") {
					$("input[name='MBD.old_skill_num']").val($("input[name='MBD.skill_num']").val());
					alert(msg + "成功");//shouwModal_(msg + "成功");
					initSkillConfigTree();
				} else {
					alert(data.msg+","+msg + "失败");//shouwModal_(data.msg+","+msg + "失败");
				}
			});
		}
	}
	
	/**
	 * 判断节点的子节点是否有某个id
	 * @param node
	 * @returns {String}
	 */
	function checkskillChilderNodeHaveId(node,id) {
		var nid = node.id;
		if(nid==id){
			return true;
		}
		if (node.children == undefined || node.children.length == undefined
				|| node.id == undefined) {
			return false;
		}
		for (var i = 0; i < node.children.length; i++) {
			if(checkskillChilderNodeHaveId(node.children[i],id)){
				return true;
			}
		}
		return false;
	}
	/**
	 * 获取树的子节点
	 * @param node
	 * @returns {String}
	 */
	function getAllChilderNodeId(node) {
		var nid = node.id;
		if (node.children == undefined || node.children.length == undefined
				|| node.id == undefined) {
			return nid;
		}
		for (var i = 0; i < node.children.length; i++) {
			nid = nid + "," + getAllChilderNodeId(node.children[i]);
		}
		return nid;
	}
	/**
	 * 
	 * */
	function changeskillPath(parents){
		var realParents={};
		var pathId=parents.pathId;
		var pathName=parents.pathName;
		var realPathId="";
		var realPathName="";
		var ids=pathId.split("->");
		var names =pathName.split("->");
		for(var k =ids.length-1;k>=0;k--){
			realPathId=realPathId+ids[k]+"->";
		}
		for(var k =names.length-1;k>=0;k--){
			realPathName=realPathName+names[k]+"->";
		}
		realPathId=realPathId.substr(0,realPathId.length-2);
		realParents.realPathId=realPathId;
		realPathName=realPathName.substr(0,realPathName.length-2);
		realParents.realPathName=realPathName;
		return realParents;
	}
	/**
	 * 获取树的子节点
	 * @param node
	 * @returns {String}
	 */
	function getAllSkillParentNodeId(node) {
		var nid = node.id;
		var name = node.name;
		if(node.pid!=undefined && node.pid!=""){
			var parentNode =node.getParentNode();
			pathId =pathId+node.id +"->";
			pathName = pathName+node.name +"->";
			getAllSkillParentNodeId(parentNode);
			path.pathId=pathId;
			path.pathName=pathName;
		}else{
			pathId=pathId+nid;
			pathName=pathName+name;
			path.pathId=pathId;
			path.pathName=pathName;
		}
		return path;
	}
	/**
	 * 初始化按钮事件
	 */
	function initSkillConfigButtonEvent() {
		$("#pre_skill_name").click(function(){
			openSelectTreeDiv($(this),"configSelectTree","SkillConfig/queryAllskillconfig.asp",{width:$("#pre_skill_name").width()+"px","margin-left": "0px"},function(node){
				if($("input[name='MBD.old_skill_num']").val()==node.id){
					return false;
				}
				$("input[name='MBD.pre_skill_name']").val(node.name);
				$("input[name='MBD.pre_skill_num']").val(node.id);
				return true;
			});
		});
		$("#pre_skill_name").focus(function(){
			$("#pre_skill_name").click();
		});
		$("#addSkillsConfig").click(function(){
			$("input[name ^='MBD.']").val("");
			$("textarea").val("");
			$("#Mprof_level").val();
			$("#Mprof_level").select2();
			$("#Mskill_type").val();
			$("#Mskill_type").select2();
			
			var selectsed = null;
			if(empSkillZTreeObj!=undefined){
				selectsed = empSkillZTreeObj.getSelectedNodes();
			}
			if(selectsed!=undefined&&selectsed.length>0){
				var selected=selectsed[0];
				$("input[name='MBD.pre_skill_num']").val(selected.id);
				$("input[name='MBD.pre_skill_name']").val(selected.name);
			}
			$("#old_skill_num").val("");
			$("input[name='MBD.skill_num']").focus();
		});
		$("#saveSkillConfig").click(function() {
			var old_skill_num=$("#old_skill_num").val();
			if(""==$.trim(old_skill_num)){//如果没有旧的菜单编号则为创建
				updateORaddForSkill("SkillConfig/addskillconfig.asp", "添加");
			}else{
				if($.trim($("#pre_skill_num").val())!=""){
					var selectsed = empSkillZTreeObj.getSelectedNodes();
					if(checkskillChilderNodeHaveId(selectsed[0],$("#pre_skill_num").val())){
						updateORaddForSkill("SkillConfig/updateskillconfig.asp", "修改",$("#pre_skill_num").val());
					}else{
						updateORaddForSkill("SkillConfig/updateskillconfig.asp", "修改");
					}
				}else{
					updateORaddForSkill("SkillConfig/updateskillconfig.asp", "修改");
				}
			}
		});
		$("#delSkillConfig").click(
			function() {
				var selected = empSkillZTreeObj.getSelectedNodes()[0];
				var nodeIds = getAllChilderNodeId(selected);
				baseAjax("SkillConfig/deleteskillconfigByid.asp", {
					skill_num : nodeIds
				}, function(data) {
					if (data != undefined && data.result == "true") {
						alert("删除成功");
						initSkillConfigTree();
					} else {
						alert("删除失败");
					}
				});
		});
		//配置重置按钮
		$("#resetSkillConfig").click(function(){
			$("#addSubjectSkill input").val("");
			$("#addSubjectSkill textarea").val("");
			initSkillPageSelect();
		});
	}	
		function initSkillPageSelect(){
			initSelect($("#Mskill_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"EMP_SKILL_TYPE"},null,null,[" "]);
			initSelect($("#Mprof_level"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"EMP_SKILL"},null,null,[" "]);
		}
		
		initVlidate($("#valititleskillConfig"));
		initSkillConfigTree();
		initSkillConfigButtonEvent();
		initSkillPageSelect();
