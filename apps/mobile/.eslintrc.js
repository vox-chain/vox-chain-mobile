module.exports = {
  root: true,
  extends: ['@ft-hackathon-2024/eslint-config'],
  ignorePatterns: ['node_modules', 'build', '.expo', '.expo-shared'],
  overrides: [
    {
      files: ['*.js'],
      env: {
        node: true,
      },
    },
  ],
};
