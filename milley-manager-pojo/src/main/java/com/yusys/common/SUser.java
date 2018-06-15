package com.yusys.common;

import java.io.Serializable;

/**
 * 用户实体
 * @author Administrator
 *
 */
public class SUser implements Serializable{
  
	private static final long serialVersionUID = 1L;
	
	private String user_no;  //用户编号
    private String user_name;//用户姓名
    private String login_name;//登陆名
    private String password; //密码
    private String nick_name;//昵称
    private String state;//状态
    private String state_name;
    private String user_post;//用户岗位
    private String user_post_name;
    private String user_level;//用户等级
    private String user_level_name;
    private String org_no;//所属部门
    private String org_no_code;
    private String org_no_name;//所属部门名称
    private String user_mail;//用户邮箱
    private String user_mobile;//电话
    private String memo; //备注
    private String create_no;//创建人
    private String create_time;//创建时间
    private String update_no;//修改人
    private String update_time;//修改时间
    private String user_belong;
    private String user_belong_name;//用户属性
    private String repairlist_num;
    private String finish_repairlist_num;
    private String unfinish_repairlist_num;
    private String wechart_no; //微信账号
    
	public String getOrg_no_name() {
		return org_no_name;
	}
	public void setOrg_no_name(String org_no_name) {
		this.org_no_name = org_no_name;
	}
	public String getUser_no() {
		return user_no;
	}
	public void setUser_no(String user_no) {
		this.user_no = user_no;
	}
	public String getUser_name() {
		return user_name;
	}
	public void setUser_name(String user_name) {
		this.user_name = user_name;
	}
	public String getLogin_name() {
		return login_name;
	}
	public void setLogin_name(String login_name) {
		this.login_name = login_name;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getNick_name() {
		return nick_name;
	}
	public void setNick_name(String nick_name) {
		this.nick_name = nick_name;
	}
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}
	public String getUser_post() {
		return user_post;
	}
	public void setUser_post(String user_post) {
		this.user_post = user_post;
	}
	public String getUser_level() {
		return user_level;
	}
	public void setUser_level(String user_level) {
		this.user_level = user_level;
	}
	public String getOrg_no() {
		return org_no;
	}
	public void setOrg_no(String org_no) {
		this.org_no = org_no;
	}
	public String getUser_mail() {
		return user_mail;
	}
	public void setUser_mail(String user_mail) {
		this.user_mail = user_mail;
	}
	public String getUser_mobile() {
		return user_mobile;
	}
	public void setUser_mobile(String user_mobile) {
		this.user_mobile = user_mobile;
	}
	public String getMemo() {
		return memo;
	}
	public void setMemo(String memo) {
		this.memo = memo;
	}
	public String getCreate_no() {
		return create_no;
	}
	public void setCreate_no(String create_no) {
		this.create_no = create_no;
	}
	public String getCreate_time() {
		return create_time;
	}
	public void setCreate_time(String create_time) {
		this.create_time = create_time;
	}
	public String getUpdate_no() {
		return update_no;
	}
	public void setUpdate_no(String update_no) {
		this.update_no = update_no;
	}
	public String getUpdate_time() {
		return update_time;
	}
	public void setUpdate_time(String update_time) {
		this.update_time = update_time;
	}
	public String getOrg_no_code() {
		return org_no_code;
	}
	public void setOrg_no_code(String org_no_code) {
		this.org_no_code = org_no_code;
	}
	public String getUser_belong() {
		return user_belong;
	}
	public void setUser_belong(String user_belong) {
		this.user_belong = user_belong;
	}
	public String getState_name() {
		return state_name;
	}
	public void setState_name(String state_name) {
		this.state_name = state_name;
	}
	public String getUser_post_name() {
		return user_post_name;
	}
	public void setUser_post_name(String user_post_name) {
		this.user_post_name = user_post_name;
	}
	public String getUser_level_name() {
		return user_level_name;
	}
	public void setUser_level_name(String user_level_name) {
		this.user_level_name = user_level_name;
	}
	public String getUser_belong_name() {
		return user_belong_name;
	}
	public void setUser_belong_name(String user_belong_name) {
		this.user_belong_name = user_belong_name;
	}
	public String getRepairlist_num() {
		return repairlist_num;
	}
	public void setRepairlist_num(String repairlist_num) {
		this.repairlist_num = repairlist_num;
	}
	public String getFinish_repairlist_num() {
		return finish_repairlist_num;
	}
	public void setFinish_repairlist_num(String finish_repairlist_num) {
		this.finish_repairlist_num = finish_repairlist_num;
	}
	public String getUnfinish_repairlist_num() {
		return unfinish_repairlist_num;
	}
	public void setUnfinish_repairlist_num(String unfinish_repairlist_num) {
		this.unfinish_repairlist_num = unfinish_repairlist_num;
	}
	public String getWechart_no() {
		return wechart_no;
	}
	public void setWechart_no(String wechart_no) {
		this.wechart_no = wechart_no;
	}
	
}
