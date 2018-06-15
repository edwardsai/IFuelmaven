package com.yusys.Utils;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
public class ExportSchemeUtils {
	
	private static String url = null; // 存放地址
	static{
		Properties prop= PropertiesUtils.getProperties("inventorySchemeURL.properties");
		url = prop.getProperty("url");
	}
	
	@SuppressWarnings("finally")
	public static Map<String, Object> export(String fileName, String SchemeInfo) {
		Map<String, Object> map = new HashMap<String, Object>();
		BufferedWriter writer = null;
		try {
			String newUrl = url + File.separator + System.currentTimeMillis();
			File dir = new File(newUrl);
			if (!dir.exists()) {
				dir.mkdirs();
			}
			String newFileName = newUrl + File.separator + fileName;
			File file = new File(newFileName);
			if (!file.exists()) {
				file.createNewFile();
			}else{
				file.delete();
				file.createNewFile();
			}
            FileOutputStream writerStream = new FileOutputStream(file);  
            writer = new BufferedWriter(new OutputStreamWriter(writerStream, "UTF-8")); 
            writer.write(SchemeInfo);
            map.put("result", true);
            map.put("fileName", newFileName);
            return map;
		} catch (Exception e) {
			e.printStackTrace();
			map.put("result", false);
			 return map;
		}finally{
			if (writer != null) {
				try {
					writer.close();
				} catch (final IOException e) {
					e.printStackTrace();
				}
			}
		}
	}
}