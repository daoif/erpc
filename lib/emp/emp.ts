//内置生产api,不含配置,因为是业务通用的.

import { eUConf, iosSocket } from "..";

type Verify = {
  NType?: string;
  NVersion?: string;
  PKey?: string;
  NID?: string;
  NGroup?: string;
};

interface IEmpInside {
  (_sioSocket: iosSocket): void;
  VerifyPSide(arg: Verify, callback: (e: boolean) => void): any;
}

export const empInside: IEmpInside = (sioSocket: iosSocket) => {
  sioSocket.on("VerifyPSide", empInside.VerifyPSide);
  console.log("进行了内部生产监听");
};

/**验证生产端,消费者发送参数,让生产端验证参数是否一致. */
empInside.VerifyPSide = (arg: Verify, callback: (e: boolean) => void) => {
  let v = eUConf.eUserS?.vartion;
  v!.NVersion = v?.NVersion ?? "";
  v!.PKey = v?.PKey ?? "";
  v!.NGroup = v?.NGroup ?? "";

  arg.NVersion = arg.NVersion ?? "";
  arg!.PKey = arg?.PKey ?? "";
  arg!.NGroup = arg?.NGroup ?? "";

  console.log("arg:", arg);
  console.log("v:", v);
  //有三种可能性
  //1.全匹配,返回true
  //2.部分参数不一致,返回false
  //3.部分参数,一方定义了,但是空值,另一方未定义,返回false(因为if判定是false.)

  if (
    arg.NType == v?.NType &&
    arg.NVersion == v?.NVersion &&
    arg.PKey == v?.PKey &&
    arg.NID == v?.NID &&
    arg.NGroup == v?.NGroup
  ) {
    callback(true);
  } else {
    callback(false);
  }
};
