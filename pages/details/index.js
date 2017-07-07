// pages/details/index.js
var util = require('../../utils/util.js')
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
      success: function(res){
        // console.log(res.data.data);
        // that.data.shopppingDetails = res.data.data;
        var goodsPicsInfo = [];
        var goodspic = res.data.data.goodspics;
        var goodspics = goodspic.substring(0, goodspic.length - 1);
        var goodspicsArr = goodspics.split("#");
        for (var i = 0; i < goodspicsArr.length; i++) {
          goodsPicsInfo.push({
            "picurl": goodspicsArr[i]
          });
        }
        that.setData({
          goodsPicsInfo: goodsPicsInfo,
          shopppingDetails: res.data.data
        })
      }
    })
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
      success: function (res){
        console.log(res)
      }
    })
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