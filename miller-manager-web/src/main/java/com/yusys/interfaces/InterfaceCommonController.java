package com.yusys.interfaces;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONException;
import net.sf.json.JSONObject;

import org.apache.log4j.Logger;

import com.yusys.interfaces.Interface_TranCode_10001;
//import com.yusys.interfaces.tranCode10002.web.Interface_TranCode_10002;
//import com.yusys.interfaces.tranCode10003.web.Interface_TranCode_10003;


@SuppressWarnings("serial")  
public class InterfaceCommonController extends HttpServlet{
	private static final Logger logger = Logger.getLogger(InterfaceCommonController.class);
	private static final String TRAN_CODE_10001="10001";
	private static final String TRAN_CODE_10002="10002";
	private static final String TRAN_CODE_10003="10003";
	private static final String TRAN_CODE_10004="10004";
	private static final String TRAN_CODE_10005="10005";
	private static final String INTERFACE_RESULT_10001="{\"RESULT\":\"E0000\",\"MESSAGE\":\"提交成功！\"}";
	private static final String INTERFACE_RESULT_10002="{\"RESULT\":\"E0000\",\"MESSAGE\":\"获取成功\",\"TOTAL\":\"3\",\"DATA\":[{\"ASSET_NUM\":\"TXM100001\",\"ASSET_NAME\":\"我的电脑1\",\"CHECK_STATUS\":\"00\",\"RETURN_MARK\":\"\"},{\"ASSET_NUM\":\"TXM100002\",\"ASSET_NAME\":\"我的电脑2\",\"CHECK_STATUS\":\"00\",\"RETURN_MARK\":\"\"},{\"ASSET_NUM\":\"TXM100003\",\"ASSET_NAME\":\"我的电脑3\",\"CHECK_STATUS\":\"00\",\"RETURN_MARK\":\"\"}]}";
	private static final String INTERFACE_RESULT_10004="{\"RESULT\":\"E0000\",\"MESSAGE\":\"提交成功\",\"TOTAL\":\"2\",\"DATA\":[{\"SCHEME_NUM\":\"FA10001\",\"SCHEME_NAME\":\"盘点方案1\",\"ASSRT_TYPE\":[1012,1412,123112],\"AREA_ORGS\":\"102121\",\"CHECK_STATUS\":\"00\",\"DETAILS\":[{\"ASSET_NUM\":\"txm1001\",\"ASSET_NAME\":\"我的资产1\",\"CATEGORY_ID\":\"sercis\",\"CATEGORY_NAME\":\"服务器\",\"ASSET_MANAGER_NAME\":\"张三\",\"ASSET_MANAGER_ORG\":\"0001\",\"ORG_NAME\":\"金融部门\",\"REAL_ADDRESS\":\"广发金融中心16楼\",\"REAL_USER_NAME\":\"李四\"},{\"ASSET_NUM\":\"txm1002\",\"ASSET_NAME\":\"我的资产2\",\"CATEGORY_ID\":\"sercis\",\"CATEGORY_NAME\":\"服务器\",\"ASSET_MANAGER_NAME\":\"张三\",\"ASSET_MANAGER_ORG\":\"0001\",\"ORG_NAME\":\"金融部门\",\"REAL_ADDRESS\":\"广发金融中心16楼\",\"REAL_USER_NAME\":\"李四\"}]},{\"SCHEME_NUM\":\"FA10001\",\"SCHEME_NAME\":\"盘点方案1\",\"ASSRT_TYPE\":[1012,1412,123112],\"AREA_ORGS\":\"102121\",\"CHECK_STATUS\":\"00\",\"DETAILS\":[{\"ASSET_NUM\":\"txm1001\",\"ASSET_NAME\":\"我的资产1\",\"CATEGORY_ID\":\"sercis\",\"CATEGORY_NAME\":\"服务器\",\"ASSET_MANAGER_NAME\":\"张三\",\"ASSET_MANAGER_ORG\":\"0001\",\"ORG_NAME\":\"金融部门\",\"REAL_ADDRESS\":\"广发金融中心16楼\",\"REAL_USER_NAME\":\"李四\"},{\"ASSET_NUM\":\"txm1002\",\"ASSET_NAME\":\"我的资产2\",\"CATEGORY_ID\":\"sercis\",\"CATEGORY_NAME\":\"服务器\",\"ASSET_MANAGER_NAME\":\"张三\",\"ASSET_MANAGER_ORG\":\"0001\",\"ORG_NAME\":\"金融部门\",\"REAL_ADDRESS\":\"广发金融中心16楼\",\"REAL_USER_NAME\":\"李四\"}]}]}";
	private static final String INTERFACE_ERROR_RESULT="{\"RESULT\":\"E0003\",\"MESSAGE\":\"没有对应的交易码！\"}";
	private static final String INTERFACE_ERROR_RESULT_FORMAT="{\"result:E0001\",\"MESSAGE\":\"请求不正确！\"}";
	
	
	public InterfaceCommonController() {
		super();
	}
	
	public void init() throws ServletException {
		super.init() ;
	}
	
	public void destroy() {  
        super.destroy();   
    }
	
	public void doGet(HttpServletRequest request, HttpServletResponse response)  
            throws ServletException, IOException {  
        doPost(request, response) ;  
    } 
	
	public void doPost(HttpServletRequest request, HttpServletResponse response)  
            throws ServletException, IOException {
		logger.info("开始调用接口...");
		Long startTime = System.currentTimeMillis();
		response.setHeader("Access-Control-Allow-Origin", "*");
		response.setHeader("Access-Control-Allow-Methods", "POST");
		response.setHeader("Access-Control-Allow-Headers", "x-requested-with,content-type");
		request.setCharacterEncoding("utf-8");
		response.setCharacterEncoding("utf-8");
		StringBuffer params = new StringBuffer();
		
		//String params=RequestUtils.getParamValue(request, "jsonString");
		PrintWriter writer=null;
		StringBuffer result=new StringBuffer();
		try {
			//String act_name = new String(request.getParameter ("jsonString").getBytes("ISO-8859-1"),"UTF-8");
			//System.out.println(act_name);
			//考虑多线程的情况
			/*BufferedInputStream in = new BufferedInputStream(request.getInputStream()); 
			
            int i;  
            char c;  
            while ((i=in.read())!=-1) {  
            	c=(char)i;  
            	params.append(c);  
            }
            System.out.println("接收到的参数："+params);*/
			
			BufferedReader br = new BufferedReader(new InputStreamReader((ServletInputStream) request.getInputStream()));  
			writer=response.getWriter();
            String line = null;  
            while ((line = br.readLine()) != null) {  
            	params.append(line);  
            }  
            System.out.println("The receive params is:" + params); 
			
			//交易记录表
			//调用不同的服务类
			if(null==params){
				result.append(INTERFACE_ERROR_RESULT_FORMAT);
			}else{
				result.append(bussinessService(params.toString()));
				logger.info("返回的数据为："+result.toString());
			}
			//返回公共报文格式
		} catch (Exception e) {
			logger.error(e.getMessage());
			result.append("{\"result:E0001\",\"MESSAGE\":\""+e.getMessage()+"\"}");
			e.printStackTrace();
		}
		writer.write(result.toString());//
		Long endTime = System.currentTimeMillis();
		logger.info("接口调用完成！");
		logger.info("用时："+(endTime-startTime)/1000+"s");
	}
	
	
	/**
	 * 具体服务接口加载控制器
	 * */
	public String bussinessService(String params) throws JSONException{
		String returnResult=null;
		JSONObject jsonObject = JSONObject.fromObject(params);
		System.out.println("转成的json对象："+jsonObject);
		String tran_code = (String) jsonObject.get("TRAN_CODE");
		System.out.println("对应的交易码："+tran_code);
		if(TRAN_CODE_10001.equals(tran_code)){
			JSONObject obj =Interface_TranCode_10001.getInstance().bussinessService(jsonObject);
			returnResult=obj.toString();
		}else if(TRAN_CODE_10002.equals(tran_code)){
			//JSONObject obj =Interface_TranCode_10002.getInstance().bussinessService(jsonObject);
			//returnResult=obj.toString();
		}else if(TRAN_CODE_10003.equals(tran_code)){
			//JSONObject obj =Interface_TranCode_10003.getInstance().bussinessService(jsonObject);
			//returnResult=obj.toString();
		}else if(TRAN_CODE_10004.equals(tran_code)){
			returnResult=INTERFACE_RESULT_10004;
		}else if(TRAN_CODE_10005.equals(tran_code)){
			returnResult=INTERFACE_RESULT_10001;
		}else{
			returnResult=INTERFACE_ERROR_RESULT;
		}
		return returnResult;
	}
	
}
