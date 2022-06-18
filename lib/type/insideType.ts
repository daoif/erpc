//该类型集为框架内部实际使用的类型
import { iocSocket, ios, iosSocket, IPConfig, RegCenter, Vartion } from "..";
import { emp } from "./empType";
/**框架内部类型,业务端启动erpc,调用框架时的配置*/
export type EUserConf = {
  /**生产端口的快捷调用方式 */
  sPort?: number;
  /**生产(服务:service)配置*/
  eUserS?: EUserS;
  /**公共(public)配置*/
  eUserP?: EUserP;
  /**消费(客户:client)配置*/
  eUserC?: EUserC;
};
/**框架内部类型,业务端生产配置,与UserS的区别在于,用empUseList替换EmpConf(里面有重复的vartion)*/
export type EUserS = {
  /**节点使用的模块生产API列表*/
  empUseList: emp[];
  /**节点使用的生产API中间件列表*/
  midEmpUseList?: any[];
  /**验证参数*/
  vartion?: Vartion;
  /**IP相关获取及更新 设置 */
  ipConfig?: IPConfig;
};

/**框架内部类型,业务端共用配置*/
export type EUserP = {
  /**注册中心配置,如果存在该参数,则启用注册中心,否则不启用.*/
  regCenter?: RegCenter;
};

/**框架内部类型,业务端消费配置*/
export type EUserC = {
  encList?: [
    {
      /**节点使用的节点消费API列表,要改的*/
      encUseList?: ((_cioSocket: iocSocket) => void)[];
      /**验证参数*/
      vartion?: Vartion;
    }
  ];
  /**节点使用的消费API中间件列表*/
  midEncUseList?: any[];
};
