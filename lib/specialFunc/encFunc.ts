import { Vartion } from "..";
import { Verify } from "../enc/enc";
//enc调用前需要用的一些函数
//将节点配置简化为验证的5个参数,再传回去.
export function vartion2Verify(_vartion: Vartion) {
  let _verify: Verify = {
    NType: _vartion.NType,
    NVersion: _vartion.NVersion,
    PKey: _vartion.PKey,
    NID: _vartion.NID,
    NGroup: _vartion.NGroup,
  };
  return _verify;
}
