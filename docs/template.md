#

# 说明

你可以在这里直接查看到本文档所使用的模板的全部文件

# 文件结构及作用

## 文件结构

示例文件的源码都在 lib 文件夹下,lib 内的文件结构如下:

```
.\index.ts
.\userErpc.ts

.\emp\empRouter.ts
.\emp\emptest.ts

.\enc\encRouter.ts
.\enc\enctest.ts

.\test\test1.ts
```

## 作用

`index.ts`:程序入口

`userErpc.ts`:erpc 的入口及配置聚合

`emp`:生产端 api 文件夹

`enc`:消费端 api 文件夹

`empRouter.ts`:聚合多个生产模块,统一传递到 userErpc,然后再被传入到 erpc 中注册.

`encRouter.ts`:聚合多个消费模块,统一传递到 userErpc,然后再被传入到 erpc 中注册.

`emptest.ts`:一个演示用的 emp 模块,其中监听有 2 个方法,并都具有回调.

`enctest.ts`:一个演示用的 enc 模块,其中有 1 个可远程调用 emp 的方法,有不在线检测,调用超时等异常返回值,并且 response 中也可以传递 error 值.

# package.json

```json
<!-- package.json -->
{
  "name": "usertemplate",
  "version": "1.0.0",
  "description": "",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "test1": "nodemon --exec ./node_modules/.bin/ts-node -- ./lib/test/test1.ts",
    "start": "npm run build:live",
    "build:live": "nodemon --exec ./node_modules/.bin/ts-node -- ./lib/index.ts",
    "build": "tsc",
    "upe": "npm update erpc",
    "pu": "npm version patch && npm run build && npm publish",
    "bro": "browserify -r ./dist/index.js:usertemplate > ./assets/index.js -d ",
    "build2": "npm run build && npm run bro"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@types/node": "^17.0.31",
    "nodemon": "^2.0.16",
    "ts-node": "^10.7.0",
    "typescript": "^4.6.4"
  },
  "dependencies": {
    "erpc": "*"
  }
}
```

# tsconfig.json

```json
<!-- tsconfig.json -->
{
  "compilerOptions": {
    /* Visit https://aka.ms/tsconfig.json to read more about this file */

    /* Projects */
    // "incremental": true,                              /* Enable incremental compilation */
    // "composite": true,                                /* Enable constraints that allow a TypeScript project to be used with project references. */
    // "tsBuildInfoFile": "./",                          /* Specify the folder for .tsbuildinfo incremental compilation files. */
    // "disableSourceOfProjectReferenceRedirect": true,  /* Disable preferring source files instead of declaration files when referencing composite projects */
    // "disableSolutionSearching": true,                 /* Opt a project out of multi-project reference checking when editing. */
    // "disableReferencedProjectLoad": true,             /* Reduce the number of projects loaded automatically by TypeScript. */

    /* Language and Environment */
    "target": "es2016" /* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. */,
    // "lib": [],                                        /* Specify a set of bundled library declaration files that describe the target runtime environment. */
    // "jsx": "preserve",                                /* Specify what JSX code is generated. */
    // "experimentalDecorators": true,                   /* Enable experimental support for TC39 stage 2 draft decorators. */
    // "emitDecoratorMetadata": true,                    /* Emit design-type metadata for decorated declarations in source files. */
    // "jsxFactory": "",                                 /* Specify the JSX factory function used when targeting React JSX emit, e.g. 'React.createElement' or 'h' */
    // "jsxFragmentFactory": "",                         /* Specify the JSX Fragment reference used for fragments when targeting React JSX emit e.g. 'React.Fragment' or 'Fragment'. */
    // "jsxImportSource": "",                            /* Specify module specifier used to import the JSX factory functions when using `jsx: react-jsx*`.` */
    // "reactNamespace": "",                             /* Specify the object invoked for `createElement`. This only applies when targeting `react` JSX emit. */
    // "noLib": true,                                    /* Disable including any library files, including the default lib.d.ts. */
    // "useDefineForClassFields": true,                  /* Emit ECMAScript-standard-compliant class fields. */

    /* Modules */
    "module": "commonjs" /* Specify what module code is generated. */,
    // "rootDir": "./",                                  /* Specify the root folder within your source files. */
    // "moduleResolution": "node",                       /* Specify how TypeScript looks up a file from a given module specifier. */
    // "baseUrl": "./",                                  /* Specify the base directory to resolve non-relative module names. */
    // "paths": {},                                      /* Specify a set of entries that re-map imports to additional lookup locations. */
    // "rootDirs": [],                                   /* Allow multiple folders to be treated as one when resolving modules. */
    // "typeRoots": [],                                  /* Specify multiple folders that act like `./node_modules/@types`. */
    // "types": [],                                      /* Specify type package names to be included without being referenced in a source file. */
    // "allowUmdGlobalAccess": true,                     /* Allow accessing UMD globals from modules. */
    // "resolveJsonModule": true,                        /* Enable importing .json files */
    // "noResolve": true,                                /* Disallow `import`s, `require`s or `<reference>`s from expanding the number of files TypeScript should add to a project. */

    /* JavaScript Support */
    // "allowJs": true,                                  /* Allow JavaScript files to be a part of your program. Use the `checkJS` option to get errors from these files. */
    // "checkJs": true,                                  /* Enable error reporting in type-checked JavaScript files. */
    // "maxNodeModuleJsDepth": 1,                        /* Specify the maximum folder depth used for checking JavaScript files from `node_modules`. Only applicable with `allowJs`. */

    /* Emit */
    "declaration": true /* Generate .d.ts files from TypeScript and JavaScript files in your project. */,
    // "declarationMap": true,                           /* Create sourcemaps for d.ts files. */
    // "emitDeclarationOnly": true,                      /* Only output d.ts files and not JavaScript files. */
    // "sourceMap": true,                                /* Create source map files for emitted JavaScript files. */
    // "outFile": "./",                                  /* Specify a file that bundles all outputs into one JavaScript file. If `declaration` is true, also designates a file that bundles all .d.ts output. */
    "outDir": "./dist" /* Specify an output folder for all emitted files. */,
    // "removeComments": true,                           /* Disable emitting comments. */
    // "noEmit": true,                                   /* Disable emitting files from a compilation. */
    // "importHelpers": true,                            /* Allow importing helper functions from tslib once per project, instead of including them per-file. */
    // "importsNotUsedAsValues": "remove",               /* Specify emit/checking behavior for imports that are only used for types */
    // "downlevelIteration": true,                       /* Emit more compliant, but verbose and less performant JavaScript for iteration. */
    // "sourceRoot": "",                                 /* Specify the root path for debuggers to find the reference source code. */
    // "mapRoot": "",                                    /* Specify the location where debugger should locate map files instead of generated locations. */
    // "inlineSourceMap": true,                          /* Include sourcemap files inside the emitted JavaScript. */
    // "inlineSources": true,                            /* Include source code in the sourcemaps inside the emitted JavaScript. */
    // "emitBOM": true,                                  /* Emit a UTF-8 Byte Order Mark (BOM) in the beginning of output files. */
    // "newLine": "crlf",                                /* Set the newline character for emitting files. */
    // "stripInternal": true,                            /* Disable emitting declarations that have `@internal` in their JSDoc comments. */
    // "noEmitHelpers": true,                            /* Disable generating custom helper functions like `__extends` in compiled output. */
    // "noEmitOnError": true,                            /* Disable emitting files if any type checking errors are reported. */
    // "preserveConstEnums": true,                       /* Disable erasing `const enum` declarations in generated code. */
    // "declarationDir": "./",                           /* Specify the output directory for generated declaration files. */
    // "preserveValueImports": true,                     /* Preserve unused imported values in the JavaScript output that would otherwise be removed. */

    /* Interop Constraints */
    // "isolatedModules": true,                          /* Ensure that each file can be safely transpiled without relying on other imports. */
    // "allowSyntheticDefaultImports": true,             /* Allow 'import x from y' when a module doesn't have a default export. */
    "esModuleInterop": true /* Emit additional JavaScript to ease support for importing CommonJS modules. This enables `allowSyntheticDefaultImports` for type compatibility. */,
    // "preserveSymlinks": true,                         /* Disable resolving symlinks to their realpath. This correlates to the same flag in node. */
    "forceConsistentCasingInFileNames": true /* Ensure that casing is correct in imports. */,

    /* Type Checking */
    "strict": true /* Enable all strict type-checking options. */,
    // "noImplicitAny": true,                            /* Enable error reporting for expressions and declarations with an implied `any` type.. */
    // "strictNullChecks": true,                         /* When type checking, take into account `null` and `undefined`. */
    // "strictFunctionTypes": true,                      /* When assigning functions, check to ensure parameters and the return values are subtype-compatible. */
    // "strictBindCallApply": true,                      /* Check that the arguments for `bind`, `call`, and `apply` methods match the original function. */
    // "strictPropertyInitialization": true,             /* Check for class properties that are declared but not set in the constructor. */
    // "noImplicitThis": true,                           /* Enable error reporting when `this` is given the type `any`. */
    // "useUnknownInCatchVariables": true,               /* Type catch clause variables as 'unknown' instead of 'any'. */
    // "alwaysStrict": true,                             /* Ensure 'use strict' is always emitted. */
    // "noUnusedLocals": true,                           /* Enable error reporting when a local variables aren't read. */
    // "noUnusedParameters": true,                       /* Raise an error when a function parameter isn't read */
    // "exactOptionalPropertyTypes": true,               /* Interpret optional property types as written, rather than adding 'undefined'. */
    // "noImplicitReturns": true,                        /* Enable error reporting for codepaths that do not explicitly return in a function. */
    // "noFallthroughCasesInSwitch": true,               /* Enable error reporting for fallthrough cases in switch statements. */
    // "noUncheckedIndexedAccess": true,                 /* Include 'undefined' in index signature results */
    // "noImplicitOverride": true,                       /* Ensure overriding members in derived classes are marked with an override modifier. */
    // "noPropertyAccessFromIndexSignature": true,       /* Enforces using indexed accessors for keys declared using an indexed type */
    // "allowUnusedLabels": true,                        /* Disable error reporting for unused labels. */
    // "allowUnreachableCode": true,                     /* Disable error reporting for unreachable code. */

    /* Completeness */
    // "skipDefaultLibCheck": true,                      /* Skip type checking .d.ts files that are included with TypeScript. */
    "skipLibCheck": true /* Skip type checking all .d.ts files. */
  }
}
```

# lib/index.ts

```ts
<!-- index.ts -->
//模拟真实用户的入口
import { enctest } from "./enc/enctest";
import * as erpcRun from "./userErpc";

export function main() {
  erpcRun.myerpcRun();

  // enctest.sendtotest1();
}

// export function main2() {
//   erpcRun.myerpcRun();

//   setTimeout(function () {
//     enctest.sendtotest1("测试");
//   }, 5000);
// }

main();

```

# lib/userErpc.ts

```ts
<!-- userErpc.ts -->
import * as erpc from "erpc";
//注册 多个 生产API模块
import { empRouter } from "./emp/empRouter";
import { InitEnctest } from "./enc/encRouter";
//运行erpc
export function myerpcRun() {
  midempUse();
  midencUse();
  erpc.Run({
    userS: {
      empConf: empRouter(),
      vartion: { NID: "999999" },
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
    userC: {
      encList: [
        { encConf: InitEnctest(), vartion: { URL: ["http://127.0.0.1"] } },
      ],
    },
  });
}

//注册 多个 生产端 中间件
function midempUse() {}

//注册 多个 消费端 中间件
function midencUse() {}

```

# lib/emp/empRouter.ts

```ts
<!-- empRouter.ts -->
//这里是生产api的集合,将返回生产api对象,以及参数.
//这里的参数都应当是字面量的,如需动态指定,则可以在userErpc里写对应的参数
//框架内部会使用userErpc里有的参数覆盖此处的参数.
import { EmpConf } from "erpc";
import emptest from "./emptest";
//自动生成消费api的方法是,从empRouter文件中获取EmpConf里面的2个对象
//empUseList 获取到已引用的生成api
//vartion 获取到默认参数.
const empRouter = () => {
  let conf: EmpConf = {
    empUseList: [emptest],
    vartion: {
      NType: "test1",
      NID: "999999",
      Port: 3000,
    },
  };
  return conf;
};

export { empRouter };
```

# lib/emp/emptest.ts

```ts
<!-- emptest.ts -->
//更新包以后,如果导入有问题,可以重启vscode.
import { iosSocket } from "erpc";

interface IEmptest {
  (_sioSocket: iosSocket): void;
  test1(arg: any, callback: (e: any) => void): any;
  test2(arg: any, callback: (e: any) => void): any;
}
const emptest: IEmptest = (_sioSocket: iosSocket) => {
  //这里是进行监听
  _sioSocket.on("test1", emptest.test1);
  _sioSocket.on("test2", emptest.test2);
};
emptest.test1 = (arg: any, callback: (e: any) => void) => {
  console.log("test1 收到请求,内容:");
  console.log(arg);
  //应该不需要将回调放在其他地方,直接在这里处理就行了.
  //callback返回值应当是一个具体的类型
  callback("test1 回调内容");
};

emptest.test2 = (arg: any, callback: (e: any) => void) => {
  console.log("test2 收到请求,内容:");
  console.log(arg);
  //应该不需要将回调放在其他地方,直接在这里处理就行了.
  //callback返回值应当是一个具体的类型
  callback("test2 回调内容");
};
export default emptest;

```

# lib/enc/encRouter.ts

```ts
<!-- encRouter.ts -->
import { EncConf } from "erpc";
import { enctest } from "./enctest";
const InitEnctest = () => {
  let conf: EncConf = {
    encUseList: [enctest],
    vartion: {
      NType: "test1",
      NID: "999999",
      Port: 3000,
      // URL:["http://127.0.0.1"]
    },
  };
  return conf;
};

export { InitEnctest };

```

# lib/enc/enctest.ts

```ts
<!-- enctest.ts -->
import { iocSocket } from "erpc";

interface IEnctest {
  (_cioSocket: iocSocket): void;
  sendtotest1(arg: any): Promise<number | any>;
}
//这个cio不要放到属性里,否则初始化麻烦.
let cioSocket: iocSocket;

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
        console.log("请求 test1,回调超时报错:");
        console.log(err);
        res(err);
      } else {
        console.log("请求 test1,回调数据:");
        console.log(response);
        res(response);
      }
    });
  });
  return res2;
};

```

# lib/test/test1.ts

```ts
<!-- test1.ts -->
import { main1 } from "..";

main1();

```
