# Waitlist Plugin for [Better Auth](https://github.com/better-auth/better-auth)

This plugin allows you to add a waitlist to your application.

## Installation

```bash
npm install @better-auth-kit/waitlist
```

## Usage

```ts
import { waitlist } from "@better-auth-kit/waitlist";

export const auth = betterAuth({
  plugins: [
    waitlist({
      enabled: true,
    }),
  ],
});
```

## Documentation

Read our documentation at [better-auth-kit.vercel.app](https://better-auth-kit.vercel.app/docs/plugins/waitlist).

## What does it do?

When enabled, the plugin will add a waitlist to your application.
All users would not be able to signup, instead they must be added to the waitlist.

Once the waitlist reaches a requirement, the user will be able to signup.

## License

[MIT](LICENSE)
