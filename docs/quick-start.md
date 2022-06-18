#

**前提条件:**

已安装 vscode 或其他 IDE.

已安装 nodejs,并可全局调用.

(推荐)[从模板开始使用 eprc](/quick-start?id=从模板开始使用-eprc)

你也可以选择从独立安装 ↓ erpc 开始,并自己尝试编写用例.

# 独立安装

**安装**

```npm
 npm i erpc -s
```

# 从模板开始使用 eprc

## 下载 userTemplate

从此处拉取或下载: [erpc-userTemplate](https://github.com/daoif/erpc-userTemplate)

该模板中包含使用 erpc 所必须的源码,只需要下载并在该目录下跟着以下操作,进行一些尝试,理解模板代码每一部分的含义.

当然你也可以先大致浏览一遍以下入门内容,有需要时再下载模板.

## 初始化

解压模板源码,将该文件夹改名为:example

通过 IDE 打开该文件夹,本文档中所有操作均使用 windows(10 或以上)系统在 vscode 中进行.

打开 package.json:[package.json](/template?id=packagejson ":target=_blank") (推荐右键新标签页打开)

将 行:**2** 与 行:**14** 的 `usertemplate` 修改为 `example`

改动:

```json
<!-- package.json -->

-  "name": "usertemplate",
+  "name": "example",

-  "bro": "browserify -r ./dist/index.js:usertemplate > ./assets/index.js -d ",
+  "bro": "browserify -r ./dist/index.js:example > ./assets/index.js -d ",
```

ctrl+s 保存,然后打开终端,输入命令:`npm i`,等待安装依赖完成.

## 跑起来

展开 lib 文件夹,双击打开`index.ts`文件:[index.ts](/template?id=libindexts)

将`main2()`的全部代码解除注释,将行:**19**的`main()`改为`main2()`.

然后在终端输入:`npm run start`,等待 5 秒.
一切顺利的话,你应该得到输出的最后 4 句应该是如下内容:

```console
<!-- console -->
test1 收到请求,内容:
测试
请求 test1,回调数据:
test1 回调内容
```

并且在上面可能还有更多的输出,那么当我们调用`main2()`的时候,发生了什么呢?

## 它是如何工作的?

在刚刚的运行中,按顺序发生了这些事情:

1.生产端口开始监听,[动态建立生产端口监听](/features?id=动态建立生产端口监听)

2.尝试链接注册中心,并上传[动态拼接 URL 列表](/features?id=动态拼接-url-列表)

3.消费端口复用注册中心链接,请求生产节点信息.

4.消费端口通过动态 URL,尝试链接生产端口,并成功.

5.延迟 5 秒,确保消费端口已链接上生产端口,然后发送一个请求`test1`

6.首先是生产端口收到信息,并`console`收到的参数. 然后是消费节点收到回调,并`console`回调内容.

所以,在整个运行过程中:

生产端:启动时运行并监听,根据预设消息 api 处理请求. 你只需要关心生产端是否监听成功.

消费端:启动时链接上生产端,在需要时调用 api 发送请求,(可选)获取回调. 你只需要关心消费端配置是否与生产端一致,在合适的时候调用 api 发送请求,处理回调.

接下来让我们看看整个运行过程中的细节与每一个参数的作用:[详解过程](/detailed)
