package com.yusys.common;

public class SUncompliance {
	
	private String id;//主键
	
	private String use_grade;//级别
	
	private String qualification;//学历
	
	private String min_years;//最小工作年限
	
	private String max_years;//最大工作年限
	
	private String flag;//启用标识
	
	private String emp_post;//岗位
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

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getUse_grade() {
		return use_grade;
	}

	public void setUse_grade(String use_grade) {
		this.use_grade = use_grade;
	}

	

	public String getQualification() {
		return qualification;
	}

	public void setQualification(String qualification) {
		this.qualification = qualification;
	}

	public String getMin_years() {
		return min_years;
	}

	public void setMin_years(String min_years) {
		this.min_years = min_years;
	}

	public String getMax_years() {
		return max_years;
	}

	public void setMax_years(String max_years) {
		this.max_years = max_years;
	}

	public String getFlag() {
		return flag;
	}

	public void setFlag(String flag) {
		this.flag = flag;
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

	public String getEmp_post() {
		return emp_post;
	}

	public void setEmp_post(String emp_post) {
		this.emp_post = emp_post;
	}

}
