package com.yusys.service.SFileInfoService;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import javazoom.upload.MultipartFormDataRequest;
import javazoom.upload.UploadBean;
import javazoom.upload.UploadException;
import javazoom.upload.UploadFile;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import uploadutilities.FileMover;

import com.yusys.Utils.DateTimeUtils;
import com.yusys.Utils.OfficeFileConvertUtil;
import com.yusys.Utils.RequestUtils;
import com.yusys.dao.SFileInfoDao;

@Service("fileInfoService")
@Transactional
public class SFileInfoService implements ISFileInfoService {
	/**
	 *  可预览的图片
	 */
	private static Map<String, String> isViewImage=new HashMap<String, String>();
	
	static{
		isViewImage.put(".png", "png");
		isViewImage.put(".jpg", "jpg");
		isViewImage.put(".jpeg", "jpeg");
		isViewImage.put(".bmp", "bmp");
		isViewImage.put(".gif", "gif");
	}
	
	
	@Resource
	private SFileInfoDao fileInfoDao;
	
	@Override
	public Map<String, Object> findFileInfo(HttpServletRequest request,String userid){
		Map<String, String> paramMap=RequestUtils.requestToMap(request, new String[]{"file_id"}, null);
		if(paramMap==null){
			Map<String, Object>  smap=new HashMap<String, Object>();
			smap.put("result", "false");
			return smap;
		}

		 String limit = RequestUtils.getParamValue(request, "limit");
		 String offset = RequestUtils.getParamValue(request, "offset");
		 if (limit!=null&&offset!=null) {
			 paramMap.put("limit",limit);
			 paramMap.put("offset",offset);
		 }
		 List<Map<String, String>> m=fileInfoDao.findFileInfo(paramMap);
		 Map<String, Object> map=new HashMap<String, Object>();
		 map.put("rows", m);
		 map.put("total", paramMap.containsKey("total")?paramMap.get("total"):m.size());
		return map;
	}
	
	@Override
	public Map<String, String> fileUpload(HttpServletRequest request, String userid) {
		Map<String, String> paramMap=RequestUtils.requestToMap(request, new String[]{"path_id","file_name","file_id"}, null);
		Map<String, String> map=new HashMap<String, String>();
		if(paramMap==null){
			map.put("result", "false");
			map.put("msg", "缺少参数!");
			return map;
		}
		Map<String, String>path=fileInfoDao.getFilePathById(paramMap.get("path_id"));
		try {
			paramMap.put("file_name", URLDecoder.decode(paramMap.get("file_name"), "UTF-8"));
		} catch (UnsupportedEncodingException e2) {
			e2.printStackTrace();
		}
		paramMap.putAll(fileUploadToDisk(request,paramMap.get("file_name"),path.get("PATH"),null));
		paramMap.put("opt_person", userid);
		paramMap.put("opt_time", DateTimeUtils.getFormatCurrentTime());
		fileInfoDao.addFileInfo(paramMap);
		map.put("result", "true");
		return map;
	}
	
	/**
	 * 上传附件到磁盘
	 * @param request
	 * @param fileName
	 * @param basePath
	 * @param formName
	 * @return keys[id,file_count,file_type]
	 */
	private Map<String, String> fileUploadToDisk(HttpServletRequest request,String fileName,String basePath,String formName) {
		Map<String, String> map=new HashMap<String, String>();
		if (formName==null) {
			formName="file";
		}
		try {
			request.setCharacterEncoding("GBK");
		} catch (UnsupportedEncodingException e1) {
			e1.printStackTrace();
		}
		FileMover fileMover = new FileMover();// 你也可以使用自带的实例中jsp:useBean的形式。
		UploadBean upBean = new UploadBean();
		MultipartFormDataRequest mrequest = null;
		Hashtable files = null;

		if (MultipartFormDataRequest.isMultipartFormData(request)) {
			try {
				mrequest = new MultipartFormDataRequest(request, null,
						100 * 1024 * 1024, MultipartFormDataRequest.COSPARSER,
						"GBK");
			} catch (Exception e) {
				e.printStackTrace();
			}
			files = mrequest.getFiles();
		}
		
		String sServerFileName = "";
		// 文件获取
		if ((files != null) || (!files.isEmpty())) {
			UploadFile file = (UploadFile) files.get(formName);
			map.put("file_count",file.getFileSize()+"");
			if (fileName != null) {
				int ii = fileName.lastIndexOf("."); // 取文件名的后缀
				
				String sExt = fileName.substring(ii);
				map.put("file_type", sExt.toLowerCase());
				// 得到不重复的文件名
				java.util.Date dt = new java.util.Date(
						System.currentTimeMillis());
				SimpleDateFormat fmt = new SimpleDateFormat("yyyyMMddHHmmssSSS");
				sServerFileName = fmt.format(dt);
				// 如果不存在该目录，则新建一个
				File dir = new File(basePath);
				if (!dir.exists()) {
					dir.mkdirs();
				}
				try {
					upBean.setFolderstore(basePath);
				} catch (UploadException e) {
					e.printStackTrace();
				}// 设置要上传的目录
				upBean.addUploadListener(fileMover);// 增加filMover监听
				fileMover.setNewfilename(sServerFileName + sExt);// 设置服务器上的文件名
				try {
					try {
						upBean.store(mrequest, formName);
					} catch (UploadException e) {
						e.printStackTrace();
					}
				} catch (IOException e) {
					e.printStackTrace();
				}

				if(isViewImage.containsKey(sExt)){
					map.put("is_view", "00");
				}else{
					map.put("is_view", "");
				}

				OfficeFileConvertUtil.buildFilePreView(basePath,sServerFileName,sExt,fileInfoDao);
			}
		}
		map.put("id", sServerFileName);
		return map;
	}

	@Override
	public boolean fileDownLoad(HttpServletRequest request,
			HttpServletResponse response, String userid) {
		Map<String, String> paramMap=RequestUtils.requestToMap(request, new String[]{"id"}, null);
		List<Map<String, String>> m=fileInfoDao.findFileInfo(paramMap);
		if (m!=null&&m.size()>0) {
			try {
				response.setHeader("Content-Disposition", "attachment;filename="+URLEncoder.encode(m.get(0).get("FILE_NAME"),"UTF-8"));
				InputStream is=new FileInputStream(m.get(0).get("PATH")+"/"+m.get(0).get("ID")+m.get(0).get("FILE_TYPE"));
				OutputStream os=response.getOutputStream();
				int len=0;
				byte[] buffer=new byte[1024];
				while ((len=is.read(buffer))!=-1) {
					os.write(buffer,0,len);
				}
				is.close();
				return true;
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return false;
	}

	@Override
	public boolean delFileInfo(HttpServletRequest request, String userid) {
		Map<String, String> paramMap=RequestUtils.requestToMap(request, new String[]{"id"}, null);
		paramMap.put("userid", userid);
		List<Map<String, String>> m=fileInfoDao.findFileInfo(paramMap);
		if (m!=null&&m.size()>0) {
			java.io.File filePath = new java.io.File(m.get(0).get("PATH")+"/"+m.get(0).get("ID")+m.get(0).get("FILE_TYPE"));
			filePath.delete();
			fileInfoDao.delFildInfo(paramMap.get("id"));

			java.io.File filePdfPath = new java.io.File(m.get(0).get("PATH")+"/pdf/"+m.get(0).get("ID")+".pdf");
			filePdfPath.delete();
			java.io.File fileSWFPath = new java.io.File(m.get(0).get("PATH")+"/swf/"+m.get(0).get("ID")+".swf");
			fileSWFPath.delete();
			return true;
		}
		return false;
	}

	@Override
	public boolean filePreFileView(HttpServletRequest request,
			HttpServletResponse response, String userid) {
		
		Map<String, String> paramMap=RequestUtils.requestToMap(request, new String[]{"id"}, null);
		List<Map<String, String>> m=fileInfoDao.findFileInfo(paramMap);
		if (m!=null&&m.size()>0) {
			try {
				InputStream is=null;
				if(isViewImage.containsKey(m.get(0).get("FILE_TYPE"))){
					response.setHeader("Content-Type", "image/"+m.get(0).get("FILE_TYPE").substring(1));
					is=new FileInputStream(m.get(0).get("PATH")+"/"+m.get(0).get("ID")+m.get(0).get("FILE_TYPE"));
				}else{
					response.setHeader("Content-Type", "application/x-shockwave-flash");
					is=new FileInputStream(m.get(0).get("PATH")+"/swf/"+m.get(0).get("ID")+".swf");
				}
				
				OutputStream os=response.getOutputStream();
				int len=0;
				byte[] buffer=new byte[1024];
				while ((len=is.read(buffer))!=-1) {
					os.write(buffer,0,len);
				}
				is.close();
				return true;
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return false;
	}

	@Override
	public boolean doFileDownLoad(HttpServletRequest request,HttpServletResponse response, String userid) {
		Map<String, String> paramMap=RequestUtils.requestToMap(request, null,new String[]{"file"});
		String path = request.getSession().getServletContext().getRealPath("/");
		try {
			response.setHeader("Content-Disposition", "attachment;filename="+URLEncoder.encode(paramMap.get("file"),"UTF-8"));
			InputStream is=new FileInputStream(path+paramMap.get("file"));
			OutputStream os=response.getOutputStream();
			int len=0;
			byte[] buffer=new byte[1024];
			while ((len=is.read(buffer))!=-1) {
				os.write(buffer,0,len);
			}
			is.close();
			return true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}
}
