# Genesis Sync (formerly Loopin) - Project Guidelines

Welcome to the **Genesis Sync** project. To maintain high code quality, consistency, and clear communication across the team during our 9-week development lifecycle, all contributors must strictly adhere to the following guidelines.

---

## 1. Error Logging (`common_errorlogbook.md`)

When initializing or working on the project, a central logbook file named `common_errorlogbook.md` must be maintained at the root of the repository.

### Rules:
* **Record Every Error:** Any non-trivial error, build failure, configuration bug, or integration blocker encountered during development **must** be logged.
* **Document the Solution:** Never log an issue without detailing how it was resolved once fixed. This builds a shared repository of knowledge and prevents team members from wasting time on duplicate issues.

### Required Entry Format:
```markdown
### [YYYY-MM-DD] - Short Error Title

- **Module / Component:** (e.g., Capacitor QR Scanner, Redis Cache, Auth API)
- **Error Description / Stack Trace:**
  ```
  [Paste exact error output or stack trace here]
  ```
- **Root Cause:** Brief explanation of why the issue occurred.
- **Solution / Fix:** Detailed steps, command, or code patch used to resolve the error.
- **Logged By:** [Contributor Name]
```

---

## 2. Commit Message Standards

Vague or short commit messages (such as `fix bug`, `updates`, `wip`, or `fixed issue`) are strictly prohibited. 

### Commit Message Requirements:
* Commit messages must be elaborated, descriptive, and follow the Conventional Commits specification.
* Clearly describe **what** changed, **why** it was changed, and **what modules** were affected.

### Format:
```text
<type>(<scope>): <short summarized description>

- Detailed bullet point explaining key changes made.
- Explanation of why this change was necessary.
- Any breaking changes or dependent PRs to note.
```

### Supported Types:
* `feat`: A new feature added to the app.
* `fix`: A bug fix.
* `docs`: Documentation-only changes.
* `refactor`: Code changes that neither fix a bug nor add a feature.
* `perf`: Code changes that improve performance (e.g., optimizing scan latency).
* `test`: Adding missing tests or correcting existing tests.
* `chore`: Changes to the build process, dependencies, or auxiliary tools.

### Example:
```text
fix(scanner): resolve camera preview freeze on Android target API 33

- Updated native Capacitor Camera plugin permissions check before initializing the camera viewport.
- Handled state cleanup on component unmount to release camera resources properly.
- Resolved scan latency bottleneck to ensure sub-400ms target scanning speed.
```

---

## 3. Mandatory & Detailed Documentation

Documentation is a core requirement, not an afterthought. No pull request (PR) will be merged without corresponding updates to documentation.

### Requirements:
* **Architecture & Features:** If your feature alters user flows or platform contracts, update the relevant documentation files (`features.md`, `execution.md`, or `project_overview.md`).
* **Code Documentation:** All functions, hooks (e.g., `useScanner`), and API routes must include inline TypeScript/JSDoc annotations explaining inputs, outputs, side effects, and edge cases.
* **API Endpoints:** Any new backend endpoint or database schema migration must be documented in the repository before PR approval.

---

## 4. Deadlines & Accountability

* **Strict Milestone Dates:** All tasks, PR submissions, and code reviews must adhere strictly to the schedule established in `roadmap.md`.
* **Timely Submissions:** Ensure code is ready for review well before the milestone cutoff to allow adequate time for QA, testing, and feedback.
* **Blockers:** If you encounter a blocking issue that threatens a deadline, immediately log it in `common_errorlogbook.md` and notify the lead.

---

## Summary Checklist Before Submitting a PR

1. [ ] Code compiles cleanly with zero TypeScript errors or linter warnings.
2. [ ] Any encountered errors and their solutions are documented in `common_errorlogbook.md`.
3. [ ] Commit messages are elaborated and follow the structured format.
4. [ ] Associated documentation (`features.md`, `execution.md`, inline JSDoc) has been updated.
5. [ ] Submissions meet the established timeline requirements.
