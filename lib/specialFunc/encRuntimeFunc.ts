//这个程序集用于运行时消费端的函数

import { iocSocket, ioc } from "..";
import { sleep } from "../currencyFunc/currencyFunc1";
import { encInside } from "../enc/enc";
import { encRc } from "../enc/regCenterENC";
import { enc } from "../type/encType";
import { Vartion } from "../type/userType";
import { vartion2Verify } from "./encFunc";

/**提供2个参数,1是消费配置,2是是否从注册中心获取URL
 * 如果允许使用注册中心,则本函数可能会使用注册中心获取的配置,覆盖掉传入的消费配置.
 * (在本地配置链接失败,且注册中心成功返回的情况下会覆盖.其他情况不会覆盖.)
 * 未完成的部分:rc_getPNodeInfo   错误代码的定义与返回.
 * 返回一个url,该url是可链接到节点的url,在外部再进行ioc到cio的存储.
 */
export async function getcio(_vartion: Vartion, isReg: boolean) {
  let callURL: string[];
  let _url: string | undefined = undefined;

  //通过配置url链接尝试
  if (_vartion.URL) {
    callURL = _vartion.URL;
    _url = await getcio2(_vartion, callURL);
    console.log("enc:_url:", _url);
  }
  //如果配置url返回一个可用的url,则此处应当返回,而不再继续尝试链接.
  if (_url != undefined) {
    return _url;
  }

  //配置url无可用,尝试从注册中心获取url
  //如果允许从注册中心获取url,则尝试获取url,并进行链接尝试.
  if (isReg) {
    return await regGetcio(_vartion);
  } else {
    //如果不允许,则返回错误代码:-1.(无可用url)
    return -1; //配置URL链接失败,且不允许使用注册中心.
  }
}
/**调用注册中心,请求生产端口配置,然后尝试链接生产端口  */
export async function regGetcio(_vartion: Vartion) {
  let callURL: string[];
  let _url: string | undefined;
  let nvartion = await encRc.rc_getPNodeInfo(_vartion);

  //如果不是数字,则表示返回的是Vartion,则返回成功,
  //用返回值 覆盖 该消费端口的配置,并从中获取URL列表.
  if (typeof nvartion !== "number") {
    (function () {
      let key: keyof Vartion;
      let ty: Vartion[keyof Vartion];
      for (key in nvartion) {
        (<typeof ty>_vartion[key]) = nvartion[key];
      }
    })();
    console.log("enc:新的生产端URL列表:", _vartion.URL);
    if (_vartion.URL) {
      callURL = _vartion.URL;
      _url = await getcio2(_vartion, callURL);
      if (_url != undefined) {
        return _url;
      } else {
        //成功从注册中心获取了URL,但依然没有链接成功.
        //返回一个错误代码.
      }
    } else {
      //没有URL,正常来说是不可能到这个分支的.
      //如果出现这个分支,有可能是代码写错了,导致新的 vartion没有赋值成功.
      //这里返回一个错误代码.(注册中心成功返回但无URL.)
    }
  } else {
    //否则返回的是数字,说明从注册中心获取失败,则返回错误代码:-2(注册中心响应异常)
    //应该会有2种错误,1是注册中心响应超时,可能是未成功链接注册中心,也可能是注册中心故障.
    //2是查询的内容没有匹配的节点.
  }
}
//然后是获取消费 验证参数,消费参数URL,注册中心配置,注册中心URL.
async function getcio2(_vartion: Vartion, callURL: string[]) {
  let n: number = -1;
  let _cioSocket: iocSocket;
  let rb: number = -1;

  // console.log("enc:开始链接消费参数URL列表:");
  rb = await recurCIO(n, callURL, _cioSocket!, _vartion);
  if (rb != -1) {
    return callURL[rb];
  }
}
//递归链接ioc
async function recurCIO(
  n: number,
  callURL: string[],
  _cioSocket: iocSocket,
  _vartion: Vartion
) {
  //递归拿到rb,并返回给最终调用方.
  let rb = -1;
  n++;
  //如果大于下标,则返回假
  if (callURL.length <= n) {
    // console.log("enc:递归完成,未成功链接,返回到 getCIO2.");
    return rb;
  }
  console.log("enc:尝试链接:callURL[" + n + "]:", callURL[n]);
  //这一句ioc,似乎传递出去以后,无效了,所以需要传递URL,而不是cio对象.
  //但connect_error,又似乎有重复的.似乎是添加到其末尾了,也就是说/
  //如果cio对象没有链接成功,则其监听,会被清空,但如果链接成功了,则可以保持.
  //所以此处其实是无需传递URL,直接传对象,也是可以用的.
  //之前有是测试connect_error时,链接失败.
  //那么问题是,两次一样的链接,是否存在其他问题.
  //目前已知,cio:ioc创建的链接,不关闭的话,即使被替换对象,依然是存活的.
  //并一直尝试重连.所以这里需要close.
  //推测,2个一样的链接,有可能在底层是同一个,也有可能前一个被后一个覆盖.
  //但前一个的on却保留了下来.
  _cioSocket = ioc(callURL[n]);
  rb = await new Promise((res) => {
    _cioSocket.on("connect_error", (e) => {
      console.log("enc:链接URL失败:", callURL[n], "将尝试链接下一URL成员");
      _cioSocket.close();
      res(recurCIO(n, callURL, _cioSocket, _vartion));
    });
    _cioSocket.on("connect", async () => {
      console.log("enc:链接URL成功:", callURL[n], " 开始验证节点");

      let bool = await encInside.VerifyPSide(
        _cioSocket,
        vartion2Verify(_vartion)
      );
      if (bool) {
        //如果为真,则无需递归,应当返回真
        // console.log("enc:参数验证成功.返回cio");
        _cioSocket.close();
        res(n);
      } else {
        // console.log("enc:参数验证失败,继续递归.");
        _cioSocket.close();
        res(recurCIO(n, callURL, _cioSocket, _vartion));
      }
    });
  });

  return rb;
}

/**赋值ciosocket
 * 如果成功链接,则直接调enc的函数,将cio赋值给它.
 *返回1,表示正常;否则返回错误码.*/
export async function assCioSocket(
  _vartion: Vartion,
  _isreg: boolean,
  _enc: enc
) {
  let _url = await getcio(_vartion, _isreg);
  console.log("enc:assCioSocket _url:", _url);
  if (typeof _url !== "number" && typeof _url !== "undefined") {
    console.log("enc:正式链接ioc");
    let _cioSocket = ioc(_url);
    console.log("enc:_cioSocket.connected:", _cioSocket.connected);
    _enc(_cioSocket);
    on_connect_error(_cioSocket, _url, _vartion, _enc);
    return 1;
  } else {
    return _url;
  }
}
/**
 * 链接后的监听断开链接,并自动重连.
 * @param _cioSocket
 * @param _url
 * @param _vartion
 * @param _enc
 */
export function on_connect_error(
  _cioSocket: iocSocket,
  _url: string | undefined,
  _vartion: Vartion,
  _enc: enc
) {
  _cioSocket.on("connect_error", async () => {
    console.log("enc:覆盖:链接生产端URL失败:", _url);
    //第一种情况,没有开启自动更新ip,则什么也不做,socket.io内部会自动尝试重连.
    //第二种情况,有开启自动更新IP,则需要请求注册中心,并进行递归
    let _upIpCycle = _vartion.upIpCycle ?? 0;
    if (_upIpCycle == 0) {
    } else {
      //关闭原链接,避免一直重连.
      _cioSocket.close();
      console.log("enc:将以" + _upIpCycle + "秒为周期尝试重连.");
      setTimeout(
        Rec,
        _upIpCycle * 1000,
        _cioSocket,
        _url,
        _vartion,
        _enc,
        _upIpCycle
      );
    }
  });
}
//重连的内核部分
export async function Rec(
  _cioSocket: iocSocket,
  _url: string | undefined,
  _vartion: Vartion,
  _enc: enc,
  _upIpCycle: number
) {
  _url = await regGetcio(_vartion);
  console.log("enc:重连后:", _url);
  if (typeof _url !== "number" && typeof _url !== "undefined") {
    //新链接的创建,赋值.
    _cioSocket = ioc(_url);
    _enc(_cioSocket);
    on_connect_error(_cioSocket, _url, _vartion, _enc);
  } else {
    //循环,避免只尝试重连一次,而是一直重连下去.
    console.log("enc:将在" + _upIpCycle + "秒后尝试重连.");
    setTimeout(
      Rec,
      _upIpCycle * 1000,
      _cioSocket,
      _url,
      _vartion,
      _enc,
      _upIpCycle
    );
  }
}
