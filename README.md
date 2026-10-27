<div align="center">

# Claude Code 实战手册

**从「一句话让 AI 写代码」到「一套可验证的工程流程 + 一台配置到位的机器」**

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![HTML](https://img.shields.io/badge/HTML-single--file-orange.svg)
![No Dependencies](https://img.shields.io/badge/Dependencies-zero-green.svg)
![Skills](https://img.shields.io/badge/Skills-15%20installable-purple.svg)
![Config](https://img.shields.io/badge/Config-copy%20%26%20run-brightgreen.svg)

[**🚀 在线直接读（免下载）**](https://djtx001.github.io/ai-coding-playbook/AICoding进阶教程.html)　·　[仓库主页](https://github.com/DJtx001/ai-coding-playbook)

</div>

---

## 先回答一个问题

你用 AI 写代码多久了？一年？两年？

那你有没有发现：**同样的工具，有人一个下午交付功能的 90%，有人改三天还在修报错。**

差距不在提示词，在工作流——前者有验收清单、有 TDD 闸门、有独立验证；后者只有「看起来做完了」。

这套手册讲两件事：**每天怎么干**（八步流程 + 两道闸门），以及**机器怎么装**（从零配置到 hooks 自动兜底）。不绑定模型，任何 Anthropic 兼容端点都能用。

## 里面有什么

| 文件 | 定位 | 适合什么时候看 |
|---|---|---|
| [**AICoding进阶教程.html**](AICoding进阶教程.html) | 主教程 · 8 章 · 单文件零依赖 | 从头系统学一遍（双击浏览器即开） |
| [Claude-Code-使用手册.md](Claude-Code-使用手册.md) | 使用手册 · 路由/八步/报错/卫生/红线/速查 | 干活时随手查 |
| [从零配置清单.md](从零配置清单.md) | 配置清单 · 12 个阶段，每步带验证命令 | 换机器、配新环境 |
| [**config/**](config/) | 可直接复制的配置资产：settings 模板、gate.js、statusline.js、agents、templates、commands | 照清单操作时直接拷 |
| [skills/](skills/) | 15 个方法论 skill 完整副本 + 离线安装脚本 | 想把流程装进 Claude Code |

## 一分钟了解核心主张

> **新手想的是「怎么让 AI 写出我要的代码」，高手想的是「怎么让 AI 的产出可以被验证」。**

- **两道闸门**：没看到测试真实变红，不许写实现；没出示「命令 + 输出 + 退出码」，不许声称完成
- **路由判据**：拿到需求先判走几步——不是看改动大小，是看爆炸半径和你能否 30 秒内验证
- **会话卫生**：上下文是易腐资产，出现三个腐烂信号立刻写 HANDOFF 重开，别硬聊
- **独立验收**：写代码的不能给自己判卷，派只读 `@verifier` 用证据判定
- **闸门机器化**：`git reset --hard` 会被 hook 拦下，测试没绿不许收工——人的纪律会犯困，机器的不会

## 快速开始

```bash
git clone https://github.com/DJtx001/ai-coding-playbook.git
cd ai-coding-playbook
```

**只想读**：双击 `AICoding进阶教程.html`，或在线读 [djtx001.github.io/ai-coding-playbook](https://djtx001.github.io/ai-coding-playbook/AICoding进阶教程.html)。

**想装 skill**（Windows PowerShell，完全离线）：

```powershell
powershell -ExecutionPolicy Bypass -File .\skills\install-skills.ps1
```

**想配整套环境**：照 [从零配置清单.md](从零配置清单.md) 走 12 个阶段，配置资产从 [config/](config/) 直接复制。核心三件套：

| 资产 | 作用 |
|---|---|
| `config/hooks/gate.js` | 闸门：PreToolUse 拦危险 git 命令，Stop 跑测试、未绿不许收工 |
| `config/agents/verifier.md` | 只读验收子代理，结论只能是 PASS / FAIL / BLOCKED |
| `config/templates/` | SPEC / PLAN / HANDOFF / CLAUDE / verify.json 五份项目模板 |

## 15 个 skill 从哪来

**13 个**来自 [obra/superpowers](https://github.com/obra/superpowers)（MIT），**2 个**（`grilling`、`tdd`）来自 [obra/superpowers-marketplace](https://github.com/obra/superpowers-marketplace)。完整副本已收录在 [skills/](skills/)，保留原作者版权声明与 MIT 许可（见 [skills/LICENSE-superpowers](skills/LICENSE-superpowers)）。

| 组 | Skill |
|---|---|
| 需求与计划 | `brainstorming` `grilling` `writing-plans` `executing-plans` `subagent-driven-development` `dispatching-parallel-agents` |
| 编码与调试 | `tdd` `systematic-debugging` |
| 审查与收尾 | `receiving-code-review` `verification-before-completion` `finishing-a-development-branch` |
| 工程习惯 | `using-git-worktrees` `writing-skills` `diagnosing-superpowers` `requesting-code-review` |

> 一个易踩的坑：`root-cause-tracing`、`defense-in-depth`、`testing-skills-with-subagents` **不是独立 skill**，而是 `systematic-debugging` 和 `writing-skills` 目录里的旁文件——装 skill 要整目录装，只拷 SKILL.md 会把它们弄丢。

## 适用人群

- 用过 Claude Code / Cursor / Copilot，但 **产出质量总在碰运气**
- 听过 TDD、验收清单、子代理，但**不知道怎么串成一个流程**
- 想要一套**不绑定工具、不绑定语言**的流程，外加**能直接复制的配置**

## 学习路线建议

```
通读 AICoding进阶教程.html（约 45 分钟）
  → 用 Claude-Code-使用手册.md 每天扫一遍速查表（每天 2 分钟）
  → 装 skill（一条命令）→ 配闸门（照清单阶段 0-7）
  → 跑三个真实需求，把踩到的坑用 writing-skills 固化下来
```

## 许可与致谢

- 本仓库原创内容（教程、手册、配置清单、gate.js、statusline.js、agents、templates、README、安装脚本）采用 [MIT License](LICENSE) 发布
- [skills/](skills/) 内的 15 个 skill 来自 [obra/superpowers](https://github.com/obra/superpowers)，版权归 Jesse Vincent 所有，按 MIT 许可随本仓库分发（许可全文见 [skills/LICENSE-superpowers](skills/LICENSE-superpowers)）
- 插件侧感谢 [`ponytail`](https://github.com/DietrichGebert/ponytail)（编码纪律）与 `code-review@claude-plugins-official`
- 方法论大量参考了社区实践与 Claude Code 官方文档

---

<div align="center">

**如果这套手册让你少踩一个坑，点个 ⭐ 就是对作者最大的支持**

*「错了重来比修更快」「不红不许实现」「要证据不要保证」*

</div>
