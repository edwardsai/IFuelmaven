package com.yusys.consumableManager;

public class GoodsInDetail {
	
	/**
	 * 物品id
	 */
	private String goodsId;
	/**
	 * 入库流水号
	 */
	private String id;
	/**
	 * 物品数量
	 */
	private String goodsNumber;
	/**
	 * 物品价格
	 */
	private String price;
	/**
	 * 物品金额
	 */
	private String money;
	/**
	 * 删除标识
	 */
	private String room;
	/*private String flag;*/
	
	public String getGoodsId() {
		return goodsId;
	}
	public void setGoodsId(String goodsId) {
		this.goodsId = goodsId;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getGoodsNumber() {
		return goodsNumber;
	}
	public void setGoodsNumber(String goodsNumber) {
		this.goodsNumber = goodsNumber;
	}
	public String getPrice() {
		return price;
	}
	public void setPrice(String price) {
		this.price = price;
	}
	public String getMoney() {
		return money;
	}
	public void setMoney(String money) {
		this.money = money;
	}
	public String getRoom() {
		return room;
	}
	public void setRoom(String room) {
		this.room = room;
	}

}
