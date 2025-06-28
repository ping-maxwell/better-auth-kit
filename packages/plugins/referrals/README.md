# @better-auth-kit/referrals

A plugin for Better Auth Kit that implements a referral system, automatically generating referral codes for users and tracking referrals.

## Installation

```bash
npm install @better-auth-kit/referrals
```

## Usage

```typescript
// auth.ts
import { referrals } from "@better-auth-kit/referrals";

export const auth = betterAuth({
  plugins: [
    referrals({
      // URL settings
      urlFormat: "?ref=", // Format for referral parameter (default: "?ref=")
      baseUrl: "/", // Base URL for referral links (default: "/")
      
      // Code settings
      codeLength: 8, // Length of generated referral codes (default: 8)
      
      // Custom referral code generator (optional)
      generateReferralCode: (length) => {
        // Custom logic to generate a code of specified length
        return "CUSTOM" + Math.random().toString(36).substring(2, 2 + length - 6);
      },
      
      // User control settings
      canUseReferrals: (user) => user.role === "owner", // Optional: control who can use referrals
      
      // Custom handler when a referral is detected (optional)
      onReferral: async ({ userId, referrerId, referralCode }) => {
        // Custom logic to handle successful referrals
        console.log(`User ${userId} was referred by ${referrerId} with code ${referralCode}`);
        
        // Perhaps award points, credits, or trigger other business logic
      }
    }),
  ],
});
```

```typescript
// auth-client.ts
import { referralsClient } from "@better-auth-kit/referrals/client";

export const authClient = createAuthClient({
  plugins: [referralsClient()],
});
```

## Using Referrals

In your client code:

```typescript
// Get the current user's referral URL
const { url, code } = await authClient.referrals.getReferralUrl();

// Validate a referral code
const { valid, referrerId } = await authClient.referrals.validateReferralCode({
  code: "ABC123XY",
});

// When creating a new user with a referral code
await authClient.auth.signUp({
  email: "user@example.com",
  password: "password123",
  referralCode: "ABC123XY", // Optional: referral code if entered manually
});

// Referral code is also extracted from URL automatically if present in the format
// https://yourdomain.com/?ref=ABC123XY

// Get information about who referred the current user
const referrerInfo = await authClient.referrals.getMyReferrer();
// Returns { referrerId, referrer, createdAt } or null if not referred

// Get list of users referred by the current user
const myReferrals = await authClient.referrals.getMyReferrals();
// Returns array of { userId, user, createdAt }

// Get count of users referred by the current user
const { count } = await authClient.referrals.getReferralCount();
// Returns the number of successful referrals
```

## Configuration Options

### URL and Code Settings

Configure how referral URLs are generated:

```typescript
referrals({
  // Default is /?ref=CODE
  urlFormat: "?invitedBy=", // Changes to /?invitedBy=CODE
  baseUrl: "/signup", // Changes to /signup?ref=CODE
  
  // Control referral code length
  codeLength: 6, // Generate shorter codes
});
```

### Custom Referral Code Generator

You can provide your own function to generate referral codes:

```typescript
referrals({
  // Generate your own format of referral codes
  generateReferralCode: (length) => {
    // For example, prefix + random string
    return "REF-" + Math.random().toString(36).substring(2, 2 + length - 4);
    
    // Or any other custom format
  }
});
```

### User Controls

Control who can use referrals:

```typescript
referrals({
  // Only allow verified users to create referrals
  canUseReferrals: (user) => {
    return user.emailVerified === true;
  }
});
```

### Referral Handler

Define custom logic to execute when a referral is detected:

```typescript
referrals({
  onReferral: async ({ userId, referrerId, referralCode }) => {
    // Award points to the referrer
    await awardPoints(referrerId, 100);
    
    // Add welcome bonus for the referred user
    await addWelcomeBonus(userId, 50);
    
    // Log the referral for analytics
    await logReferral({ referrer: referrerId, referred: userId, code: referralCode });
  }
});
```

### Customizing the Schema

You can customize the schema field names:

```typescript
referrals({
  schema: {
    referrals: {
      modelName: "referralEntries", // Rename the model
      fields: {
        userId: "authorId", // Rename the userId field
        referralCode: "code", // Rename the referralCode field
        referrerId: "invitedBy", // Rename the referrerId field
        createdAt: "createdAt", // Rename the createdAt field
      },
    },
  },
});
```

You can also add additional fields:

```typescript
referrals({
  additionalFields: {
    rewardClaimed: { type: "boolean", required: false },
    referralSource: { type: "string", required: false },
  },
});
```

## Database Schema

The referrals plugin creates a table with the following schema:

| Column       | Type   | Description                                  |
| ------------ | ------ | -------------------------------------------- |
| id           | string | Unique identifier for the referral entry     |
| userId       | string | ID of the user who owns this referral code   |
| referralCode | string | The unique referral code                     |
| referrerId   | string | ID of the user who referred (if applicable)  |
| createdAt    | date   | Timestamp when the referral was created      |

## Referral Analytics

The plugin provides several endpoints to track and analyze referrals:

### Getting Referrer Information

Retrieve information about who referred the current user:

```typescript
const referrerInfo = await authClient.referrals.getMyReferrer();

if (referrerInfo) {
  console.log(`You were referred by user ${referrerInfo.referrerId}`);
  console.log(`Referral happened at ${referrerInfo.createdAt}`);
  
  // If the referrer user object is included
  if (referrerInfo.referrer) {
    console.log(`Referrer name: ${referrerInfo.referrer.name}`);
  }
}
```

### Listing Users You've Referred

Get a list of all users that the current user has referred:

```typescript
const myReferrals = await authClient.referrals.getMyReferrals();

console.log(`You have referred ${myReferrals.length} users`);

// Display information about each referred user
myReferrals.forEach(referral => {
  console.log(`User ${referral.userId} signed up on ${referral.createdAt}`);
  
  // If the user object is included
  if (referral.user) {
    console.log(`User name: ${referral.user.name}`);
  }
});
```

### Counting Referrals

Get the total count of users the current user has referred:

```typescript
const { count } = await authClient.referrals.getReferralCount();

console.log(`You have referred ${count} users in total`);

// Use this for building leaderboards or achievement systems
if (count >= 10) {
  console.log("You've unlocked the 'Expert Referrer' badge!");
}
```

## Error Handling

The plugin provides several error codes to handle different scenarios:

- `INVALID_REFERRAL_CODE`: The referral code is invalid or doesn't exist
- `USER_NOT_FOUND`: The user was not found
- `USER_NOT_ALLOWED`: The user is not allowed to use referrals based on the canUseReferrals function

## License

[MIT](LICENSE)
