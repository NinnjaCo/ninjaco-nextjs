# Commit Message Guidelines

We have very precise rules over how our git commit messages can be formatted. This leads to more readable messages that are easy to follow when looking through the project history.

Commit Message Format
Each commit message consists of a header, a body and a footer. The header has a special format that includes a type, a scope and a subject:

```md
<type>(<scope>): <subject>
```

The `header` is mandatory and the `scope` of the header is optional.

Any line of the commit message cannot be longer 100 characters! This allows the message to be easier to read on GitHub as well as in various git tools.

The footer should contain a closing reference to an issue if any.

## Samples: (even more samples)

docs(changelog): update changelog to beta.5
fix(release): need to depend on latest rxjs and zone.js

## Type

Must be one of the following:

- <strong>`build:`</strong> Changes that affect the build system or external dependencies (example scopes: npm)
- <strong>`ci:`</strong> Changes to our CI configuration files and scripts (example scopes: Github actions)
- <strong>`docs:`</strong> Documentation only changes
- <strong>`feat:`</strong> A new feature
- <strong>`fix:`</strong> A bug fix
- <strong>`perf:`</strong> A code change that improves performance
- <strong>`refactor:`</strong> A code change that neither fixes a bug nor adds a feature
- <strong>`style:`</strong> Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- <strong>`test:`</strong> Adding missing tests or correcting existing tests

## Scope

Use the branch name as the scope

## Subject

The subject contains a succinct description of the change:

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize the first letter
- no dot (.) at the end
