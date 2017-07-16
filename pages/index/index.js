// pages/index/index.js
var app = getApp()
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
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      })
    })

    // 轮播图接口
    wx.request({
      url: 'http://huanqiuxiaozhen.com/wemall/slider/list',
      method: 'GET',
      data: {},
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        that.setData({
          images: res.data
        })
      }
    })

    // 主题馆接口
    wx.request({
      url: 'http://huanqiuxiaozhen.com/wemall/venues/venuesList',
      method: 'GET',
      data: {},
      header: {
        'Accept': 'application/json'
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

    wx.setStorage({
      key: 'JSESSIONID ',
      data: 'F5FE919E88A900314DF93AD6E9299894',
    })
    
    wx.setStorage({
      key: 'JSESSIONID  ',
      data: '82C87EFC77C0AB333F08E3FBAFC1F368',
    })

    wx.setStorage({
      key: 'usropenid',
      data: 'oEhDdwzZ4opKJW_VAyG2RfQGAdhg',
    })

    // 环球精选商品接口
    wx.request({
      url: 'http://huanqiuxiaozhen.com/wemall/goods/choiceList',
      method: 'GET',
      data: {},
      header: {
        'Accept': 'application/json',
        'Cookie': 'JSESSIONID = E11EC56A7850162FDCC1860E9946F40E; usropenid=oEhDdwzZ4opKJW_VAyG2RfQGAdhg; JSESSIONID=7CC83E3A72BF341FE10E1140582842A0'
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