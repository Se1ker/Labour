# 劳动教育实践数字化管理与展示系统API 接口文档

## API V1 接口说明

- 接口基准地址：`https://qc9qjl.app.cloudendpoint.cn/api/v1`
- 服务端已开启 CORS 跨域支持
- API V1 认证统一使用 Token 认证
- 需要授权的 API ，必须在请求头中使用 `Authorization` 字段提供 `token` 令牌
- 使用 HTTP Status Code 标识状态
- 数据返回格式统一使用 JSON

### 支持的请求方法

- GET（SELECT）：从服务器取出资源（一项或多项）。
- POST（CREATE）：在服务器新建一个资源。
- PUT（UPDATE）：在服务器更新资源（客户端提供改变后的完整资源）。
- PATCH（UPDATE）：在服务器更新资源（客户端提供改变的属性）。
- DELETE（DELETE）：从服务器删除资源。

### 通用返回状态说明

| *状态码* | *含义*                | *说明*                                              |
| -------- | --------------------- | --------------------------------------------------- |
| 200      | OK                    | 请求成功                                            |
| 201      | CREATED               | 创建成功                                            |
| 204      | DELETED               | 删除成功                                            |
| 400      | BAD REQUEST           | 请求的地址不存在或者包含不支持的参数                |
| 401      | UNAUTHORIZED          | 未授权                                              |
| 403      | FORBIDDEN             | 被禁止访问                                          |
| 404      | NOT FOUND             | 请求的资源不存在                                    |
| 422      | Unprocessable entity   | [POST/PUT/PATCH] 当创建一个对象时，发生一个验证错误 |
| 500      | INTERNAL SERVER ERROR | 内部错误                                            |

# APP端

## 用户信息模块

### 登录功能

- 请求路径：/login
- 请求方法：post
- 请求参数

| 参数名   | 参数说明 | 是否能为空 | 数据类型 | 备注                 |
| -------- | -------- | ---------- | -------- | -------------------- |
| account  | 账号     | N          | string   | 可填学号或者邮箱     |
| password | 密码     | N          | string   | 长度大于10位小于16位 |

```json
{
    "account":"2009104008",
    "password":"1234567890"
}
```

- 响应数据

| 参数名 | 参数说明 | 备注            |
| ------ | -------- | --------------- |
| token  | 令牌     | 基于 jwt 的令牌 |

```json
{
    "msg": "登录成功",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MWEzMzZkNzhjZDBkNTJkZWRmYzRjNTQiLCJpYXQiOjE2MzgxNTgxMjl9.WWHWXIdfF4rLFIsTSCzpIoQgKLn6KTL2kZ4KGdEphAQ"
    }
}
```

### 注册功能

- 请求路径：/register
- 请求方法：post
- 请求参数

| 参数名   | 参数说明 | 是否能为空 | 数据类型 | 备注                 |
| -------- | -------- | ---------- | -------- | -------------------- |
| toEmail  | 邮箱号   | N          | string   |                      |
| code     | 验证码   | N          | string   |                      |
| stuId    | 学号     | N          | string   |                      |
| password | 密码     | N          | string   | 长度大于10位小于16位 |

```json
{
    "toEmail":"2990310340@qq.com",
    "code":"432115",
    "password":"1234567890",
    "stuId":"2009104008"
}
```

- 响应数据

```json
{
    "msg": "注册成功",
}
```

### 发送验证码

- 请求路径：/sendSecCode
- 请求方法：post
- 请求参数

| 参数名   | 参数说明 | 是否能为空 | 数据类型 | 备注                 |
| -------- | -------- | ---------- | -------- | -------------------- |
| toEmail  | 邮箱号   | N          | string   |                      |
| code     | 验证码   | N          | string   |                      |
| stuId    | 学号     | N          | string   |                      |
| password | 密码     | N          | string   | 长度大于10位小于16位 |

```json
{
    "toEmail":"2990310340@qq.com"
}
```

- 响应数据

```json
{
    "msg": "发送成功"
}
```

### 修改密码

- 请求路径：/modifyPass
- 请求方法：post
- 请求参数

| 参数名  | 参数说明 | 是否能为空 | 数据类型 | 备注                 |
| ------- | -------- | ---------- | -------- | -------------------- |
| code    | 验证码   | N          | string   |                      |
| newPass | 密码     | N          | string   | 长度大于10位小于16位 |

```json
{
    "newPass":"cjq0913121"
}
```

- 响应数据

```json
{
    "msg": "修改成功"
}
```

### 修改个人信息

- 请求路径：/modifyUserInfo
- 请求方法：post
- 请求参数

| 参数名    | 参数说明 | 是否能为空 | 数据类型 | 备注          |
| --------- | -------- | ---------- | -------- | ------------- |
| img       | 头像     | Y          | file     | form-data类型 |
| nickname  | 昵称     | Y          | string   |               |
| academyId | 学院ID   | Y          | string   |               |
| classId   | 班级Id   | Y          | string   |               |

- 响应数据

```json
{
    "data": {
        "_id": "61a336d78cd0d52dedfc4c54",
        "email": "2990310340@qq.com",
        "stuId": "2009104008",
        "createdAt": "2021-11-28T07:59:19.561Z",
        "updatedAt": "2021-12-02T09:36:02.150Z",
        "nickname": "theKi",
        "avatar": "https://s3-lc.thelarkcloud.com/obj/larkcloud-mgcloud/baas/qc9qjl/88cf8e63ef4e0f17_1638437761586.jpg",
        "academyName": "电子与信息工程学院"
    },
    "msg": "修改成功"
}
```

### 返回班级列表

- 请求路径：/listClass
- 请求方法：post
- 请求参数

| 参数名称  | 参数类型 | 参数说明 |
| --------- | -------- | -------- |
| academyId | string   | 学院Id   |

- 响应数据

```json
{
    "msg": "获取成功",
    "data": [
        {
            "_id": "6232f77dccec549be0aabf14",
            "belong": "6232f76accec549be0aabeb6",
            "name": "18德语",
            "peopleCount": 28,
            "createdAt": "2022-03-17T08:55:25.402Z",
            "updatedAt": "2022-03-17T08:55:25.402Z"
        },
        {
            "_id": "6232f77dccec549be0aabf15",
            "belong": "6232f76accec549be0aabeb6",
            "name": "18日语",
            "peopleCount": 29,
            "createdAt": "2022-03-17T08:55:25.568Z",
            "updatedAt": "2022-03-17T08:55:25.568Z"
        },
        {
            "_id": "6232f77dccec549be0aabf16",
            "belong": "6232f76accec549be0aabeb6",
            "name": "18商英",
            "peopleCount": 57,
            "createdAt": "2022-03-17T08:55:25.778Z",
            "updatedAt": "2022-03-17T08:55:25.778Z"
        },]
 }
```



### 返回个人信息

- 请求路径：/getUserInfo
- 请求方法：get
- 请求参数： 无

- 响应数据

```json
{
    "data": {
        "_id": "61a336d78cd0d52dedfc4c54",
        "email": "2990310340@qq.com",
        "stuId": "2009104008",
        "createdAt": "2021-11-28T07:59:19.561Z",
        "updatedAt": "2021-12-02T09:36:02.150Z",
        "nickname": "theKi",
        "avatar": "https://s3-lc.thelarkcloud.com/obj/larkcloud-mgcloud/baas/qc9qjl/88cf8e63ef4e0f17_1638437761586.jpg",
        "academyName": "电子与信息工程学院"
    },
    "msg": "获取用户个人信息成功"
}
```

### 返回学院信息

- 请求路径：/listAcademy
- 请求方法：get
- 请求参数： 无

- 响应数据

```json
{
    "msg": "学院列表获取成功",
    "data": [
        {
            "_id": "61a6221fb5c463023efe5180",
            "createdAt": "2021-11-30T13:07:43.631Z",
            "updatedAt": "2021-11-30T13:07:53.586Z",
            "name": "医学部"
        },
        {
            "_id": "61a62236b5c463023efe5182",
            "createdAt": "2021-11-30T13:08:06.333Z",
            "updatedAt": "2021-11-30T13:08:10.163Z",
            "name": "电子与信息工程学院"
        }
    ]
}
```

### 收藏活动

- 请求路径：/addFavorites
- 请求方法：post
- 请求参数：

| 参数名 | 参数说明 | 是否能为空 | 数据类型 | 备注 |
|--------| ------- | ---------- | -------- | ------------ |
| aid | 活动id | N | string |            |

- 响应数据

```json
{
    "msg": "已取消收藏",
    "data": false
}
```

```json
{
    "msg": "收藏成功",
    "data": true
}
```

## 活动模块

### 创建活动

- 请求路径：/createActivity
- 请求方法：post
- 请求参数：

| 参数名 | 参数说明 | 是否能为空 | 数据类型 | 备注 |
|--------| ------- | ---------- | -------- | ------------ |
| title | 活动标题 | N | string |            |
| content | 活动描述 | N | string |            |
| cover | 活动封面图片url | Y | string |        |
| applyTime | 允许加入时间 | N | object | {"start": "2022-01-11T08:32:39.628Z","end": "2022-01-16T08:32:39.628Z"} |
| actTime | 活动行动时间 | N | object | {"start": "2022-01-16T08:32:39.628Z","end": "2022-01-19T08:32:39.628Z"} |
| location | 活动地点 | N | string | |
| score | 活动分数 | N | number | 大于0小于10 不能为小数 |

- 响应数据

```json
{
    "data": {
        "aid": "61a336d78cd0d52dedfc4c73"
    },
    "msg": "创建活动成功"
}
```

### 加入活动

- 请求路径：/joinActivity
- 请求方法：post
- 请求参数：

| 参数名 | 参数说明 | 是否能为空 | 数据类型 | 备注 |
|--------| ------- | ---------- | -------- | ------------ |
| aid | 活动ID | N | string |            |

- 响应数据

```json
{
    "msg": "加入活动成功"
}
```

### 退出活动

- 请求路径：/quitActivity
- 请求方法：post
- 请求参数：

| 参数名 | 参数说明 | 是否能为空 | 数据类型 | 备注 |
|--------| ------- | ---------- | -------- | ------------ |
| aid | 活动ID | N | string |            |

- 响应数据

```json
{
    "msg": "退出活动成功"
}
```

### 活动签到

- 请求路径：/activitySignIn
- 请求方法：post
- 请求参数：

| 参数名 | 参数说明 | 是否能为空 | 数据类型 | 备注 |
|--------| ------- | ---------- | -------- | ------------ |
| aid | 活动ID | N | string |            |

- 响应数据

```json
{
    "msg": "活动签到成功"
}
```

### 活动签退

- 请求路径：/activitySignOut
- 请求方法：post
- 请求参数：

| 参数名 | 参数说明 | 是否能为空 | 数据类型 | 备注 |
|--------| ------- | ---------- | -------- | ------------ |
| aid | 活动ID | N | string |            |

- 响应数据

```json
{
    "msg": "活动签退成功"
}
```

### 活动结项

- 请求路径：/commit
- 请求方法：post
- 请求参数：

| 参数名 | 参数说明 | 是否能为空 |
| ------ | -------- | ---------- |
| aid    | 活动id   | N          |
| urls   | 图片数组 | N          |



### 获取活动列表

- 请求路径：/listActivity

- 请求方法：get

- 请求参数：
  | 参数名 | 是否必须 | 数据类型 | 备注                                                         |
  | ------ | -------- | -------- | ------------------------------------------------------------ |
  | status | N        | string   | 不加参数则返回已通过审核列表，unPass：返回未通过审核数据；unCheck：返回未审核数据；all：返回所有数据 |
- 响应数据

```json
{
    "msg": "已通过审核列表查询成功",
    "data": [
        {
            "_id": "61dd4848d83d74652376b56a",
            "title": "标题13",
            "content": "内容22",
            "owner": "61a336d78cd0d52dedfc4c54",
            "capacity": 996,
            "applyTime": {
                "start": "2022-01-11T08:32:39.628Z",
                "end": "2022-01-16T08:32:39.628Z"
            },
            "actTime": {
                "start": "2022-01-17T08:32:39.628Z",
                "end": "2022-01-19T08:32:39.628Z"
            },
            "cover": "https://s6-lc.thelarkcloud.com/obj/larkcloud-mgcloud/baas/qc9qjl/57e9942d4a48a65e_1638356137250.jpg",
            "createdAt": "2022-01-11T09:05:12.276Z",
            "updatedAt": "2022-01-13T05:35:41.583Z",
            "isPass": true,
            "applyPerson": [
                {
                    "uid": "61a5da8ce09d6e026316cfab",
                    "nickname": "37w",
                    "avatar": "https://s3-lc.thelarkcloud.com/obj/larkcloud-mgcloud/baas/qc9qjl/88cf8e63ef4e0f17_1638437761586.jpg"
                }
            ],
            "score": 1,
            "isDone": false,
            "ownerName": "theKi",
            "favoritesCount": 1,
            "favorite": false,
            "location": "第二食堂"
        }
    ]
}
```

### 根据活动id返回活动详情

- 请求路径：/getActivityById

- 请求方法：get

- 请求参数：

  | 参数名 | 是否必须 | 数据类型 | 备注   |
  | ------ | -------- | -------- | ------ |
  | aid    | Y        | string   | 活动id |

- 响应数据

```json
{
    "msg": "获取活动成功",
    "data": {
        "_id": "61dd4848d83d74652376b56a",
        "title": "标题13",
        "content": "内容22",
        "owner": "61a336d78cd0d52dedfc4c54",
        "capacity": 996,
        "applyTime": {
            "start": "2022-01-11T08:32:39.628Z",
            "end": "2022-01-16T08:32:39.628Z"
        },
        "actTime": {
            "start": "2022-01-17T08:32:39.628Z",
            "end": "2022-01-19T08:32:39.628Z"
        },
        "cover": "https://s6-lc.thelarkcloud.com/obj/larkcloud-mgcloud/baas/qc9qjl/57e9942d4a48a65e_1638356137250.jpg",
        "createdAt": "2022-01-11T09:05:12.276Z",
        "updatedAt": "2022-01-13T05:35:41.583Z",
        "isPass": true,
        "applyPerson": [
            {
                "uid": "61a5da8ce09d6e026316cfab",
                "nickname": "lzw-723",
                "avatar": "https://qc9qjl.file.qingfuwucdn.com/file/6a9a5edb97aedc57_1642172519330.jpg"
            }
        ],
        "score": 1,
        "isDone": false,
        "ownerName": "theKi123",
        "ownerEmail": "2990310340@qq.com",
        "favoritesCount": 1,
        "favorite": false,
        "location": "第二食堂"
    }
}
```

### 根据用户id返回参加的活动信息

- 请求路径：/listJoinActivity

- 请求方法：get

- 请求参数：

- 响应数据

```json
{
    "msg": "获取活动成功",
    "data": {
        "_id": "61dd4848d83d74652376b56a",
        "title": "标题13",
        "content": "内容22",
        "owner": "61a336d78cd0d52dedfc4c54",
        "capacity": 996,
        "applyTime": {
            "start": "2022-01-11T08:32:39.628Z",
            "end": "2022-01-16T08:32:39.628Z"
        },
        "actTime": {
            "start": "2022-01-17T08:32:39.628Z",
            "end": "2022-01-19T08:32:39.628Z"
        },
        "cover": "https://s6-lc.thelarkcloud.com/obj/larkcloud-mgcloud/baas/qc9qjl/57e9942d4a48a65e_1638356137250.jpg",
        "createdAt": "2022-01-11T09:05:12.276Z",
        "updatedAt": "2022-01-13T05:35:41.583Z",
        "isPass": true,
        "applyPerson": [
            {
                "uid": "61a5da8ce09d6e026316cfab",
                "nickname": "lzw-723",
                "avatar": "https://qc9qjl.file.qingfuwucdn.com/file/6a9a5edb97aedc57_1642172519330.jpg"
            }
        ],
        "score": 1,
        "isDone": false,
        "ownerName": "theKi123",
        "ownerEmail": "2990310340@qq.com",
        "favoritesCount": 1,
        "favorite": false,
        "location": "第二食堂"
    }
}
```

### 积分排名

- 请求路径：/scoreSort

- 请求方法：get

- 请求参数：

- 响应数据

```json
{
    "msg": "获取积分排序列表成功",
    "data": [
        {
            "_id": "61a336d78cd0d52dedfc4c54",
            "email": "2990310340@qq.com",
            "stuId": "2009104008",
            "createdAt": "2021-11-28T07:59:19.561Z",
            "updatedAt": "2022-01-12T10:21:12.193Z",
            "nickname": "theKi",
            "score": 12,
            "HDegree": 100,
            "avatar": "https://s3-lc.thelarkcloud.com/obj/larkcloud-mgcloud/baas/qc9qjl/88cf8e63ef4e0f17_1638437761586.jpg",
            "actId": [
                "61dd4848d83d74652376b56a"
            ],
            "academyName": "电子与信息工程学院"
        },
        {
            "_id": "61a5da8ce09d6e026316cfab",
            "createdAt": "2021-11-30T08:02:20.923Z",
            "updatedAt": "2022-01-13T09:59:25.281Z",
            "email": "lzw-723@qq.com",
            "stuId": "2111111020",
            "nickname": "37w",
            "score": 11,
            "HDegree": 100,
            "actId": [
                "61dd4848d83d74652376b56a",
                "61de6c4af36443024c5b36ed"
            ],
            "avatar": "https://s3-lc.thelarkcloud.com/obj/larkcloud-mgcloud/baas/qc9qjl/88cf8e63ef4e0f17_1638437761586.jpg",
            "academyName": "电子与信息工程学院"
        },
        {
            "_id": "61de8917e5e45002391dbbd7",
            "createdAt": "2022-01-12T07:53:59.187Z",
            "updatedAt": "2022-01-12T10:21:17.184Z",
            "email": "123123123@qq.com",
            "stuId": "2000000000",
            "score": 10,
            "HDegree": 100,
            "avatar": "https://s3-lc.thelarkcloud.com/obj/larkcloud-mgcloud/baas/qc9qjl/88cf8e63ef4e0f17_1638437761586.jpg",
            "actId": [
                "61dd4848d83d74652376b56a",
                "61de6c4af36443024c5b36ed"
            ],
            "nickname": "aaa",
            "academyName": "医学部"
        }
    ]
}
```

### 评论活动

- 请求路径：/commentActivity
- 请求方法：post
- 请求参数：

| 参数名 | 是否必须 | 数据类型 | 备注 |
|--------|---------|---------|------|
| aid | Y | string | 活动id |
| content | N | string | 评论内容 |

- 响应数据

```json
{
    "msg": "评论成功",
    "data": "61df9862e5d05cc2b8ca4e8d"
}
```

### 获取评论列表

- 请求路径：/listComments
- 请求方法：get
- 请求参数：

| 参数名 | 是否必须 | 数据类型 | 备注 |
|-|-|-|-|
| aid | Y | string | 活动id |

- 响应数据

```json
{
    "msg": "获取评论列表成功",
    "data": [
        {
            "comment": {
                "_id": "61e62d0b517d7b1d01c19bea",
                "owner": "61a336d78cd0d52dedfc4c54",
                "content": "对于e27活动的评论1",
                "reply": null,
                "belong": "61dd081e40ced60208cf7e27",
                "type": "activity",
                "createdAt": "2022-01-18T02:59:23.324Z",
                "updatedAt": "2022-01-18T02:59:23.325Z",
                "likeCount": 0,
                "liked": false,
                "avatar": "https://qc9qjl.file.qingfuwucdn.com/file/c402a11b3380db76_1642170754457.png",
                "nickname": "theKi123"
            },
            "child": [
                {
                    "comment": {
                        "_id": "61e637096905d71c386825e4",
                        "owner": "61a336d78cd0d52dedfc4c54",
                        "content": "对于bea评论的回复2",
                        "reply": "61e62d0b517d7b1d01c19bea",
                        "belong": "61dd081e40ced60208cf7e27",
                        "type": null,
                        "createdAt": "2022-01-18T03:42:01.936Z",
                        "updatedAt": "2022-01-18T03:42:01.936Z",
                        "likeCount": 0,
                        "liked": false,
                        "avatar": "https://qc9qjl.file.qingfuwucdn.com/file/c402a11b3380db76_1642170754457.png",
                        "nickname": "theKi123"
                    },
                    "child": [
						...
                    ]
                },
}
```

### 回复评论

- 请求路径：/replyComment
- 请求方法：post
- 请求参数：

| 参数名 | 是否必须 | 数据类型 | 备注 |
| -------- | -------- | ---------- | -------- |
| reply | Y | string | 所回复的评论id |
| content | N | string | 评论内容 |
| belong | Y | string | 当前活动id |

- 响应数据

```json
{
    "msg": "回复评论成功",
    "data": "61df9862e5d05cc2b8ca4e8d"
}
```

### 点赞或取消点赞评论

- 请求路径：/likeComment
- 请求方法：post
- 请求参数：

| 参数名 | 是否必须 | 数据类型 | 备注 |
| -------- | -------- | ---------- | -------- |
| cmid | Y | string | 所点赞的评论id |

- 响应数据

```json
{
    "msg": "点赞成功",
    "data": true
}
```

```json
{
    "msg": "已取消点赞",
    "data": false
}
```



### 获取热门活动

- 请求路径：/getHotActivity
- 请求方法：get
- 请求参数：无

- 响应参数

  ```json
  {
      "msg": "获取热门推荐活动成功",
      "data": [
          {
              "_id": "61dd4848d83d74652376b56a",
              "title": "标题13",
              "content": "内容22",
              "owner": "61a336d78cd0d52dedfc4c54",
              "capacity": 12,
              "applyTime": {
                  "start": "2022-01-11T08:32:39.628Z",
                  "end": "2022-01-16T08:32:39.628Z"
              },
              "actTime": {
                  "start": "2022-01-17T08:32:39.628Z",
                  "end": "2022-01-19T08:32:39.628Z"
              },
              "cover": "https://s6-lc.thelarkcloud.com/obj/larkcloud-mgcloud/baas/qc9qjl/57e9942d4a48a65e_1638356137250.jpg",
              "createdAt": "2022-01-11T09:05:12.276Z",
              "updatedAt": "2022-01-16T08:31:18.097Z",
              "isPass": true,
              "applyPerson": [
                  {
                      "uid": "61a5da8ce09d6e026316cfab",
                      "nickname": "lzw-723",
                      "avatar": "https://qc9qjl.file.qingfuwucdn.com/file/6a9a5edb97aedc57_1642172519330.jpg"
                  }
              ],
              "score": 1,
              "isDone": false,
              "favoritesCount": 1,
              "favorite": false,
              "commentCount": 5,
              "ownerName": "theKi123",
              "ownerEmail": "2990310340@qq.com"
          } 
          ... // 最多十条
      ]
  }
  ```

### 获取动态列表

- 请求路径：/listDynamic
- 请求方法：get
- 请求参数：无

| 参数名 | 参数说明     | 是否为空 | 数据类型 | 备注     |
| ------ | ------------ | -------- | -------- | -------- |
| skip   | 跳过前n项    | y        | number   | 默认为0  |
| limit  | 指定返回 n项 | y        | number   | 默认为10 |



- 响应参数

```json
{
    "msg": "获取动态列表成功",
    "data": [
        {
            "_id": "62206a650fe6c5b6f20a8b7c",
            "uid": "61a5da8ce09d6e026316cfab",
            "content": "女朋友丢了",
            "title": "女朋友",
            "images": [],
            "keywords": [
                "骗人的"
            ],
            "type": "寻物启事",
            "contact": {
                "type": "微信"
            },
            "isDone": false,
            "createdAt": "2022-03-03T07:12:37.099Z",
            "updatedAt": "2022-03-03T07:12:37.099Z"
        },
        {
            "_id": "622069f20fe6c5b6f20a8b7b",
            "uid": "61a5da8ce09d6e026316cfab",
            "content": "羽毛球场捡到",
            "title": "发卡",
            "images": [
                "https://qc9qjl.file.qingfuwucdn.com/file/819879e4928eaaf8_1646291412581.png"
            ],
            "keywords": [
                "发卡"
            ],
            "type": "失物招领",
            "contact": {
                "type": "邮箱"
            },
            "isDone": false,
            "createdAt": "2022-03-03T07:10:42.327Z",
            "updatedAt": "2022-03-03T07:10:42.327Z"
        }
    ]
}
```



## 失物招领&寻物启事模块

### 创建

- 请求路径: /createLosts
- 请求方法：post
- 请求参数

| 参数名   | 参数说明 | 是否能为空 | 数据类型 | 备注                                  |
| -------- | -------- | ---------- | -------- | ------------------------------------- |
| title    | 标题     | n          | string   |                                       |
| content  | 内容     | n          | string   |                                       |
| images   | 图片     | y          | array    |                                       |
| contact  | 联系     | n          | object   | 有两个属性，联系方式 type, 联系值info |
| keywords | 关键词   | n          | array    |                                       |
| type     | 类型     | n          | string   | 为"失物招领"或者"寻物启事"            |

```json
{
    "title":"耳机失物招领",
    "content":"谁的计算机导论掉了",
    "images":["https://qc9qjl.file.qingfuwucdn.com/file/337821e67cbccb13_1642597710523.jpg"],
    "contact":{
        "type":"QQ",
        "info":"2638420181"
    },
    "keywords":["计算机导论","书"],
    "type":"失物招领"
}
```

- 响应数据

```json
{
    "msg": "创建成功",
    "data": "61ebc4dde0822062ce5c0fed"
}
```

### 根据关键词查找

- 请求路径：/searchByKey
- 请求方法:get
- 请求参数

| 参数名 | 参数说明 | 是否能为空 | 数据类型 | 备注 |
| ------ | -------- | ---------- | -------- | ---- |
| key    | 关键字   | n          | string   |      |

- 响应参数

```json
{
    "msg": 1,
    "data": [
        {
            "_id": "61ebc4dde0822062ce5c0fed",
            "uid": "61a5da8ce09d6e026316cfab",
            "content": "谁的计算机导论掉了",
            "title": "耳机失物招领",
            "images": [
                "https://qc9qjl.file.qingfuwucdn.com/file/337821e67cbccb13_1642597710523.jpg"
            ],
            "keywords": [
                "计算机导论",
                "书"
            ],
            "type": "失物招领",
            "contact": {
                "type": "QQ",
                "info": "2638420181"
            },
            "isDone": false,
            "createdAt": "2022-01-22T08:48:29.800Z",
            "updatedAt": "2022-01-22T08:48:29.800Z"
        }
    ]
}
```

### 完结事件

- 请求路径：/doneLosts
- 请求方法：post
- 请求参数

| 参数名 | 参数说明 | 是否能为空 | 数据类型 | 备注 |
| ------ | -------- | ---------- | -------- | ---- |
| lid    | 事件id   | n          | string   |      |

- 响应数据

```json
{
    "msg": "关闭成功",
    "data": true
}
```

### 获取列表

- 请求路径: /listLosts
- 请求方法: get
- 请求参数：无
- 响应数据

```js
{
    "msg": "获取列表成功",
    "data": [
        {
            "_id": "61ebb08d7ed69a35d4bb8bd1",
            "uid": "61a5da8ce09d6e026316cfab",
            "content": "谁家耳机掉了",
            "title": "耳机失物招领",
            "images": [
                "https://qc9qjl.file.qingfuwucdn.com/file/337821e67cbccb13_1642597710523.jpg"
            ],
            "keywords": [
                "耳机",
                "二食堂"
            ],
            "type": "失物招领",
            "contact": {
                "type": "QQ",
                "info": "2638420181"
            },
            "isDone": true,
            "createdAt": "2022-01-22T07:21:49.367Z",
            "updatedAt": "2022-01-22T11:44:49.374Z"
        },
        {
            "_id": "61ebb7b7071cf3642a2c48f7",
            "uid": "61a5da8ce09d6e026316cfab",
            "content": "谁家耳机掉了",
            "title": "耳机失物招领",
            "images": [
                "https://qc9qjl.file.qingfuwucdn.com/file/337821e67cbccb13_1642597710523.jpg"
            ],
            "keywords": [
                "耳机",
                "二食堂"
            ],
            "type": "失物招领",
            "contact": {
                "type": "QQ",
                "info": "2638420181"
            },
            "isDone": false,
            "createdAt": "2022-01-22T07:52:23.702Z",
            "updatedAt": "2022-01-22T07:52:23.702Z"
        },
        {
            "_id": "61ebc4dde0822062ce5c0fed",
            "uid": "61a5da8ce09d6e026316cfab",
            "content": "谁的计算机导论掉了",
            "title": "耳机失物招领",
            "images": [
                "https://qc9qjl.file.qingfuwucdn.com/file/337821e67cbccb13_1642597710523.jpg"
            ],
            "keywords": [
                "计算机导论",
                "书"
            ],
            "type": "失物招领",
            "contact": {
                "type": "QQ",
                "info": "2638420181"
            },
            "isDone": false,
            "createdAt": "2022-01-22T08:48:29.800Z",
            "updatedAt": "2022-01-22T08:48:29.800Z"
        }
    ]
}
```



### 评论活动

- 请求路径：/commentLosts
- 请求方法：post
- 请求参数：

| 参数名  | 是否必须 | 数据类型 | 备注     |
| ------- | -------- | -------- | -------- |
| lid     | Y        | string   | 活动id   |
| content | N        | string   | 评论内容 |

- 响应数据

```json
{
    "msg": "评论成功",
    "data": "61df9862e5d05cc2b8ca4e8d"
}
```

### 获取评论列表

- 请求路径：/losts/listComments
- 请求方法：get
- 请求参数：

| 参数名 | 是否必须 | 数据类型 | 备注   |
| ------ | -------- | -------- | ------ |
| lid    | Y        | string   | 活动id |

- 响应数据

```json
{
    "msg": "获取评论列表成功",
    "data": [
        {
            "comment": {
                "_id": "61ebfe9ece5c369d587add91",
                "owner": "61a5da8ce09d6e026316cfab",
                "content": "这玩意可能是xxx的",
                "reply": null,
                "belong": "61ebc4dde0822062ce5c0fed",
                "type": "losts",
                "createdAt": "2022-01-22T12:54:54.156Z",
                "updatedAt": "2022-01-22T12:54:54.156Z",
                "likeCount": 0,
                "liked": false,
                "avatar": "https://qc9qjl.file.qingfuwucdn.com/file/6a9a5edb97aedc57_1642172519330.jpg",
                "nickname": "lzw-723"
            },
            "child": [
                {
                    "comment": {
                        "_id": "61ec0063ce5c369d587add92",
                        "owner": "61a5da8ce09d6e026316cfab",
                        "content": "这可能是我的",
                        "reply": "61ebfe9ece5c369d587add91",
                        "belong": "61ebc4dde0822062ce5c0fed",
                        "type": null,
                        "createdAt": "2022-01-22T13:02:27.905Z",
                        "updatedAt": "2022-01-22T13:02:27.905Z",
                        "likeCount": 0,
                        "liked": false,
                        "avatar": "https://qc9qjl.file.qingfuwucdn.com/file/6a9a5edb97aedc57_1642172519330.jpg",
                        "nickname": "lzw-723"
                    },
                    "child": []
                }
            ]
        }
    ]
}
```

### 回复评论

- 请求路径：/losts/replyComment
- 请求方法：post
- 请求参数：

| 参数名  | 是否必须 | 数据类型 | 备注           |
| ------- | -------- | -------- | -------------- |
| reply   | Y        | string   | 所回复的评论id |
| content | Y        | string   | 评论内容       |
| belong  | Y        | string   | 当前活动id     |

- 响应数据

```json
{
    "msg": "回复评论成功",
    "data": "61ec0063ce5c369d587add92"
}
```



## 后台管理端

### 登录功能

- 请求路径：/saLogin
- 请求方法：post
- 请求参数

| 参数名   | 参数说明 | 是否能为空 | 数据类型 | 备注                 |
| -------- | -------- | ---------- | -------- | -------------------- |
| stuId    | 账号     | N          | string   | 可填学号或者邮箱     |
| password | 密码     | N          | string   | 长度大于10位小于16位 |

```json
{
    "stuId":"admin",
    "password":"admin"
}
```

- 响应数据

```json
{
    "msg": "登录成功",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MWEwZDVlZWQyODEwMTAyMmUxOWJjNGUiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2Mzg4ODU5NTYsImV4cCI6MTY0MDA5NTU1Nn0.-amzl5emxiguN-iuRQd5q49nYOhH0u_UAXzU8M__HYY"
    }
}
```

### 审核活动

- 请求路径：/checkActivity
- 请求方法：post
- 请求参数：

| 参数名 | 参数说明 | 是否能为空 | 数据类型 | 备注 |
|--------| ------- | ---------- | -------- | ------------ |
| aid | 活动ID | N | string |            |
| pass | 审核是否通过 | N | boolean |            |

- 响应数据

```json
{
    "msg": "审核活动通过"
}
```

### 获取活动列表

- 请求路径：/back/listActivity

- 请求方法：get

- 请求参数：

  | 参数名 | 是否必须 | 数据类型 | 备注                                                         |
  | ------ | -------- | -------- | ------------------------------------------------------------ |
  | status | N        | string   | 不加参数则返回已通过审核列表，unPass：返回未通过审核数据；unCheck：返回未审核数据；all：返回所有数据 |

- 响应数据

```json
{
    "msg": "获取活动成功",
    "data": {
        "_id": "61dd4848d83d74652376b56a",
        "title": "标题13",
        "content": "内容22",
        "owner": "61a336d78cd0d52dedfc4c54",
        "capacity": 996,
        "applyTime": {
            "start": "2022-01-11T08:32:39.628Z",
            "end": "2022-01-16T08:32:39.628Z"
        },
        "actTime": {
            "start": "2022-01-17T08:32:39.628Z",
            "end": "2022-01-19T08:32:39.628Z"
        },
        "cover": "https://s6-lc.thelarkcloud.com/obj/larkcloud-mgcloud/baas/qc9qjl/57e9942d4a48a65e_1638356137250.jpg",
        "createdAt": "2022-01-11T09:05:12.276Z",
        "updatedAt": "2022-01-13T05:35:41.583Z",
        "isPass": true,
        "applyPerson": [
            {
                "uid": "61a5da8ce09d6e026316cfab",
                "nickname": "lzw-723",
                "avatar": "https://qc9qjl.file.qingfuwucdn.com/file/6a9a5edb97aedc57_1642172519330.jpg"
            }
        ],
        "score": 1,
        "isDone": false,
        "ownerName": "theKi123",
        "favoritesCount": 1,
        "favorite": false,
        "location": "第二食堂"
    }
}
```



## 打扫模块

### 班级成员自选

- 请求路径：/choose
- 请求方法:post
- 请求参数

| 参数名  | 参数类型 | 参数说明 |
| ------- | -------- | -------- |
| weekDay | string   | 周几     |
|         |          |          |

- 响应数据

```json
{
    "msg": "选取成功",
    "data": true
}
```

### 选择列表

- 请求路径：/chooseList
- 请求方法: get

- 请求参数
- 响应数据

```json
{
    "msg": "获取成功",
    "data": {
        "tasksId": "6203d7706d2a0a34aa7e7c93",
        "classInfo": {
            "name": "21软件一班",
            "peopleCount": 53
        },
        "room": "11A103",
        "mon": {
            "capacity": 10,
            "remain": 10
        },
        "tue": {
            "capacity": 11,
            "remain": 11
        },
        "wed": {
            "capacity": 11,
            "remain": 11
        },
        "thu": {
            "capacity": 11,
            "remain": 11
        },
        "fri": {
            "capacity": 10,
            "remain": 10
        }
    }
}
```

- 参数说明

| 参数名称 | 参数说明 |
| -------- | -------- |
| capacity | 容量     |
| remain   | 剩余数   |

### 打扫任务推送

- 请求路径:/getTask
- 请求方法:get

- 请求参数:无
- 响应数据

```json
{
    "msg": "获取成功",
    "data": {
        "currentWeek": "当前是第3周,当前周一有打扫任务",
        "allWeek": [
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18
        ],
        "detail": {
            "className": "20软件2",
            "areaName": "10B502",
            "buildName": "10栋",
            "acaName": "电子与信息工程学院"
        }
    }
}
```

- 响应数据说明

| 参数名称    | 参数说明                 |      |
| ----------- | ------------------------ | ---- |
| currentweek | 当前周是否有任务         |      |
| allweek     | 所有有打扫任务的周，序号 |      |
|             |                          |      |

### 是否签到

- 请求路径:/isTaskSign
- 请求方法:post

- 请求参数:无
- 响应数据

```json
{
    "msg": "未签到",
    "data": false
}
```



### 打扫签到

- 请求路径:/taskSign
- 请求方法:post
- 请求参数:无
- 响应数据

```json
{
    "msg": "签到失败,非本周任务或重复签到",
    "data": false
}
```



## 检查模块

### 报名

- 请求路径：/apply
- 请求方法：post
- 请求参数
- 响应参数

```json
{
	"msg": "报名成功",
	"data": true
}
```

### 创建任务

- 请求路径:/createCheck
- 请求方法:post
- 请求参数

| 参数名称 | 参数类型 | 参数说明 |
| -------- | -------- | -------- |
| weekDay  | string   | 周几     |
| bid      | string   | 楼栋id   |

- 响应数据

```json
{
    "msg":"创建成功",
    "data":true
}
```

### 获取检查列表

- 请求路径:/getCheckList
- 请求方法:get
- 请求参数
- 响应数据

```json
{
    "msg": "生成成功",
    "data": [
        {
            "_id": "61a0d7f0d28101022e19bc56",
            "createdAt": "2021-11-26T12:49:52.308Z",
            "updatedAt": "2022-02-14T09:22:11.390Z",
            "name": "10栋",
            "count": 41,
            "limit": 4,
            "selectDetail": [
                {
                    "weekDay": "周一",
                    "remain": 4
                },
                {
                    "weekDay": "周二",
                    "remain": 4
                },
                {
                    "weekDay": "周三",
                    "remain": 4
                },
                {
                    "weekDay": "周四",
                    "remain": 4
                },
                {
                    "weekDay": "周五",
                    "remain": 4
                }
            ]
        },
        {
            "_id": "61e2ad012f281eb3fcffe778",
            "name": "医3号教学楼",
            "createdAt": "2022-01-15T11:16:17.043Z",
            "updatedAt": "2022-02-14T09:22:11.617Z",
            "count": 12,
            "limit": 1,
            "selectDetail": [
                {
                    "weekDay": "周一",
                    "remain": 0
                },
                {
                    "weekDay": "周二",
                    "remain": 1
                },
                {
                    "weekDay": "周三",
                    "remain": 1
                },
                {
                    "weekDay": "周四",
                    "remain": 1
                },
                {
                    "weekDay": "周五",
                    "remain": 1
                }
            ]
        },
        {
            "_id": "61e2ad012f281eb3fcffe775",
            "name": "8栋（新艺术楼）",
            "createdAt": "2022-01-15T11:16:17.042Z",
            "updatedAt": "2022-02-14T09:22:11.804Z",
            "count": 85,
            "limit": 8,
            "selectDetail": [
                {
                    "weekDay": "周一",
                    "remain": 8
                },
                {
                    "weekDay": "周二",
                    "remain": 8
                },
                {
                    "weekDay": "周三",
                    "remain": 8
                },
                {
                    "weekDay": "周四",
                    "remain": 8
                },
                {
                    "weekDay": "周五",
                    "remain": 8
                }
            ]
        },
        {
            "_id": "61e2ad012f281eb3fcffe773",
            "name": "5栋",
            "createdAt": "2022-01-15T11:16:17.041Z",
            "updatedAt": "2022-02-14T09:22:12.006Z",
            "count": 73,
            "limit": 7,
            "selectDetail": [
                {
                    "weekDay": "周一",
                    "remain": 7
                },
                {
                    "weekDay": "周二",
                    "remain": 7
                },
                {
                    "weekDay": "周三",
                    "remain": 7
                },
                {
                    "weekDay": "周四",
                    "remain": 7
                },
                {
                    "weekDay": "周五",
                    "remain": 7
                }
            ]
        },
        {
            "_id": "61e2ad012f281eb3fcffe76e",
            "name": "11栋",
            "createdAt": "2022-01-15T11:16:17.038Z",
            "updatedAt": "2022-02-14T09:22:12.204Z",
            "count": 42,
            "limit": 4,
            "selectDetail": [
                {
                    "weekDay": "周一",
                    "remain": 4
                },
                {
                    "weekDay": "周二",
                    "remain": 4
                },
                {
                    "weekDay": "周三",
                    "remain": 4
                },
                {
                    "weekDay": "周四",
                    "remain": 4
                },
                {
                    "weekDay": "周五",
                    "remain": 4
                }
            ]
        },
        {
            "_id": "61e2ad012f281eb3fcffe76f",
            "name": "20栋（医学楼）",
            "createdAt": "2022-01-15T11:16:17.039Z",
            "updatedAt": "2022-02-14T09:22:12.446Z",
            "count": 35,
            "limit": 4,
            "selectDetail": [
                {
                    "weekDay": "周一",
                    "remain": 4
                },
                {
                    "weekDay": "周二",
                    "remain": 4
                },
                {
                    "weekDay": "周三",
                    "remain": 4
                },
                {
                    "weekDay": "周四",
                    "remain": 4
                },
                {
                    "weekDay": "周五",
                    "remain": 4
                }
            ]
        },
        {
            "_id": "61e2ad012f281eb3fcffe776",
            "name": "9栋",
            "createdAt": "2022-01-15T11:16:17.043Z",
            "updatedAt": "2022-02-14T09:22:12.655Z",
            "count": 41,
            "limit": 4,
            "selectDetail": [
                {
                    "weekDay": "周一",
                    "remain": 4
                },
                {
                    "weekDay": "周二",
                    "remain": 4
                },
                {
                    "weekDay": "周三",
                    "remain": 4
                },
                {
                    "weekDay": "周四",
                    "remain": 4
                },
                {
                    "weekDay": "周五",
                    "remain": 4
                }
            ]
        }
    ]
}
```

### 获取用户的检查任务

- 请求路径：/getCheckById
- 请求方法：get
- 请求参数
- 响应数据

```json
{
    "msg": "获取成功",
    "data": {
        "_id": "620a42b72632aa25f0bebc08",
        "uid": "61a336d78cd0d52dedfc4c54",
        "weekDay": "周一",
        "room": [
            {
                "rid": "61e2af06dd16c3be909afe90",
                "name": "医学校区372"
            },
            {
                "rid": "61e2af05dd16c3be909afe1f",
                "name": "医学校区341"
            },
            {
                "rid": "61e2af06dd16c3be909afe89",
                "name": "医学校区331"
            },
            {
                "rid": "61e2af05dd16c3be909afde0",
                "name": "医学校区364"
            },
            {
                "rid": "61e2af05dd16c3be909afe20",
                "name": "医学校区321"
            },
            {
                "rid": "61e2af05dd16c3be909afe31",
                "name": "医学校区353"
            },
            {
                "rid": "61e2af05dd16c3be909afe25",
                "name": "医学校区352"
            },
            {
                "rid": "61e2af05dd16c3be909afe0a",
                "name": "医学校区363"
            },
            {
                "rid": "61e2af05dd16c3be909afdb8",
                "name": "医学校区351"
            },
            {
                "rid": "61e2af06dd16c3be909afe4e",
                "name": "医学校区373"
            },
            {
                "rid": "61e2af06dd16c3be909afeba",
                "name": "医学校区371"
            },
            {
                "rid": "61e2af05dd16c3be909afe17",
                "name": "医学校区365"
            }
        ],
        "bid": "61e2ad012f281eb3fcffe778",
        "createdAt": "2022-02-14T11:53:27.174Z",
        "updatedAt": "2022-02-14T11:53:27.174Z",
        "buildingName": "医3号教学楼"
    }
}
```



### 上传检查情况

- 请求路径: /checkCondition

- 请求方法: post

- 请求参数

  | 参数名 | 参数类型 | 参数说明         | 是否必需                                       |
  | ------ | -------- | ---------------- | ---------------------------------------------- |
  | status | string   | 不合格/合格/优秀 | Y                                              |
  | desc   | string   | 描述             | 当status为不合格时为必需，其他情况为不需       |
  | images | Array    | 图片             | 当status为不合格和优秀时为必需，其他情况为不需 |
  | coords | Array    | 坐标             | Y                                              |
  | area   | Object   | 地点             | Y                                              |

  ```json
  {
      "status":"不合格",
      "desc":"aaa",
      "images":"123",
      "coords":[22.345 , 78.222],
      "area":{
          "name":"123",
          "rid":"624ebb181762f45c7c7f8fed"
      } 
  }
  ```

- 响应参数

```json
{
    "msg": "发布成功",
    "data": {
        "uid": "61a5da8ce09d6e026316cfab",
        "status": "预警",
        "desc": "aaa",
        "images": "123",
        "coords": [
            22.345,
            78.222
        ],
        "class": "6232f7a2ccec549be0aabfce",
        "area": {
            "name": "123",
            "rid": "624ebb181762f45c7c7f8fed"
        },
        "_id": "62501783fe3b55a789077ddd",
        "createdAt": "2022-04-08T11:07:47.472Z",
        "updatedAt": "2022-04-08T11:07:47.473Z"
    }
}
```



## 上传图片

- https://qc9qjl.api.cloudendpoint.cn/uploadImage

