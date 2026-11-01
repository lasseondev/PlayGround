# OMGithub Agent Instructions

## Repository Overview

This repository contains a 2D RTS game inspired by Warcraft with three unique races: Human, Orc, and Undead. The game is built using modern web technologies and the OMGithub/OpenCode platform.

## Process Lifecycle

- Run long-lived servers and watchers in a persistent session such as tmux.
- Do not background them in bounded commands without explicit detachment and cleanup.
- After a timeout, inspect the process and endpoint before retrying or claiming failure.

## Linux browser and WebGPU capture

- Use the preinstalled `playwright-cli` executable from Actions or SSH.
- Use its headed Chromium, persistent Xvfb display, and SwiftShader configuration.
- Run `playwright-cli open http://localhost:3002` for the Pascal development server.
- Load a saved scene. Wait for actual geometry and the active WebGPU renderer.
- Run `playwright-cli screenshot --filename=screenshots/linux.png` after creating the output directory.
- Inspect the image. Reject loading screens, empty grids, and blank canvases.
- Report SwiftShader as CPU software rendering. Do not claim GPU hardware acceleration.
- Inspect `$HOME/.local/share/omgithub-playwright/linux.json` for launch settings.
- Use `playwright-cli --help` for commands and named sessions. Pass configuration only to `open`.

## Mobile browser games

- Support Android and iOS phones and tablets with responsive layouts and usable touch controls.
- Keep gameplay and controls visible within safe areas and avoid browser gesture conflicts.
- Add tilt controls only when appropriate; offer touch alternatives and request iOS motion permission from a user gesture when needed.
- Follow explicit device and control requirements in the user request.

## Technical Guidelines

### Code Quality

- Follow consistent coding style across all files
- Use meaningful variable and function names
- Add appropriate comments and documentation
- Implement error handling and logging
- Ensure code is modular and maintainable

### Performance

- Optimize rendering performance with efficient game loops
- Implement efficient collision detection and spatial partitioning
- Use resource management for textures and audio
- Implement proper garbage collection

### User Experience

- Create intuitive UI with clear feedback
- Implement responsive design for mobile and desktop
- Add accessibility features where appropriate
- Include loading screens and progress indicators

## Skills Usage

### Available Skills

This repository can leverage various OpenCode skills:

- **`gauntlet-loop`**: Use for iterative development with quality bars and critical testing
- **`opencode-zen-completions`**: For complex coding tasks and implementation
- **`load-sketchfab-threejs`**: If 3D assets are needed for the game
- **`mcp-duckgo`**: For web search and research
- **`image-search`**: For acquiring game assets and sprites

### Skill Selection Criteria

- Use `gauntlet-loop` when you need to build with a concrete quality bar and iterate until it beats your standard
- Use `opencode-zen-completions` for complex implementation tasks that need external AI assistance
- Use `load-sketchfab-threejs` when you need 3D models or assets
- Use `mcp-duckgo` and `image-search` for research and asset acquisition

## Development Workflow

### Local Development

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Build for production: `npm run build`
4. Run tests: `npm test`
5. Verify build: `npm run verify`

### OMGithub Workflow

1. Create a GitHub issue with the `OpenCode` label
2. The OMGithub workflow will:
   - Check out your repository and skills
   - Run build.md using the selected skills
   - Run verify.md for verification
   - Start a local app for testing
   - Create a public preview URL
   - Commit and push an `opencode/<run-id>` branch

### Iteration

For complex development tasks, use the `gauntlet-loop` skill:

1. Define a concrete quality bar
2. Split work into small, judgeable pieces
3. Run a builder and separate harsh critic on each
4. Compare blind against the bar
5. Loop until it wins

## Verification

### Local Validation

- Run `actionlint .github/workflows/opencode.yml` to validate workflow
- Run `git diff --check` to ensure no whitespace errors
- Run tests regularly to catch regressions

### OMGithub Verification

The workflow includes multiple verification steps:

1. **Build Verification**: Checks for essential files and functionality
2. **Gameplay Verification**: Validates core game functionality
3. **Public App Verification**: Tests in actual browser environment
4. **Completion Report**: Generates detailed verification report

### Common Issues and Solutions

| Problem | What to check |
|---------|---------------|
| The workflow did not start | Confirm the `OpenCode` label is applied to the issue. |
| A skill was not selected | Add a matching `skill/<name>` label. |
| The app URL is missing | Check the local app verification step and runner log. |
| The PR was not created | Confirm OpenCode produced a diff and the workflow reached the PR step. |
| The workflow ran unexpectedly | Tighten the trigger condition and trusted-user policy. |

## Contributing

### Adding Skills

1. Create skill files in `.agents/skills/` with `SKILL.md` documentation
2. Ensure skills follow the OpenCode skill specification
3. Test skills locally before adding to the workflow

### Improving Workflows

1. Add verification scripts and tests
2. Update AGENTS.md with new guidelines
3. Document best practices and patterns
4. Create examples and templates

### Game Development

1. Follow the existing code structure and patterns
2. Use the available skills for asset acquisition and implementation
3. Run verification frequently during development
4. Test on both desktop and mobile browsers

## Links in handoffs

When a relevant URL or stable identifier exists, include a clickable Markdown link in the user-facing response. Link GitHub issues, Actions runs, pull requests, commits, releases, public app URLs, and Codex tasks/threads rather than reporting only their numbers or plain text. For Codex tasks/threads, use the `codex://threads/<thread-id>` URL format.

When mentioning a commit, append its relative age in hours or days.

## OpenCode GitHub Actions

To execute an issue, create it with `OpenCode` and only mode labels explicitly requested by the user.

Check for a native `issues` run and successful preparation.
The workflow starts a temporary AgentsWeb SSH session,
verifies it, runs OpenCode, and cleans up the SSH session afterward.

When monitoring a triggered run, use `gh run watch <run-id> --repo denaidark/OhMyGithub --exit-status` for overall job status.
Do not use `gh run view --log` to read logs from a running task: GitHub reports that
logs are unavailable until completion. Use `bash scripts/ssh-run-log.sh <run-id>`
for the live Actions log over SSH. Do not use tight `for` loops around `gh run list`,
which needlessly consume GitHub API rate limit.

Free OpenCode models are limited per egress IP, not per account.
Treat a local `FreeUsageLimitError` 429 as local only.
Read the runner's own `Selected model` and provider errors before blaming quota.
Use `retryAfterMs` as the reset bound.
Run repeated V2 tests with a connected provider; do not spend the free allowance on retries.

Interrupting a V2 turn before the assistant message projects leaves no stopped message to save.
Wait for that assistant message before requiring the interrupted idle marker.

To connect to an issue's live worker, find its run ID with
`gh run list --repo denaidark/OhMyGithub --workflow opencode.yml --status in_progress`,
then run `bash scripts/ssh-run-log.sh <run-id>` to discover the host and port and SSH
with `~/.ssh/aiplay-agentsweb` as shown by the helper.

When the user asks to check a live OpenCode workflow, always pull the runner logs
over SSH first, using `scripts/ssh-run-log.sh` or a targeted SSH read from the
same runner. Base the answer on those logs before discussing whether an action
is confirmed; do not lead with a generic inability-to-confirm statement when
live log evidence can be collected.

For real-time inspection from a live temporary SSH session, use the helper:

```sh
bash scripts/ssh-run-log.sh <run-id>
```

The helper discovers the temporary SSH command from the triggering issue or pull
request, then follows the freshest `_diag/pages` log. The runner uploads chunks from
`_diag/blocks` to GitHub. Do not print environment files, tokens, or private keys while
inspecting a worker.

## Mac SSH access

The Mac private key stays at `~/.ssh/aiplay-agentsweb`. Its public key is
stored in the repository Actions secret `AGENTSWEB_SSH_PUBLIC_KEY`. The issue
commented by the workflow contains a directly usable command such as:

```sh
ssh -i ~/.ssh/aiplay-agentsweb -p <port> runner@<run-name>.agentsweb.space
```

The command works only while the corresponding Actions job is running.

## Connecting to a live OpenCode worker

Use the repository helper to discover the worker host and port from the broker
or issue comment. It uses the persistent local key `~/.ssh/aiplay-agentsweb`:

```sh
bash scripts/ssh-run-log.sh <run-id> --repo denaidark/OhMyGithub
```

For an interactive shell, reuse the host and port printed by the helper and
use the same key:

```sh
ssh -tt -o StrictHostKeyChecking=no \
  -o UserKnownHostsFile=/dev/null \
  -i ~/.ssh/aiplay-agentsweb \
  -p <port> runner@<run-name>.agentsweb.space
```

Do not substitute the generated runner key under `sshworker/outputs/keys/`; it
can produce a misleading `Permission denied (publickey)` result. Temporary
worker SSH access ends when the Actions job and session are cleaned up. Never
print secrets while inspecting a worker.

## Compliance

Do not implement, suggest, report, or propose security issues unless the user explicitly asks for a security review.
Inspect the OpenCode implementation at `/Users/igor/Documents/ChatGPT/opencode` and [anomalyco/opencode](https://github.com/anomalyco/opencode) for related requests.

## Wiki index

- [OpenCode workflow](wiki/opencode.md) — 📖 Workflow and session notes
- [Test OpenCode execution](wiki/opencode-v2-experiment.md) — 🧪 Verification guidance
- [Oh My Github App](https://github.com/denaidark/omsite/blob/main/wiki/oh-my-github-app.md) — 🤖 App documentation
- [Temporary Mac SSH access](wiki/access.md) — 🔑 SSH access guide
- [Testing and verification](wiki/testing.md) — 🧪 Testing guidelines
- [OmGithub publishing](https://github.com/denaidark/omsite/blob/main/wiki/omgithub.md) — 🌍 Publishing documentation

## Links in handoffs

When a relevant URL or stable identifier exists, include a clickable Markdown link in the user-facing response. Link GitHub issues, Actions runs, pull requests, commits, releases, public app URLs, and Codex tasks/threads rather than reporting only their numbers or plain text. For Codex tasks/threads, use the `codex://threads/<thread-id>` URL format.

When mentioning a commit, append its relative age in hours or days.

## Summary

This OMGithub repository contains the foundation for a 2D RTS game inspired by Warcraft with three unique races: Human, Orc, and Undead. The project is structured to leverage the OMGithub/OpenCode platform for automated development, testing, and deployment.

### Key Features

1. **Game Architecture**: Modular, object-oriented design with clear separation of concerns
2. **Core Systems**: Game engine, input management, resource management, UI, audio, and map systems
3. **Race Implementation**: Three distinct races with unique units, buildings, and abilities
4. **Game Mechanics**: Resource gathering, unit production, combat, and territory control
5. **User Interface**: Intuitive HUD and controls for desktop and mobile
6. **Development Tools**: Build scripts, verification tools, and testing frameworks
7. **OMGithub Integration**: Automated workflow for development, testing, and deployment

### Development Workflow

The project follows the OMGithub workflow:

1. **Create Issue**: Describe the game in a GitHub issue
2. **Apply Label**: Add the `OpenCode` label to trigger the workflow
3. **Automated Build**: OpenCode builds, tests, and verifies the game
4. **Preview**: Test the game in a temporary browser URL
5. **Commit**: Create an immutable project link for review

### Skills Available

The project can leverage various OpenCode skills:

- **`gauntlet-loop`**: For iterative development with quality bars
- **`opencode-zen-completions`**: For complex implementation tasks
- **`load-sketchfab-threejs`**: For 3D assets if needed
- **`mcp-duckgo`**: For web search and research
- **`image-search`**: For acquiring game assets

### Technical Requirements

- **Dependencies**: Pixi.js, GSAP, Lodash, Vite, Jest, Canvas
- **Build Process**: npm run dev, npm run build, npm run verify
- **Testing**: Unit tests, integration tests, performance tests
- **Compatibility**: Desktop and mobile browsers
- **Performance**: Optimized for 60 FPS gameplay

### Next Steps

To develop this game:

1. **Set up the environment**: Install dependencies and configure the project
2. **Start development**: Run `npm run dev` to start the development server
3. **Create game assets**: Use skills to acquire sprites, sounds, and other assets
4. **Implement game logic**: Develop core game mechanics and systems
5. **Test and verify**: Run tests and verification regularly
6. **Iterate and improve**: Use gauntlet-loop for quality improvements
7. **Deploy**: Use OMGithub workflow for automated deployment

This repository provides a comprehensive foundation for building a high-quality 2D RTS game with the power of the OMGithub/OpenCode platform.