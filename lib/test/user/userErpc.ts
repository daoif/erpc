import * as erpc from "../../index";

//注册 生产API
import { empRouter } from "./emp/empRouter";
//注册消费api
import { InitEnctest } from "./enc/encRouter";
//运行erpc
export async function myerpcRun() {
  // midempUse();
  // midencUse();
  await erpc.Run({
    userS: {
      empConf: empRouter(),
      vartion: { NID: "999999", upIpCycle: 20 },
    },
    userP: {
      regCenter: {
        vartion: {
          NType: "RegCenter",
          Port: 8889,
          NID: "8889",
          URL: ["http://127.0.0.1:8889", "http://39.101.164.148:8889"],
          PKey: "1234567890114",
        },
      },
    },
  });
}

export async function myerpcRun2() {
  // midempUse();
  // midencUse();
  await erpc.Run({
    // userS: {
    //   empConf: empRouter(),
    //   vartion: { NID: "999999", upIpCycle: 20 },
    // },
    userP: {
      regCenter: {
        vartion: {
          NType: "RegCenter",
          Port: 8889,
          NID: "8889",
          URL: ["http://127.0.0.1:8889", "http://39.101.164.148:8889"],
          PKey: "1234567890114",
        },
      },
    },
    userC: { encList: [{ encConf: InitEnctest(), vartion: {} }] },
  });
}

//注册 多个 节点消费API

//注册 多个 生产端 中间件
function midempUse() {}

//注册 多个 消费端 中间件
function midencUse() {}
