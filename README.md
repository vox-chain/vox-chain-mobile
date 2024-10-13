# 📦 FT Hackaton 2024 Monorepo

## ⚠️ Under Construction

This project is currently under active development. Features and documentation are subject to change.

### Dependencies

- [Node.js](https://nodejs.org/en/download/) - JavaScript runtime
- [pnpm](https://pnpm.io/installation) - Fast, disk space efficient package manager

### Commands

- `$ pnpm dev` - Build and watch all **apps** and **packages** for development.
- `$ pnpm lint` - Analyze the source code of all **apps** and **packages** using ESLint.
- `$ pnpm lint-fix` - Fix all fixable warnings for **apps** and **packages** using ESLint.
- `$ pnpm build` - Build all **apps** and **packages** for production or to publish them on npm.

This monorepo uses a simple npm script convention of `dev:<app-name>` and `build:<app-name>` to keep this process simple. Under the hood, it uses [Turborepo's workspace filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering), defined as an npm script in the root [**package.json**](./package.json).

- `$ pnpm dev:mobile` - Build and watch **app/mobile** and all **packages** used in mobile, for development.
- `$ pnpm build:mobile` - Build **apps/mobile** and all **packages** used in mobile, for production deployments

## 📁 Structure

- [`apps`](./apps) - Apps that only use packages and aren't aware of other apps.
- [`packages`](./packages) - Packages that may use external and/or other monorepo packages.

### Apps

- [`apps/mobile`](./apps/mobile) - Expo app using `eslint-config` package.

### Packages

- [`packages/eslint-config`](./packages/eslint-config) - Preconfigured ESLint configuration for each app or package.

<!-- ## 👷 Workflows

- [`build`](./.github/workflows/build.yml) - Starts the EAS builds for **apps/mobile** using the given profile.
- [`preview`](./.github/workflows/preview.yml) - Publishes apps to a PR-specific release channel and adds a QR code to that PR.
- [`test`](./.github/workflows/test.yml) - Ensures that the apps and packages are healthy on multiple OSs.

### Composite workflows

- [`setup-monorepo`](./.github/actions/setup-monorepo/action.yml) - Reusable composite workflow to setup the monorepo in GitHub Actions. -->
