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
  isCurrent?: boolean;
  description: string;
  details: string[];
}

export function RoadmapTimeline() {
  const roadmapSteps: RoadmapStep[] = [
    {
      title: "Better-Auth-Kit UI",
      isCurrent: true,
      description:
        "ShadCN registry based UI components specific to Better-Auth.",
      details: [
        "~~add: Sign up component~~",
        "~~add: Sign in component~~",
        "~~add: Social login support~~",
        "add: Magic link support",
        "add: Waitlist component",
        "add: User component",
        "add: Forgot password component",
        "chore: Documentation",
      ],
    },
    {
      title: "Better-Auth-Kit CLI",
      description:
        "A CLI tool to provide a better experience for setting up, and using, Better-Auth.",
      details: [
        "add: General structrue for CLI",
        "add: Database seeding",
        "add: Database seeding docs",
        "add: UI component generation",
        "add: UI component generation docs",
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
        description: "Stop signins or signups at any moment.",
        details: [
            "add: Shutdown schema",
            "add: Shutdown API functionality",
            "add: Write unit tests",
            "chore: Documentation",
        ]
    },
    {
      title: "Admin Dashboard Library",
      description: "Develop a library for creating admin dashboards",
      details: [
        "chore: Refine user page",
        "Add: Organization page",
        "Add: API-Key page",
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
        ]
    }
  ];

  return (
    <div className="space-y-8">
      {roadmapSteps.map((step, index) => (
        <div key={step.title + index} className="flex gap-4">
          <div className="flex flex-col items-center gap-2">
            <div className="flex !size-10 min-h-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              {index + 1}
            </div>
            {index < roadmapSteps.length - 1 && (
              <div className="h-full w-px bg-border"></div>
            )}
          </div>
          <Card
            className={`flex-1 ${step.isCurrent ? "drop-shadow-lg shadow-primary" : ""}`}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {step.title}
                {step.isCurrent && (
                  <>
                    <span className="mx-1">─</span> Current Stage
                  </>
                )}
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
