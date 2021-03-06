#

# vartion

在一个实例中,往往每一个生产/消费节点的`vartion`有 2 套配置:

字面量 vartion:简称`字面量配置`,位于`emp\empRouter.ts`或`enc\encRouter.ts`的`conf`中,`约定①`在 emp 中只能填写字面量,不能填写变量,这样做将在生成 enc 模板源码时,自动填入对应位置.

`约定①`:因为变量对于 enc 模板中的`字面量配置`来说是没有意义,反而会导致报错.

在仅需简单配置的情况下,用户使用 enc 时无需填写任何节点参数(如果模板代码生成可用),仅需加入到 encList 中,就可以注册使用.

变量动态 vartion:简称 `动态配置`,位于`userErpc.ts->myerpcRun()->erpc.Run()`,`动态配置`中可以填写变量,以便在初始化时以不同的参数运行,在这里填写的 vartion 优先级最高,在 erpc 内部,将会用`动态配置`合并覆盖`字面量配置`

```ts
/**业务端生产,验证参数,设置过的选项,消费端没有验证过则无法通信.*/
type Vartion = {
  /**监听生产端口,可空,为空且生产配置存在时,自动分配随机端口.否则不启用生产端口.*/
  Port?: number;
  /**URL绑定[数组]*/
  URL?: string[];

  /**节点类型,每个业务端的节点类型应当具有唯一性.*/
  NType?: string;
  /**节点版本,不同版本代表对消费请求的处理及返回值预期可能存在差异*/
  NVersion?: string;
  /**生产密钥,其他消费者调用本节点时使用,验证安全性.*/
  PKey?: string;
  /**节点ID,用于寻找指定节点.*/
  NID?: string;
  /**节点组,用于绑定一组节点.*/
  NGroup?: string;

  /**链接方式,其他消费者调用本节点时用ws,还是wss.目前该参数为占位,未实现.*/
  LinkMode?: string;
  /**动态更新ip周期(秒),不填或填0,则不自动更新.*/
  upIpCycle?: number;
};
```

## Port

端口.

可空.

初始化 erpc 时(`erpc.Run()`),有传递[userS](/data-structure?id=userS),将以`单生产模式`或`生产消费模式`运行:

- 情况 1:未提供`port`,从默认值`3000`开始,寻找一个可用端口,进行监听:

- - 生产与消费节点均链接注册中心 且 2 者验证参数匹配 :消费节点将自动获取到包含实际端口的有效 URL 列表,并可以成功链接.

- - 未链接注册中心 : 消费节点后启动,手动或通过其他方式获取到生产节点的 ip:端口,也可以成功链接.

- 情况 2: `字面量配置`提供了`port`,`动态配置`未提供`port`:

- - 生产节点成功监听`字面量配置`的`port`,消费节点在[可达](/net?id=可达)的情况下,可以直接连上生产节点,而无需通过注册中心.

- - 生产节点监听到非`字面量配置`的`port`,生产与消费节点均链接注册中心,且 2 者验证参数匹配时,可成功链接.

- 情况 3:`动态配置`提供了`port`,`字面量配置`的`port`将无效,生产节点成功监听任意`port`时:

- - 生产与消费节点均链接注册中心,且 2 者验证参数匹配时,可成功链接.

- - 没有链接注册中心,但通过其他方式传递了 `动态的`url 列表,也可以成功链接.

未传递`userS`,将不会进行生产监听,可以以`单消费模式`运行.

## URL

网址列表.

可空.

可以提供网址或 IP,以提高链接速度或在无注册中心且 IP 不固定的情况下链接成功.

成员写法:`http://127.0.0.1` or `http://www.baidu.com:6789`

前缀必须是`http`或`https`,目前未测试过`https`的情况.

可以携带端口,或不携带端口.

携带端口时,这一个 URL 成员的端口将不被`port`属性所覆盖

未携带端口时,将使用`port`与该 URL 成员拼接,组成一个完整的 url:port.

## 验证信息

`NType` ,`NVersion`,`PKey`,`NID`,`NGroup`为验证信息.

## NType

节点类型.

设定上是可空的,但没有测试过空值是否可运行.

建议每个不同的生产节点仅在`字面量配置`中填入一个独特的固定不变的`NType`.

它的作用是,作为提交与获取注册中心数据,以及安全验证时的主键.

如果生产与消费节点的`NType 不一致`,将无法正常在注册中心获取到 URL 列表,以及无法链接.

## NVersion

节点版本.

可空.

用于管理不同的生产节点版本,这在多实例,不同版本同时运行的情况下会很有用.

如果生产与消费节点的`NVersion 不一致`,将无法正常在注册中心获取到 URL 列表,以及无法链接.

## PKey

节点密钥.

可空.

用于链接时的安全性设计,可选填入一个很长随机字符串,可以固定;或每次运行时随机生成,然后通过其他方式传递给消费节点.

如果生产与消费节点的`PKey 不一致`,将无法正常在注册中心获取到 URL 列表,以及无法链接.

## NID

节点 ID.

用于生产节点多实例情况下,对生产节点的区分.

可空,但推荐以下 2 种用法:

- 不使用 NID 划分,或不开启多实例时,`字面量配置`与`动态配置`填写同一个内容.

- 使用 NID 划分多实例时,`动态配置`可填写一个变量,以在初始化时获得不同的值,然后通过其他的方式传递给对应的消费节点.

根据填写的状态,会出现以下三种情况:

- 未填写,erpc 内部将生成随机`NID`.

- 仅`字面量配置`有`NID`,erpc 内部将生成随机`NID`以覆盖.

- `动态配置`有`NID`,erpc 将`不会生成随机 NID`

`字面量配置`的`NID`用于传递给消费节点,`动态配置`的`NID`用于抑制 erpc 的覆盖行为.

如果生产与消费节点的`NID 不一致`,将无法正常在注册中心获取到 URL 列表,以及无法链接.

## NGroup

节点组.

可空.

用于将多个生产/消费节点绑定到一个组,进行通信,这将有效隔绝不同`组`.

如果生产与消费节点的`NGroup 不一致`,将无法正常在注册中心获取到 URL 列表,以及无法链接.

## LinkMode

链接方式.

可空.

其他消费者调用本节点时用 ws,还是 wss.目前该参数为占位,未实现.

## upIpCycle

动态更新 IP 周期(秒).

可空.

本属性是为家用且具有公网 IPV6 的情况而设计的.

节点一旦正常运行,往往不会停机,但是家用环境下,运营商会定时更新你的公网 IP 地址.

当你的 IP 地址与最初提交给注册中心的不符后,消费节点将无法链接到你.

所以需要生产端定时更新给注册中心,这样当消费节点断开链接后,可以再次从注册中心获取到你的最新 IP 信息,以继续使用服务.

# userS

```ts
/**业务端生产配置*/
type UserS = {
  /**生产api*/
  empConf?: EmpConf;
  /**节点使用的生产API中间件列表*/
  midEmpUseList?: any[];

  /**验证参数(可动态)*/
  vartion?: Vartion;

  /**IP相关获取及更新 设置 */
  ipConfig?: IPConfig;
};
```

如果你希望节点为其他节点提供服务,那么你需要做这三件事:

- 编写生产 api

- 将生产 api 传递到`empRouter`的`empUserList`,并在此处编写你的生产节点信息.

- 将`empRouter`的`conf`传递给 erpc,以注册你的生产模块.

## empConf

这就是你的生产 api 与`字面量配置`

## midEmpUseList

为生产端插件预留

## vartion

这里是你的生产 api 的`动态配置`,最小化运行你在这里必须要填写与`字面量配置`一致的[NID](/data-structure?id=ntype)

## IPConfig

```ts
type IPConfig = {
  /**是否将127.0.0.1,以及fe80端的IPV6地址添加到地址列表中. 默认false,以加快消费端链接速度. */
  NativeIP?: boolean;
  /**耗时5ms,是否从本地额外获取IP列表,默认true.如果false,则不从本地获取IP列表 */
  getLocalIP?: boolean;
  /**耗时200ms,是否从网络获取IPV4,默认false,不建议开启,家用IP一般在net后面,所以获取到公网IP也无法访问,如果可以公网访问的,本地IP一般也能获取. */
  getNetIPV4?: boolean;
  /**耗时2s,是否从test-ipv6获取ipv4与ipv6,默认false,不建议开启. */
  getNetIPV6?: boolean;
};
```

这是`userS`的一个可选配置对象,它的作用是在 erpc 内部获取生产端本机/公网 IP 时的策略.

一般来说,不需要对其进行设置,默认设置已经是最优配置.

当然如果你需要获取一些额外的地址,那么你可以开启它们,并观察运行后的输出.

# userP

```ts
/**业务端共用配置*/
type UserP = {
  /**注册中心配置,如果存在该参数,则启用注册中心,否则不启用.*/
  regCenter?: RegCenter;
};
```

这里的配置对生产与消费都有效.

## regCenter

如果你希望使用注册中心进行动态链接,那么这里需要填写注册中心的配置信息.

### vartion

注册中心的链接信息.

# userC

```ts
/**业务端消费配置*/
type UserC = {
  encList?: EncList[];
  /**节点使用的消费API中间件列表*/
  midEncUseList?: any[];
};
```

这里是你的消费配置

## encList

实际上`encList`基本上等于`UserS`的数组版,这是因为,对于生产来说,你只需要监听一个端口,就可以提供多个模块的服务,所以生产只需要一组配置.

而消费,可能链接多个生产节点,所以需要为它们分别进行配置.

### encConf

与`empConf`是镜像设计,不过`empConf`与`encConf`并不能互换使用.因为其内部 `empUserList`与`encUseList`所传递的内容并不一致.

### vartion

消费端的对端配置信息,只要保证[验证信息](/data-structure?id=验证信息)与生产端一致即可,其 URL 无法访问也没问题,可以通过`注册中心`获取到对方上传的最新 URL 列表.
