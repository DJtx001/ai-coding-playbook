# 模板使用说明

| 文件 | 复制到 | 用途 |
|---|---|---|
| `CLAUDE.md.template` | `<仓库>/CLAUDE.md` | 项目级约定与运行/测试命令 |
| `SPEC.md.template` | `<仓库>/SPEC.md` | 跨模块改动的规格与验收清单 |
| `PLAN.md.template` | `<仓库>/PLAN.md` | 拆步骤，每步标注验证方式 |
| `HANDOFF.md.template` | `<仓库>/HANDOFF.md` | `/clear` 前的交接层 |
| `verify.json.template` | `<仓库>/.claude/verify.json` | Stop 闸门要跑的命令 |

## Stop 闸门怎么认测试命令

`~/.claude/hooks/gate.js` 按顺序判断：

1. `<仓库>/.claude/verify.json` 存在 → 用里面的 `command` 和 `timeout`
2. `package.json` 有真实的 `test` 脚本 → `npm test`
3. 有 `.venv/Scripts/python.exe` 且存在 `tests/` → `python -m pytest -q`
4. 其他情况不猜（Maven 等太慢），需要显式写 `verify.json`

只有**工作区有改动**时才跑；同一份改动只验证一次；测试失败会阻止收工并回传输出。

## verify.json 示例

```json
{ "command": "mvn -q test", "timeout": 300 }
```

```json
{ "command": "pytest -q", "timeout": 120 }
```

```json
{ "command": "npm test && npm run lint", "timeout": 180 }
```