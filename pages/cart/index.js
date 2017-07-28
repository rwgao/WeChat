// pages/cart/index.js
var app = getApp()
var util = require('../../utils/util.js')
var openid, JSESSIONID1, JSESSIONID2, usropenid;
openid = usropenid = app.getCookie("usropenid")
JSESSIONID1 = app.getCookie("JSESSIONID ")
JSESSIONID2 = app.getCookie("JSESSIONID  ")
var cookie = "usropenid=" + usropenid + "; JSESSIONID=" + JSESSIONID1 + "; JSESSIONID=" + JSESSIONID2 + ";"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTips: false,
    goodsStock:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let { data, checked_ids} = that.getIds(0);
    that.getCartInfo(data, checked_ids, cookie)
  },

  // 获取商品id
  getIds: function (cardfee) {
    var that = this;
    var arr = [];
    var goods = [];
    var openId = app.getCookie("usropenid");
    var goods_info = wx.getStorageInfoSync()
    let data = {};
    for (let i = 0; i < goods_info.keys.length; i++) {
      if (goods_info.keys[i].indexOf("goods_") != -1) {
        arr.push(goods_info.keys[i].substr(6))
      }
    }
    var ids = arr.join("/")
    var checked_ids = arr.join("%2F")
    wx.setStorage({
      key: 'checked_ids',
      data: checked_ids
    })
    if (arr.length > 0) {
      for (let j = 0; j < arr.length; j++) {
        var goods_json = JSON.parse(app.getCookie("goods_" + arr[j]));
        var goodsid = arr[j];
        var carttime = goods_json.timestamp,
          price = goods_json.ourprice.toFixed(2),
          amount = goods_json.goodsamount,
          wareid = goods_json.wareid;
        goods.push(
          {
            goodsid, carttime, wareid, price, amount
          }
        )
      }
      goods = JSON.stringify(goods);
      data.openId = openId;
      data.goodsid = ids;
      data.cardfee = cardfee;
      data.goodsinfo = goods;
    }
    return { data, checked_ids}
  },

  // 选择商品
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    console.log(e)
    var cartList = this.data.cartList,
      values = e.detail.value,
      key = e.target.dataset["key"];
    if (key == 'all') {
      for (let i = 0, lenI = cartList.length; i < lenI; i++) {
        let list = cartList[i];
        list.checked = false;
        for (let k = 0, lenK = list.group.length; k < lenK; k++) {
          list.group[k].checked = false;
        }
        for (let j = 0, lenJ = values.length; j < lenJ; j++) {
          if (list.id == values[j]) {
            list.checked = true;
            for (let l = 0, lenL = list.group.length; l < lenL; l++) {
              list.group[l].checked = true;
            }
          }
        }
      }
    } else {
      let index = e.target.dataset['index'];
      for (let i = 0, lenI = cartList[index].group.length; i < lenI; i++) {
        cartList[index].group[i].checked = false;
        for (let j = 0, lenJ = values.length; j < lenJ; j++) {
          if (cartList[index].group[i].goodsid == values[j]) {
            cartList[index].group[i].checked = true;
          }
          if (values.length != cartList[index].group.length) {
            cartList[index].checked = false;
          } else {
            cartList[index].checked = true;
          }
        }
      }
    }
    this.sum()
    this.setData({
      cartList: cartList
    });
  },

  // 获取购物车商品
  getCartInfo: function (data, checked_ids, cookie) {
    var that = this;
    wx.request({
      url: 'http://wx.huanqiuxiaozhen.com/wemall/cart/view',
      method: 'POST',
      dataType: 'json',
      data: data,
      header: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        'Cookie': cookie + ' checked_ids=' + checked_ids + ';'
      },
      success: function (res) {
        let cartList = res.data.data.list;
        let stock = res.data.data.qty;
        for (let i = 0, lenI = cartList.length; i < lenI; i++) {
          let list = cartList[i];
          list.checked = true;
          list.id = i;
          for (let j = 0, lenJ = list.group.length; j < lenJ; j++) {
            let goodsid = list.group[j].goodsid;
            list.group[j].checked = true;
            list.group[j].showTips = false;
            list.group[j].ourprice = util.formatPrice(list.group[j].ourprice)
            list.group[j].goodsStock = that.setStock(stock,goodsid)
            let goods_json = app.getCookie("goods_" + goodsid);
            goods_json = JSON.parse(goods_json);
            list.group[j].qty  = goods_json.goodsamount;
          }
        }
        if (res.data.code == 0) {
          that.setData({
            originData: data,
            cartList: res.data.data.list,
            stock: res.data.data.qty
          })
        }
        that.sum()
      }
    })
  },

  setStock: function (stock,goodsid){
    let goodsStock = 0;
    for (let k = 0, lenK = stock.length; k < lenK; k++) {
      if (stock[k].gid == goodsid) {
        goodsStock = stock[k].qty;
      }
    }
    return goodsStock;
  },

  // 统计数量价格
  sum:function(){
    let cartList = this.data.cartList;
    let totalPrice = 0;
    let totalAmount = 0;
    for (let i = 0, lenI = cartList.length; i < lenI; i++){
      let list = cartList[i];
      for (let j = 0, lenJ = list.group.length; j < lenJ; j++){
        if (list.group[j].checked){
          let amount = list.group[j].qty;
          let price = list.group[j].ourprice;
          let tatal = amount * price;
          totalPrice += tatal;
          totalAmount += amount;
        }
      }
    }
    totalPrice = util.formatPrice(totalPrice)
    this.setData({
      totalPrice: totalPrice,
      totalAmount: totalAmount
    })
  },

  // 删除商品
  deleteGood:function(e){
    const that = this;
    let goodsid = e.target.dataset.goodsid
    let cartList = this.data.cartList;
    wx.showModal({
      title: '提示信息',
      content: '确定从购物车移除该商品吗？',
      confirmText: "确定",
      cancelText: "取消",
      success: function (res) {
        if (res.confirm) {
          for(let i = 0, lenI = cartList.length; i < lenI; i++){
            let list = cartList[i];
            for (let j = 0, lenJ = list.group.length; j < lenJ; j++){
              if (list.group[j].goodsid == goodsid){
                list.group.splice(j, 1)
                try {
                  wx.removeStorageSync("goods_" + goodsid)
                } catch (e) {
                  console.log(e)
                }
              }
            }
          }
          that.sum()
          that.setData({
            cartList: cartList
          })
        }
      }
    });
  },

  // 减数量
  minusAmount:function(e){
    let { goodsid, qty } = e.target.dataset;
    qty--;
    this.changeGoods(goodsid, qty)
  },

  // 加数量
  plusAmount:function(e){
    let {goodsid, qty } = e.target.dataset;
    qty++;
    this.changeGoods(goodsid, qty)
  },

  // 输入数量
  changeAmount:function(e){
    let that = this;
    let goodsid = e.target.dataset.goodsid;
    let value = parseInt(e.detail.value);
    if (isNaN(value)){
      wx.showModal({
        title: '提示信息',
        content: '请输入数字！',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            value = 1;
            that.changeGoods(goodsid, value)
          }
        }
      })
    } else {
      that.changeGoods(goodsid, value)
    }
  },

  // 改变数量
  changeGoods: function (goodsid, value){
    let cartList = this.data.cartList;
    for (let i = 0, lenI = cartList.length; i < lenI; i++) {
      let list = cartList[i];
      for (let j = 0, lenJ = list.group.length; j < lenJ; j++) {
        if (list.group[j].goodsid == goodsid) {
          list.group[j].showTips = false;
          if (value < 1) {
            value = 1;
          } else if (value > list.group[j].goodsStock) {
            value = list.group[j].goodsStock;
            list.group[j].showTips = true;
          }
          list.group[j].qty = value;
          let good_json = JSON.parse(app.getCookie("goods_" + goodsid))
          good_json.goodsamount = list.group[j].qty;
          good_json = JSON.stringify(good_json)
          wx.setStorageSync("goods_" + goodsid, good_json)
        }
      }
    }
    this.setData({
      cartList: cartList
    })
    this.sum()
  },

  toPay:function(){
    wx.navigateTo({
      url: '../pay/index?ids=1,2,3',
      success:function(){

      },
      fail:function(){

      },
      complete:function(){

      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    let { data, checked_ids } = that.getIds(0);
    let originData = that.data.originData;
    if (JSON.stringify(data) != JSON.stringify(originData) && originData != null){
      that.getCartInfo(data, checked_ids, cookie)
    }

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})