const db = wx.cloud.database()
const app = getApp();
const _ = db.command
Page({

    /**
     * 页面的初始数据
     */
    data: {
      orderlist:[{}],
      key:'',
    },

    tojuti:function(e){
      const index= e.currentTarget.dataset['index']
      console.log(index)
      console.log(this.data.orderlist)
      wx.navigateTo({
        url: '../juti/juti?id='+this.data.orderlist[index]._id+'&_openid='+this.data.orderlist[index]._openid,
      })
    },

/**
 * 根据类型查询
 * @param {*} e 
 */
    typeFind:function(e){
      const type= e.currentTarget.dataset['type'];
      console.log(type+"被点击了")
      this.setData({
        key:type
      })
      db.collection('orders').where({
        orderType: this.data.key
      }).get().then(res => {
        this.setData({
          orderlist:res.data
        })
      })
    },


    /**
     * 查询
     */
    find: function (e) {
      console.log("搜索被点击了")
      this.setData({
        key:e.detail.value.key
      })
      db.collection('orders').where(_.or([
        {orderName: db.RegExp({
          regexp:this.data.key,
          options:'i',
        })},
        {orderType: db.RegExp({
        regexp:this.data.key,
        options:'i',
        })}
      ]
      )).get().then(res => {
        this.setData({
          orderlist:res.data
        })
      })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      if(app.globalData.login == false){
        wx.showModal({
          title: '提示',
          content: '请先登录',
          success: function (res) {
            if (res.confirm) {//这里是点击了确定以后
              console.log('用户点击确定')
              // 跳转到我的
              wx.reLaunch({
                url: '/pages/my/my',
              })
            } else {//这里是点击了取消以后
              console.log('用户点击取消')
              wx.reLaunch({
                url: '/pages/first/first',
              })
            }
          }
        })
      }
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
      // 随机推荐工作
      db.collection('orders').aggregate().sample({
        size: 5
      }).end().then(res =>{
        this.setData({
          orderlist:res.list
        })
        console.log(this.data.orderlist)
      })
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