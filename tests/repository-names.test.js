// Tests for repository naming conventions
const VALID_NAME_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const MAX_NAME_LENGTH = 100;

function validateRepositoryName(name) {
  if (!name || typeof name !== 'string') {
    return { valid: false, error: 'Name must be a non-empty string' };
  }
  if (name.length > MAX_NAME_LENGTH) {
    return { valid: false, error: `Name exceeds maximum length of ${MAX_NAME_LENGTH}` };
  }
  if (name.startsWith('-') || name.endsWith('-')) {
    return { valid: false, error: 'Name cannot start or end with a hyphen' };
  }
  if (!VALID_NAME_PATTERN.test(name)) {
    return { valid: false, error: 'Name must be lowercase alphanumeric with optional hyphens' };
  }
  return { valid: true };
}

// ── Test runner ───────────────────────────────────────────────────────────────
let passed = 0;
let failed = 0;

function test(description, fn) {
  try {
    fn();
    console.log(`  ✓ ${description}`);
    passed++;
  } catch (e) {
    console.error(`  ✗ ${description}`);
    console.error(`    ${e.message}`);
    failed++;
  }
}

function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
      }
    },
    toEqual(expected) {
      const a = JSON.stringify(actual);
      const b = JSON.stringify(expected);
      if (a !== b) throw new Error(`Expected ${b}, got ${a}`);
    },
  };
}

// ── Valid names ───────────────────────────────────────────────────────────────
console.log('\nValid repository names:');

test('accepts simple lowercase name', () => {
  expect(validateRepositoryName('myrepo').valid).toBe(true);
});

test('accepts name with hyphens', () => {
  expect(validateRepositoryName('my-cool-repo').valid).toBe(true);
});

test('accepts name with numbers', () => {
  expect(validateRepositoryName('repo123').valid).toBe(true);
});

test('accepts name with hyphens and numbers', () => {
  expect(validateRepositoryName('ai-chatbot-v2').valid).toBe(true);
});

test('accepts single character name', () => {
  expect(validateRepositoryName('a').valid).toBe(true);
});

// ── Invalid names ─────────────────────────────────────────────────────────────
console.log('\nInvalid repository names:');

test('rejects empty string', () => {
  expect(validateRepositoryName('').valid).toBe(false);
});

test('rejects null', () => {
  expect(validateRepositoryName(null).valid).toBe(false);
});

test('rejects uppercase letters', () => {
  expect(validateRepositoryName('MyRepo').valid).toBe(false);
});

test('rejects spaces', () => {
  expect(validateRepositoryName('my repo').valid).toBe(false);
});

test('rejects underscores', () => {
  expect(validateRepositoryName('my_repo').valid).toBe(false);
});

test('rejects leading hyphen', () => {
  expect(validateRepositoryName('-myrepo').valid).toBe(false);
});

test('rejects trailing hyphen', () => {
  expect(validateRepositoryName('myrepo-').valid).toBe(false);
});

test('rejects name exceeding max length', () => {
  const longName = 'a'.repeat(MAX_NAME_LENGTH + 1);
  expect(validateRepositoryName(longName).valid).toBe(false);
});

test('rejects special characters', () => {
  expect(validateRepositoryName('my.repo').valid).toBe(false);
});

// ── Error messages ────────────────────────────────────────────────────────────
console.log('\nError messages:');

test('returns correct error for null input', () => {
  expect(validateRepositoryName(null).error).toBe('Name must be a non-empty string');
});

test('returns correct error for leading hyphen', () => {
  expect(validateRepositoryName('-bad').error).toBe('Name cannot start or end with a hyphen');
});

test('returns correct error for uppercase', () => {
  expect(validateRepositoryName('BadName').error).toBe('Name must be lowercase alphanumeric with optional hyphens');
});

// ── Summary ───────────────────────────────────────────────────────────────────
console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
