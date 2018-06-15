package com.yusys.common;

public class SSkillConfig {
	
	
	private String skill_num;//技能编号
	
	private String skill_name;//技能姓名
	
	private String skill_type;//技能类别（字典项）
	
	private String pre_skill_num;//上级科目
	
	private String prof_level;//熟练程度（字典项）
	
	private String menu_level;//菜单级别
	
	private String marks;//备注
	
	private String order_id;//序号
	
    private String skill_type_name;//技能类别中文
	
	private String prof_level_name;//熟练程度中文
	/**
	 * 创建人ID
	 * */
	private String create_user;
	/**
	 * 创建机构
	 * */
	private String create_org;
	/**
	 * 创建日期
	 * */
	private String create_date;
	/**
	 * 最后修改人
	 * */
	private String last_update_user;
	/**
	 * 最后修改时间
	 * */
	private String last_update_date;
	
	public String getSkill_num() {
		return skill_num;
	}
	public void setSkill_num(String skill_num) {
		this.skill_num = skill_num;
	}
	public String getSkill_name() {
		return skill_name;
	}
	public void setSkill_name(String skill_name) {
		this.skill_name = skill_name;
	}
	public String getSkill_type() {
		return skill_type;
	}
	public void setSkill_type(String skill_type) {
		this.skill_type = skill_type;
	}
	public String getPre_skill_num() {
		return pre_skill_num;
	}
	public void setPre_skill_num(String pre_skill_num) {
		this.pre_skill_num = pre_skill_num;
	}
	public String getProf_level() {
		return prof_level;
	}
	public void setProf_level(String prof_level) {
		this.prof_level = prof_level;
	}
	public String getMenu_level() {
		return menu_level;
	}
	public void setMenu_level(String menu_level) {
		this.menu_level = menu_level;
	}
	public String getMarks() {
		return marks;
	}
	public void setMarks(String marks) {
		this.marks = marks;
	}
	public String getOrder_id() {
		return order_id;
	}
	public void setOrder_id(String order_id) {
		this.order_id = order_id;
	}
	public String getCreate_user() {
		return create_user;
	}
	public void setCreate_user(String create_user) {
		this.create_user = create_user;
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
	public String getLast_update_user() {
		return last_update_user;
	}
	public void setLast_update_user(String last_update_user) {
		this.last_update_user = last_update_user;
	}
	public String getLast_update_date() {
		return last_update_date;
	}
	public void setLast_update_date(String last_update_date) {
		this.last_update_date = last_update_date;
	}
	public String getSkill_type_name() {
		return skill_type_name;
	}
	public void setSkill_type_name(String skill_type_name) {
		this.skill_type_name = skill_type_name;
	}
	public String getProf_level_name() {
		return prof_level_name;
	}
	public void setProf_level_name(String prof_level_name) {
		this.prof_level_name = prof_level_name;
	}

}
