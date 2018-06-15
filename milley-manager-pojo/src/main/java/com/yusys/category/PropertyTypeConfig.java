package com.yusys.category;

public class PropertyTypeConfig {

	private String category_id;	//varchar2(32 byte)	yes		1	类型编号
	private String category_name;	//varchar2(400 byte)	yes		2	类别名称
	private String pre_category_id;	//varchar2(32 byte)	yes		3	上级类别编号
	private String create_id;	//varchar2(10 byte)	yes		4	创建人
	private String create_org;	//varchar2(50 byte)	yes		5	创建机构
	private String create_date;	//varchar2(10 byte)	yes		6	创建日期
	private String menu_level;	//varchar2(20 byte)	yes		7	菜单级别
	private String order_id;	//varchar2(10 byte)	yes		8	序号
	private String description;	//varchar2(800 byte)	yes		9	描述
	private String flag;	//varchar2(2 byte)	yes		11	删除标识
	private String c_id;	//varchar2(32 byte)	no		12	主键id
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
	public String getPre_category_id() {
		return pre_category_id;
	}
	public void setPre_category_id(String pre_category_id) {
		this.pre_category_id = pre_category_id;
	}
	public String getCreate_id() {
		return create_id;
	}
	public void setCreate_id(String create_id) {
		this.create_id = create_id;
	}
	public String getCreate_org() {
		return create_org;
	}
	public void setCreate_org(String create_org) {
		this.create_org = create_org;
	}
	public String getCreate_date() {
		return create_date;
	}
	public void setCreate_date(String create_date) {
		this.create_date = create_date;
	}
	public String getMenu_level() {
		return menu_level;
	}
	public void setMenu_level(String menu_level) {
		this.menu_level = menu_level;
	}
	public String getOrder_id() {
		return order_id;
	}
	public void setOrder_id(String order_id) {
		this.order_id = order_id;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getFlag() {
		return flag;
	}
	public void setFlag(String flag) {
		this.flag = flag;
	}
	public String getC_id() {
		return c_id;
	}
	public void setC_id(String c_id) {
		this.c_id = c_id;
	}
	
}
