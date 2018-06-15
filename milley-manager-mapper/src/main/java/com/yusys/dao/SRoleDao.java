package com.yusys.dao;

import java.util.List;
import java.util.Map;

import com.yusys.common.SRole;

public interface SRoleDao {
	//查询单个
    public List<SRole> querySRoleListByActorNo(String actorNo);
    public SRole findSRoleById(String roleno);
    //新增
    public void saveSRole(Map<String, String> map);
    //修改
    public void updateSRole(Map<String, String> map);
    //删除    
    public void deleteSRole(Map<String, String> map);
    //查询全部
    public List<Map<String,String>> findSRoleInfoAll(Map<String, String> map);
    /**
     * 角色菜单配置
     * @param map
     */
    public void	sRoleMenuDis(Map<String, String> map);
    /**
     * 查询菜单树是否被选中
     */
    public List<Map<String,String>>  queryTreeMenu(String role_no);
    //第二次保存时删除 角色已存在的 菜单菜单权限再保存
    public void deleteMenuDis(String role_no); 
    /**
     * 查询当前操作权限是否已存在
     * @param map
     */
    public List<Map<String,String>> queryOperDis(Map<String, String> map);
  //查询数据数据权限是否被选中
    public List<Map<String,String>>  queryDataAuth(Map<String,String> map);
    //查询字段权限是否被选中
    public List<Map<String,String>>  queryFiledAuth(Map<String,String> map);
    /**
     * 删除已存在的操作权限
     * @param map
     */
    public void deletOprDis(Map<String, String> map);
    //删除已存在的 数据权限
    public void deletDataAuth(Map<String, String> map);
    //删除已存在的字段权限
    public void deleteFiledAuth(Map<String,String> map);
    /**
     * 保存角色操作配置
     * @param map
     */
    public void sRoleOperDis(Map<String, String> map);
    /**
     * 角色数据权限
     * @param map
     */
    public void sRoleDataAuth(Map<String, String> map);
    /**
     * 角色字段权限
     * @param map
     */
    public void sRoleFieldAuth(Map<String, String> map);
    
    /**
     * 查询用户当前的角色
     * @param actorno
     * @return
     */
    public List<SRole> queryUserRole(Map<String, String> map);
    /**
     * 查询用户当前没有的角色
     * @param actorno
     * @return
     */
    public List<SRole> queryUserNoRole(Map<String, String> map);
    
    /**
     * 添加用户角色
     * @param map
     */
    public void addUserRole(Map<String, String> map);
    /**
     * 移除用户角色
     * @param map
     */
    public void rmUserRole(Map<String, String> map);
	//根据用户编码查询出该用户的所有角色	
    public List<Map<String, String>> findAllRoleById(Map<String, String> map);
    //多条件查询所有角色
    public List<Map<String, String>> findAllRole(Map<String, String> map);
}
