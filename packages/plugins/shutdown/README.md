# Shutdown Plugin for [Better Auth](https://github.com/better-auth/better-auth)

This plugin allows you to stop signins or signups at any moment using rules.

## Installation

```bash
npm install @better-auth-kit/shutdown
```

## Usage

```ts
import { shutdown } from "@better-auth-kit/shutdown";

export const auth = betterAuth({
  plugins: [
    shutdown({
      allowedRoles: ["admin"]
    }),
  ],
});
```

## Documentation

Read our documentation at [better-auth-kit.com](https://better-auth-kit.com/docs/plugins/shutdown).

## What does it do?

When enabled, the plugin will allow you to stop signins or signups at any moment.

You can create rules that will be checked before the sign-in or sign-up process. If a rule is matched, the user will not be able to sign in or sign up.

## License

[MIT](LICENSE)
