// 这里是根据一个节点的生产api集合,自动生成的消费api模板,包括其引入的生成api相应的消费api,以及参数.

import { EncConf } from "../../../type/encType";
import { enctest } from "./enctest";

const InitEnctest = () => {
  let conf: EncConf = {
    encUseList: [enctest],
    vartion: {
      NType: "test1",
      NID: "999999",
      Port: 3000,
      // URL: ["http://127.0.0.1"],
    },
  };
  return conf;
};

export { InitEnctest };

//也就是说,有2个需要调用的,一个是init,一个是其方法
