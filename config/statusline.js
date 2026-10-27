#!/usr/bin/env node
// Claude Code 状态栏：模型 | 所在目录 | git 分支 | 上下文用量
const { execFileSync } = require('child_process');

let buf = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (d) => (buf += d));
process.stdin.on('end', () => {
  let j = {};
  try {
    j = JSON.parse(buf);
  } catch {}

  const cwd = j.workspace?.current_dir || j.cwd || process.cwd();
  const model = j.model?.display_name || j.model?.id || '?';

  // 目录：家目录缩写为 ~
  const home = (process.env.USERPROFILE || process.env.HOME || '').replace(/\\/g, '/').replace(/\/+$/, '');
  let dir = cwd.replace(/\\/g, '/');
  if (home && dir === home) dir = '~';
  else if (home && dir.startsWith(home + '/')) dir = '~' + dir.slice(home.length);

  // git 分支：非仓库或 detached HEAD 时为空，自动隐藏
  let branch = '';
  try {
    branch = execFileSync('git', ['-C', cwd, 'branch', '--show-current'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      timeout: 500,
    }).trim();
  } catch {}

  // 上下文用量：Claude Code 直接提供百分比
  const cw = j.context_window;
  const pct = Math.round(cw?.used_percentage ?? 0);
  const ctxColor = pct >= 80 ? '31' : pct >= 50 ? '33' : '32';

  const parts = [
    `\x1b[36m${model}\x1b[0m`,
    `\x1b[2m${dir}\x1b[0m`,
    branch && `\x1b[35m(${branch})\x1b[0m`,
    cw?.context_window_size && `\x1b[${ctxColor}mctx ${pct}%\x1b[0m`,
  ].filter(Boolean);

  process.stdout.write(parts.join(' \x1b[2m|\x1b[0m '));
});