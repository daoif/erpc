//模拟真实用户的入口
import * as erpcRun from "./userErpc";

import { enctest } from "./enc/enctest";
async function test3() {
  await erpcRun.myerpcRun();
  // setTimeout(function () {
  //   enctest.sendtotest1();
  // }, 5000);
}
async function test4() {
  await erpcRun.myerpcRun2();
  // setTimeout(function () {
  //   enctest.sendtotest1();
  // }, 5000);
}

function emittest1() {
  enctest.sendtotest1("12345");
}

export { test3, test4, emittest1 };
