// pages/juti/juti.js
const db = wx.cloud.database()
const app = getApp();
const _ = db.command;
Page({

    /**
     * 页面的初始数据
     */
    data: {
      order:{},
      user:{},
      takeOrderUserid:[],
    },

    work:function(e){
      console.log(this.data.order)
      console.log(app.globalData.userInfo)
      db.collection('orders').where({
        _id: this.data.order._id
      }).get().then(res => {
        console.log(res.data)
        this.setData({
          takeOrderUserid:res.data[0].takeOrderUserid,
          _openid:res.data[0]._openid
        })
        if(app.globalData.openid == this.data._openid){
          wx.showToast({
            title: '不可以接自己发出的零活', //弹框内容
            icon: 'none',  //弹框模式
            duration: 2000    //弹框显示时间
          })
        }else{
          console.log(this.data.takeOrderUserid)
          var index =this.data.takeOrderUserid.indexOf(app.globalData.openid)
          console.log(index)
          if(index <0){
            console.log(app.globalData.openid)
            console.log(this.data.order._id)
            db.collection('orders').doc(this.data.order._id).update({
              data: {
                takeOrderUserid: _.push(app.globalData.openid)
              },
            success :res => {
              console.log("抢活成功")
              wx.showToast({
                title: '抢活成功',
                icon: 'success',
                duration: 2000//持续的时间
                });
            }
            });}else{
              wx.showToast({
              title: '已抢活',
              icon: null,
              duration: 2000//持续的时间
              });
            }
        }
        
      })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      this.setData({
        id:options.id,
        _openid:options._openid
      })
      console.log(this.data.id)
      console.log(this.data._openid)
      db.collection('orders').where({
        _id: this.data.id
      }).get().then(res => {
        console.log(res.data)
        this.setData({
          order:res.data[0]
        })
      })
      db.collection('users').where({
        _openid: this.data._openid
      }).get().then(res => {
        console.log(res.data)
        this.setData({
          user:res.data[0]
        })
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