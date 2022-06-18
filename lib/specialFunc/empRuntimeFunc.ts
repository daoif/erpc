//本程序集是在运行过程中,会调用的函数

import { eUConf, runConfig, wsServerRun } from "..";
import { encRc } from "../enc/regCenterENC";
import { EUserS } from "../type/insideType";
import { Dport } from "./DuserConfig";
import { getAllIP } from "./IPget";

//该函数应当只有2个地方会调用,
//1是DuserS(初始化生产配置),
//2是如果upipCycle开启时,将定期执行.
/**获取ip,并将可用端口加在ip与URL后面.
 *会使用euserS里的参数,并将结果赋值给euserS.vartion
 *无返回值*/
export async function dynamicGetAllIP(port: number, euserS: EUserS) {
  //这里用runConfig,是为了重连时避免重复添加自动获取的IP.
  let domain = runConfig.userS?.vartion?.URL ?? [];
  let NativeIP = euserS.ipConfig?.NativeIP ?? false;
  let local = euserS.ipConfig?.getLocalIP ?? true;
  let netipv4 = euserS.ipConfig?.getNetIPV4;
  let nettestipv6 = euserS.ipConfig?.getNetIPV6;

  euserS.vartion!.URL = await getAllIP(
    port,
    domain!,
    NativeIP,
    local,
    netipv4,
    nettestipv6
  );
}

/**生产端动态更新ip信息并上传到注册中心.
 * 使用的都是全局参数,需要多加小心.
 */
export async function upip() {
  //这里只做了上传,没有做更新.
  dynamicGetAllIP(eUConf.sPort!, eUConf.eUserS!);
  regpnodeinfo();
}

/**上传到注册中心.*/
export async function regpnodeinfo() {
  if (eUConf.eUserS?.vartion?.URL != undefined) {
    let res = await encRc.rc_regPNodeInfo(eUConf.eUserS?.vartion);
    return res;
  } else {
    return -1;
  }
}
