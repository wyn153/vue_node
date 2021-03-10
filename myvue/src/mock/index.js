// 使用 Mock
const Mock = require('mockjs')
require('./my-radom')
const Random = Mock.Random
Mock.setup({
  timeout: '500-1000'
})

const list = []

for (let i = 0; i < 20; i++) {
  list.push({
    id: i + 1,
    date: Random.date(),
    name: Random.cname(),
    address: Random.address(),
    likes: Random.likes()
  })
}

const users = [
  {
    id: 1,
    username: '普通用户1',
    password: '123456',
    token: 'abcdefghijklmnopqrstuvwxy99',
    rights: [{
      id: 1,
      authName: '基础菜单',
      icon: 'icon-menu',
      children: [{
        id: 11,
        authName: '一级项目1',
        path: '/menu/one',
        rights: ['view', 'edit', 'add', 'delete']
      }, {
        id: 11,
        authName: '一级项目2',
        path: '/menu/two',
        rights: ['view']
      }]
    }]
  },
  {
    id: 1,
    username: '普通用户2',
    password: '123456',
    token: 'abcdefghijklmnopqrstuvwxyz',
    rights: [{
      id: 1,
      authName: '一级菜单',
      icon: 'icon-menu',
      children: [{
        id: 11,
        authName: '一级项目1',
        path: '/menu/one',
        rights: ['view', 'edit', 'add', 'delete']
      }, {
        id: 11,
        authName: '一级项目2',
        path: '/menu/two',
        rights: ['view']
      }]
    }]
  },
  {
    id: 2,
    username: '霸道总裁',
    password: '123456',
    buttonadd: true,
    buttondel: true,
    buttondit: true,
    buttonfind: false,
    Nuclearmissile:true,
    token: 'abcdefghijklmnopqrstuvwxyz'.split('').reverse().join(''),
    rights: [{
      id: 1,
      authName: '一级菜单',
      icon: 'icon-menu',
      children: [{
        id: 11,
        authName: '一级项目1',
        path: '/menu/one',
        rights: ['view', 'edit', 'add', 'delete']
      }, {
        id: 11,
        authName: '一级项目2',
        path: '/menu/two',
        rights: ['view', 'edit', 'add', 'delete']
      }]
    }, {
      id: 2,
      authName: '总裁管理私密',
      icon: 'icon-menu',
      children: [{
        id: 21,
        authName: '秘书管理1',
        path: '/menu/three',
        rights: ['view', 'edit', 'add', 'delete']
      }, {
        id: 22,
        authName: '秘书管理22',
        path: '/menu/four',
        rights: ['view', 'edit', 'add', 'delete']
      }, {
        id: 23,
        authName: '秘书管理33',
        path: '/menu/five',
        rights: ['view']
      }]
    }]
  }
]

// 获取列表
Mock.mock('/list', 'get', options => {
  const { current } = JSON.parse(options.body)
  return list.slice(((current - 1) * 10), current * 10)
})

// 总数
Mock.mock('/list/total', 'get', () => {
  return list.length
})

// 查询
Mock.mock('/list/value', 'get', options => {
  const { value } = JSON.parse(options.body)
  const _list = list.filter(item => {
    if (item.name.includes(value) || item.address.includes(value) || item.likes.includes(value)) {
      return true
    }
    return false
  })
  return {
    list: _list,
    total: _list.length
  }
})

// 添加
Mock.mock('/list/add', 'post', options => {
  const { rowData } = JSON.parse(options.body)
  rowData.id = list[list.length - 1].id + 1
  rowData.date = new Date().toLocaleDateString().replace(/\//g, '-')
  list.unshift(rowData)
  return rowData
})

// 修改
Mock.mock('/list/update', 'put', options => {
  const { rowData } = JSON.parse(options.body)
  let _rowData = {}
  list.forEach((item, idx) => {
    if (item.id === rowData.id) {
      _rowData = rowData
      list[idx] = rowData
    }
  })
  return _rowData
})

// 删除
Mock.mock('/list/delete', 'delete', options => {
  const { id } = JSON.parse(options.body)
  const index = list.findIndex(item => item.id === id)
  const item = index > 0 ? list[index] : {}
  list.splice(index, 1)
  return item
})

// 用户登录
console.log('快进入 mock里面了  数据登录了')
Mock.mock('/login', 'post', options => {
  console.log('快进入 mock里面了  数据登录了2222')
   const { username, password } = JSON.parse(options.body)
   console.log(username,password)
  const user = users.find(item => {
    return item.username === username && item.password === password
  })
  return user
})
