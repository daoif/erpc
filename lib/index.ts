//erpc-core
import { Server as ios, Socket as iosSocket } from "socket.io";
import { io as ioc, Socket as iocSocket } from "socket.io-client";
import { UserConf } from "./type/userType";
import { EUserConf } from "./type/insideType";
import { enc, EncConf } from "./type/encType";
import { emp, EmpConf } from "./type/empType";

export * from "./type/userType";

import { Dport, DuserC, DuserP, DuserS } from "./specialFunc/DuserConfig";
import { urlport } from "./specialFunc/IPget";
import { empInside } from "./emp/emp";
import { assCioSocket } from "./specialFunc/encRuntimeFunc";
import { encRc } from "./enc/regCenterENC";
import { regpnodeinfo, upip } from "./specialFunc/empRuntimeFunc";

import { emittest1, test3, test4 } from "./test/user";

//对socket.io的 class type等原样导出.这样用户与api就不需要导入socket.io了.

//服务端
//ios 是 创建服务端,通过new使用 所以返回的也是ios,变量名是sio.
//iosSocket 是服务端里链接进来的一个客户端对象. 变量名是 sioSocket.

//客户端
//ioc 是创建客户端,是一个函数,没有变量名.返回的是iocsocket.
//iocSocket 是客户端对象,变量名是cioSocket.

export {
  ios,
  iosSocket,
  ioc,
  iocSocket,
  emp,
  enc,
  EncConf,
  EmpConf,
  test3,
  test4,
  emittest1,
};
//运行erpc的配置 类型

//用户端方法
//业务端传入的变量.
export let runConfig: UserConf;
/**框架内部 业务配置 实际使用的变量.*/
export let eUConf: EUserConf;
//运行,需要传入一些必要的参数
export async function Run(_runConfig: UserConf) {
  console.log("erpc启动成功!");
  //这里是初始化eUConf,不然后续赋值会报错.
  //(初始化给个空的就行.但又不能在申明处初始化,避免执行顺序问题.)
  eUConf = {};
  runConfig = {};
  runConfig = _runConfig;

  await DepositUserConfig();
  //下面是运行,上面是配置的初始化.
  if (typeof eUConf.eUserS != "undefined") {
    console.log("生产端开始初始化");
    //生产接口运行
    wsServerRun();
  }

  if (typeof eUConf.eUserP != "undefined") {
    //公共事务运行
    await publicRun();
  }

  if (typeof eUConf.eUserC != "undefined") {
    console.log("消费端开始初始化");
    //消费接口运行
    wsclientRun();
  }
}
//将业务端传入的参数组织,转入到内部变量.
async function DepositUserConfig() {
  if (runConfig.userS) {
    eUConf.sPort = 0;
    //业务 生产配置 转换为 框架内部 生产配置
    eUConf.eUserS = await DuserS(runConfig.userS);
    //返回最近可用端口,作为实际的生产端口.
    eUConf.sPort = await Dport(eUConf.eUserS);
  }

  //业务 公共配置 转换为 框架内部 公共配置
  eUConf.eUserP = DuserP(runConfig.userP);
  //业务 消费配置 转换为 框架内部 消费配置
  eUConf.eUserC = DuserC(runConfig.userC);
}

//结束erpc服务
export function Quit() {}

//ws相关
//ios=socket.io 的服务端类型  sio=socket.io的服务端变量.

//ws服务端对象
let sio: ios;
//运行ws服务端
export function wsServerRun() {
  //初始化生产端口设置,隐式调用了listen,后面不用再listen,直接能运行.
  console.log("eUConf.sPort:", eUConf.sPort);

  sio = new ios(eUConf.sPort, {
    cors: {
      // origin: ["http://127.0.0.1:5501"], //跨域,*表示通配.
      origin: (origin, callback) => {
        return callback(null, origin);
      },
    },
  });
  console.log("ios完成");
  //在这里,使用注册中心api,提交注册信息.
  const bindemp = (sioSocket: iosSocket) => {
    console.log("开始执行监听");
    //监听框架内生产api.
    empInside(sioSocket);
    //监听业务生产api.
    if (eUConf.eUserS?.empUseList) {
      eUConf.eUserS.empUseList.forEach((empitem) => {
        empitem(sioSocket);
      });
    }
  };
  //监听生产请求
  console.log("sio开始");
  sio.on("connection", bindemp);
  console.log("sio结束");
}
//公共事务运行
async function publicRun() {
  //注册中心事务
  //验证是否有注册中心,然后链接上注册中心.
  let regVar = eUConf.eUserP?.regCenter?.vartion;
  if (regVar?.URL) {
    if (regVar?.URL?.length > 0) {
      console.log("注册中心开始链接");
      //此处链接注册中心.使用encRuntimeFunc里的getcio
      //返回一个url,手动注册cio对象,对注册中心消费api进行init
      let _url = await assCioSocket(regVar, false, encRc);
      if (_url == 1) {
        //然后调用注册中心api,提交生产端口信息.

        //有生产端配置才上传,否则就只链接上注册中心,等待消费节点使用.
        if (eUConf.eUserS != undefined) {
          console.log(
            "emp:eUConf.eUserS?.vartion?.URL:",
            eUConf.eUserS?.vartion?.URL
          );
          // 3种情况,1查询到有,则不插入,但返回1.
          //  2查询到没有,插入,成功,返回2.
          //  3.其他报错,返回-1
          let res = await regpnodeinfo();
          console.log("res:", res);
          if (res > 0) {
            let upipCycle = eUConf.eUserS?.vartion?.upIpCycle ?? 0;
            if (upipCycle > 0) {
              //设定定时循环,如果递归调用setInterval的话,会不断创建重复的任务,所以只需要调用一次.
              setInterval(upip, upipCycle * 1000);
            }
          }
        }
      } else {
        console.log("生产端:注册中心链接失败,未成功提交注册信息!");
      }
    }
  }
}
//消费端口
function wsclientRun() {
  //绑定消费API:通过地址创建一个ciosokcet,并提供给消费API.

  eUConf.eUserC?.encList?.forEach(async (c) => {
    //尝试拼接,url与port
    if (c.vartion) {
      c.vartion.URL = urlport(c.vartion?.URL, c.vartion?.Port ?? 0);
      /**是否使用注册中心 */
      let isreg = false;
      if (eUConf.eUserP?.regCenter) {
        isreg = true;
      }

      c.encUseList?.forEach(async (encitem) => {
        await assCioSocket(c.vartion!, isreg, encitem);
      });
    }
  });
}
