package com.yusys.category;

public class CommonConfig {

	private String col_id;	//varchar2(32 byte)	no		1	主键
	private String tag_id;	//varchar2(80 byte)	yes		2	标签id
	private String tag_name;	//varchar2(200 byte)	yes		3	标签名
	private String col_required;	//char(2 byte)	yes		4	是否必填
	private String tag_type;	//char(2 byte)	yes		5	标签类型
	private String max_length;	//varchar2(10 byte)	yes		6	最大长度
	private String dic_code;	//varchar2(50 byte)	yes		7	字典项编号
	private String order_id;	//varchar2(10 byte)	yes		8	排序序号
	private String default_value;	//varchar2(200 byte)	yes		9	默认值
	private String init_template;	//varchar2(32 byte)	yes		10	初始化模版
	private String category_id;	//varchar2(32 byte)	yes		11	类别编号
	private String category_name;   //所属类别，用于关联查询
	public String getCol_id() {
		return col_id;
	}
	public void setCol_id(String col_id) {
		this.col_id = col_id;
	}
	public String getTag_id() {
		return tag_id;
	}
	public void setTag_id(String tag_id) {
		this.tag_id = tag_id;
	}
	public String getTag_name() {
		return tag_name;
	}
	public void setTag_name(String tag_name) {
		this.tag_name = tag_name;
	}
	public String getCol_required() {
		return col_required;
	}
	public void setCol_required(String col_required) {
		this.col_required = col_required;
	}
	public String getTag_type() {
		return tag_type;
	}
	public void setTag_type(String tag_type) {
		this.tag_type = tag_type;
	}
	public String getMax_length() {
		return max_length;
	}
	public void setMax_length(String max_length) {
		this.max_length = max_length;
	}
	public String getDic_code() {
		return dic_code;
	}
	public void setDic_code(String dic_code) {
		this.dic_code = dic_code;
	}
	public String getOrder_id() {
		return order_id;
	}
	public void setOrder_id(String order_id) {
		this.order_id = order_id;
	}
	public String getDefault_value() {
		return default_value;
	}
	public void setDefault_value(String default_value) {
		this.default_value = default_value;
	}
	public String getInit_template() {
		return init_template;
	}
	public void setInit_template(String init_template) {
		this.init_template = init_template;
	}
	public String getCategory_id() {
		return category_id;
	}
	public void setCategory_id(String category_id) {
		this.category_id = category_id;
	}
	public String getCategory_name() {
		return category_name;
	}
	public void setCategory_name(String category_name) {
		this.category_name = category_name;
	}
	
}
