/*jadclipse*/// Decompiled by Jad v1.5.8e2. Copyright 2001 Pavel Kouznetsov.
// Jad home page: http://kpdus.tripod.com/jad.html
// Decompiler options: packimports(3) radix(10) lradix(10) 
// Source File Name:   ISLogService.java

package com.yusys.service.SLogService;

import java.util.Map;
import javax.servlet.http.HttpServletRequest;

public interface ISLogService
{

    public abstract Map<String, Object> queryLoginLog(HttpServletRequest httpservletrequest, String s);

    public abstract Map<String, Object> queryOperaLog(HttpServletRequest httpservletrequest, String s);

    public abstract Map<String, String> insertNewLog(HttpServletRequest httpservletrequest, String s);

    public abstract Map<String, String> insertNewLog(HttpServletRequest httpservletrequest, Map<String,String> map);

    public abstract Map<String, String> savelogConfig(HttpServletRequest httpservletrequest, String s);

    public abstract Map<String, Object> queryLastLogConfig();

    public abstract void deleteLogbylimittime();
}
