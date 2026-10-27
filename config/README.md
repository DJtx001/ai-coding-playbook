# config/ · 可直接复制的配置资产

> 本目录是《从零配置清单》的配套文件。照清单操作时直接复制，不用手敲。
> 目标位置默认 `~/.claude`（Windows 即 `C:\Users\<你的用户名>\.claude`）。

| 文件 | 复制到 | 用途 |
|---|---|---|
| `CLAUDE.md` | `~/.claude/CLAUDE.md` | 全局行为规则样例（语言、选择中文、目标驱动） |
| `settings.json.template` | `~/.claude/settings.json` | 配置总入口模板（**已脱敏，需填端点与 token**） |
| `statusline.js` | `~/.claude/statusline.js` | 状态栏：模型 │ 目录 │ 分支 │ ctx% |
| `hooks/gate.js` | `~/.claude/hooks/gate.js` | 闸门：PreToolUse 拦危险 git + Stop 跑测试 |
| `hooks/gate.test.js` | `~/.claude/hooks/gate.test.js` | 闸门自检，`node gate.test.js` 应输出全部通过 |
| `agents/debugger.md` | `~/.claude/agents/debugger.md` | 排障子代理（无复现不修复） |
| `agents/verifier.md` | `~/.claude/agents/verifier.md` | 验收子代理（只读，独立判卷） |
| `templates/*` | `~/.claude/templates/` | 6 份项目模板（CLAUDE/SPEC/PLAN/HANDOFF/verify.json/说明） |
| `commands/*` | `~/.claude/commands/` | `/chinese` `/en` `/english` `/zh` 切换命令 |

## 安装顺序

1. 先装 CLI，跑一次 `claude` 生成 `settings.json` 骨架
2. 复制 `settings.json.template` 为 `settings.json`，把 `<你的用户名>`、`<你的 Anthropic 兼容端点>`、`<你的 token>`、`<模型名>` 全部替换成真实值
3. 复制 hooks / agents / templates / commands / statusline.js / CLAUDE.md 到对应位置
4. 重启 CLI，跑 `node ~/.claude/hooks/gate.test.js` 验证闸门
5. skills 从本仓库 `skills/` 目录整体复制到 `~/.claude/skills/`

## 注意事项

- **`settings.json` 含明文 token，不要提交进任何仓库。** 本仓库只提供模板。
- Windows 路径在 JSON 的 `args` 里必须写**双反斜杠**（`C:\\Users\\...`），单反斜杠会被吞。
- 改完 `settings.json` 必须**重启 CLI** 才生效。
- `gate.js` 找不到测试命令时会**静默放行**——这不是 bug，是设计：宁可不拦，不能卡死。
