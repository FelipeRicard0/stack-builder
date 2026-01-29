# Contributing to this project

Thank you for considering contributing! To keep a clean and organized workflow, follow the guidelines below:

## 1. Git Flow

We use the GitFlow model. Follow this flow:

- `main`: production code.
- `develop`: base for development.
- Create branches from `develop`:
  - `feature/feature-name`
  - `bugfix/bug-name`

After finishing the task:

- Send a _pull request_ to `develop`.
- Do not send changes directly to `main`.

## 2. Conventional Commits

Use the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) standard:

Examples:

- `feat(login): add authentication with JWT`
- `fix(api): fix 500 error when creating user`
- `docs(readme): update usage instructions`

Most common types:

- `feat`: new feature
- `fix`: bug fix
- `docs`: documentation
- `style`: formatting (no code changes)
- `refactor`: refactor without behavior change
- `test`: add/fix tests
- `chore`: build tasks, configs, etc.

## 3. How to Contribute

1. **Fork** the repository.
2. Make sure you are on the `develop` branch.
3. Create a **branch** (`git checkout -b feature/feature-name`).
4. Make your changes and **commit** using the [Conventional Commits](#2-conventional-commits) standard.
5. **Push** to your branch (`git push origin feature/feature-name`).
6. Create a **Pull Request** to `develop`.

## 4. Code Rules

- Follow the project's style.
- Keep the code clean and organized.
- Comment complex parts.
- Write tests whenever possible.

## 5. Reporting Issues

Use the [**Issues**](https://github.com/FelipeRicard0/stack-builder/issues) tab to report bugs, suggest improvements, or ask questions.

## 6. Code of Conduct

Be respectful to everyone. See the [`CODE_OF_CONDUCT`](https://github.com/FelipeRicard0/stack-builder/blob/main/CODE_OF_CONDUCT.md) file for more information.

---

Any questions? Open an [_issue_](https://github.com/FelipeRicard0/stack-builder/issues/new/choose) and let’s talk! 🚀
