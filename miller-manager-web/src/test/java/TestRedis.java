import redis.clients.jedis.Jedis;
//import redis.clients.jedis.JedisPool;

public class TestRedis {

	public static void main(String[] args) {
		Jedis Jedis = new Jedis("119.23.227.39",6379);
		Jedis.set("test2","hello World!");
		String tt = Jedis.get("test2");
		System.out.println(tt);
		Jedis.close();
	}

}
