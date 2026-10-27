# skills/ · 实战手册配套方法论技能包

本目录收录了 [Claude Code 实战手册](../AICoding进阶教程.html) 全流程引用的 **15 个方法论 skill** 的完整副本，clone 本仓库即可离线安装，无需访问任何外部服务。

## 15 个 skill（按流程分组）

| 组 | Skill | 干什么 |
|---|---|---|
| 需求与计划 | `brainstorming` | 需求发散：探清意图、约束与替代方案 |
| | `grilling` | 需求拷问：设计树 + 轮次制采访，捶方案漏洞 |
| | `writing-plans` | 把 SPEC 拆成有序、可测的任务计划 |
| | `executing-plans` | 按计划分批执行，每批 checkpoint 验收 |
| | `subagent-driven-development` | 计划拆给子代理执行，主代理只做验收 |
| | `dispatching-parallel-agents` | 并发子代理工作流的标准配方 |
| 编码与调试 | `tdd` | 测试驱动：RED → GREEN → REFACTOR（内含 `tests.md`、`mocking.md`、`verify.md`） |
| | `systematic-debugging` | 系统化排障循环（内含 `root-cause-tracing.md`、`defense-in-depth.md` 旁文件） |
| 审查与收尾 | `receiving-code-review` | 有脑地回应审查意见 |
| | `verification-before-completion` | 未出示「命令 + 输出 + 退出码」前禁止声称完成 |
| | `finishing-a-development-branch` | 分支收尾：合并 / PR / 保留 / 丢弃 四选一 |
| 工程习惯 | `using-git-worktrees` | 并行会话的物理隔离 |
| | `writing-skills` | 元 skill：怎么写 skill（`references/testing-skills-with-subagents.md` 是旁文件） |
| | `diagnosing-superpowers` | 套件自身的诊断工具 |
| | `requesting-code-review` | 按清单整理信息，交付 / 开 PR |

## 触发方式分两档

| 档 | 做法 | 适合谁 |
|---|---|---|
| 自动 | `description` 保留原文 | `tdd`、`systematic-debugging`、`receiving-code-review`、`verification-before-completion` |
| 手动 | `description` 改成「仅在用户明确要求时调用」 | 其余 11 个 |

> 手动档收益不是省 token（只占常驻描述 1.7%），是减少「该调哪个」的歧义。本仓库的 `grilling` 已按手动档配置。

## 出处与许可

| 项目 | 说明 |
|---|---|
| 上游仓库 | [obra/superpowers](https://github.com/obra/superpowers)（13 个） |
| 另外 2 个 | `grilling`、`tdd` 来自 [obra/superpowers-marketplace](https://github.com/obra/superpowers-marketplace) |
| 快照版本 | `2ce8aa15d05b`（superpowers main 分支，2026-10-21） |
| 许可 | MIT · Copyright (c) 2025 Jesse Vincent |
| 许可全文 | [LICENSE-superpowers](LICENSE-superpowers) |

> 本目录内容版权归原作者 Jesse Vincent 所有，按 MIT 许可随本仓库分发。若上游有更新，可到原仓库获取最新版。

## 安装

Windows PowerShell：

```powershell
powershell -ExecutionPolicy Bypass -File .\install-skills.ps1
```

脚本会把本目录下 15 个 skill 复制到 `~/.claude/skills/`，装完新开一个 Claude Code 会话即可使用。

## 三个易踩的坑

1. **旁文件不是独立 skill**：`root-cause-tracing`、`defense-in-depth`、`testing-skills-with-subagents` 是 `systematic-debugging` 和 `writing-skills` 目录里的子文件，装 skill 必须整目录装，只拷 `SKILL.md` 会把它们弄丢。
2. **TDD 不要装两份**：上游的 `test-driven-development` 与本目录的 `tdd` 是同一套规则。本仓库已收录 `tdd`，不要再额外安装 `test-driven-development`——两份副本迟早打架。
3. **`using-superpowers` 不在本仓库**：它是 superpowers 套件的入口索引，本手册的 15 个清单里不含它。若你的机器上有，可以保留也可以归档，不影响流程。
