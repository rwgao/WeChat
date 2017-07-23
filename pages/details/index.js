// pages/details/index.js
var util = require('../../utils/util.js')
var R_htmlToWxml = require('../../utils/htmlToWxml.js');
var sliderWidth = 96;
var openid = "";
var usropenid = "";
var JSESSIONID1 = "";
var JSESSIONID2 = "";
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 3000,
    duration: 1200,
    tabs: ["图文详情", "产品参数", "保税优势"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    cartQty:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      goodid: options.id
    })
    openid = usropenid = app.getCookie("usropenid")
    JSESSIONID1 = app.getCookie("JSESSIONID ")
    JSESSIONID2 = app.getCookie("JSESSIONID  ")
    var cookie = "usropenid=" + 'oEhDdwzZ4opKJW_VAyG2RfQGAdhg' + "; JSESSIONID=" + JSESSIONID1 + "; JSESSIONID=" + JSESSIONID2 + ";"
    that.chkExpired(options.id, null, that)
    that.getProductDetail(options.id, openid, cookie, that)
    that.queryTabbarTop()
    that.initTabbar(that)
    that.showCartAmount(that)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  // 购物车
  toCart: function (e) {
    wx.switchTab({
      url: "../cart/index",
      data: {
        id: 11
      }
    })
  },

  // 页面滚动
  scrollViewEvent: function (e) {
    var scrollViewTop = e.detail.scrollTop
    this.setData({
      scrollViewTop: scrollViewTop
    })
  },

  // 图片加载完成时 由于小程序图片高度不能自适应  需要程序设置
  imageLoad: function (e) {
    var width = e.detail.width;
    var height = e.detail.height;
    var windowWidth = wx.getSystemInfoSync().windowWidth - 30;
    var picHeight = (height / width) * windowWidth;
    var index = e.currentTarget.dataset.index;
    var detailinfo = this.data.detailinfo;
    this.data.detailinfo[index].attr.height = picHeight;
    this.setData({
      detailinfo: this.data.detailinfo
    });
  },

  // 获取tabbar距离顶部的top值
  queryTabbarTop: function () {
    var that = this;
    var query = wx.createSelectorQuery();
    query.select(".weui-navbar").boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      var top = res[0].top
      that.setData({
        navbarOffsetTop: top
      })
    })
  },

  // 初始化购物车数量
  showCartAmount:function(that){
    var StorageInfo = wx.getStorageInfoSync()
    var arr = [];
    var cookieAmountAll = 0;
    for (let i = 0; i < StorageInfo.keys.length; i++){
      let cookie = "";
      var _g = StorageInfo.keys[i].indexOf("goods_")
      var _grp_g = StorageInfo.keys[i].indexOf("grp_goods_")  
      if (_g > -1 && _grp_g == -1){
        cookie = StorageInfo.keys[i].substr(6);
        arr.push (cookie);
      }
    }
    for(let j = 0; j< arr.length; j++){
      var goods_json = JSON.parse(app.getCookie("goods_"+ arr[j]))
      var goodsamount = Number(goods_json.goodsamount);
      cookieAmountAll += goodsamount;
    }
    if (cookieAmountAll){
      if (cookieAmountAll <= 99) {
        that.setData({
          cartQty: cookieAmountAll
        })
      } else {
        that.setData({
          cartQty: '...'
        })
      }
    } else {
      return
    }
  },

  // 初始化tabbar切换动画宽度
  initTabbar: function(that){
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },

  // 获取商品详情 
  getProductDetail:function(productId, openid, cookie, that){
    wx.request({
      url: 'http://wx.huanqiuxiaozhen.com/wemall/goods/inqgoods',
      method: 'POST',
      header:{
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        id: productId,
        openid: openid
      },
      success: function (res) {
        var goodsPicsInfo = [];
        var goodspic = res.data.data.goodspics;
        var goodspics = goodspic.substring(0, goodspic.length - 1);
        var goodspicsArr = goodspics.split("#");
        for (var i = 0; i < goodspicsArr.length; i++) {
          goodsPicsInfo.push({
            "picurl": goodspicsArr[i]
          });
        }
        var prodparams = res.data.data.prodparams.substring(3, res.data.data.prodparams.length - 3).split("|||");
        var detailinfo = R_htmlToWxml.html2json(res.data.data.detailinfo)
        if (detailinfo[0].type !== "img") {
          detailinfo[0] = detailinfo[0].child[0];
        }
        var tem = [];
        for (var k = 0; k < detailinfo.length; k++) {
          if (detailinfo[k].type == "img") {
            tem.push(detailinfo[k])
          }
        }
        detailinfo = tem;
        that.setData({
          goodsPicsInfo: goodsPicsInfo,
          shopppingDetails: res.data.data,
          prodparams: prodparams,
          detailinfo: detailinfo
        })
      }
    });
  },

  // 添加购物车
  addToCart:function (event) {
    var that = this;
    var goodid = event.currentTarget.dataset.id;
    var goods_json, goodsamount;
    if (openid != null) {
      if (app.getCookie("goods_" + goodid)){
        goods_json = app.getCookie("goods_" + goodid)
        goods_json = JSON.parse(goods_json)
        goodsamount = goods_json.goodsamount;
      } else {
        goodsamount = 0;
      }
      var product = this.data.shopppingDetails;
      var goodsname = product.title
      let timestamp = this.data.timestamp
      goodsamount ++;
      var tax, ourprice, wareid, house, bigtype, qty, goodspics, guideroyalty;
      let { tax, ourprice, wareid, house, bigtype, qty, goodspics, guideroyalty } = product;
      if (timestamp != ""){
        let goods_info = {
          goodsname, timestamp, goodsamount, tax, ourprice, wareid, house, bigtype, qty, goodspics, guideroyalty
        }
        goods_info = JSON.stringify(goods_info),
        wx.setStorage({
          key: 'goods_'+goodid,
          data: goods_info
        })
        wx.showToast({
          title: '加入购物车成功！',
          icon: 'success',
          duration: 2000,
          mask: true,
          success: function(){
            that.showCartAmount(that)
          }
        })
      } else {
        wx.showToast({
          title: '商品已下架，暂不能购买。',
          image: '../../images/iconfont-help.png',
          duration: 2000,
          mask:true
        })
      }
    }
  },

  // 校验商品
  chkExpired: function (id, time,that) {
    wx.request({
      url: 'http://wx.huanqiuxiaozhen.com/wemall/goods/chkExpired',
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      data: {
        goodid: id
      },
      success: function (res) {
        var timestamp = res.data;
        that.setData({
          timestamp: timestamp
        })
      }
    })
  },

  // tabbar切换
  tabClick: function (e) {
    var top = this.data.navbarOffsetTop;
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
      top: top
    });
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