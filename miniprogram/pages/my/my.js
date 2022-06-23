// pages/my/my.js
const db = wx.cloud.database();
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isShowUserName:false,
    },

    toUserinfo:function(e){
      if(app.globalData.login == false){
        wx.showModal({
          title: '提示',
          content: '请先登录',
        })
      }else{
        wx.navigateTo({
          url: '../userinfo/userinfo',
        })
      }
    },
    togetandsend:function(e){
      if(app.globalData.login == false){
        wx.showModal({
          title: '提示',
          content: '请先登录',
        })
      }else{
        const op= e.currentTarget.dataset['op']
        wx.navigateTo({
          url: '../getandsend/getandsend?op='+op,
        })
      }
    },

// 立即登录
    getUserProfile:function () {
      //获取用户信息
      wx.getUserProfile({
        desc: '用于完善用户资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          console.log("获取用户信息成功", res)
          let user = res.userInfo
          wx.setStorageSync('user', user)
          this.setData({
            isShowUserName:true,
            userInfo:user
          })
          app.globalData.login = true
          // 根据用户openid查询用户信息
          db.collection('users').where({
            _openid: app.globalData.openid,
          }).get().then(res =>{
            console.log(res.data[0])
            app.globalData.userInfo = res.data[0]
            if(res.data[0]==null){
              console.log("用户信息为空")
              // 跳转去注册界面注册
              wx.navigateTo({
                url: '../userinfo/userinfo?regist=true',
              })
            }
          })
        },
        fail: res => {
          console.log("获取用户信息失败", res)
        }
      })
      
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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

