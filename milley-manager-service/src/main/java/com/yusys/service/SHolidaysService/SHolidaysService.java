package com.yusys.service.SHolidaysService;

import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.yusys.dao.SHolidaysDao;

@Service("holidayService")
@Transactional
public class SHolidaysService implements ISHolidaysService {
	@Resource
	private SHolidaysDao holidaysDao;
	/**
	 * 查询节假日所有标记
	 */
	@Override
	public Map<String, Object> queryHolidays(HttpServletRequest req,
			String actorno) {
		
		return null;
	}
	/**
	 * 写入
	 */
	@Override
	public Map<String, String> insertHoliday(HttpServletRequest req,
			String actorno) {
		
		return null;
	}

	@Override
	public Map<String, String> deleteHoliday(HttpServletRequest req,
			String actorno) {
		
		return null;
	}
    
}