#!/usr/bin/env node
// 全局闸门：
//   PreToolUse(Bash) 拦截不可逆的 git 命令
//   Stop             工作区有改动时跑项目测试，未绿不许收工
const { spawnSync, execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');

let buf = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (d) => (buf += d));
process.stdin.on('end', () => {
  let j = {};
  try {
    j = JSON.parse(buf);
  } catch {}

  try {
    if (j.hook_event_name === 'PreToolUse') process.exit(preToolUse(j));
    if (j.hook_event_name === 'Stop') process.exit(stopGate(j));
  } catch (e) {
    // 闸门自身出错时放行，不能因为它挂掉而卡死工作流
    process.stderr.write(`闸门脚本异常（已放行）：${e.message}\n`);
  }
  process.exit(0);
});

// ---------- 危险命令拦截 ----------
// 只匹配命令位置（行首或 ; && | 之后），避免 echo/文档里的文字被误拦
const CMD = String.raw`(?:^|[\n;&|]+)\s*git\s+`;
const DANGEROUS = [
  { re: new RegExp(CMD + String.raw`reset\s+--hard\b`, 'i'), why: 'git reset --hard 会丢弃所有未提交改动，且不可恢复' },
  { re: new RegExp(CMD + String.raw`clean\b[^\n]*\s-[a-z]*f[a-z]*\b`, 'i'), why: 'git clean -f 会删除未跟踪文件' },
  { re: new RegExp(CMD + String.raw`push\b[^\n]*(--force(?!-with-lease)\b|\s-f\b)`, 'i'), why: 'git push --force 会覆盖远端历史' },
  { re: new RegExp(CMD + String.raw`checkout\s+--\s+\.`, 'i'), why: 'git checkout -- . 会丢弃工作区改动' },
  { re: new RegExp(CMD + String.raw`restore\s+\.(?=\s|$)`, 'i'), why: 'git restore . 会丢弃工作区改动' },
];

function preToolUse(j) {
  if (j.tool_name !== 'Bash') return 0;
  const cmd = String(j.tool_input?.command || '');
  const hit = DANGEROUS.find((d) => d.re.test(cmd));
  if (!hit) return 0;
  process.stderr.write(
    `已拦截：${hit.why}。\n命令：${cmd}\n` +
      `如确认要执行，请让用户手动运行，或临时从 ~/.claude/settings.json 移除 PreToolUse 闸门。\n`
  );
  return 2;
}

// ---------- 收工前测试闸门 ----------
function stopGate(j) {
  if (j.stop_hook_active) return 0; // 已因本闸门续跑，避免死循环
  const cwd = j.cwd || process.cwd();
  const cfg = verifyConfig(cwd);
  if (!cfg) return 0; // 没有可靠测试命令不自动猜，避免误伤

  if (isGitRepo(cwd) && !hasChanges(cwd)) return 0; // 纯问答轮次不跑

  const key = fingerprint(cwd, cfg.command);
  if (key && readState(cwd) === key) return 0; // 同一份改动只验一次

  const started = Date.now();
  const r = spawnSync(cfg.command, {
    cwd,
    shell: true,
    encoding: 'utf8',
    timeout: cfg.timeout * 1000,
    windowsHide: true,
    maxBuffer: 32 * 1024 * 1024,
  });

  if (r.status === 0) {
    if (key) writeState(cwd, key);
    return 0;
  }

  const code = r.status === null ? `超时/${r.error?.code || '未启动'}` : r.status;
  const secs = ((Date.now() - started) / 1000).toFixed(1);
  process.stderr.write(
    `验收闸门未通过：${cfg.command}（退出码 ${code}，耗时 ${secs}s）\n` +
      `${tail((r.stdout || '') + (r.stderr || ''), 30)}\n` +
      `修好并重新跑通测试后再结束本轮。\n`
  );
  return 2;
}

function verifyConfig(cwd) {
  // 1) 项目显式声明：.claude/verify.json { "command": "...", "timeout": 180 }
  const cfgPath = path.join(cwd, '.claude', 'verify.json');
  if (fs.existsSync(cfgPath)) {
    try {
      const c = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
      if (c && typeof c.command === 'string' && c.command.trim()) {
        return { command: c.command, timeout: Math.min(Number(c.timeout) || 180, 600) };
      }
    } catch {}
  }

  // 2) Node 项目：package.json 里有真实 test 脚本
  const pkgPath = path.join(cwd, 'package.json');
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      const t = pkg.scripts && pkg.scripts.test;
      if (t && !/no test specified/i.test(t)) return { command: 'npm test', timeout: 180 };
    } catch {}
  }

  // 3) Python 项目：有 .venv 且存在 tests/ 目录
  const py = path.join(cwd, '.venv', 'Scripts', 'python.exe');
  if (fs.existsSync(py) && fs.existsSync(path.join(cwd, 'tests'))) {
    return { command: `"${py}" -m pytest -q`, timeout: 180 };
  }

  // 其他栈（Maven 等）太慢，交给项目 .claude/verify.json 显式开启
  return null;
}

function isGitRepo(cwd) {
  try {
    return (
      execFileSync('git', ['-C', cwd, 'rev-parse', '--is-inside-work-tree'], {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
        timeout: 3000,
      }).trim() === 'true'
    );
  } catch {
    return false;
  }
}

function hasChanges(cwd) {
  try {
    return (
      execFileSync('git', ['-C', cwd, 'status', '--porcelain'], {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
        timeout: 3000,
      }).trim() !== ''
    );
  } catch {
    return true;
  }
}

function fingerprint(cwd, command) {
  if (!isGitRepo(cwd)) return '';
  try {
    const status = execFileSync('git', ['-C', cwd, 'status', '--porcelain'], {
      encoding: 'utf8',
      timeout: 3000,
    });
    let diff = '';
    try {
      diff = execFileSync('git', ['-C', cwd, 'diff', 'HEAD'], {
        encoding: 'utf8',
        timeout: 8000,
        maxBuffer: 32 * 1024 * 1024,
      });
    } catch {}
    return crypto.createHash('sha1').update(cwd + '\n' + command + '\n' + status + diff).digest('hex');
  } catch {
    return '';
  }
}

function statePath(cwd) {
  const h = crypto.createHash('sha1').update(cwd).digest('hex').slice(0, 12);
  return path.join(os.tmpdir(), `claude-gate-${h}.state`);
}

function readState(cwd) {
  try {
    return fs.readFileSync(statePath(cwd), 'utf8').trim();
  } catch {
    return '';
  }
}

function writeState(cwd, key) {
  try {
    fs.writeFileSync(statePath(cwd), key);
  } catch {}
}

function tail(s, n) {
  const lines = String(s).trimEnd().split(/\r?\n/);
  return lines.slice(-n).join('\n');
}