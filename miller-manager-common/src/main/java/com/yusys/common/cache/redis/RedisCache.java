package com.yusys.common.cache.redis;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.util.List;

import org.springframework.cache.Cache;
import org.springframework.cache.support.SimpleValueWrapper;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.RedisTemplate;


/**
 * Created with IntelliJ IDEA.
 * User: wuxw1
 * Date: 16-3-28
 * Time: 下午6:39
 */
public class RedisCache implements Cache {
    
    private RedisTemplate<String, Object> redisTemplate;
    
	RedisCache(List<IMyCache> myCaches,RedisTemplate<String, Object> redisTemplate){
    	this.redisTemplate=redisTemplate;
    	initCache(myCaches,this);
    }
	
	/**
	 * 
	 * @param myCaches
	 * @param cache
	 */
	private static void initCache(List<IMyCache> myCaches,Cache cache){
		for (int i = 0; i < myCaches.size(); i++) {
			myCaches.get(i).initCache(cache);
		}
	}

    private String name;
    
    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String getName() {
        return this.name;
    }

    @Override
    public Object getNativeCache() {
        return this.redisTemplate;
    }

    @Override
    public ValueWrapper get(Object key) {
    	try{
    		final String keyf = (String) key;
            Object object = null;
            object = redisTemplate.execute(new RedisCallback<Object>() {
                public Object doInRedis(RedisConnection connection) throws DataAccessException {

                    byte[] key = keyf.getBytes();
                    byte[] value = connection.get(key);
                    if (value == null) {
                        return null;
                    }
                    return toObject(value);
                }
            });
            return (object != null ? new SimpleValueWrapper(object) : null);
    	}catch(Exception e){
    		e.printStackTrace();
    	}
        return null;
    }
    /**
     * @param key
     * @param value
     * @param liveTime 存活时间（秒）
     */
    public void set(String key, String value, long liveTime) {
        this.set(key.getBytes(), value.getBytes(), liveTime);
    }
    /**
     * zlg add 2016-11-23
     * @param key
     * @param value
     * @param liveTime
     */
    @SuppressWarnings({ "unchecked", "rawtypes" })
	public void set(final byte[] key, final byte[] value, final long liveTime) {
        redisTemplate.execute(new RedisCallback() {
        public Long doInRedis(RedisConnection connection) throws DataAccessException {
                connection.set(key, value);
                if (liveTime > 0) {
                    connection.expire(key, liveTime);
                }
                return 1L;
            }
        });
    }
    @Override
    public void put(Object key, Object value) {
    	try{
    		 final String keyf = (String) key;
    	        final Object valuef = value;
    	        final long liveTime = 17560*24;
    	        get(keyf);

    	        redisTemplate.execute(new RedisCallback<Long>() {
    	            public Long doInRedis(RedisConnection connection) throws DataAccessException {
    	                byte[] keyb = keyf.getBytes();
    	                byte[] valueb = toByteArray(valuef);
    	                connection.set(keyb, valueb);
    	                if (liveTime > 0) {
    	                    connection.expire(keyb, liveTime);
    	                }
    	                return 1L;
    	            }
    	        });
    	}catch(Exception e){
    		e.printStackTrace();
    	}
    }

    /**
     * 描述 : <Object转byte[]>. <br>
     * <p>
     * <使用方法说明>
     * </p>
     *
     * @param obj
     * @return
     */
    private byte[] toByteArray(Object obj) {
        byte[] bytes = null;
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        try {
            ObjectOutputStream oos = new ObjectOutputStream(bos);
            oos.writeObject(obj);
            oos.flush();
            bytes = bos.toByteArray();
            oos.close();
            bos.close();
        } catch (IOException ex) {
            ex.printStackTrace();
        }
        return bytes;
    }

    /**
     * 描述 : <byte[]转Object>. <br>
     * <p>
     * <使用方法说明>
     * </p>
     *
     * @param bytes
     * @return
     */
    private Object toObject(byte[] bytes) {
        Object obj = null;
        try {
            ByteArrayInputStream bis = new ByteArrayInputStream(bytes);
            ObjectInputStream ois = new ObjectInputStream(bis);
            obj = ois.readObject();
            ois.close();
            bis.close();
        } catch (IOException ex) {
            ex.printStackTrace();
        } catch (ClassNotFoundException ex) {
            ex.printStackTrace();
        }
        return obj;
    }

    @Override
    public void evict(Object key) {
        final String keyf = (String) key;
        redisTemplate.execute(new RedisCallback<Long>() {
            public Long doInRedis(RedisConnection connection) throws DataAccessException {
                return connection.del(keyf.getBytes());
            }
        });
    }

    @Override
    public void clear() {
        redisTemplate.execute(new RedisCallback<String>() {
            public String doInRedis(RedisConnection connection) throws DataAccessException {
                connection.flushDb();
                return "ok";
            }
        });
    }

    @SuppressWarnings("unchecked")
    public <T> T get(Object key, Class<T> type) {
        final String keyf = (String) key;
        Object object = null;
        try {
        	object = redisTemplate.execute(new RedisCallback<Object>() {
        		public Object doInRedis(RedisConnection connection) throws DataAccessException {
        			
        			byte[] key = keyf.getBytes();
        			byte[] value = connection.get(key);
        			if (value == null) {
        				return null;
        			}
        			return toObject(value);
        		}
        	});
        	return (T) object;
		} catch (Exception e) {
			e.printStackTrace();
		}
        return null;
    }

    public ValueWrapper putIfAbsent(Object key, Object value) {
        put(key, value);
        return new SimpleValueWrapper(value);
    }
}
