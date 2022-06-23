const db = wx.cloud.database();
const app = getApp();
var mydata = new Date();
Page({
    data:{
      selectorItems:['农活','维修','厨师','搬运','手工','家政','餐饮','土建/装修'],
      address:'',
      image_src:'',
      image_path:'',
      location:[],
    },
   selectorChang:function(e){
    let i=e.detail.value;
    let value=this.data.selectorItems[i];
    this.setData({selector:value});

   },
   dateChange:function(e){
    let value=e.detail.value;
    this.setData({date:value});
   },

  // 打开地图
  map:function () {
    var that = this
    wx.chooseLocation({
      success: function (res) {
        // success
        if (res.name == '') {
          that.setData({
            address: '选择位置',
          })
        } else {
          that.setData({
            address: res.name,
            location:[res.longitude,res.latitude]
          })
        }
        console.log(res)
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  // 提交表单
  formSubmit:function (e) {
    if(
      e.detail.value.orderType == '' ||
      e.detail.value.orderName == '' ||
      e.detail.value.orderNumber == '' ||
      e.detail.value.startTime == '' ||
      e.detail.value.salary == '' ||
      e.detail.value.orderDay == '' ||
      this.data.address == '' ||
      this.data.image_src == '' ||
      e.detail.value.description == '' ||
      this.data.location == []
    ){
      wx.showToast({
        title: '请填写所有项目',
        icon: 'none',
        duration: 2000//持续的时间
      })
    }else{
      console.log(e.detail.value)
      // 插入订单
      this.setData({
      image_path:'cloud://cloud1-9gt341u00cd6f83b.636c-cloud1-9gt341u00cd6f83b-1310886251/orders_image/'+app.globalData.openid+mydata.getTime()+'.png'
      })
      console.log(this.data.image_src)
      wx.cloud.uploadFile({
      // 指定上传到的云路径
      cloudPath: this.data.image_path,
      }).then(res=>{
      console.log('上传成功', res);
      })
      //发布
      db.collection('orders').add({
      data:{
        orderType:this.data.selectorItems[e.detail.value.orderType],//类型
        orderName:e.detail.value.orderName,//名字
        orderNumber:parseInt(e.detail.value.orderNumber),//人数
        startTime:e.detail.value.startTime,//开工时间
        salary:parseInt(e.detail.value.salary),//工资
        orderDay:parseInt(e.detail.value.orderDay),//用工时间
        address:this.data.address,//地址
        image:this.data.image_path,//图片地址
        description:e.detail.value.description,// 描述
        location:this.data.location,//经纬度
        takeOrderUserid:[]
      },//一个对象，可以是已经定义好的变量
      // 操作成功的回调函数
      success: res => {
        wx.showToast({
          title: '发布成功',
          icon: 'success',
          duration: 2000//持续的时间
        })
        wx.switchTab({
          url: '/pages/index/index',
        })
      },
      // 失败回调
      fail: err => {
        console.log(err)
        wx.showToast({
          title: '发布失败',
          icon: 'fail',
          duration: 2000//持续的时间
        })
      }
      })
    }
    
  },
  // 选择照片
  chose_photo:function(evt){
    let _this = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        console.log(res.tempFilePaths)               //一个数组，每个元素都是“http://...”图片地址
        _this.setData({
          image_src: res.tempFilePaths[0]
        })
      }
    })
  },
  reselect:function(evt){
    let _this = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        _this.setData({
          image_src: res.tempFilePaths[0]
        })
      }
    })
  },
  photo_preview:function(evt){
    let _this = this;
    let imgs = [];
    imgs.push(_this.data.photo_src);
    wx.previewImage({
      urls:imgs
    })
  },
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
})
