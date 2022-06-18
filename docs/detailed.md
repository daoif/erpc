#

# 入口

在此之前,可以了解模板文件中各个部分的作用:[文件结构及作用](/template?id=文件结构及作用)

按住 ctrl+鼠标左键,点击`index.ts`的`erpcRun.myerpcRun();`中的`myerpcRun`

此时你应当已经跳转到了`userErpc.ts`文件,其内容如下:[userErpc.ts](/template?id=libusererpcts)

行:**9** 的`erpc.Run`就是调用 erpc 启动的地方.

# 参数

在`erpc.Run()`中传递了这样一个复杂的数据结构:

```ts

{userS:{
  empConf:{empUserList[],vartion:{}},
  midEmpUseList?: any[],
  vartion:{},
  ipConfig?: IPConfig;
},

userP:{
  regCenter:{
    vartion:{}
  }
},

userC:{
  encList:[
    encConf:{encUserList[],vartion:{}},
    vartion:{}
  ],
  midEncUseList?: any[];
}}

```

不用担心,只要你对它们有一点了解以后,它们就会变得非常简单.

## vartion

先说出现过多次的一个属性,

`vartion`:它是整个框架的基石数据结构,实际上不管是生产端,消费端,注册中心,都可以说在最底层是同一类东西,那就是`节点`.

而`vartion`就是所有节点都具有的最基本的信息,被用于识别它们,并与它们建立链接.

关于`vartion`内部的属性说明可以看:[vartion](/data-structure?id=vartion)

## UserConf

传递给`erpc.run()`的这个对象,实际上叫做`UserConf`,它将被 erpc 在内部转换为`EUserConf`.

数据结构最外层的三个属性:`userS`,`userP`,`userC`

它们分别是:生产配置,注册中心配置,消费配置.

需要注意的是,`UserConf`仅在执行`erpc.Run()`的这一次传递中有效,当传递进去后,再对其做出任何改动,都是没有意义的.

所以 erpc 并不支持`热重载`配置.

你会发现,上面的结构体中的部分内容,并没有在代码中出现,这是因为:

`mid`前缀是为插件设计预留的,目前还未实现.

`ipConfig`是可选的,且默认配置足够使用了,了解更多:[ipConfig](/data-structure?id=ipconfig)

关于`userS`,`userP`,`userC`的详细内容见:

[userS](/data-structure?id=userc) [userP](/data-structure?id=userc) [userC](/data-structure?id=userc)
