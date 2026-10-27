# ppt.xux.ai：部署与 DNS

## 推荐方案

沿用 Cloudflare 管理 `xux.ai` 的 DNS，在 Vercel 创建独立项目 `xux-ppt`，
绑定 `ppt.xux.ai`。同一个 Git 仓库可以服务多个 Vercel 项目，各自选择根目录。

```text
xux.ai 的 DNS（Cloudflare）
├── www    → 现有 Vercel 个人网站项目（仓库根目录）
├── money  → 现有北美 hosting
└── ppt    → 新 Vercel 项目 xux-ppt（sites/ppt）
```

PPT 指南使用独立的 HTML / CSS / JavaScript，不需要构建、后端、环境变量或新依赖。
只有 `sites/ppt/public` 中的文件会被新项目发布。个人站继续使用原来的 Next.js 配置。

DNS 决定请求到哪个服务；Vercel 的项目域名绑定决定返回哪个站点。
仅增加 CNAME 而未绑定域名，不能让 Vercel 正确找到新项目。

## 当前公开记录

核实时间：2026-10-03，使用 Google Public DNS 的 DNS-over-HTTPS 查询。
本机普通 DNS 曾返回 `198.18.x.x` 代理占位地址，因此这些地址没有作为部署目标。

| 主机名 | 类型 | 已查到的值 | 操作 |
| --- | --- | --- | --- |
| `xux.ai` | NS | `elma.ns.cloudflare.com`、`paul.ns.cloudflare.com` | 保留 |
| `www.xux.ai` | CNAME | `0caf2f5e83c54e45.vercel-dns-017.com` | 保留 |
| `money.xux.ai` | A | `198.44.55.184` | 保留 |
| `ppt.xux.ai` | — | 查询返回 NXDOMAIN，尚未解析 | 为新站增加 CNAME |

这些是公开查询快照，不是完整的 Cloudflare 区域导出。根域名、邮件和其他记录继续保持原样。

## 1. 创建独立 Vercel 项目

先把 `xux/ppt-guide` 分支上的已验证代码推送到 GitHub；正式上线时合并到 `main`。
本次本地实现没有执行推送、合并、Vercel 发布或 DNS 修改。

在 Vercel 选择 **Add New → Project**，再次导入 `xujiazhao/XUX_Site`：

| 配置项 | 值 |
| --- | --- |
| Project Name | `xux-ppt` |
| Root Directory | `sites/ppt` |
| Framework Preset | `Other` |
| Build Command | 留空，不执行构建 |
| Install Command | 留空，不安装依赖 |
| Output Directory | `public` |
| Production Branch | `main` |
| Environment Variables | 无 |

仓库中的 `sites/ppt/vercel.json` 已声明框架、命令和输出目录。
**Root Directory 仍需要在新项目设置中选择**，它不能由此配置文件替代。
不要修改现有个人网站项目的根目录或 Framework Preset。

先检查新项目的 Vercel 预览地址：首页、样式和交互均正常，再连接正式域名。
部署当前开发分支可用于预览；正式项目的 `main` 需要包含这些文件。

## 2. 在 Vercel 绑定域名

进入 **xux-ppt → Settings → Domains**，添加 `ppt.xux.ai`。
复制 Vercel 此时显示的 CNAME 目标。该值由实际项目配置决定，本地不能预先确定。
如 Vercel 要求额外的 TXT 所有权验证，按它给出的主机名和值添加。

`ppt.xux.ai` 应绑定新项目，不要绑定到个人网站项目，也不要配置为跳转到 `www.xux.ai`。
无需把整个 `xux.ai` 的 nameserver 转到 Vercel，也无需添加通配域名。

## 3. 在 Cloudflare 添加一条记录

打开 **xux.ai → DNS → Records → Add record**：

| 字段 | 填写内容 |
| --- | --- |
| Type | `CNAME` |
| Name | `ppt` |
| Target | Vercel 为 `ppt.xux.ai` 实际给出的目标主机名 |
| Proxy status | **DNS only（灰云）** |
| TTL | `Auto` |

Target 是主机名，不包含 `https://`、端口或 URL 路径。
优先用 DNS only，让 Vercel 直接提供 CDN 和 HTTPS，避免多加一层代理。
不照抄 `www` 的现有 CNAME；以新项目域名页显示的值为准。
不要为同一个 `ppt` 主机名同时保留冲突的 A / AAAA / CNAME 记录。

## 4. 确认上线

等待 Vercel Domains 显示域名配置有效并完成证书签发，随后检查：

- `https://ppt.xux.ai/` 打开 PPT 指南，没有跳到个人站的 `/en` 或 `/zh`。
- CSS、脚本、favicon 都正常加载；第 1–7 步的 DO / DON’T 画布保持 16:9，桌面并排、窄屏上下排列，内容无裁切。
- 第 7 步的“下一步”依次显示问题、原因、方案，“重新演示”回到第一步；鼠标和键盘均可操作。
- 呈现流程按顺序阅读；FAQ 收起显示 +，展开显示 ×，鼠标和键盘均可操作。
- 行前检查的十个检查项计数正确，手机页面没有横向滚动。
- `www.xux.ai` 与 `money.xux.ai` 仍按原来方式访问。

DNS 缓存更新和证书签发可能需要等待，以公开解析结果及 Vercel 的实际状态为准。
DNS 不能配置 URL 路径，因此不要尝试把 CNAME 指向 `www.xux.ai/ppt`。

## 本地预览与维护

在仓库根目录执行：

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory sites/ppt/public
```

打开 `http://127.0.0.1:4173/`。编辑后刷新浏览器即可，无需安装依赖。
内容与静态对比示例在 `index.html`，样式在 `styles.css`，清单计数和逐步出现的演示在 `guide.js`。
界面图标统一来自 Lucide，本地 SVG 集合在 `icons.svg`，许可保存在 `icon-license.txt`；无需图标脚本或外部 CDN。
全部正文在静态 HTML 中；JavaScript 不可用时，分步示例会完整显示，原生复选框仍可勾选。
检查状态仅存在当前页面中，没有账户、远程存储或数据上传。

## 参考

- [Vercel：静态站点构建与 Root Directory](https://vercel.com/docs/builds/configure-a-build)
- [Vercel：vercel.json 配置](https://vercel.com/docs/project-configuration/vercel-json)
- [Vercel：添加和配置自定义域名](https://vercel.com/docs/domains/working-with-domains/add-a-domain)
- [Cloudflare：创建子域名记录](https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-subdomain/)
