# Indiana Scouting Alliance Monorepo

[![Build Android application](https://img.shields.io/github/actions/workflow/status/kennanhunter/scouting/android.yaml?style=for-the-badge&label=Android)](https://github.com/KennanHunter/scouting/actions/workflows/android.yaml)
[![Deploy API & Web](https://img.shields.io/github/actions/workflow/status/kennanhunter/scouting/javascript.yaml?style=for-the-badge&label=Web%20%2B%20API)](https://github.com/KennanHunter/scouting/actions/workflows/javascript.yaml)

# Setup

## Dev Container

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/KennanHunter/scouting)
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/KennanHunter/scouting)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/KennanHunter/scouting)
[![Open in Glitch](https://img.shields.io/badge/Open%20in-Glitch-blue?logo=glitch)](https://glitch.com/edit/#!/import/github/KennanHunter/scouting)
[![Open in Repl.it](https://replit.com/badge)](https://replit.com/github/KennanHunter/scouting)
[![Open in Codeanywhere](https://codeanywhere.com/img/open-in-codeanywhere-btn.svg)](https://app.codeanywhere.com/#https://github.com/KennanHunter/scouting)
[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/KennanHunter/scouting)




The easiest way to start contributing is to open this repository in a codespace. Either **press the button above**, or go to [the repository](https://github.com/kennanhunter/scouting) and select the big green button labeled `<> Code`. In the resulting drop down menu, press `Codespaces` and press `Create Codespace on main`.

When the codespace is open, run `pnpm dev` in the terminal.

## System Diagram

![System Structure Diagram](./system_structure.svg)

## Local Development

### API

- Run `pnpm create-environment` this
  - Copies [.dev.vars.example](api/.dev.vars.example) to [.dev.vars](api/.dev.vars)
  - Copies [.env.example](web/.env.example) to [.env](web/.env)
- Get a thebluealliance key from your [account page](https://www.thebluealliance.com/account) and add it to [.dev.vars](api/.dev.vars) as `TBA_KEY`
- (Optional for development) Generate a new JWT secret with `openssl rand -base64 32` and add it to [.env](web/.env) as `VITE_API_TOKEN`
