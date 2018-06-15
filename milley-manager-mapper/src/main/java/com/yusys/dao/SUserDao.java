package com.yusys.dao;

import java.util.List;
import java.util.Map;

import com.yusys.common.SUser;

public interface SUserDao {
	//登陆
	public SUser findByParam(Map<String, String> map);
	//查询所有用户
	public List<Map<String, String>> queryAllUser(Map<String, String> map);
	//创建用户
	public void insertNewUser(Map<String, String> map);
	//查询单个用户信息
	public SUser queryOneUser(String user_no);
	//修改个人信息
	public void updateUser(Map<String, String> map);
	//删除用户信息
	public void delteUser(Map<String, Object> map);
	//查询角色
	public List<Map<String, String>> queryRoleuser(Map<String, String> map);
	//POP框查多条件询所有用户
	public List<Map<String, String>> popFindAllUser(Map<String, String> map);
	//查询用户密码
	public String findUserPass(String user_no);
	//修改用户密码
	public void updatePass(Map<String, String> map);
	//修改用户微信号
	public void updateWechartNo(Map<String, String>map);
}
