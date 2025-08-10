# Publishing Guide

This document outlines the automated publishing process for the PopNext package using semantic versioning and conventional commits.

## Package States

- **0.x.x versions**: Pre-release, not production-ready
- **Empty keywords**: Reduces discoverability during alpha phase
- **Description disclaimer**: Warns users about work-in-progress status

## Automated Release Process

### Overview

The package now uses **semantic-release** for automated versioning, changelog generation, and publishing based on conventional commit messages.

### Workflow

1. **Make Changes** → 2. **Commit with Conventional Format** → 3. **Push to Master** → 4. **Automatic Release**

## Commit Message Format

### Using Commitizen (Recommended)

Interactive prompts guide you through creating proper conventional commits:

```bash
# Install dependencies first
pnpm install

# Use interactive commit tool
pnpm run commit
```

This opens guided prompts for:

- **Type**: feat, fix, docs, style, refactor, test, chore
- **Scope**: Optional (e.g., auth, db, middleware)
- **Description**: Brief description of changes
- **Breaking changes**: If applicable

### Manual Commit Format

If you prefer manual commits, follow this format:

```bash
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Examples:**

```bash
git commit -m "feat: add new authentication middleware"
git commit -m "fix: resolve database connection timeout"
git commit -m "docs: update API documentation"
git commit -m "feat!: redesign auth system (BREAKING CHANGE)"
```

## Version Bumping Rules

Semantic-release automatically determines version bumps based on commit types:

| Commit Type                 | Version Bump | Example       |
| --------------------------- | ------------ | ------------- |
| `feat:`                     | **Minor**    | 0.1.0 → 0.2.0 |
| `fix:`                      | **Patch**    | 0.1.0 → 0.1.1 |
| `BREAKING CHANGE:` or `!`   | **Major**    | 0.1.0 → 1.0.0 |
| `docs:`, `style:`, `chore:` | **None**     | No release    |

## Release Branches

### Master Branch (Production)

- **Trigger**: Push to `master`
- **Result**: Full release with version bump
- **Changelog**: Automatically updated
- **NPM**: Published with `latest` tag

### Beta Branch (Pre-release)

- **Trigger**: Push to `beta`
- **Result**: Pre-release version (e.g., 0.1.0-beta.1)
- **NPM**: Published with `beta` tag

## Automatic Release Process

When you push to `master`, the CI/CD pipeline automatically:

1. ✅ **Runs Tests**: Lint, TypeScript check, build
2. 🔍 **Analyzes Commits**: Determines version bump needed
3. 📝 **Updates Changelog**: Generates release notes
4. 🏷️ **Creates Git Tag**: Tags the release
5. 📦 **Publishes to NPM**: Publishes with appropriate tag
6. 🎉 **Creates GitHub Release**: With generated notes

## Development Workflow

### Daily Development

1. **Make Changes**

   ```bash
   # Make your code changes
   pnpm run lint:fix
   pnpm run prettier:fix
   pnpm run ts:check
   ```

2. **Commit with Conventional Format**

   ```bash
   # Interactive (recommended)
   pnpm run commit

   # Or manual
   git commit -m "feat: add new user authentication"
   ```

3. **Push to Trigger Release**
   ```bash
   git push origin master    # Triggers automatic release
   git push origin beta      # Triggers pre-release
   ```

## Manual Release (Emergency Only)

If you need to bypass automation:

```bash
# Manual release (not recommended)
pnpm run release
```

## User Installation

### For End Users

```bash
# Install latest stable version
npm install popnext

# Install beta version (during alpha phase)
npm install popnext@beta

# Install specific version
npm install popnext@0.1.0
```

## Package Configuration

### Current Settings

- **Access**: Public (`publishConfig.access: "public"`)
- **Files**: `dist/`, `README.md`, `LICENSE`, `CHANGELOG.md`
- **Entry Points**: Multiple exports for modular usage
- **Auto-generated**: Version, changelog, git tags

### Alpha Phase Strategy

- Keywords remain empty (reduces discoverability)
- Description includes disclaimer
- Version stays 0.x.x until production-ready
- Automated releases ensure consistency

## Transitioning to Production

When ready for v1.0.0:

1. **Update Package Metadata**

   ```json
   {
     "description": "A opinionated but minimal Next.js utilities library",
     "keywords": ["nextjs", "react", "typescript", "utilities"]
   }
   ```

2. **Create Breaking Change Commit**

   ```bash
   git commit -m "feat!: stable v1.0.0 API (BREAKING CHANGE)"
   ```

3. **Push to Master**
   - Automatic major version bump to 1.0.0
   - Published with `latest` tag
   - Full production release

## Troubleshooting

### Release Not Triggered

- Check commit message format follows conventional commits
- Ensure push is to `master` or `beta` branch
- Verify GitHub Actions are enabled

### Build Failures

- All linting and type checks must pass
- Check `.github/workflows/build.yml` logs
- Fix issues and push again

## Quick Reference

| Action             | Command                   |
| ------------------ | ------------------------- |
| Interactive commit | `pnpm run commit`         |
| Manual release     | `pnpm run release`        |
| Check formatting   | `pnpm run prettier:check` |
| Fix formatting     | `pnpm run prettier:fix`   |
| Type check         | `pnpm run ts:check`       |
| Build              | `pnpm run build`          |

## Benefits of New System

✅ **Consistency**: Standardized commit messages and releases  
✅ **Automation**: No manual version bumping or changelog writing  
✅ **Quality**: Automated checks before every release  
✅ **Transparency**: Generated changelogs and release notes  
✅ **Rollback Safety**: Git tags for every release
