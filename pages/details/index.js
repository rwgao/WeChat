// pages/details/index.js
var util = require('../../utils/util.js')
var R_htmlToWxml = require('../../utils/htmlToWxml.js');
var sliderWidth = 96;
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
    sliderLeft: 0
  },

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
  toCart: function(e){
    wx.switchTab({
      url: "../cart/index",
      data: {
        id: 11
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      goodid: options.id
    })
    wx.request({
      url: 'http://huanqiuxiaozhen.com/wemall/goods/inqgoods?id=' + options.id,
      method: 'GET',
      data: {},
      header: {
        'Accept': 'application/json'
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
        // var detailinfo = res.data.data.detailinfo.replace(/\<img/g,"<image")
        // detailinfo = detailinfo.replace(/\>/g,"</image>")
        var detailinfo = R_htmlToWxml.html2json(res.data.data.detailinfo)
        if (detailinfo[0].type !== "img") {
          detailinfo[0] = detailinfo[0].child[0];
        }
        var tem = [];
        for (var k = 0; k < detailinfo.length; k++){
          if (detailinfo[k].type == "img"){
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
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  addcart: function (event) {
    var goodid = event.currentTarget.dataset.id;
    var cartTime = util.formatTime(new Date())
    wx.request({
      url: 'http://wx.huanqiuxiaozhen.com/wemall/goods/chkExpired',
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      data: {
        goodid: goodid,
        cartTime: cartTime
      },
      success: function (res) {
        
      }
    })
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
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