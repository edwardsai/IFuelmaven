package com.yusys.Utils;

import java.util.Properties;

import javax.mail.BodyPart;
import javax.mail.Message;
import javax.mail.Multipart;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

public class SendMailUtils {
	
	private static String host = null; // smtp服务器
	private static String user = null; // 用户名
	private static String pwd = null; // 密码
	private static String fromAddress = null; // 发件人地址
	//获取静态服务信息
	static{
		Properties prop= PropertiesUtils.getProperties("sysConfig.properties");
		host =prop.getProperty("host");
		user =prop.getProperty("user");
		pwd  =prop.getProperty("pwd");
		fromAddress =prop.getProperty("fromAddress");
	}
	
	public static boolean send(String title,String txt,String toAddress) {
		Properties props = new Properties();
		// 设置发送邮件的邮件服务器的属性（这里使用网易的smtp服务器）
		props.put("mail.smtp.host", host);
		// 需要经过授权，也就是有户名和密码的校验，这样才能通过验证（一定要有这一条）
		props.put("mail.smtp.auth", "true");
		// 用刚刚设置好的props对象构建一个session
		Session session = Session.getDefaultInstance(props);
		// 有了这句便可以在发送邮件的过程中在console处显示过程信息，供调试使
		// 用（你可以在控制台（console)上看到发送邮件的过程）
		session.setDebug(true);
		// 用session为参数定义消息对象
		MimeMessage message = new MimeMessage(session);
		try {
			// 加载发件人地址
			message.setFrom(new InternetAddress(fromAddress));
			// 加载收件人地址
			message.addRecipient(Message.RecipientType.TO, new InternetAddress(
					toAddress));
			// 加载标题
			message.setSubject(title);
			// 向multipart对象中添加邮件的各个部分内容，包括文本内容和附件
			Multipart multipart = new MimeMultipart();

			// 设置邮件的文本内容
			BodyPart contentPart = new MimeBodyPart();
			contentPart.setText(txt);
			multipart.addBodyPart(contentPart);

			// 添加附件
			// BodyPart messageBodyPart = new MimeBodyPart();
			// DataSource source = new FileDataSource(affix);
			// 添加附件的内容
			// messageBodyPart.setDataHandler(new DataHandler(source));
			// 添加附件的标题
			// 这里很重要，通过下面的Base64编码的转换可以保证你的中文附件标题名在发送时不会变成乱码
			// sun.misc.BASE64Encoder enc = new sun.misc.BASE64Encoder();
			// messageBodyPart.setFileName("=?GBK?B?"+
			// enc.encode(affixName.getBytes()) + "?=");
			// multipart.addBodyPart(messageBodyPart);

			// 将multipart对象放到message中
			message.setContent(multipart);
			// 保存邮件
			message.saveChanges();
			// 发送邮件
			Transport transport = session.getTransport("smtp");
			// 连接服务器的邮箱
			transport.connect(host, user, pwd);
			// 把邮件发送出去
			transport.sendMessage(message, message.getAllRecipients());
			transport.close();
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	public static void main(String[] args) {
		//邮件标题
		String title="请【查阅】关于供应商管理系统验收材料";
		//邮件内容
		String message="XXX先生，你好！\n 这是我的信息反馈，请认真阅读。";
		//目标地址
		String toAddress="chenjh3@yusys.com.cn";
		send(title,message,toAddress);
	}
}