$(document).ready(function(){	
	/* input[checkbox] */
	 $('input[type="checkbox"]').iCheck({
      checkboxClass: 'icheckbox_square-blue',
      radioClass: 'iradio_square-blue',
      increaseArea: '20%'
    });
	//全选、反选
	 var chkAllBtn = $('#chkAll');
	 chkAllBtn.on('ifChecked', function(event){
		 $('tr td input').iCheck('check');		
	 	});
	 chkAllBtn.on('ifUnchecked', function(event){
	 	$('tr td input').iCheck('uncheck');
	 	});
	});
