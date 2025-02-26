# Waitlist Plugin for [Better Auth](https://github.com/better-auth/better-auth)

This plugin allows you to add a waitlist to your application.

## Installation

```bash
npm install better-auth-waitlist
```

## Usage

```ts
import { waitlist } from "better-auth-legal-consent";

export const auth = betterAuth({
  plugins: [
    waitlist({
      enabled: true,
    }),
  ],
});
```

## What does it do?

When enabled, the plugin will add a waitlist to your application.
All users would not be able to signup, instead they must be added to the waitlist.

Once the waitlist reaches a requirement, the user will be able to signup.

## License

[MIT](LICENSE)
