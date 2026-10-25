# skills/ · 教程配套方法论技能包

本目录收录了 [AICoding进阶教程](../AICoding进阶教程.html) 第 4 章主干流程直接引用的 **14 个方法论 skill** 的完整副本，clone 本仓库即可离线安装，无需访问任何外部服务。

## 出处与许可

| 项目 | 说明 |
|---|---|
| 上游仓库 | [obra/superpowers](https://github.com/obra/superpowers) |
| 快照版本 | `2ce8aa15d05b`（main 分支，2026-10-21） |
| 许可 | MIT · Copyright (c) 2025 Jesse Vincent |
| 许可全文 | [LICENSE-superpowers](LICENSE-superpowers) |

> 本目录内容版权归原作者 Jesse Vincent 所有，按 MIT 许可随本仓库分发。若上游有更新，可到原仓库获取最新版。

## 安装

Windows PowerShell：

```powershell
powershell -ExecutionPolicy Bypass -File .\install-skills.ps1
```

脚本会把本目录下所有 skill 复制到 `~/.claude/skills/`，装完新开一个 Claude Code 会话即可使用。

## 包含哪些 skill

| Skill | 干什么 |
|---|---|
| `brainstorming` | 需求发散：探清意图、约束与替代方案 |
| `writing-plans` | 把 SPEC 拆成有序、可测的任务计划 |
| `executing-plans` | 按计划分批执行，每批 checkpoint 验收 |
| `subagent-driven-development` | 计划拆给子代理执行，主代理只做验收 |
| `dispatching-parallel-agents` | 并发子代理工作流的标准配方 |
| `systematic-debugging` | 系统化排障循环（内含 `root-cause-tracing.md`、`defense-in-depth.md` 旁文件） |
| `verification-before-completion` | 未出示「命令 + 输出 + 退出码」前禁止声称完成 |
| `requesting-code-review` | 按清单整理信息，交付 / 开 PR |
| `receiving-code-review` | 有脑地回应审查意见 |
| `finishing-a-development-branch` | 分支收尾：合并 / PR / 保留 / 丢弃 四选一 |
| `using-git-worktrees` | 并行会话的物理隔离 |
| `writing-skills` | 元 skill：怎么写 skill（`references/testing-skills-with-subagents.md` 是旁文件） |
| `using-superpowers` | superpowers 套件总入口 / 索引 |
| `diagnosing-superpowers` | 套件自身的诊断工具 |

## 两个易踩的坑

1. **旁文件不是独立 skill**：`root-cause-tracing`、`defense-in-depth`、`testing-skills-with-subagents` 是 `systematic-debugging` 和 `writing-skills` 目录里的子文件，装 skill 必须整目录装，只拷 `SKILL.md` 会把它们弄丢。
2. **TDD 不要装两份**：上游的 `test-driven-development` 与常见的 `tdd` 是同一套规则。本仓库**未收录** `test-driven-development`——如果你已经有 `tdd`，直接跳过即可；没有的话，到上游仓库单独安装。
