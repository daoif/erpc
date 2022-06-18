import { Vartion } from "..";
//内置公共消费api,不含配置,因为是业务通用的.
import { iocSocket } from "..";

export type Verify = {
  NType?: string;
  NVersion?: string;
  PKey?: string;
  NID?: string;
  NGroup?: string;
};

interface IencInside {
  VerifyPSide(cioSocket: iocSocket, _verify: Verify): Promise<boolean>;
}

export const encInside: IencInside = () => {};
/**验证生产端,框架内消费api,消费者发送参数,让生产端验证参数是否一致.
 * 返回值:true=验证通过,可以使用该生产端.
 * false=某个值不匹配,请消费端自行断开链接,稍后服务端也会断开链接.
 */
encInside.VerifyPSide = async (cioSocket: iocSocket, _verify: Verify) => {
  if (cioSocket?.connected == undefined) {
    console.log("生产端不在线, VerifyPSide 发送失败");
    return false;
  }
  let arg = _verify;
  // socketio 异步等待一个结果,并返回的范例.使用promise.
  //返回值变量需要显式声明类型,否则res返回的是unknown
  let res2: boolean = await new Promise((res) => {
    cioSocket
      .timeout(1000)
      .emit("VerifyPSide", arg, (err: any, response: boolean) => {
        if (err) {
          console.log("请求VerifyPSide,回调超时报错:", err);
          res(false);
        } else {
          console.log("请求VerifyPSide,回调数据:", response);
          res(response);
        }
      });
  });

  return res2;
};
