import http from './http'

export const login = data => {
  console.log('进入api 里面的user login里面了')
  return http('/login', 'post', data)
}
