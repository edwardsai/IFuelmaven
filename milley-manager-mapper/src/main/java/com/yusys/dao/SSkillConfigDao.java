package com.yusys.dao;

import java.util.List;
import java.util.Map;

import com.yusys.common.SSkillConfig;

public interface SSkillConfigDao {

	    //新增技能配置
		public void addskillconfig(Map<String, String> map);
		//删除技能配置
		public void deleteskillconfig(Map<String, String> map);
		//更新技能配置
		public void updateskillconfig(Map<String, String> map);
		//查询所有技能配置
		public List<Map<String, String>> queryAllskillconfig(Map<String, String> map);
		//具体查询技能配置
		public SSkillConfig queryoneskillconfig(String str);
		//具体删除技能配置
		public void deleteskillconfigByid(Map<String, String> pmap);
		/**
		 * 修改子菜单的 父菜单编号
		 * @param map
		 */
		public void updateChilMenuSupNo(Map<String, String> map);
		/**
		 * 修改子菜单的 菜单级别
		 * @param map
		 */
		public void updateChilMenuLevel(Map<String, String> map);
		/**
		 * 清空父节点
		 * @param haveId
		 */
		public void clearMenuSupNoInfo(String haveId);
}
