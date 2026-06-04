# 高考倒计时

一个无第三方运行时依赖的高考倒计时静态网页。页面会根据当前设备时间，在倒计时状态和高考祝福状态之间自动切换。

[在线预览](https://xiaoyuban1213.github.io/gkdjs/)

## 页面状态

| 时间范围 | 页面状态 |
| --- | --- |
| 每年 6 月 7 日 09:00 之前 | 显示当年高考倒计时 |
| 6 月 7 日 09:00 至 6 月 10 日 00:00 | 显示高考祝福页面 |
| 6 月 10 日 00:00 之后 | 自动进入下一年高考倒计时 |

所有时间均以访问设备的本地时区为准。页面每秒检查一次状态，跨越时间边界时无需刷新。

## 功能

- 自动计算距离下一次高考第一场考试的剩余天、时、分、秒
- 高考期间自动切换为祝福页面，并显示当前考试日
- 自动更新目标年份、页面标题和版权年份
- 磨砂玻璃闹钟风格倒计时组件
- 桌面端与移动端响应式布局
- 自定义 404 页面
- 可直接部署到 GitHub Pages

## 项目结构

```text
.
├── index.html                  # 首页结构与页面文案
├── 404.html                    # 自定义 404 页面
├── css/style.css               # 页面样式与响应式规则
├── js/script.js                # 时间状态、倒计时与动态 DOM
├── img/bj.png                  # 页面背景图
├── favicon.ico
└── .github/workflows/static.yml
```

## 本地预览

直接打开 `index.html`，或在项目目录启动静态服务器：

```bash
python -m http.server 8000
```

然后访问 `http://127.0.0.1:8000/`。

## 修改时间规则

时间规则集中在 `js/script.js` 顶部：

```js
const GAOKAO_MONTH = 5; // JavaScript 月份从 0 开始，5 表示六月
const GAOKAO_DAY = 7;
const GAOKAO_HOUR = 9;
const EXAM_END_DAY = 10;
```

## 技术实现

- 语义化 HTML
- CSS Grid、媒体查询、`backdrop-filter`
- 原生 JavaScript、DOM API、`Intl.DateTimeFormat`
- GitHub Actions 与 GitHub Pages

## 鸣谢

- 感谢 [ssdomei232](https://github.com/ssdomei232) 提供的部分代码
- 本站云计算服务由 [雨云](https://www.rainyun.com/YuBan_) 提供

## 许可证

本项目基于 [MIT License](./LICENSE) 开源。
