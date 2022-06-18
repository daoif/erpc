import { iosSocket, Vartion } from "..";

type emp = (_sioSocket: iosSocket) => void;
/**生产api及字面量默认参数*/
type EmpConf = {
  /**节点使用的生产API列表*/
  empUseList: emp[];
  /**验证参数(字面量,默认)*/
  vartion?: Vartion;
};

export { emp, EmpConf };
