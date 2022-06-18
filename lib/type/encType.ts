import { iocSocket } from "..";
import { Vartion } from "./userType";

type enc = (_cioSocket: iocSocket) => void;

/**消费api及字面量默认参数 */
type EncConf = {
  /**节点使用的某个节点的消费API列表*/
  encUseList: enc[];
  /**验证参数(字面量,默认)*/
  vartion?: Vartion;
};

export { enc, EncConf };
