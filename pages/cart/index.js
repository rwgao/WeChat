// pages/cart/index.js
var app = getApp()
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

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let { data, checked_ids} = that.getIds(0);
    that.getCartInfo(data, checked_ids, cookie)
  },

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
    this.setData({
      cartList: cartList
    });
  },

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
        var cartList = res.data.data.list;
        for (let i = 0, lenI = cartList.length; i < lenI; i++) {
          let list = cartList[i];
          list.checked = true;
          list.id = i;
          for (let j = 0, lenJ = list.group.length; j < lenJ; j++) {
            list.group[j].checked = true;
          }
        }
        if (res.data.code == 0) {
          that.setData({
            originData: data,
            cartList: res.data.data.list,
            stock: res.data.data.qty
          })
        }
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