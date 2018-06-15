package com.yusys.service.SUserService;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.yusys.common.SUser;

public interface ISUserService{
	//查询所有用户
	public Map<String, Object> queryAllUser(HttpServletRequest req,String actorno);
	//查询用户详细信息
	public SUser queryOneUser(HttpServletRequest req,String actorno);
	//创建用户
	public Map<String, String> insertNewUser(HttpServletRequest req,String actorno);
	//修改用户信息
	public Map<String, String> updateUser(HttpServletRequest req,String actorno);
	//删除用户(标记位删除)
	public Map<String, String> delteUser(HttpServletRequest req,String actorno);
	//查询用户密码
	public Map<String, String> findUserPass(HttpServletRequest req,String actorno);
	//修改用户密码
	public Map<String, String> updatePass(HttpServletRequest req,String actorno);
	/**
	 * 用户登录
	 * @param req
	 * @param actorno
	 * @return
	 */
	public  Map<String, Object> userLogin(HttpServletRequest req,String actorno) ;
	/**
	 * @author  罗一飞
	 * @param POP框查询所有用户
	 */
	public Map<String, Object>  popFindAllUser(HttpServletRequest req,String userid);//查所有

    public SUser querySUserByNoCache(String user_no);

    public String addUserByCache(String user_no);
    
    /**
     * @author 周福生
     * @param 校验微信号是否存在
     * */
    public boolean checkWechartNoIsExists(String wechart_no);
}
