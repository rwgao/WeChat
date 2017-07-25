// pages/cart/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkboxItems: [
      { name: 'standard is dealt for u.', value: '0', checked: true },
      { name: 'standard is dealicient for u.', value: '1' }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var openid, JSESSIONID1, JSESSIONID2, usropenid;
    openid = usropenid = app.getCookie("usropenid")
    JSESSIONID1 = app.getCookie("JSESSIONID ")
    JSESSIONID2 = app.getCookie("JSESSIONID  ")
    var cookie = "usropenid=" + 'oI-WduGucLO_WZm7r9Bag7TWdjig' + "; JSESSIONID=" + JSESSIONID1 + "; JSESSIONID=" + JSESSIONID2 + ";"
    that.getIds(0, cookie )
  },

  getIds: function (cardfee,cookie){
    var that = this;
    var arr = [];
    var goods = [];
    var openId = app.getCookie("usropenid");
    var goods_info = wx.getStorageInfoSync()
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
    if (arr.length > 0){
      for (let j = 0; j < arr.length; j++){
        var goods_json = JSON.parse(app.getCookie("goods_"+arr[j]));
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
      wx.request({
        url: 'http://wx.huanqiuxiaozhen.com/wemall/cart/view',
        method: 'POST',
        dataType: 'json',
        data: {
          openid: openId,
          goodsid: ids,
          cardfee: cardfee,
          goodsinfo: goods
        },
        header: {
          "Content-Type":"application/x-www-form-urlencoded; charset=UTF-8",
          'Cookie': cookie + ' checked_ids='+ checked_ids + ';'
        },
        success: function(res){
          console.log(res)
          var cartList = res.data.data.list;
          for (let i = 0, lenI = cartList.length; i < lenI; i++){
            for (let j = 0, lenJ = cartList[i].group.lenght; j < lenJ; j++){
              cartList[i].group[j].checked = true;
            }
          }
          console.log(cartList)
          if (res.data.code == 0) {
            that.setData({
              cartList: res.data.data.list,
              stock: res.data.data.qty
            })
          }
        }
      })
    }
  },
  
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);

    var checkboxItems = this.data.checkboxItems, values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].value == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    }

    this.setData({
      checkboxItems: checkboxItems
    });
  },

  getCartInfo:function(){

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