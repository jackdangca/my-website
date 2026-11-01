const assert = require('node:assert/strict');
const test = require('node:test');
const Project = require('../models/Project');
const { registerUser } = require('../controllers/authController');
const userRoutes = require('../routes/userRoutes');

test('project schema requires a completion date', () => {
  const completionDatePath = Project.schema.path('completionDate');
  assert.equal(completionDatePath.instance, 'Date');
  assert.equal(completionDatePath.isRequired, true);

  const project = new Project({
    id: 'schema-check',
    title: 'Schema check',
    image: '/schema-check.png',
    alt: 'Schema check image',
    role: 'Test',
    description: 'Project schema validation check',
    techStack: ['Node.js'],
    outcome: 'Completion date is enforced',
  });
  assert.match(project.validateSync().errors.completionDate.message, /completion date is required/i);
});

test('POST /api/users is public and delegates to regular-user registration', () => {
  const postIndex = userRoutes.stack.findIndex(
    (layer) => layer.route?.path === '/' && layer.route.methods.post,
  );
  const authMiddlewareIndex = userRoutes.stack.findIndex((layer) => !layer.route);

  assert.notEqual(postIndex, -1);
  assert.ok(postIndex < authMiddlewareIndex, 'registration must be mounted before protect');
  assert.equal(
    userRoutes.stack[postIndex].route.stack.at(-1).handle,
    registerUser,
  );
});
