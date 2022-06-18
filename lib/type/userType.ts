import { EmpConf } from "./empType";
import { iocSocket, ios, iosSocket } from "..";
import { EncConf } from "./encType";

/**业务端启动erpc,调用框架时的配置*/
type UserConf = {
  /**生产(服务:service)配置*/
  userS?: UserS;
  /**公共(public)配置*/
  userP?: UserP;
  /**消费(客户:client)配置*/
  userC?: UserC;
};

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
/**业务端共用配置*/
type UserP = {
  /**注册中心配置,如果存在该参数,则启用注册中心,否则不启用.*/
  regCenter?: RegCenter;
};
/**业务 共用 注册中心配置*/
type RegCenter = {
  /**验证参数*/
  vartion: Vartion;
};

/**业务端消费配置*/
type UserC = {
  encList?: EncList[];
  /**节点使用的消费API中间件列表*/
  midEncUseList?: any[];
};

type EncList = {
  /**消费api */
  encConf?: EncConf;
  /**验证参数*/
  vartion?: Vartion;
};

export { UserConf, UserS, Vartion, IPConfig, UserP, RegCenter, UserC, EncList };
