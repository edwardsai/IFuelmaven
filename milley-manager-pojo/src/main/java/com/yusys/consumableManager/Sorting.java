package com.yusys.consumableManager;

public class Sorting {
	private String category_id; //类别编号
	private String goods_id;//物品编码
	private String category_name;//类别名称
	private String pre_category_id;//上级类别名称
	private String create_id;//创建人
	private String create_org;//创建人机构
	private String create_date;//创建日期
	private String menu_level;//菜单级别
	private String order_id;//序号
	private String description;//描述
	private String table_name;//表名
	private String flag;//删除标识
	private String pic;//图片附件
	public String getGoods_id() {
		return goods_id;
	}
	public void setGoods_id(String goods_id) {
		this.goods_id = goods_id;
	}
	public String getPic() {
		return pic;
	}
	public void setPic(String pic) {
		this.pic = pic;
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
	public String getTable_name() {
		return table_name;
	}
	public void setTable_name(String table_name) {
		this.table_name = table_name;
	}
	public String getFlag() {
		return flag;
	}
	public void setFlag(String flag) {
		this.flag = flag;
	}
	@Override
	public String toString() {
		return "Sorting [category_id=" + category_id + ", goods_id=" + goods_id
				+ ", category_name=" + category_name + ", pre_category_id="
				+ pre_category_id + ", create_id=" + create_id
				+ ", create_org=" + create_org + ", create_date=" + create_date
				+ ", menu_level=" + menu_level + ", order_id=" + order_id
				+ ", description=" + description + ", table_name=" + table_name
				+ ", flag=" + flag + ", pic=" + pic + "]";
	}
	
}
