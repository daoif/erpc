//这里是生产api的集合,将返回生产api对象,以及参数.
//这里的参数都应当是字面量的,如需动态指定,则可以在userErpc里写对应的参数
//框架内部会使用userErpc里有的参数覆盖此处的参数.
import { EmpConf } from "../../../index";
import emptest from "./emptest";
//自动生成消费api的方法是,从empRouter文件中获取EmpConf里面的2个对象
//empUseList 获取到已引用的生成api
//vartion 获取到默认参数.
const empRouter = () => {
  let conf: EmpConf = {
    empUseList: [emptest],
    vartion: {
      NType: "test1",
      Port: 3000,
    },
  };
  return conf;
};

export { empRouter };
