# TactiChess version-control guide

Reviewed against official Git and GitHub documentation on November 2, 2026. Follow this guide together with [Code style](CODE_STYLE.md) and [Running the project](RUNNING.md).

## Our workflow

Use **GitHub Flow**: keep `main` stable, make each focused change on a short-lived branch, and review it through a pull request before merging. This is our project choice for a small static application; no permanent `develop` branch or extra Git tooling is needed. GitHub describes this branch-based workflow and recommends isolated, complete changes. [GitHub Flow](https://docs.github.com/en/get-started/using-github/github-flow)

```text
main → task branch → changes + checks → reviewed commit → push → pull request → merge → main
```

Git records local history. GitHub hosts shared history and pull requests. A commit stays local until pushed; saving a file does not commit it. Git tracks working files, a staging area containing the next snapshot, and committed snapshots. [Recording changes](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository)

## Approval rules for agents

Authorization to edit code or documentation does not authorize Git mutations. Inspect status and diffs freely. Obtain explicit approval before creating/switching branches, staging, committing, pushing, opening a pull request, merging, deleting branches, changing repository settings, or creating release tags. The user can authorize several named actions together; do not request the same approval again.

Before asking for a commit, present the concrete files/hunks to include, proposed message, checks performed, and remaining limitations. Deployment remains a separate approval. A merge or push must not be treated as deployment approval; check whether a connected host automatically deploys that branch before proceeding.

The commands below are instructions for approved work, not actions already performed.

## 1. Inspect and start a task

Run from the repository root:

```powershell
git status --short --branch
git branch --show-current
git diff
git diff --staged
```

Read existing changes before editing. If there is unrelated unfinished work, preserve it and agree how to separate it before switching branches or pulling. Do not automatically discard or stash someone else's work.

With a clean working tree and approval to start a branch:

```powershell
git switch main
git pull --ff-only origin main
git switch -c docs/version-control
```

Replace the branch name with the task, such as `feat/rating-filters`, `fix/preview-focus`, or `refactor/page-navigation`. Keep one purpose per branch. If `--ff-only` fails because history diverged, inspect the history and agree on integration; do not force the update. [Git pull](https://git-scm.com/docs/git-pull)

If Git reports dubious ownership for this known checkout, use the command-scoped prefix already needed locally:

```powershell
git -c safe.directory='C:/Users/ANDREI/Documents/Computer Science Major/TactiChess' status
```

Apply that same `-c` prefix to the other Git commands when needed. Do not disable the check globally or trust every directory.

## 2. Make and validate one complete change

Keep relevant code, focused tests, and necessary documentation together. Separate unrelated formatting or features. The change should be understandable and reversible on its own.

For application changes:

```powershell
npm.cmd test
npm.cmd run build
git diff --check
```

Also check affected browser behavior and responsive layouts. For documentation-only changes, check formatting, links, paths, and command accuracy; a new app build is unnecessary. Report what actually ran, including incomplete visual checks. A successful build alone does not prove the interface works.

## 3. Stage and commit deliberately

After staging approval, name the intended files explicitly. For this documentation task, an example is:

```powershell
git add -- docs/VERSION_CONTROL.md README.md docs/DEVELOPMENT_DOCUMENTATION.md
git diff --staged --stat
git diff --staged
git diff --staged --check
git status --short
```

Review staged additions, deletions, and renames. `git diff` shows unstaged tracked edits; `git diff --staged` shows the proposed commit. Untracked files require their own inspection. Editing a file after staging does not automatically update its staged copy. Avoid blanket staging with `git add .` or bypassing review with `git commit -am`. [Recording changes](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository)

After commit approval:

```powershell
git commit -m "docs: add version-control workflow"
git show --stat --oneline HEAD
git status --short
```

Use a brief action-oriented subject describing the result. Our lightweight message style follows the existing `feat:` history: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, or `build:` followed by a clear description. This is a local convention, not a Git requirement. Avoid messages such as `updates`, `final`, or `fixed stuff`. Explain a non-obvious reason in the commit body when useful.

## 4. Push, review, and merge

After push approval, push the named task branch:

```powershell
git push -u origin docs/version-control
```

Open an approved pull request targeting `main`. Include:

- The problem and resulting behavior.
- Relevant tests/build results and honest limitations.
- Screenshots for visible UI changes.
- Whether frozen exports or dependencies changed, and why.

Use a draft PR for unfinished work. Resolve review feedback and conflicts before merging. Our default recommendation is **Squash and merge** for a focused PR, producing one main-branch commit for the complete change. This is a project preference; GitHub also supports merge commits and rebase merges. [Pull request merges](https://docs.github.com/en/pull-requests/reference/pull-request-merges)

After merge approval and completion, return to `main` with a clean tree and run `git pull --ff-only origin main`. Start the next task from the updated `main`; do not reuse the old squash-merged branch. Branch deletion requires separate approval. Do not bump `package.json` or create a release tag for every commit; release versions are deliberate, validated milestones.

## Files we preserve and exclude

| Track and review                                                                | Keep out of commits                                                  |
| ------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Source, tests, shared configuration, README, and useful project docs            | `node_modules/`, `dist/`, temporary browser profiles and screenshots |
| `package.json` and `package-lock.json` together for approved dependency changes | Secrets, credentials, local environment files, raw research CSVs     |
| The three frozen exports in `public/data/`                                      | Local `AGENTS.md`                                                    |

Run `npm.cmd test` to verify the frozen hashes, 20 themes, 48 rules, 34 pairs, and 506 entries before a related application commit. Never edit metrics, FENs, puzzle links, or metadata to make tests pass. Historical notebook/Drive paths remain unchanged.

Shared exclusions belong in `.gitignore`; local-only exclusions belong in `.git/info/exclude`. Use forward slashes in ignore paths. Ignoring an already tracked file does not untrack it. These are separate decisions. [Git ignore rules](https://git-scm.com/docs/gitignore), [GitHub ignoring guidance](https://docs.github.com/en/get-started/git-basics/ignoring-files)

Before staging, ensure `AGENTS.md` is listed in local `.git/info/exclude` as required by the local instructions, then verify:

```powershell
git check-ignore -v AGENTS.md
git ls-files -- AGENTS.md
```

The first should identify an ignore rule; the second should print nothing. Current repository finding: the handoff is tracked despite an ignore entry. Preserve its tracking until an explicit decision is made; do not run `git rm --cached` as incidental cleanup. This guide does not change any ignore rules or tracked files.

## Recover without losing work

To unstage a reviewed file while retaining its working copy, after authorization:

```powershell
git restore --staged -- README.md
```

Plain `git restore` without `--staged` can overwrite working edits; it is not equivalent to unstaging. [Git restore](https://git-scm.com/docs/git-restore)

For a faulty shared commit, prefer an approved revert on a new task branch and review it like any other change. `git revert` creates a new commit reversing the selected commit, preserving shared history. Merge-commit reverts need additional care. [Git revert](https://git-scm.com/docs/git-revert)

When conflicts occur, read both sides, resolve the intended behavior, and rerun affected checks before staging the resolution. Never blindly select all of one side. Do not use `reset --hard`, `clean -fd`, force pushes, or rewriting shared commits as routine recovery.

## Recommended GitHub safeguards

When the owner approves repository settings changes, protect `main`: require PRs, block force pushes and deletion, and require existing automated checks. Add required human review when another reviewer is available. Do not require a check that does not exist. Protection availability depends on the repository visibility and GitHub plan; this repository's remote settings have not been audited or changed. [Protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)

For a solo project, manually review the complete diff and validation record before merging; do not claim independent review. Automated CI, branch protection, hooks, release automation, and deployment remain proposed follow-up work requiring their own approval.
