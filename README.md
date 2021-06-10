<!--
 * @Author: wangshengxian
 * @Date: 2020-08-19 09:57:01
 * @LastEditors: wangshengxian
 * @LastEditTime: 2021-02-01 17:33:20
 * @Desc: 说明文档
-->

## 简介

唐僧直播运营管理系统

### 登录账号

测试账号：admin 123456

### 服务器地址

测试服：54.222.167.84

测试访问：http://twww.whkuaiyu.com/tslive

正式服：18.162.251.202、 18.166.101.144、 18.166.33.162

正式服访问：http://live.whkuaiyu.com:8888/tslive

### 接口文档

测试：http://tapi.whkuaiyu.com/livecms/swagger-ui.html

正式：http://live.whkuaiyu.com:8888/livecms/swagger-ui.html

## 命令

```bash
# 启动
yarn serve 或 npm run serve

# 打包
yarn build:环境名 (测试环境：test，正式环境：prod)

# 静态资源分析
npm run report

# 代码格式检查并自动修复
npm run lintcd
├── public                     // html模板
├── src                        // 源代码
│   ├── api                    // 各模块请求接口函数
│   ├── assets                 // 图片、icons、styles等静态资源
│   ├── components             // 全局公共组件
│   ├── directive              // 公共自定义指令
│   ├── filters                // 公共filter
│   │   ├── transform.js       // 字段转中文函数
│   ├── utils                  // 公用方法目录
│   │   ├── request.js         // axios请求统一配置
│   │   ├── routerGuards.js    // 全局路由拦截
│   │   ├── tools.js           // 公共工具方法
│   │   ├── storage.js         // localStorage存储封装
│   │   ├── validate.js        // 公共表单校验方法
│   ├── views                  // 所有页面代码目录
├── vue.config.js              // vue-cli配置
```

### 浏览器支持

IE 11
Edge
Chrome
Firefox
Safari
