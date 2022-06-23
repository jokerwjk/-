// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    //云开发初始化
    wx.cloud.init({
      env: 'cloud1-9gt341u00cd6f83b',
      traceUser: true
    })
    //获取openid
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      config: {
        env:'cloud1-9gt341u00cd6f83b'
      },
      data: {
        type: 'getOpenId'
      }
    }).then((resp) => {
      this.globalData.openid=resp.result.openid
      console.log(this.globalData.openid)
      wx.hideLoading();
    }).catch((e) => {
     wx.hideLoading();
    })
  },
  globalData: {
    userInfo: null,
    openid:"",
    login:false,
  },
  
})
