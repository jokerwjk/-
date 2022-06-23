// index.js
// 获取应用实例
const db = wx.cloud.database()
const app = getApp();
const _ = db.command
Page({
  data: {
    scrollviewTitle:['我发的活','我接的活'],
    currentIndex:0,
    sendlist:[],
    getlist:[]
  },
  changeCurrentIndex:function(e){
    this.setData({
      currentIndex:e.currentTarget.id
    })
},
  onLoad:function (options) {
    this.setData({
      canIUseGetUserProfile: true,
      op:options.op
    })
    if(this.data.op=='get'){
      this.setData({
        currentIndex:1
      })
    }
    // 根据用户openid查找和他有关的零活
    db.collection('orders').where({
      _openid:app.globalData.openid
    }).get().then(res=>{
      for (let i = 0; i < res.data.length; i++) {
        const element = res.data[i];
        this.setData({
          sendlist: this.data.sendlist.concat(element)
        })
      }
    })
    db.collection('orders').where({
      takeOrderUserid:app.globalData.openid
    }).get().then(res=>{
      for (let i = 0; i < res.data.length; i++) {
        const element = res.data[i];
        this.setData({
          getlist: this.data.getlist.concat(element)
        })
      }
    })
  },
})
