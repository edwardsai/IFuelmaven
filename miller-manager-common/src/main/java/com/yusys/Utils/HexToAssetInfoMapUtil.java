package com.yusys.Utils;

import java.io.ByteArrayOutputStream;
import java.util.HashMap;
import java.util.Map;

public class HexToAssetInfoMapUtil {
	
	private static String hexString = "0123456789ABCDEF";
	
	/**
	 * 条形码规则：1. 一共存60位（定长）
	 * 			2. 0-40位存标签编码，其中0-12位存前缀（可存1-6个字母，一个字母解码出2位16进制，
	 * 					每不足一个字母的，解码后前面加00）-->需要解码，
	 * 					13-40位  -->不需要转码
	 * 			3. 41-50存机构,截取出来的字符串最后面逢0去掉（写入条形码的时候加的规则）-->不需要转码
	 * 			4. 51-60存类别,截取出来的字符串最后面逢0去掉（写入条形码的时候加的规则）-->不需要转码
	 * @param code
	 * @return
	 */
	public static Map<String, String> hexToMap(String code) {
		//JSONObject asset = new JSONObject();
		Map<String, String> asset = new HashMap<String, String>();
		String preTagIdCode = code.substring(0, 12);//获取标签编码的前缀
		for(int i = 0; i < 6; i++){
			 String subStr = preTagIdCode.substring(0, 2);
			 if(subStr.equals("00")){//一直把前缀有偶数倍的0去掉为止
				 preTagIdCode = preTagIdCode.substring(2);
			 }else{
				 break;
			 }
		 }
		String preTagId = decode(preTagIdCode);//解码出标签前缀
		String afterTagId = code.substring(12, 40);
		asset.put("ASSET_NUM", preTagId + afterTagId);
		
		String org = code.substring(40, 50);//所属机构
		for(int i = 0; i < 10; i++){
			 String subStr = org.substring(org.length() - 1, org.length());
			 if(subStr.equals("0")){//一直把后缀的0去掉为止
				 org = org.substring(0, org.length() - 1);
			 }else{
				 break;
			 }
		 }
		asset.put("ASSET_MANAGER_ORG", org);
		
		String type = code.substring(50, 60);//类别
		for(int i = 0; i < 10; i++){
			 String subStr = type.substring(type.length() - 1, type.length());
			 if(subStr.equals("0")){//一直把后缀的0去掉为止
				 type = type.substring(0, type.length() - 1);
			 }else{
				 break;
			 }
		 }
		asset.put("CATEGORY_ID", type);
		return asset;
	}
	
	/*
	 * 将字符串编码成16进制数字,适用于所有字符（包括中文）
	 */
	public static String encode(String str) {
	    // 根据默认编码获取字节数组
	    byte[] bytes = str.getBytes();
	    StringBuilder sb = new StringBuilder(bytes.length * 2);
	    // 将字节数组中每个字节拆解成2位16进制整数
	    for (int i = 0; i < bytes.length; i++) {
	    sb.append(hexString.charAt((bytes[i] & 0xf0) >> 4));
	    sb.append(hexString.charAt((bytes[i] & 0x0f) >> 0));
	    }
	    return sb.toString();
	}
	 
	/*
	 * 将16进制数字解码成字符串,适用于所有字符
	 */
	public static String decode(String bytes) {
	    ByteArrayOutputStream baos = new ByteArrayOutputStream(bytes.length() / 2);
	    // 将每2位16进制整数组装成一个字节
	    for (int i = 0; i < bytes.length(); i += 2)
	    baos.write((hexString.indexOf(bytes.charAt(i)) << 4 | hexString
	                    .indexOf(bytes.charAt(i + 1))));
	    return new String(baos.toByteArray());
	}
	
	
	public static void main(String[] args) {
		String code1 = "000000004251201704130102030405100000005611010102000104040100";
		String code2 = "000000004251201704140102030405100000006211010102000104040300";
		String code3 = "000000004251201704120102030405100000005411010102000104031200";
		String asset_num1 = "BQ2017041301020304051000000056";
		String asset_num2 = "BQ2017041401020304051000000062";
		String asset_num3 = "BQ2017041201020304051000000054";
		Map<String, String> assetInfo =  hexToMap(code3);
		System.out.println(assetInfo);
	}
	
	
	
}
