// index.js
// 获取应用实例
const db = wx.cloud.database();
const app = getApp();
Page({
  data: {
    region:[],
    userinfo:{},
    revise:false,
    sex:['男','女'],
    regist:false
  },
  getUserProvince:function(e){
    this.setData({
        region:e.detail.value
    })
  },
  radioChange:function(e){
    
   },
  revise:function(){
    this.setData({
      revise:true
    })
  },
  formSubmit:function(e){
    console.log(this.data.regist)
    if(this.data.regist == "true"){//用户注册
      if(e.detail.value.username == '' || e.detail.value.phone == ''||e.detail.value.address == ''){
        wx.showToast({
          title: '请填写真实姓名或联系电话',
          icon: 'none',
          duration: 1500
        })
        return false
        }
        console.log(e.detail.value)
        this.setData({
          ['userinfo.username']:e.detail.value.username,
          ['userinfo.sex']:e.detail.value.sex,
          ['userinfo.phone']:e.detail.value.phone,
          ['userinfo.credibility']:100,
          ['userinfo.address']:this.data.region,
          ['userinfo.description']:e.detail.value.description
        })
        console.log(this.data.userinfo)
        wx.showLoading({
        title: '',
        });
        db.collection('users').add({
          data:{
            username:this.data.userinfo.username,
            sex:this.data.userinfo.sex,
            phone:parseInt(this.data.userinfo.phone),
            credibility:this.data.userinfo.credibility,
            address:this.data.userinfo.address,
            description:this.data.userinfo.description
          },//一个对象，可以是已经定义好的变量
          // 操作成功的回调函数
          success: res => {
            wx.showToast({
              title: '注册成功',
              icon: 'success',
              duration: 2000//持续的时间
            })
            wx.navigateBack({
              delta: 1,
            })
          },
          // 失败回调
          fail: err => {
            wx.showToast({
              title: '注册失败',
              icon: 'fail',
              duration: 2000//持续的时间
            })
          }
        })
    }else{
      if(e.detail.value.username == '' || e.detail.value.phone == ''||e.detail.value.address == ''){
      wx.showToast({
        title: '请填写真实姓名或联系电话',
        icon: 'none',
        duration: 1500
      })
      return false
      }
      console.log(e.detail.value)
      console.log(this.data.userinfo._id)
      this.setData({
        ['userinfo.username']:e.detail.value.username,
        ['userinfo.sex']:e.detail.value.sex,
        ['userinfo.phone']:parseInt(e.detail.value.phone),
      })
      console.log(this.data.userinfo)
      db.collection('users').doc(this.data.userinfo._id).update({
        data:{
            username:this.data.userinfo.username,
            phone:this.data.userinfo.phone,
            sex:this.data.userinfo.sex
        },
        success :res => {
            console.log(res.data)
            wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 2000//持续的时间
            });
            console.log(this.data.userinfo)
            //更新全局变量
            app.globalData.userInfo = this.data.userinfo
            this.setData({
              revise:false
            })
        }
      })
    }
    
  },
  onLoad: function (options) {
    
    db.collection('users').where({
      _openid: app.globalData.openid,
    }).get().then(res =>{
      console.log(res.data[0])
      app.globalData.userInfo = res.data[0]
      this.setData({
      userinfo: app.globalData.userInfo,
      regist:options.regist
      })
    })
  },
})
