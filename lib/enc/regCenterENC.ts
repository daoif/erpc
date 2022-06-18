import { iocSocket, Vartion } from "..";
interface IEncRc {
  (_cioSocket: iocSocket): void;
  rc_regPNodeInfo(_vartion: Vartion): any;
  rc_getPNodeInfo(_vartion: Vartion): Promise<number | Vartion>;
}
let cioSocket: iocSocket;
//标准初始化,后续直接调cioSocket.
export const encRc: IEncRc = (_cioSocket: iocSocket) => {
  console.log("触发IEncRc");
  cioSocket = _cioSocket;
};
/**生产端口提交注册信息,注册中心消费api 内置于框架 */
encRc.rc_regPNodeInfo = async (_vartion: Vartion) => {
  if (cioSocket?.connected == undefined) {
    console.log("生产端不在线, rc_regPNodeInfo 发送失败 ,vartion:", _vartion);
    return -1;
  }
  console.log("rc_regPNodeInfo 开始发送");
  let arg: Vartion = _vartion;
  let res2: number = await new Promise((res) => {
    cioSocket
      .timeout(1000)
      .emit("rc_regPNodeInfo", arg, (err: any, response: number) => {
        if (err) {
          res(-1);
        } else {
          res(response);
        }
      });
  });
  return res2;
};

/**消费端口获取生产节点信息,注册中心消费api 内置于框架 */
encRc.rc_getPNodeInfo = async (_vartion: Vartion) => {
  if (cioSocket?.connected == undefined) {
    console.log("生产端不在线, rc_getPNodeInfo 发送失败");
    return -1;
  }

  let arg: Vartion = _vartion;
  let res2: Vartion | number = await new Promise((res) => {
    cioSocket
      .timeout(1000)
      .emit("rc_getPNodeInfo", arg, (err: any, response: Vartion | number) => {
        if (err) {
          res(-1);
        } else {
          res(response);
        }
      });
  });
  return res2;
};
