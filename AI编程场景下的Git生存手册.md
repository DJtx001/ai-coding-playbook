# AI 编程场景下的 Git 生存手册

> 适用环境：IntelliJ IDEA（Java）/ PyCharm（Python）+ IDE 终端跑 Claude Code
> 目标：不系统学 Git，但**在 AI 把代码改乱时能自救**
> 原则：日常用图形界面，命令行只用来保命

---

## 零、先记住这一个模型

Git 的全部复杂度，都建立在这张图上：

```
工作区            暂存区             本地仓库            远程仓库
(正在编辑)  add→  (待提交清单) commit→ (已提交历史) push→ (GitHub)
   ←restore      ←reset --soft        ←fetch
```

三句话记住本质：

1. **commit 是一条链上的节点**，每个节点是项目某一刻的完整快照。
2. **分支只是一个指针**，指向某个 commit。切分支就是挪指针，不复制文件。
3. **HEAD 是"你现在站在哪"**。 detached HEAD 就是你站在一个没有分支名的 commit 上。

> 推荐先花 1 小时做一遍 **Learn Git Branching**（`learngitbranching.js.org`），交互式闯关，做完分支模型就通了。这比看任何教程都快。

---

## 一、只需要背 6 个命令

| 命令 | 作用 | 风险 |
|---|---|---|
| `git status` | 我现在在哪、改了什么 | **零风险**，随时敲 |
| `git diff` | 具体改了哪些行 | 零风险 |
| `git log --oneline` | 看提交历史 | 零风险 |
| `git checkout -- 文件名` | 放弃这个文件的改动 | 中（丢改动） |
| `git stash` / `git stash pop` | 临时存起来 / 取回来 | 低 |
| `git reflog` | **找回一切"丢失"的 commit** | 零风险，救命用 |

**任何不确定的时候，先敲 `git status`。** 它不修改任何东西，但会告诉你当前状态——这是唯一需要形成肌肉记忆的命令。

---

## 二、10 个场景速查

### 场景 1｜我现在是什么状态？

```bash
git status
git log --oneline -5
```

**IDEA / PyCharm**：`Alt+9` 打开 Version Control 工具窗口，Log 标签看历史图，Local Changes 看未提交改动。

---

### 场景 2｜AI 改了一堆，我要看它到底改了什么

```bash
git diff              # 未暂存的改动
git diff --stat       # 只看改了哪些文件、各改了多少行
git diff 文件名        # 只看某个文件
```

**IDEA / PyCharm**：Local Changes 里双击文件，直接开 diff 界面（比终端好看得多）。
想看 AI 从上次提交以来动过哪些文件：`git diff --stat HEAD~1`。

> 这条特别重要：**AI 会"顺手改"你没让它改的地方**，只能靠 diff 发现。

---

### 场景 3｜AI 动了不该动的文件，只恢复这一个文件

```bash
git checkout -- src/foo.java          # 放弃这个文件的未暂存改动
git restore src/foo.java              # 新写法，等价
```

**IDEA / PyCharm**：Local Changes 里右键该文件 → **Rollback**。

只影响这一个文件，其他改动不受影响，比重置整个仓库安全得多。

---

### 场景 4｜这次改动全不要了，工作区清干净

```bash
git checkout -- .        # 放弃所有未暂存的改动
git clean -fd            # 再删掉新增的未跟踪文件
```

**IDEA / PyCharm**：Local Changes 里选中所有文件 → 右键 → **Rollback**。

> ⚠️ **不可恢复**（未提交的东西没有进过 Git，reflog 也救不了）。执行前先确认没有要留的代码。

---

### 场景 5｜撤销刚才的 commit，但代码要留着

```bash
git reset --soft HEAD~1    # 改动保留在暂存区，直接重新 commit
git reset HEAD~1           # 改动回到工作区（默认 --mixed），可以重新挑文件提交
```

`HEAD~1` 表示"上一个"。想退三个就 `HEAD~3`。

**IDEA / PyCharm**：Log 里右键目标 commit → **Reset Current Branch to Here** → 选 Soft 或 Mixed。

> 这是"AI 改乱了但还想抢救部分代码"时最常用的操作。

---

### 场景 6｜已经 push 到远程了，怎么安全撤销

```bash
git revert <hash>      # 生成一个反向 commit 抵消它
git push
```

**IDEA / PyCharm**：Log 里右键该 commit → **Revert Commit**。

> **已推送的 commit 一律用 revert，不要用 reset。** reset 会改写历史，别人pull 时会炸。
> 判断标准：**别人有没有可能已经拉过这个分支？** 有 → revert。

---

### 场景 7｜commit message 写错了 / 漏提交了一个文件

```bash
# 只改消息
git commit --amend -m "新的提交信息"

# 漏了文件
git add 漏掉的文件
git commit --amend --no-edit      # 沿用原消息
```

**IDEA / PyCharm**：Commit 工具窗口里，勾选 **Amend** 再点提交。

> ⚠️ amend 会改写历史。**只在还没 push 的时候用**。

---

### 场景 8｜reset --hard 过头了，commit 找不回来了

```bash
git reflog                    # 列出 HEAD 每一次移动，包括"被丢弃"的
git reset --hard HEAD@{2}     # 回到 reflog 里看到的那个位置
```

**IDEA / PyCharm**：`Alt+9` → Log 标签右上角有个 **"Show All Branches / 眼睛"** 图标，可以显示包括被丢弃的提交；或者直接用终端 reflog。

> **这是 Git 里最值得记住的兜底命令。** 只要 commit 曾经存在过，reflog 里基本都能翻出来（默认保留 90 天）。

---

### 场景 9｜改到一半要切分支，代码还不想提交

```bash
git stash push -m "说明：写到一半的登录逻辑"
git stash list              # 看存了哪些
git stash pop               # 取回最近那一份
```

**IDEA / PyCharm**：右键 changelist 或选中文件 → **Shelve Changes**（比 stash 好用，有名字、有列表、不会忘）。取回是 **Unshelve**。

> 用 AI 时这条很常见：一个功能做到一半，突然要先修个 bug。

---

### 场景 10｜让多个 AI 会话并行改代码，怎么不打架

**核心原则：文件集不重叠。**

```bash
# 方案一：开独立工作目录（物理隔离，最稳）
claude --worktree feature-auth      # 终端 A
claude --worktree fix-rate-limit    # 终端 B

# 方案二：普通分支
git branch feature/auth && git checkout feature/auth
```

**IDEA / PyCharm**：右下角分支名 → **New Branch**。

> 两个会话改同一个文件 = 必然冲突，合并成本远高于串行。
> 仓库需要至少有一个 commit，否则 `claude --worktree` 会报 `Failed to resolve base branch "HEAD"`。

---

## 三、IDEA / PyCharm 图形界面路径

不用记命令也能干完 90% 的事：

| 想做什么 | 路径 |
|---|---|
| 打开版本控制面板 | `Alt+9`（Windows 默认） |
| 看提交历史图 | `Alt+9` → **Log** 标签 |
| 提交 | Commit 工具窗口（`Alt+0`）或 `Ctrl+K` |
| 推送 | `Ctrl+Shift+K` |
| 撤销某个 commit | Log 里右键 → **Revert Commit** |
| 回退到某个 commit | Log 里右键 → **Reset Current Branch to Here** → 选 soft/mixed/hard |
| 摘取某个提交 | Log 里右键 → **Cherry-pick** |
| 可视化变基 | Log 里右键 → **Interactively Rebase from Here** |
| 临时存改动 | 右键文件/变更集 → **Shelve Changes**（取回：Unshelve） |
| 看每行是谁改的 | 行号栏右键 → **Annotate** |
| 解决冲突 | 冲突时自动弹出三向合并界面（左你的 / 右对方的 / 中间结果） |

> 快捷键是 Windows 默认方案，你的 keymap 可能不同。找不到就按 `Ctrl+Shift+A` 搜动作名。

IDEA 的可视化 rebase 和冲突解决界面做得比多数独立 Git 客户端都好——**你不需要装 Fork、SourceTree 或任何额外的 GUI**。

---

## 四、安全红线

1. **`git reset --hard` 会同时丢弃所有未提交的改动，且不可恢复。** 跑之前先 `git status` 确认工作区干净。
2. **已 push 的 commit 不要 reset / amend。** 用 `git revert`。
3. **不要用 `git push --force`**（除非你明确知道在干什么，且分支只有你一个人用）。
4. **不确定就先 `git status`**，它永远不修改任何东西。
5. **出事先查 `git reflog`**，别慌着乱敲。

---

## 五、让 Claude Code 帮你用 Git

你已经有这个工具了，别浪费：

```
git status 输出是这样，我现在是什么状态？下一步该执行什么？
```

```
帮我看一下这次 diff，写一条符合 conventional commits 的 commit message
```

```
我想撤销刚才那个 commit 但保留代码，给我具体命令，并说明每条的风险
```

**但要守住两条边界：**

- **`reset --hard`、`push --force` 这类破坏性命令，让它先解释再执行**，别开自动接受就跑。
- **别让它替你决定要不要 push / 要不要 force push**——那涉及协作，你自己判断。

另外，`git commit` 前让 Claude 帮你写提交信息很划算，但**让它先 `git diff --stat` 确认改动范围**，不然它会编。

---

## 六、学习资源

| 资源 | 用途 |
|---|---|
| **Learn Git Branching**（`learngitbranching.js.org`） | ⭐ 交互式闯关，1 小时搞懂分支模型，首选 |
| **Oh Shit, Git!?!**（`ohshitgit.com`） | 出错了怎么办的对照表，有中文版 |
| **Pro Git 中文版**（`git-scm.com/book/zh`） | 想系统学时的权威参考，前 3 章够用 |
| `git help <命令>` | 本地查任何命令 |

---

## 最后一句

用 AI 写代码的人，Git 不是"版本管理"，是**安全带**：

- AI 改动又快又大 → 你需要**频繁存档**（绿点越密，回滚损失越小）
- AI 会顺手改不该改的地方 → 你只能靠 **diff** 发现
- AI 把代码改乱了 → 处置手段**全建立在 Git 上**，没有绿点就无从回滚

**不会 Git 的 AI 编程，等于没有刹车。**
