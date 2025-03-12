import { Button } from "@/components/ui/button";
import type { OAuthButtonPressEvent } from "@/components/oauth";
import { cn } from "@/lib/utils";

interface Props {
  onClick: OAuthButtonPressEvent;
  iconOnly?: boolean;
  isLoading: boolean;
}

const logo = (
  <svg
    className="size-4"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="17" y="17" width="10" height="10" fill="#FEBA08" />
    <rect x="5" y="17" width="10" height="10" fill="#05A6F0" />
    <rect x="17" y="5" width="10" height="10" fill="#80BC06" />
    <rect x="5" y="5" width="10" height="10" fill="#F25325" />
  </svg>
);

export function MicrosoftOAuth(props: Props) {
  return (
    <Button
      className={"grow cursor-pointer min-w-20"}
      onClick={() =>
        props.onClick({ providerId: "microsoft", type: "supported-provider" })
      }
      variant={"outline"}
      disabled={props.isLoading}
    >
      {logo}{" "}
      <span
        className={cn(
          props.iconOnly && "hidden",
          "text-muted-foreground font-normal"
        )}
      >
        Microsoft
      </span>
    </Button>
  );
}
