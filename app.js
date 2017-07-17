//app.js
var R_htmlToWxml = require('utils/htmlToWxml.js');
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.setStorage({
      key: 'JSESSIONID ',
      data: 'F5FE919E88A900314DF93AD6E9299894',
      key: 'JSESSIONID  ',
      data: '82C87EFC77C0AB333F08E3FBAFC1F368',
      key: 'usropenid',
      data: 'oI-WduGucLO_WZm7r9Bag7TWdjig'
    })
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData:{
    userInfo:null
  }
})