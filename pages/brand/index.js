// pages/brand/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNo: 0,
    pageSize: 15,
    totalPage: 0,
    loadingHidden: true
  },
  tapName: function (event) {
    var that = this;
    var id = event.currentTarget.dataset.id;
    var pageNo = event.currentTarget.dataset.pageno;
    var totalpage = event.currentTarget.dataset.totalpage;
    var index = event.currentTarget.dataset.tabindex;
    var dataList = that.data.dataList;
    pageNo++;
    that.setData({
      loadingHidden: false
    })
    if (pageNo <= totalpage) {
      wx.request({
        url: 'http://www.huanqiuxiaozhen.com/wemall/goods/goodsList',
        method: 'GET',
        data: {
          goodstype: id,
          p: pageNo
        },
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          dataList[index].dataList.push.apply(dataList[index].dataList, res.data.data.dataList);
          dataList[index].currentPage = pageNo
          that.setData({
            dataList: dataList,
            loadingHidden: true
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: 'http://www.huanqiuxiaozhen.com/wemall/venues/getBrandAndType?id=' + options.id,
      method: 'GET',
      data: {},
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        that.setData({
          brandList: res.data.data,
          types: res.data.data.types
        })
        var types = that.data.types;
        var dataList = [];
        var p = 0;
        that.getDataList(dataList, types, p)

      }
    })
  },

  getDataList: function (dataList, types, p, pageNo) {
    var that = this;
    var p = p;
    var pageNo = pageNo | 1;
    var types = types;
    var id = types[p].subid;
    var dataList = dataList;
    wx.request({
      url: 'http://www.huanqiuxiaozhen.com/wemall/goods/goodsList',
      method: 'GET',
      data: {
        goodstype: id,
        p: pageNo
      },
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        dataList[p] = res.data.data;
        that.setData({
          dataList: dataList
        })
        p++;
        if (p < types.length) {
          that.getDataList(dataList, types, p)
        }
      }
    })
  },

  showMore: function (e) {

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