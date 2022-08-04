module.exports = {
  branches: ['master', 'chore/package'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'docs/CHANGELOG.md',
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: ['package.json', 'docs/CHANGELOG.md'],
      },
    ],
    '@semantic-release/github',
  ],
};
