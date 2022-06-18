import { iocSocket } from "../../../index";

interface IEnctest {
  (_cioSocket: iocSocket): void;
  sendtotest1(arg: any): any;
}
//这个cio不要放到属性里,否则初始化麻烦.
let cioSocket: iocSocket;
//初始化,目前只需要提供cio,后续也可以提供更多通用的参数,
//但此处不应该提供消费API发送所需的参数
//因为消费api只是封装起来,最终还是要在业务中根据实际情况填入参数进行调用.
export const enctest: IEnctest = (_cioSocket: iocSocket) => {
  cioSocket = _cioSocket;
};

//消费api,传入参数,等待回调.一般来说是async,里面封装成await promise.
enctest.sendtotest1 = async (arg: any) => {
  if (cioSocket?.connected == undefined) {
    console.log("生产端不在线, sendtotest1 发送失败");
    return -1;
  }
  //此处2个any,都应该更换为具体的类型
  let res2: any = await new Promise((res) => {
    cioSocket.timeout(1000).emit("test1", arg, (err: any, response: any) => {
      if (err) {
        console.log("请求test1,回调超时报错:");
        console.log(err);
      } else {
        console.log("请求test1,回调数据:");
        console.log(response);
      }
    });
  });
};
