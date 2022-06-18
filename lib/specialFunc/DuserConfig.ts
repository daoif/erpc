//本程序集的功能是,在启动时,将业务端传入的参数,转换到内部变量.
//可用端口寻找
import * as protfinder from "portfinder";

import { Vartion } from "..";
import { EUserC, EUserP, EUserS } from "./../type/insideType";
import { UserC, UserP, UserS } from "../type/userType";
import { dynamicGetAllIP } from "./empRuntimeFunc";
import { v4 as uuidv4 } from "uuid";

//获取可用端口
//使用业务或生产api提供的端口(如果未提供,使用3000),验证是否可用,
export async function Dport(_eusers: EUserS | undefined) {
  let _port = _eusers?.vartion?.Port;
  let port = 0;
  port = await protfinder.getPortPromise({
    port: _port ?? 3000,
  });
  await dynamicGetAllIP(port, _eusers!);
  return port;
}
//将用户填入的生产配置转入到内部变量.
//最后获取ip,url端口绑定.并输出到vartion的URL中.
export async function DuserS(userS: UserS | undefined) {
  //返回值
  let euserS: EUserS = {
    //节点生产api列表
    empUseList: userS?.empConf?.empUseList!,
    //节点生产api中间件列表
    midEmpUseList: userS?.midEmpUseList,
    //IP获取及更新 相关配置
    ipConfig: userS?.ipConfig,
  };
  //vartion处理部分的代码
  //字面量 验证参数(从生产api传入)
  let lvar: Vartion = userS?.empConf?.vartion!;
  //清理掉字面量的id
  lvar.NID = "";
  //动态 验证参数(从业务端初始化传入)
  let dvar: Vartion = userS?.vartion!;
  euserS.vartion = threeVartion(lvar, dvar);
  if (euserS.vartion.NID == "") {
    //如果动态 验证参数未提供id,则随机生成一个id,用于注册中心使用的.
    euserS.vartion.NID = uuidv4();
  }
  return euserS;
}
//将用户填入的公共配置转入到内部变量.
export function DuserP(userP: UserP | undefined) {
  //返回值
  let euserP: EUserP = {
    regCenter: userP?.regCenter,
  };
  return euserP;
}

//将用户填入的消费配置转入到内部变量.
export function DuserC(userC: UserC | undefined) {
  //返回值
  let euserC: EUserC = {
    midEncUseList: userC?.midEncUseList,
  };
  //userC.enc数组循环
  userC?.encList?.forEach((v) => {
    //v是enc数组的成员
    let veulist = v.encConf?.encUseList;

    let lvar: Vartion = v.encConf?.vartion!;
    let dvar: Vartion = v.vartion!;
    let vvartion: Vartion = threeVartion(lvar, dvar);
    //输出到euserC.enc数组的成员,一个临时类型
    let venc = {
      encUseList: veulist,
      vartion: vvartion,
    };
    if (euserC.encList == undefined) {
      euserC.encList = [venc];
    } else {
      euserC.encList?.push(venc);
    }
  });
  return euserC;
}

//字面量a,变量b,框架内部c 三个验证参数 输入a,b,输出c(ab合集,b覆盖a有的属性)
function threeVartion(lvar: Vartion, dvar: Vartion) {
  //vartion处理部分的代码
  //字面量:lvar 验证参数(从生产api传入)
  //动态:dvar 验证参数(从业务端初始化传入)
  //最后传出的:rvar 验证参数
  //typevar 类型限定
  let typevar: Vartion[keyof Vartion];
  let rvar: Vartion = lvar;
  let key: keyof Vartion;
  //首先将字面量传入rvar,然后 动态 参数如果有的话,覆盖.没有的话,就使用字面量的部分
  for (key in dvar) {
    if (dvar[key]) {
      (<typeof typevar>rvar[key]) = dvar[key];
    }
  }
  return rvar;
}
