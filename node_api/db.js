const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://wangyanan:123456wang@cluster0.kteu6.mongodb.net/houtai?retryWrites=true&w=majority',{ useNewUrlParser: true, useUnifiedTopology: true})

// 第三步 链接成功处理
// connected 连接成功
mongoose.connection.on("connected", () => {
    console.log("云数据库已经链接成功");
  });
  // disconnected 表示没有连接
  mongoose.connection.on("disconnected", () => {
    console.log("云数据库连接失败");
  });
  // error 遇到错误
  mongoose.connection.on("error", () => {
    console.log("云数据库已经error");
  });
  
  // 1.
  module.exports.mongoose = mongoose
  // 2.整体
  // module.exports=mongoose
  
  // 1和2导出相同，但是接收时，2不需要加mongoose.
  