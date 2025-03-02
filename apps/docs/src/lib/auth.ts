import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { waitlist } from "better-auth-waitlist";
import Database from "better-sqlite3";

export const auth = betterAuth({
  database: new Database("./test.db"),
  plugins: [
    waitlist({
      enabled: true,
      waitlistEndConfig: {
        event: "max-signups-reached",
        maximumSignups: 2,
        onWaitlistEnd: (users) => {
          console.log("Waitlist complete!", users);
        },
      },
    }),
    nextCookies(),
  ],
});
