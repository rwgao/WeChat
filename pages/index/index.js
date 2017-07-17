// pages/index/index.js
var app = getApp()
var openid = "";
var usropenid = "";
var sliderListUrl = "";
var venuesListUrl = "";
var choiceListUrl = "";
var JSESSIONID1 = "";
var JSESSIONID2 = "";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    vertical: false,
    autoPlay: true,
    interval: 3000,
    duration: 1000,
    loadingHidden: false,
    title: "环球精选"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    usropenid = openid = that.getCookie("usropenid")
    JSESSIONID1 = that.getCookie("JSESSIONID ")
    JSESSIONID2 = that.getCookie("JSESSIONID  ")
    sliderListUrl = "http://wx.huanqiuxiaozhen.com/wemall/slider/list?openid=" + openid;
    venuesListUrl = "http://wx.huanqiuxiaozhen.com/wemall/venues/venuesList?openid=" + openid;
    choiceListUrl = "http://wx.huanqiuxiaozhen.com/wemall/goods/choiceList?openid=" + openid;
    var cookie = "usropenid=" + usropenid + "; JSESSIONID=" + JSESSIONID1 + "; JSESSIONID=" + JSESSIONID2 + ";"
    that.getSliderList(sliderListUrl, cookie, that)
    that.getVenuesList(venuesListUrl, cookie, that)
    that.getChoiceList(choiceListUrl, cookie,that)
  },

  getCookie:function(key){
    var tem;
    try {
      tem = wx.getStorageSync(key)
      if (tem) {
        // Do something with return value
        return tem;
      }
    } catch (e) {
      // Do something when catch error
      return null
    }
    // wx.getStorageSync({
    //   key: key,
    //   success: function (res) {
    //     tem = res.data
    //     return tem
    //   },
    //   fail: function (res) {
    //   },
    //   complete: function (res) {
    //   },
    // })
    
  },

  getSliderList: function (url, cookie,that){
    // 轮播图接口
    wx.request({
      url: url,
      method: 'GET',
      data: {},
      header: {
        'Accept': 'application/json',
        'Cookie': cookie
      },
      success: function (res) {
        that.setData({
          images: res.data
        })
      }
    })
  },

  getVenuesList: function (url, cookie,that){
    // 主题馆接口
    wx.request({
      url: url,
      method: 'GET',
      data: {},
      header: {
        'Accept': 'application/json',
        'Cookie': cookie
      },
      success: function (res) {
        that.setData({
          venuesItems: res.data.data
        })
        setTimeout(function () {
          that.setData({
            loadingHidden: true
          })
        }, 1500)
      }
    })
  },

  getChoiceList:function(url,cookie,that){
    // 环球精选商品接口
    wx.request({
      url: choiceListUrl,
      method: 'GET',
      data: {},
      header: {
        'Accept': 'application/json',
        'Cookie': cookie
      },
      success: function (res) {
        that.setData({
          choiceItems: res.data.data.dataList
        })
        setTimeout(function () {
          that.setData({
            loadingHidden: true
          })
        }, 1500)
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