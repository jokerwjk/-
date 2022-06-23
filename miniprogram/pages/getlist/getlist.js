// pages/getlist/getlist.js
const db = wx.cloud.database()
const app = getApp()
const _ = db.command
var util = require ( '../../utils/util.js' );
Page({

    /**
     * 页面的初始数据
     */
    data: {
        
        scrollviewTitle:['全部','待开工','已开工','已完工'],
        // 全部：where openid= ？ 已发布：
        currentIndex:0,
        all:[],
        ready:[],
        start:[],
        finsh:[],
    },
    alltojuti:function(e){
      const index= e.currentTarget.dataset['index']
      console.log(index)
      console.log(this.data.orderlist)
      wx.navigateTo({
        url: '../juti/juti?id='+this.data.all[index]._id+'&_openid='+this.data.all[index]._openid,
      })
    },
    redaytojuti:function(e){
      const index= e.currentTarget.dataset['index']
      console.log(index)
      console.log(this.data.orderlist)
      wx.navigateTo({
        url: '../juti/juti?id='+this.data.ready[index]._id+'&_openid='+this.data.ready[index]._openid,
      })
    },
    starttojuti:function(e){
      const index= e.currentTarget.dataset['index']
      console.log(index)
      console.log(this.data.orderlist)
      wx.navigateTo({
        url: '../juti/juti?id='+this.data.start[index]._id+'&_openid='+this.data.start[index]._openid,
      })
    },
    finshtojuti:function(e){
      const index= e.currentTarget.dataset['index']
      console.log(index)
      console.log(this.data.orderlist)
      wx.navigateTo({
        url: '../juti/juti?id='+this.data.finsh[index]._id+'&_openid='+this.data.finsh[index]._openid,
      })
    },
    
    changeCurrentIndex:function(e){
        this.setData({
          currentIndex:e.currentTarget.id
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
      }else{
        // 根据用户openid查找和他有关的零活
        db.collection('orders').where(_.or([
          {_openid:app.globalData.openid},
          {takeOrderUserid:app.globalData.openid}
        ])).get().then(res =>{
          this.setData({
            all:res.data
          })
          console.log(this.data.all)
          var nowTime = util.formatTime ( new Date ());
          console.log(nowTime)
          for (let i = 0; i < this.data.all.length; i++) {
            const element = this.data.all[i]
            const date = this.data.all[i].startTime
            const day = this.data.all[i].orderDay
            console.log("date:"+date)
            console.log("day:"+day)
            console.log(util.formatTime(new Date(Date.parse(new Date(date))+day*24*60*60*1000)))
            if(nowTime<date){
              console.log("未开工")
              this.setData({
                ready: this.data.ready.concat(element)
              })
            }else if(nowTime<util.formatTime(new Date(Date.parse(new Date(date))+day*24*60*60*1000))){
              console.log("已开工")
              this.setData({
                start: this.data.start.concat(element)
              })
            }else{
              console.log("已完工")
              this.setData({
                finsh: this.data.finsh.concat(element)
              })
            }
          }
          if(res.data[0]==null){
            console.log("用户信息为空")
            // 跳转去注册界面注册
            wx.navigateTo({
              url: '../userinfo/userinfo?regist=true',
            })
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