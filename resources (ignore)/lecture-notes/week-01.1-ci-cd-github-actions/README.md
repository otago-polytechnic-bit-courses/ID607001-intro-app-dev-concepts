# Week 01 - CI/CD and GitHub Actions

## Navigation

|                  | Link                                                                                                 |
| ---------------- | ---------------------------------------------------------------------------------------------------- |
| GitHub Classroom | [ID608001-S2-26]()                                            |
| → Next           | [Week 02 - APIs, Express and Development Tools](../week-02-apis-express-development-tools/README.md) |

---

## Before We Start

Open your repository in Visual Studio Code and switch to the Week 07 branch:

```bash
git checkout -b w01-ci-cd-gh-actions
```

Set up your development environment (Docker, environment variables, etc.) before continuing.

> **Tip:** Typing the code examples rather than copy-pasting is strongly recommended. Read the comments in the code too - they help explain where and why things go.

---

## Hard Exercises

These exercises require independent research and problem-solving. Completing them deepens your understanding and supports higher marks in the Project assessment.

---

### Hard Task 1 - Semantic Release

Automate versioning and changelog generation using `semantic-release`. When commits follow the **Conventional Commits** format (`feat:`, `fix:`, `chore:`, etc.), `semantic-release` automatically determines the next version number, creates a GitHub Release, and updates `CHANGELOG.md`.

Install:

```bash
npm install semantic-release @semantic-release/changelog @semantic-release/git --save-dev
```

Create `.releaserc.json`:

```json
{
  "branches": ["main"],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    "@semantic-release/npm",
    "@semantic-release/git"
  ]
}
```

Create `.github/workflows/release.yml` that runs `semantic-release` on every push to `main`. Use `secrets.GITHUB_TOKEN` - this is automatically provided by GitHub, no setup needed.

📖 Reference: [semantic-release docs](https://semantic-release.gitbook.io/semantic-release/)

---

### Hard Task 2 - Scheduled Security Audit

Extend your security audit workflow to also run on a **weekly schedule** using cron syntax, in addition to running on push to `main`.

Use [crontab.guru](https://crontab.guru) to construct an expression that runs every Monday at 9am UTC.

📖 Reference: [GitHub Docs - Scheduled events](https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows#schedule)

---

## README

Update the `README.md` in your repository to document any workflows added this week. Include the workflow status badge and any other relevant information for developers contributing to the project.
