const assert = require('node:assert/strict');
const test = require('node:test');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { admin, protect } = require('../middleware/authMiddleware');

const invoke = async (middleware, req) => {
  const result = { statusCode: 200, body: undefined, nextCalled: false };
  const res = {
    status(code) {
      result.statusCode = code;
      return this;
    },
    json(body) {
      result.body = body;
      return this;
    },
  };
  await middleware(req, res, () => {
    result.nextCalled = true;
  });
  return result;
};

test('protect rejects requests without a bearer token', async () => {
  const result = await invoke(protect, { headers: {} });

  assert.equal(result.statusCode, 401);
  assert.equal(result.nextCalled, false);
});

test('protect rejects an invalid bearer token', async () => {
  const result = await invoke(protect, {
    headers: { authorization: 'Bearer invalid-token' },
  });

  assert.equal(result.statusCode, 401);
  assert.equal(result.nextCalled, false);
});

test('protect verifies the token and attaches the current user', async () => {
  const originalFindById = User.findById;
  const originalSecret = process.env.JWT_SECRET;
  const user = { _id: 'user-id', role: 'user' };
  process.env.JWT_SECRET = 'test-secret';
  User.findById = () => ({
    select: async () => user,
  });

  try {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const req = { headers: { authorization: `Bearer ${token}` } };
    const result = await invoke(protect, req);

    assert.equal(result.nextCalled, true);
    assert.equal(req.user, user);
  } finally {
    User.findById = originalFindById;
    if (originalSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = originalSecret;
  }
});

test('admin allows administrators and rejects regular users', async () => {
  const administrator = await invoke(admin, { user: { role: 'admin' } });
  const regularUser = await invoke(admin, { user: { role: 'user' } });

  assert.equal(administrator.nextCalled, true);
  assert.equal(regularUser.statusCode, 403);
  assert.equal(regularUser.nextCalled, false);
});
