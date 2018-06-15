package com.yusys.Utils;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import javax.annotation.PostConstruct;

import org.apache.ibatis.executor.Executor;
import org.apache.ibatis.mapping.BoundSql;
import org.apache.ibatis.mapping.MappedStatement;
import org.apache.ibatis.mapping.MappedStatement.Builder;
import org.apache.ibatis.mapping.ParameterMapping;
import org.apache.ibatis.mapping.SqlSource;
import org.apache.ibatis.plugin.Interceptor;
import org.apache.ibatis.plugin.Intercepts;
import org.apache.ibatis.plugin.Invocation;
import org.apache.ibatis.plugin.Plugin;
import org.apache.ibatis.plugin.Signature;
import org.apache.ibatis.scripting.defaults.DefaultParameterHandler;
import org.apache.ibatis.session.ResultHandler;
import org.apache.ibatis.session.RowBounds;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Before;

@Intercepts({ @Signature(type = Executor.class, method = "query", args = {
		MappedStatement.class, Object.class, RowBounds.class,
		ResultHandler.class }) })
public class AuthorityAndPageInterceptor implements Interceptor {

	private Map<String, Object> authorityParams;
	private Map<String, Boolean> authorityPower;
	
	public AuthorityAndPageInterceptor(String configFilePath){
		if(authorityParams!=null){
			authorityParams = null;
		} 
		Properties pp = new Properties();
		try {
			String path = AuthorityAndPageInterceptor.class.getClassLoader().getResource(configFilePath).getPath();
			pp.load(new FileInputStream(path));
//			pp.load(AuthorityAndPageInterceptor.class.getResourceAsStream(configFilePath));
			pp.put("load", "true");
		} catch (IOException e) {
			e.printStackTrace();
			pp.put("load", "false");
			pp.put("reason", "获取文件失败");
		}
		authorityParams = new HashMap<String, Object>((Map) pp);
		if("true".equals(authorityParams.get("load"))){
			if("true".equals(authorityParams.get("roleDataAuthority"))){
				authorityPower = new HashMap<String, Boolean>();
				authorityPower.put("roleDataAuthority", true);
				authorityPower.put("rpecialRole", Boolean.parseBoolean((String)authorityParams.get("rpecialRole")));
				authorityPower.put("recursion", Boolean.parseBoolean((String)authorityParams.get("recursion")));
				authorityPower.put("writeSql", Boolean.parseBoolean((String)authorityParams.get("writeSql")));
			}
		}
	}
	
	@Override
	public Object intercept(Invocation invocation) throws Throwable {
		preInterCept(invocation);
		Object result = doInterCept(invocation);
		return afterInterCept(result);
	}
	
	private Object doInterCept(Invocation invocation) throws Exception{
		MappedStatement mappedStatement = (MappedStatement) invocation
				.getArgs()[0];
		Object parameter = invocation.getArgs()[1];
		int[] limitOffset = getLimitOffset(parameter);
		//加入判断是否系统初始化的判断
		
		Object aa = authorityParams.get("roleDataAuthority");
		Connection connection;
		ResultSet rs;
		PreparedStatement countStmt;
		
		if(limitOffset.length == 2 || authorityPower.get("roleDataAuthority")){
			connection = mappedStatement.getConfiguration().getEnvironment().getDataSource().getConnection();
			BoundSql boundSql = mappedStatement.getBoundSql(parameter);
			String originalSql = boundSql.getSql().trim();
			
			//是否执行权限控制
			if(parameter!=null&&"java.util.HashMap".equals(parameter.getClass().getName())){
				if(parameter!=null&&authorityPower.get("roleDataAuthority")&&((Map)parameter).containsKey(authorityParams.get("orgIdRow"))){
					String userid = (String) ((Map)parameter).get(authorityParams.get("userIdRow"));
					String orgid = (String) ((Map)parameter).get(authorityParams.get("orgIdRow"));
					String menuid = (String) ((Map)parameter).get(authorityParams.get("menuIdRow"));
					Integer totpage = null;
					//提取成配置
					//oracle语法
					/*String userdata = "select max(to_number(rd.data_no)) from s_roleuser t, s_roledata rd where t."+authorityParams.get("userIdRow")+"='"+userid+
							"' and rd.role_no=t.role_no and rd."+authorityParams.get("menuIdRow")+"='"+menuid+"'";*/
					//mysql
					String userdata = "select max((rd.data_no)) from s_roleuser t, s_roledata rd where t."+authorityParams.get("userIdRow")+"='"+userid+
					"' and rd.role_no=t.role_no and rd."+authorityParams.get("menuIdRow")+"='"+menuid+"'";
					countStmt = connection.prepareStatement(userdata);
					rs = countStmt.executeQuery();
					while (rs.next()) {
						totpage = rs.getInt(1);
					}
					rs.close();
					countStmt.close();
					
					if(totpage!=null){
						switch (totpage) {
						case 0:
							originalSql = "select * from (" + originalSql + ") where " + authorityParams.get("userIdRow") + "='" + userid + "'";
							break;
						case 1:
							originalSql = "select * from (" + originalSql + ") where " + authorityParams.get("orgIdRow") + 
							" in (select org_code from s_org connect by prior org_code=suporg_code start with org_code ='" + orgid + "')";
							break;
						case 2:
							originalSql = "select * from (" + originalSql + ") where " + authorityParams.get("orgIdRow") + 
							" in (select org_code from s_org connect by prior org_code=suporg_code start with org_code ='1101')";
							break;
						case 3:
							break;
						default:
							break;
						}
					}
				}
			}
			
			//分页查询
			if (limitOffset.length == 2) {
				String countSql = getCountSql(originalSql);
				/*Connection connection = mappedStatement.getConfiguration()
						.getEnvironment().getDataSource().getConnection();*/
				countStmt = connection.prepareStatement(countSql);
				BoundSql countBS = copyFromBoundSql(mappedStatement, boundSql,
						countSql);
				DefaultParameterHandler parameterHandler = new DefaultParameterHandler(
						mappedStatement, boundSql.getParameterObject(), countBS);
				parameterHandler.setParameters(countStmt);
				rs = countStmt.executeQuery();
				int totpage = 0;
				if (rs.next()) {
					totpage = rs.getInt(1);
				}
				rs.close();
				countStmt.close();

				int offset = limitOffset[0] + 1;
				int end = offset + limitOffset[1];
				if (end>totpage) {
					end=totpage+1;
				}
				originalSql = getLimitSql(originalSql, offset, end-1);
				Map<String, String> map = (Map<String, String>)parameter;
				map.put("total", totpage+"");
			}
			
			try{
				if(!connection.isClosed())	connection.close();
			} catch(Exception e){
				e.printStackTrace();
			} finally {
				try{
					if(!connection.isClosed())	connection.close();
				} catch(Exception e){
					e.printStackTrace();
				}
			}
			final BoundSql newBoundSql = copyFromBoundSql(mappedStatement, boundSql,originalSql); 
			MappedStatement newMs =
					copyFromMappedStatement(mappedStatement,new SqlSource() {
						BoundSql boundSql=newBoundSql;
						@Override
						public BoundSql getBoundSql(Object paramObject) {
							return boundSql;
						}
					});
			invocation.getArgs()[0]= newMs;
		}
		
		return invocation.proceed();
	}
	
	public Invocation preInterCept(Invocation invocation){
		return invocation;
	}
	
	public Object afterInterCept(Object result){
		//TODO
		return result;
	}

	/**
	 * 获取分页数据
	 * 
	 * @param o
	 * 
	 * @return offset,limit
	 */
	private int[] getLimitOffset(Object o) {
		if (o == null) {
			return new int[] {};
		}
		try {
			if (o instanceof Map) {
				Map map = (Map)o;
				if (map.containsKey("offset")&&map.containsKey("limit")) {//
					/*//加入系统初始化的判断
					Object init=null;
					if(map.containsKey("init")){
						init =map.get("init");
					}*/
					Object offset = map.get("offset");
					Object limit = map.get("limit");
					if((offset != null&& limit != null&&!"".equals(limit) )){
						/*if(init!=null){
							return new int[] { Integer.parseInt(offset+""),
									Integer.parseInt(limit+""),Integer.parseInt(init+"") };
						}else{*/
							return new int[] { Integer.parseInt(offset+""),
									Integer.parseInt(limit+"") };
						//}
					}
				}
			}
		} catch (ClassCastException e) {
			e.printStackTrace();
		}
		return new int[] {};
	}

	/**
	 * 根据原Sql语句获取对应的查询总记录数的Sql语句
	 */
	private String getCountSql(String sql) {
		//return "select count(1) from (" + sql + ") dual";
		//dual为oracle的关键字，mysql会报错
		return "select count(1) from (" + sql + ") a";
	}

	/**
	 * 获取分页Sql
	 * 
	 * @param sql
	 * @param start
	 * @param end
	 * @return
	 */
	private String getLimitSql(String sql, int start, int end) {
		StringBuilder sb = new StringBuilder();
		//oracle的分页
		/*sb.append("select * from (select rownum as row_num,a.* from (");
		sb.append(sql);
		sb.append(") a)");
		sb.append(" where row_num between " + start);
		sb.append(" and " + end);*/
		
		//mysql的分页
		sb.append("select * from (");
		sb.append(sql);
		sb.append(") alias limit ");
		sb.append(start+","+end);
		return sb.toString();
	}

	/**
	 * 复制BoundSql对象
	 */
	private BoundSql copyFromBoundSql(MappedStatement ms, BoundSql boundSql,
			String sql) {
		BoundSql newBoundSql = new BoundSql(ms.getConfiguration(), sql,
				boundSql.getParameterMappings(), boundSql.getParameterObject());
		for (ParameterMapping mapping : boundSql.getParameterMappings()) {
			String prop = mapping.getProperty();
			if (boundSql.hasAdditionalParameter(prop)) {
				newBoundSql.setAdditionalParameter(prop,
						boundSql.getAdditionalParameter(prop));
			}
		}
		return newBoundSql;
	}
	  /** 
	   * 复制MappedStatement对象 
	   */  
	  private MappedStatement copyFromMappedStatement(MappedStatement ms,SqlSource newSqlSource) {  
	    Builder builder = new Builder(ms.getConfiguration(),ms.getId(),newSqlSource,ms.getSqlCommandType());  
	      
	    builder.resource(ms.getResource());  
	    builder.fetchSize(ms.getFetchSize());  
	    builder.statementType(ms.getStatementType());  
	    builder.keyGenerator(ms.getKeyGenerator());  
	   // builder.keyProperty(ms.getKeyProperty());  
	    builder.timeout(ms.getTimeout());  
	    builder.parameterMap(ms.getParameterMap());  
	    builder.resultMaps(ms.getResultMaps());  
	    builder.resultSetType(ms.getResultSetType());  
	    builder.cache(ms.getCache());  
	    builder.flushCacheRequired(ms.isFlushCacheRequired());  
	    builder.useCache(ms.isUseCache());  
	      
	    return builder.build();  
	  }  
	@Override
	public Object plugin(Object target) {

		return Plugin.wrap(target, this);
	}

	@Override
	public void setProperties(Properties arg0) {

	}
}
