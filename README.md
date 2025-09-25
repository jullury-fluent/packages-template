# EquiSafe Packages Templates

This repository contains template configurations and base setups for EquiSafe packages. It provides a standardized foundation for creating new packages within the EquiSafe ecosystem.

## Features

- TypeScript configuration
- ESLint and Prettier setup for code quality
- Jest testing framework
- Automated release process with semantic-release

## Dependency Profiles

Use this repository as the source of truth for backend packages. Opt into the frontend tooling only when you are building a React or Next.js package.

| Profile                                      | Keep by default                                                                                                       | Add / Remove guidance                                                                                                                                                                                                                                                                 |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Backend (Node libraries, CLIs, services)** | Core dev dependencies already listed in `package.json` such as `eslint`, `typescript`, `jest`, `@typescript-eslint/*` | **Remove** frontend-only lint tooling if it was previously added: `@next/eslint-plugin-next`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y`, `eslint-plugin-testing-library`, `eslint-plugin-jest-dom`. Delete `eslint.frontend.config.mjs` if unused. |
| **Frontend (React / Next.js packages)**      | All backend defaults plus the frontend stack                                                                          | **Add** the frontend lint dependencies above via `pnpm add -D ...` (already included in this template). Use the dedicated lint config `eslint.frontend.config.mjs` when linting UI code.                                                                                              |

### Frontend lint workflow

- Run `pnpm eslint --config eslint.frontend.config.mjs --ext .js,.jsx,.ts,.tsx src` for React/Next projects.
- For backend-only projects, keep using the default command `pnpm lint`, which reads `eslint.config.mjs`.

## Configuration Overview

- `tsconfig.json` – Base TypeScript settings for libraries and Node-targeted packages.
- `tsconfig.app.json` – Strict TypeScript profile for application-style bundles; opt in when you need browser-oriented output.
- `tsup.config.ts` – Build pipeline powered by `tsup`, configured for dual ESM/CJS output, DTS generation, and watch-aware caching.
- `eslint.config.mjs` – Default flat ESLint configuration with strict TypeScript rules for backend packages.
- `eslint.frontend.config.mjs` – Optional React/Next flat ESLint profile. Install the frontend lint dependencies listed in the table above before using it.
- `jest.config.js` – Jest setup targeting Node with optional `jsdom` environment for UI tests.
- `.releaserc.js` – Semantic-release configuration for automated changelog, npm (GitHub Packages) publishing, and GitHub releases.
- `.husky/` – Git hooks enforcing commit linting and other checks.

## Getting Started

### Prerequisites

- Node.js >= 22.0.0
- PNPM 10.17.1 or higher

### Installation

```bash
pnpm install
```

### Development

```bash
# Run tests
pnpm test

# Build the package
pnpm build

# Lint code
pnpm lint

# Format code
pnpm format
```

### Conventional Commits

This project uses [Conventional Commits](https://www.conventionalcommits.org/) for standardized commit messages. We've set up Commitizen to help you create properly formatted commit messages.

#### Setup Git Alias (Recommended)

Run the following command to set up a Git alias for Commitizen:

```bash
pnpm setup-git-aliases
```

After running this command, you can use:

- `git cz` - Shorthand for using Commitizen to create conventional commits

#### Alternative: Using npm/pnpm scripts

If you prefer not to modify your Git aliases, you can use:

```bash
pnpm commit
```

## Project Structure

- `src/` – Library source files.
- `tests/` – Unit and integration tests (Jest).
- `dist/` – Generated build artifacts (gitignored).
- `.github/workflows/` – Release automation pipeline configuration.
- `.husky/` – Local Git hooks (`pre-commit`, `commit-msg`).
- `eslint.config.mjs` – Default lint rules for backend packages.
- `eslint.frontend.config.mjs` – Frontend lint rules (only keep when building React/Next projects).
- `tsconfig.json`, `tsconfig.app.json` – Shared and application TypeScript compiler options.
- `tsup.config.ts` – Build bundler settings.
- `jest.config.js` – Jest runner configuration.
- `.releaserc.js` – Semantic-release setup.

## Versioning and Releases

This project uses automated semantic versioning. See [VERSIONING.md](./VERSIONING.md) for detailed information about the versioning and release process.

## License

UNLICENSED - See the [LICENSE](./LICENSE) file for details.
