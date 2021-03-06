// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({env: 'cloud1-9gt341u00cd6f83b'})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection(event.collection).aggregate().lookup({
      from:event.from,
      localField: event.localField,
      foreignField: event.foreignField,
      as: event.as
    }).match(event.match).end()
  } catch (e) {
    console.error(e)
  }
}
