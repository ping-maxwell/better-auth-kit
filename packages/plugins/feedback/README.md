# @better-auth-kit/feedback

A plugin for Better Auth Kit that allows users to submit feedback about your application.

## Installation

```bash
npm install @better-auth-kit/feedback
```

## Usage

```typescript
// auth.ts
import { feedback } from "@better-auth-kit/feedback";

export const auth = betterAuth({
  plugins: [
    feedback({
      // Text length settings
      minLength: 10, // Minimum feedback text length (default: 10)
      maxLength: 500, // Maximum feedback text length (default: 500)

      // User control settings
      feedbackLimit: 5, // Optional: limit users to 5 feedbacks
      requireAuth: true, // Optional: require authentication (default: true)
      canSubmitFeedback: (user) => user.role === "owner", // Optional: control who can submit
    }),
  ],
});
```

```typescript
// auth-client.ts
import { feedbackClient } from "@better-auth-kit/feedback/client";

export const authClient = createAuthClient({
  plugins: [feedbackClient()],
});
```

## Submitting Feedback

In your client code:

```typescript
// By default requires a logged-in user (if requireAuth is true)
await authClient.feedback.submitFeedback({
  userId: user.id, // Required if requireAuth is true
  text: "Your feedback text here (min 10, max 500 characters by default)",
});
```

## Getting All Feedback

```typescript
// Admin-only endpoint
const { data } = await authClient.feedback.getFeedback();
```

## Configuration Options

### Authentication Settings

By default, users must be authenticated to submit feedback, but you can configure this:

```typescript
feedback({
  // Allow anonymous feedback
  requireAuth: false,

  // Control who can submit feedback (only applies when requireAuth is true)
  canSubmitFeedback: (user) => {
    // Only allow verified users to submit feedback
    return user.emailVerified === true;
  },

  // Limit the number of feedbacks per user
  feedbackLimit: 3,
});
```

### Customizing the Schema

You can customize the schema field names:

```typescript
feedback({
  schema: {
    feedback: {
      modelName: "feedbackEntries", // Rename the model
      fields: {
        userId: "authorId", // Rename the userId field
        text: "message", // Rename the text field
        createdAt: "submittedAt", // Rename the createdAt field
      },
    },
  },
});
```

You can also add additional fields:

```typescript
feedback({
  additionalFields: {
    category: { type: "string", required: true },
    rating: { type: "number", required: true },
    attachments: { type: "string[]", required: false },
  },
});
```

## Database Schema

The feedback plugin creates a table with the following schema:

| Column    | Type   | Description                                                                  |
| --------- | ------ | ---------------------------------------------------------------------------- |
| id        | string | Unique identifier for the feedback entry                                     |
| userId    | string | ID of the user who submitted the feedback (optional if requireAuth is false) |
| text      | string | The feedback content (length controlled by minLength/maxLength)              |
| createdAt | date   | Timestamp when the feedback was submitted                                    |

## Error Handling

The plugin provides several error codes to handle different scenarios:

- `FEEDBACK_TOO_SHORT`: The feedback text is shorter than the minimum length
- `FEEDBACK_TOO_LONG`: The feedback text is longer than the maximum length
- `USER_NOT_LOGGED_IN`: User authentication is required but no userId provided
- `USER_NOT_FOUND`: The provided userId doesn't match any existing user
- `FEEDBACK_LIMIT_REACHED`: The user has reached their feedback submission limit
- `USER_NOT_ALLOWED`: The user is not allowed to submit feedback based on the canSubmitFeedback function

## License

[MIT](LICENSE)
