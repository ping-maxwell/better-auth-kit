import { GitBranch } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface RoadmapStep {
  title: string;
  inProgress?: boolean;
  isCompleted?: boolean;
  description: string;
  details: string[];
}

export function RoadmapTimeline() {
  const roadmapSteps: RoadmapStep[] = [
    {
      title: "Better-Auth-Kit/tests library",
      isCompleted: true,
      description:
        "A collection of utilities to help you test your Better-Auth plugins.",
      details: [
        "~~add: `getTestInstance` function~~",
        "~~chore: Documentation~~",
      ],
    },
    {
      title: "Move convex-better-auth to this monorepo",
      inProgress: true,
      description:
        "This will allow us to iterate on the library faster, and make it easier to maintain.",
      details: [
        "~~add: convex-better-auth to this monorepo~~",
        "~~chore: update dependencies~~",
        "~~chore: update docs~~",
        "~~fix: any issues or bugs with the library~~",
        "~~add: `count` method to the database adapter~~",
        "chore: add tests for `count` method <- delayed.",
      ],
    },
    {
      title: "Better-Auth-Kit CLI",
	  inProgress: true,
      description:
        "A CLI tool to provide a better experience for setting up, and using, Better-Auth",
      details: ["add: General structure for CLI"],
    },
    {
      title: "Better-Auth-Kit UI",
      inProgress: true,
      description:
        "ShadCN registry based UI components specific to Better-Auth.",
      details: [
        "~~add: UI component builder page~~",
        "~~add: Sign up component~~",
        "~~add: Sign in component~~",
        "~~add: Social login support~~",
        "add: Export feature in component builder",
        "add: Plugin UI selection interface in component builder",
        "fix: Component builder sidebar links",
        "add: Magic link support",
        "add: Captcha support",
        "add: Waitlist component",
        "add: User component",
        "add: Forgot password component",
        "chore: Documentation",
      ],
    },
    {
      title: "Better-Auth Dashboard",
      description:
        "A Clerk-like dashboard for your Better-Auth project. This will be a Next.js project that is styled with shadcn/ui.",
      details: [
        "add: /dashboard route that watches for that device's localhost:3887",
        "add: UI toggle Better-Auth configs",
        "add: Database view - similar to Drizzle Studio",
        "add: User management",
        "add: Session management",
        "add: API-Key management",
        "add: Organization management",
      ],
    },
    {
      title: "Waitlist Plugin",
      description: "Create a flexible waitlist management system",
      details: [
        "~~add: Waitlist schema~~",
        "add: Waitlist API functionality",
        "add: Write unit tests",
        "add: waitlist + better-auth-harmony",
        "chore: Documentation",
      ],
    },
    {
      title: "Reverify plugin",
      description:
        "Prompt the user to reverify their identity by providing a form of authentication for revalidation.",
      details: [
        "~~add: Reverify plugin~~",
        "~~add: Reverify plugin docs~~",
        "~~add: Reverify plugin tests~~",
        "~~chore: Documentation~~",
        "add: Other auth methods (OTP, Magic link, etc) support",
        "add: session freshness check - if session is fresh, skip re-verification. And configurable in plugin options",
      ],
    },
    {
      title: "Blockade Plugin",
      description: "Whitelist or blacklist users from signing in",
      details: [
        "add: Blockade schema",
        "add: Blockade API functionality",
        "add: Write unit tests",
        "chore: Documentation",
      ],
    },
    {
      title: "Shutdown Plugin",
      description: "Stop signins or signups at any moment",
      details: [
        "add: Shutdown schema",
        "add: Shutdown API functionality",
        "add: Write unit tests",
        "chore: Documentation",
      ],
    },
    {
      title: "Admin Dashboard Library",
      description: "Develop a library for creating admin dashboards",
      details: [
        "~~add: Initial Admin Dashboard API~~",
        "add: move the current admin-dashboard repo into this monorepo",
        "refactor: Refine user page",
        "add: Organization page",
        "add: API-Key page",
        "add: Analytics on home page",
        "chore: Documentation",
      ],
    },
    {
      title: "PocketBase DB support",
      description: "A database adapter for PocketBase",
      details: [
        "add: Pocketbase database adapter",
        "add: Pocketbase database adapter docs",
        "add: tests",
        "chore: Documentation",
      ],
    },
    {
      title: "Firestore DB support",
      description: "A database adapter for Firebase - Firestore",
      details: [
        "add: Firestore database adapter",
        "add: Firestore database adapter docs",
        "add: tests",
        "chore: Documentation",
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {roadmapSteps.map((step, index) => (
        <div
          key={step.title + index}
          className={cn("flex gap-4", step.isCompleted && "opacity-80")}
        >
          <div className="flex flex-col items-center gap-2">
            <div
              className={cn(
                "flex !size-10 min-h-10 items-center justify-center rounded-full bg-primary text-primary-foreground",
                step.isCompleted && "bg-primary/50"
              )}
            >
              {index + 1}
            </div>
            {index < roadmapSteps.length - 1 && (
              <div className="h-full w-px bg-border"></div>
            )}
          </div>
          <Card
            className={`flex-1 ${step.inProgress ? "drop-shadow-lg shadow-primary" : ""}`}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className={cn(step.isCompleted && "line-through")}>
                  {step.title}
                </span>
                {step.inProgress && (
                  <>
                    <span className="mx-1">─</span> Currently in progress
                  </>
                )}
                {step.isCompleted && "✔"}
              </CardTitle>
              <CardDescription>{step.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {step.details.map((detail, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <GitBranch className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <span
                      className={cn(
                        detail.startsWith("~~") &&
                          "line-through text-muted-foreground/70"
                      )}
                    >
                      {detail.replaceAll("~", "")}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
