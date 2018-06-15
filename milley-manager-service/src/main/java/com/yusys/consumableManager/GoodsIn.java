package com.yusys.consumableManager;

import java.util.List;

public class GoodsIn {
	
	/**
	 * 主键
	 */
	private String id;
	/**
	 * 供应商
	 */
	private String supplierName;
	/**
	 * 新建机构
	 */
	private String create_org;
	/**
	 * 新建时间
	 */
	private String create_date;
	/**
	 * 新建用户
	 */
	private String create_no;
	private String create_name;
	/**
	 * 更新用户
	 */
	private String update_no;
	/**
	 * 更新时间
	 */
	private String update_date;
	/**
	 * 仓库
	 */
	private String room;
	private String room_name;
	/**
	 * 删除标识
	 */
	/*private String flag;*/
	/**
	 * 备注
	 */
	private String descr;
	/**
	 * 入库状态
	 */
	private String in_status;
	private String in_status_name;
	
	private String is_state;
	
	/**
	 * 详情列表
	 */
	private List<GoodsInDetail> detailList;
	public List<GoodsInDetail> getDetailList() {
		return detailList;
	}
	public void setDetailList(List<GoodsInDetail> detailList) {
		this.detailList = detailList;
	}
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getSupplierName() {
		return supplierName;
	}
	public void setSupplierName(String supplierName) {
		this.supplierName = supplierName;
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
	public String getCreate_no() {
		return create_no;
	}
	public void setCreate_no(String create_no) {
		this.create_no = create_no;
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
	public String getRoom() {
		return room;
	}
	public void setRoom(String room) {
		this.room = room;
	}
	public String getDescr() {
		return descr;
	}
	public void setDescr(String descr) {
		this.descr = descr;
	}
	public String getCreate_name() {
		return create_name;
	}
	public void setCreate_name(String create_name) {
		this.create_name = create_name;
	}
	public String getRoom_name() {
		return room_name;
	}
	public void setRoom_name(String room_name) {
		this.room_name = room_name;
	}
	public String getIn_status() {
		return in_status;
	}
	public void setIn_status(String in_status) {
		this.in_status = in_status;
	}
	public String getIn_status_name() {
		return in_status_name;
	}
	public void setIn_status_name(String in_status_name) {
		this.in_status_name = in_status_name;
	}
	public String getIs_state() {
		return is_state;
	}
	public void setIs_state(String is_state) {
		this.is_state = is_state;
	}

}
