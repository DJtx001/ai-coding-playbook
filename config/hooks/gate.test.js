#!/usr/bin/env node
// 自检：node ~/.claude/hooks/gate.test.js
const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const assert = require('assert');

const hook = path.join(__dirname, 'gate.js');

function run(event) {
  const r = spawnSync(process.execPath, [hook], { input: JSON.stringify(event), encoding: 'utf8' });
  return { code: r.status, err: r.stderr };
}

function pre(command) {
  return run({ hook_event_name: 'PreToolUse', tool_name: 'Bash', tool_input: { command } });
}

// PreToolUse：危险命令拦截、安全命令放行
for (const c of [
  'git reset --hard HEAD~1',
  'git clean -fd',
  'git push --force origin main',
  'git push -f origin main',
  'git restore .',
  'git checkout -- .',
]) {
  assert.strictEqual(pre(c).code, 2, `应拦截: ${c}`);
}
for (const c of ['git status', 'git push --force-with-lease', 'echo "git reset --hard"', 'git log']) {
  assert.strictEqual(pre(c).code, 0, `应放行: ${c}`);
}

// Stop：干净跳过 / 脏且失败拦截 / stop_hook_active 放行 / 脏且通过放行
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gate-test-'));
try {
  fs.writeFileSync(
    path.join(dir, 'package.json'),
    JSON.stringify({
      name: 'gate-test',
      private: true,
      scripts: { test: `node -e "process.exit(require('fs').existsSync('FAIL')?1:0)"` },
    })
  );
  fs.writeFileSync(path.join(dir, 'app.txt'), 'hello');
  const git = (args) => spawnSync('git', ['-C', dir, ...args], { encoding: 'utf8' });
  git(['init', '-q']);
  git(['config', 'user.email', 't@t']);
  git(['config', 'user.name', 't']);
  git(['add', '.']);
  git(['commit', '-qm', 'init']);

  const stop = (active = false) => run({ hook_event_name: 'Stop', cwd: dir, stop_hook_active: active });
  assert.strictEqual(stop().code, 0, '干净仓库应跳过测试');

  fs.writeFileSync(path.join(dir, 'FAIL'), '');
  assert.strictEqual(stop().code, 2, '测试失败应拦截收工');
  assert.strictEqual(stop(true).code, 0, 'stop_hook_active 应放行');

  fs.unlinkSync(path.join(dir, 'FAIL'));
  fs.appendFileSync(path.join(dir, 'app.txt'), 'world');
  assert.strictEqual(stop().code, 0, '测试通过应放行');

  console.log('gate.js 自检全部通过');
} finally {
  fs.rmSync(dir, { recursive: true, force: true });
}