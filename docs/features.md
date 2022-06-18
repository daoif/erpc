#

# 动态建立生产端口监听

得益于 erpc 内部使用的`portfinder`包

在进行生产端口监听时,完整过程是这样的:

尝试使用用户提供的生产端口,进行监听,如果成功,则结束监听该端口,并将该端口返回,由 erpc 再次进行监听.

如果失败了,将尝试监听`用户生产端口++`的一个端口,如此循环,直到找到一个可用端口,返回给 erpc 进行监听.

如果用户未提供端口,也将使用一个默认值进行以上操作.

这样的特性让你无需担心端口冲突导致生产端运行失败,同时也可以无需额外配置端口的运行多个生产端.

# 动态拼接 URL 列表

将预设的 URL 列表+获取到的本机 IP,及动态监听到的端口,拼接在一起,得到一个 URL 数组`列表`,

该`列表`将上传到注册中心,消费节点向注册中心请求获取到该`列表`,

然后消费节点将尝试使用这个`列表`包含的地址信息链接到本生产节点.

URL 列表:未完成指向 注释,这里指向 vartion 的 URL 说明.

获取到的本机 IP:未完成指向 这里指向 ipConfig 的说明.

# 自动重连

erpc 消费端有 2 种自动重连机制:

1.当你的对端配置中,`upIpCycle`=0 时,作为消费端,你断开链接后,将使用 socket.io-client 的自动重连机制.

它将以指数级回退的方式,一直重复尝试链接,你上一次链接到生产端的地址.

2.当你的对端配置中,`upIpCycle`!=0 时,你将会以`upIpCycle`为周期,向注册中心请求该生产端的新 URL 列表,并遍历尝试链接新 URL 列表的每一个成员,直到成功链接,或者失败后等待下一个周期.

# 打包到浏览器

对于 nodejs 或独立运行,你可以找到很多种方式打包你的项目.

而对于在浏览器运行你的项目,我推荐你使用`browserify`

在`package.json`的`scripts`字段里,我已经预设了`bro`与`build2`脚本.

你只需要先在终端使用 `npm i browserify -g`安装它,然后在你的项目根目录手动新建一个`assets`文件夹

如果你需要运行以下示例,请将`lib/index.ts`的内容改为:

```ts
<!--index.ts-->
//用户入口
import { enctest } from "./enc/enctest";
import * as erpcRun from "./userErpc";

function main() {
  erpcRun.myerpcRun();
}
async function sendtest1() {
  return await enctest.sendtotest1("1");
}
export = { main, sendtest1 };

// main();
```

最后调用`npm run build2`

你的`assets`文件夹中将新增一个`index.js`文件

以下是使用它的简单示例:

```html
<!--index.html-->
<script src="./assets/index.js"></script>

<script>
  let example = require("example");

  example.main();

  async function test1() {
    let res = await example.sendtest1();
    document.getElementById("res").innerHTML = "执行结果:" + res;
  }
</script>

<button onclick="test1()">测试erpc在浏览器中运行</button>
<label id="res"> </label>
```

在浏览器中成功运行它以后,点击按钮,你将得到结果.

可以打开浏览器的 F12,查看输出内容.

# 手机端浏览器使用

目前测试的结果:

- chrome 浏览器: 可以使用 eprc 库.
- via 浏览器:无法使用 erpc 库.
