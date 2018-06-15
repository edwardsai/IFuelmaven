package com.yusys.consumableManager;

import java.io.Serializable;

public class StatisticsConsumableSupplies implements Serializable{

	private static final long serialVersionUID = 1L;
	
	private String id;
	private String max_num;
	private String min_num;
	private String marks;
	private String flag;
	private String status;
	private String create_no;
	private String create_org;
	private String create_date;
	private String update_no;
	private String update_date;
	private String category_id;
	private String room_id;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getMax_num() {
		return max_num;
	}
	public void setMax_num(String max_num) {
		this.max_num = max_num;
	}
	public String getMin_num() {
		return min_num;
	}
	public void setMin_num(String min_num) {
		this.min_num = min_num;
	}
	public String getMarks() {
		return marks;
	}
	public void setMarks(String marks) {
		this.marks = marks;
	}
	public String getFlag() {
		return flag;
	}
	public void setFlag(String flag) {
		this.flag = flag;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getCreate_no() {
		return create_no;
	}
	public void setCreate_no(String create_no) {
		this.create_no = create_no;
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
	public String getUpdate_no() {
		return update_no;
	}
	public void setUpdate_no(String update_no) {
		this.update_no = update_no;
	}
	public String getUpdate_date() {
		return update_date;
	}
	public void setUpdate_date(String update_date) {
		this.update_date = update_date;
	}
	public String getCategory_id() {
		return category_id;
	}
	public void setCategory_id(String category_id) {
		this.category_id = category_id;
	}
	public String getRoom_id() {
		return room_id;
	}
	public void setRoom_id(String room_id) {
		this.room_id = room_id;
	}
	
	

}
