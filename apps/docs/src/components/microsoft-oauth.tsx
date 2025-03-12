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
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="12" y="12" width="10" height="10" fill="#FEBA08" />
    <rect x="0" y="12" width="10" height="10" fill="#05A6F0" />
    <rect x="12" y="0" width="10" height="10" fill="#80BC06" />
    <rect x="0" y="0" width="10" height="10" fill="#F25325" />
  </svg>
);

export function MicrosoftOAuth(props: Props) {
  return (
    <Button
      className={cn(
        "grow cursor-pointer basis-[calc(33.33%-0.5rem)] relative",
        props.iconOnly ? "min-w-[80px]" : "min-w-[110px] [&_svg]:absolute [&_svg]:left-4"
      )}
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
