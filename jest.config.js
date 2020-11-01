module.exports = {
  clearMocks: true,
  verbose: true,
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  roots: ['test/'],
  setupFilesAfterEnv: ['./jest.setup.js'],
};
