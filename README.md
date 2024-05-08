# 一个可以快速生成 hosts 修改脚本的小工具

## 线上演示地址

<https://hosts.balder.wang/>

## 如何开发

需要在.env中配置环境变量VITE_BASE_URL，用于指定后端接口地址

后端项目仓库地址：<https://github.com/baIder/hosts-script-backend>

```yml
VITE_BASE_URL=xxx
```

### 安装依赖

```bash
pnpm install
```

### 开发

```bash
pnpm dev
```

### 打包

```bash
pnpm build
```
