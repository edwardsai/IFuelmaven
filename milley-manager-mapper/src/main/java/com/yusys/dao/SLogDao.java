package com.yusys.dao;

import java.util.List;
import java.util.Map;



public interface SLogDao{

    public abstract List<Map<String, String>> queryLoginLog(Map<String, String> map);

    public abstract List<Map<String, String>> queryOperaLog(Map<String, String> map);

    public abstract void insertNewLog(Map<String, String> map);

    public abstract void savelogConfig(Map<String, String> map);

    public abstract Map<String,Object> queryLastLogConfig();

    public abstract void deleteLogbylimittime(Map<String,String> map);
}
