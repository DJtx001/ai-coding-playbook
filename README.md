<div align="center">

# 可能是你见过的最强 AI Coding 教程

**从「一句话让 AI 写代码」到「一套可验证的工程流程」**

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![HTML](https://img.shields.io/badge/HTML-single--file-orange.svg)
![No Dependencies](https://img.shields.io/badge/Dependencies-zero-green.svg)
![Skills](https://img.shields.io/badge/Skills-14%20installable-purple.svg)

</div>

---

## 先回答一个问题

你用 AI 写代码多久了？一年？两年？

那你有没有发现一件事：**同样的工具，有人用它一个下午交付一个功能的 90%，有人改三天还在修报错。**

差距不在提示词。差距在工作流——前者有验收清单、有 TDD 闸门、有独立验证；后者只有「看起来做完了」。

这套教程讲的不是某个工具的用法，而是**让 AI 产出可以被验证的完整方法论**。不绑定案例，纯讲方法，任何模型、任何编辑器都能直接用。

## 里面有什么

| 文件 | 定位 | 适合什么时候看 |
|---|---|---|
| [**AICoding进阶教程.html**](AICoding进阶教程.html) | 主教程 · 6 章 · 3 张手绘级 SVG 流程图 | 从头系统学一遍（双击浏览器即开，零依赖） |
| [aicoding手册.md](aicoding手册.md) | 浓缩速查表 · 一页纸主干 | 已经懂了，贴在工位上随时扫一眼 |
| [ClaudeCode实战手册.html](ClaudeCode实战手册.html) | 八步全流程 · 8 张速查附表 | 正在用 Claude Code，查命令查快捷键 |
| [AI编程场景下的Git生存手册.md](AI编程场景下的Git生存手册.md) | 10 个 AI 编程特有的 Git 场景 | AI 把你的仓库搞乱了，急救用 |
| [skills/install-skills.ps1](skills/install-skills.ps1) | 一键安装 14 个方法论 skill | 想直接把流程装进你的 Claude Code |

## 一分钟了解教程主张

> **新手想的是「怎么让 AI 写出我要的代码」，高手想的是「怎么让 AI 的产出可以被验证」。**

整本教程的每一步，都只为把「看起来做完了」变成「能证明做完了」：

- **两道闸门**：没看到测试真实变红，不许写实现；没出示「命令 + 输出 + 退出码」，不许声称完成
- **路由判据**：拿到需求先判走几步——不是看改动大小，是看爆炸半径和你能否 30 秒内验证
- **会话卫生**：上下文是易腐资产，出现三个信号立刻写 HANDOFF 重开，别硬聊
- **独立验证**：写代码的不能给自己判卷，换子代理只读核对 SPEC

## 快速开始

```bash
git clone https://github.com/DJtx001/ai-coding-playbook.git
cd ai-coding-playbook
```

直接双击 `AICoding进阶教程.html`，或者先把 `aicoding手册.md` 花五分钟扫完。

**想装 skill 武装到牙齿？**（Windows PowerShell）

```powershell
powershell -ExecutionPolicy Bypass -File .\skills\install-skills.ps1
```

脚本会从 skill 原作者仓库拉取最新版，安装 14 个流程 skill 到 `~/.claude/skills/`，装完新开会话验证即可。

## 教程引用了哪些 skill

本教程第 4 章主干流程直接点名的方法，全部来自开源社区，**本仓库只提供安装脚本与出处，不打包任何第三方代码**：

| Skill | 出处 |
|---|---|
| `grilling`（需求拷问）、`tdd`（测试驱动开发） | [obra/superpowers-marketplace](https://github.com/obra/superpowers-marketplace) |
| `brainstorming` `writing-plans` `executing-plans` `subagent-driven-development` `dispatching-parallel-agents` `systematic-debugging` `verification-before-completion` `requesting-code-review` `receiving-code-review` `finishing-a-development-branch` `using-git-worktrees` `writing-skills` `using-superpowers` `diagnosing-superpowers` | [obra/superpowers](https://github.com/obra/superpowers)（MIT） |
| 更多子代理模板 | [VoltAgent/awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents) |
| 更多 skill 索引 | [anthropics/skills](https://github.com/anthropics/skills) · [trailofbits](https://github.com/trailofbits) 等社区合集 |

> 一个易踩的坑：`root-cause-tracing`、`defense-in-depth`、`testing-skills-with-subagents` **不是独立 skill**，而是 `systematic-debugging` 和 `writing-skills` 目录里的旁文件——装 skill 要整目录装，只拷 SKILL.md 会把它们弄丢。

## 适用人群

- 用过 Claude Code / Cursor / Copilot，但 **产出质量总在碰运气**
- 听过 TDD、验收清单、子代理，但**不知道怎么串成一个流程**
- 想要一套**不绑定工具、不绑定语言**的方法论，而不是某个产品的说明书

## 学习路线建议

```
通读 AICoding进阶教程.html（约 40 分钟）
  → 用 aicoding手册.md 每天扫一遍主干（每天 2 分钟）
  → 装 skill 开始实战（一条命令）
  → 遇到 Git 翻车查 Git生存手册
  → 用 ClaudeCode实战手册 当日常速查
```

## 许可与致谢

- 本仓库原创内容（教程、手册、README）采用 [MIT License](LICENSE) 发布
- `obra/superpowers` 及其 marketplaces 的 skill 版权归原作者所有（MIT），由安装脚本从原仓库实时拉取
- 方法论大量参考了社区实践与 Claude Code 官方文档

---

<div align="center">

**如果这套教程让你少踩一个坑，点个 ⭐ 就是对作者最大的支持**

*「错了重来比修更快」「不红不许实现」「要证据不要保证」*

</div>
