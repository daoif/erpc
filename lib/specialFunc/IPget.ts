//本程序集的作用是:生产端 IP的获取,IP与URL 端口的拼接
//最后是传出去,由框架核心函数,传给注册中心.
//调用获取 与 使用 都由框架核心函数处理.
let ph: string;
//进来的端口
let port: number = 0;

//数组1:192段的,也就是内网IP
let ipv41: string[] = [];
//数组2:非192段,可能是外网IP
let ipv42: string[] = [];
//fe80,内网段
let ipv61: string[] = [];
//外网段
let ipv62: string[] = [];

//net数组:公网IP
let ipv4net: string[] = [];
let ipv6net: string[] = [];

let domain: string[] = [];
//首先,我要拿到地址的组,分成IPV4和IPV6
// 127.0.0.1 直接放到第一个去.  然后将192段的放到127段同一个数组的后面
//将非192段的放在第二个数组.

//::1  放到第一个去.  然后将fe80::放到 ::1同一个数组的后面
//将非fe80::的放到第二个数组.
//在放入之前,要添加上端口. 域名的话要检查,是否已携带端口,是的话,将不额外添加,没有的话添加默认端口.
//最后,根据这样进行排序拼接:  ipv4第一个数组 外网IPV4查询结果数组  ipv6第一个数组
//ipv4第二个数组  外网IPV6查询结果数组 ipv6第二个数组  域名绑定数组

/**获取全部ip,URL
 * @param  _port:端口
 * @param _domain:URL(端口可选),传进来自动填端口.
 * @param local:是否本地获取IP,默认true,建议使用,(耗时5ms)
 * @param netipv4:是否网络获取IPV4,默认false,不建议使用,(耗时200ms)
 * @param nettestipv6:是否从test-ipv6获取IPV4和IPV6,默认false,不建议使用,(耗时1-2s)
 * @return {string[]} ip,URL (带端口)的数组
 */
export async function getAllIP(
  _port: number,
  _domain: string[],
  NativeIP: boolean,
  local: boolean = true,
  netipv4: boolean = false,
  nettestipv6: boolean = false
) {
  //协议头Protocol Header
  ph = "http://";
  port = _port;
  domain = _domain;

  if (NativeIP == true) {
    ipv41.push(ph + "127.0.0.1:" + port);
    ipv61.push(ph + "[::1]:" + port);
  }

  if (local) {
    getLocalIp();
  }
  if (netipv4) {
    await getNetIpv4();
  }
  if (nettestipv6) {
    await getNetFortestipv6();
  }
  domain = urlport(domain, port);
  //临时将所有string[]放到一个string[][]里,用于遍历.
  //如果不需要fe80段IPV6,则将该数组置空,否则无操作.
  if (NativeIP == false) {
    ipv61 = [];
  }
  let allList: string[][] = [
    ipv61,
    ipv62,
    ipv6net,
    domain,
    ipv41,
    ipv4net,
    ipv42,
  ];
  let allIpURL: string[] = [];
  allList.forEach((item) => {
    //存到最后输出的变量中.
    allIpURL = dupRemoval(allIpURL, item);
  });

  // 返回前,清空属性,方便下次调用.
  recovery();
  return allIpURL;
}
/**类中的属性全部初始化 */
function recovery() {
  //进来的端口
  port = 0;
  //数组1:192段的,也就是内网IP
  ipv41 = [];
  //数组2:非192段,可能是外网IP
  ipv42 = [];
  //fe80,内网段
  ipv61 = [];
  //外网段
  ipv62 = [];

  //net数组:公网IP
  ipv4net = [];
  ipv6net = [];

  domain = [];
}
/**获取本地IP4+IP6列表(如果你的ip4或ip6是公网可访问的,也会获取到)
 * 数据返回到ipv41,ipv42,ipv61,ipv62*/
function getLocalIp() {
  var os = require("os");
  var ifaces = os.networkInterfaces();
  Object.keys(ifaces).forEach((item: any) => {
    ifaces[item].forEach((item2: any) => {
      let addr: string = item2["address"];
      let fam: string = item2["family"];

      if (fam == "IPv4") {
        let rst: string[] = addr.split(".");
        if (rst[0] == "127") {
          return;
        } else if (rst[0] == "192") {
          ipv41.push(ph + addr + ":" + port);
        } else {
          ipv42.push(ph + addr + ":" + port);
        }
      } else if (fam == "IPv6") {
        let rst: string[] = addr.split(":");
        if (rst[0] == "") {
          return;
        } else if (rst[0] == "fe80") {
          ipv61.push(ph + "[" + addr + "]:" + port);
        } else {
          ipv62.push(ph + "[" + addr + "]:" + port);
        }
      }
    });
  });
}
/**获取网络ip4,该函数目前只处理了IPV4的返回结果,如果节点处于纯IPV6环境则无效.
 * 数据返回到ipv4net*/
async function getNetIpv4() {
  let url: string[] = [
    "http://myip.ipip.net/",
    "http://pv.sohu.com/cityjson?ie=utf-8",
  ];
  //url访问的返回数据
  let res = "";
  //正则表达式,匹配IP
  let regex = /(\d*\.\d*\.\d*\.\d*)/g;
  //单个URL取到的临时IP数组,一般是0或1个成员.
  let res2: string[] | null;
  //所有URL取到的第一个成员的集合.
  let res3: string[] = [];
  //将IP进行重复过滤,最后得到的IP返回数组,一般来说应该返回的成员只有1个.
  //但为了避免如有代理等情况,可能出现返回多个.所以使用数组.
  let res4: string[] = [];
  //如果res4已经有该成员,则tr=true,并结束本次的res4循环.
  let tr: boolean = false;
  let tr2: boolean;
  for await (let ul of url) {
    res = await getUrlData(ul);
    res2 = res.match(regex);
    if (res2?.length == 1) {
      res3.push(res2[0]);
    }
    res4 = dupRemoval(res4, res3);
  }
  res4.forEach((r, i) => {
    res4[i] = ph + r + ":" + port;
  });
  ipv4net = dupRemoval(ipv4net, res4);
}
/**从test-ipv6 获取IPV4与IPV6地址
 * 数据返回到ipv4net,ipv6net*/
async function getNetFortestipv6() {
  let IP4 =
    "http://ipv4.lookup.test-ipv6.com/ip/?callback=_jqjsp&asn=1&testdomain=test-ipv6.cl&testname=test_asn4";
  let IP6 =
    "http://ipv6.lookup.test-ipv6.com/ip/?callback=_jqjsp&asn=1&testdomain=test-ipv6.cl&testname=test_asn6";
  let resIP4 = await getUrlData(IP4);
  let resIP6 = await getUrlData(IP6);

  if (resIP4 != "") {
    resIP4 = resIP4.substring(7, resIP4.length - 2);
    let rip4 = JSON.parse(resIP4);
    ipv4net = dupRemoval(ipv4net, [ph + rip4.ip + ":" + port]);
  }

  if (resIP6 != "") {
    resIP6 = resIP6.substring(7, resIP6.length - 2);
    let rip6 = JSON.parse(resIP6);
    ipv6net = dupRemoval(ipv6net, [ph + "[" + rip6.ip + "]:" + port]);
  }
}
/**判断传入的url[数组]是否携带端口,如果不携带,则加上传入的端口,如果有,则原样返回.
 * 简单的域名处理,可能处理ipv6地址会出问题.*/
export function urlport(_domain: string[] | undefined, _port: number) {
  let regex = /(.*?:?).*(:\d+)/g;
  let res: string[] | null = [];
  if (_domain != undefined) {
    _domain.forEach((v, i) => {
      res = v.match(regex);
      //没有端口的情况,就加上端口,有端口的情况不处理.
      if (res == null) {
        _domain[i] = v + ":" + _port;
      }
    });
    return _domain;
  } else {
    return [];
  }
}

/**通用的ajax取数据,如果出错,返回空值.*/
async function getUrlData(url: string) {
  let axios = require("axios");
  let html = "";

  await axios
    .get(url)
    .then((res: any) => {
      html = res.data;
    })
    .catch(() => {});

  return html;
}
/**将数组2的内容去重,写入到数组1的前面或后面,around=true(前面),around=false(后面,默认)*/
function dupRemoval(l1: string[], l2: string[], around: boolean = false) {
  l2.forEach((item) => {
    if (l1.indexOf(item) == -1) {
      if (around) {
        l1.unshift(item);
      } else {
        l1.push(item);
      }
    }
  });
  return l1;
}
