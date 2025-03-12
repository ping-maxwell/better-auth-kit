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
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
  >
    <path fill="#ffffff" d="M13 7.5l-2 2H9l-1.75 1.75V9.5H5V2h8v5.5z" />
    <g fill="#9146FF">
      <path d="M4.5 1L2 3.5v9h3V15l2.5-2.5h2L14 8V1H4.5zM13 7.5l-2 2H9l-1.75 1.75V9.5H5V2h8v5.5z" />
      <path d="M11.5 3.75h-1v3h1v-3zM8.75 3.75h-1v3h1v-3z" />
    </g>
  </svg>
);

export function TwitchOAuth(props: Props) {
  return (
    <Button
      className={cn(
        "grow cursor-pointer basis-[calc(33.33%-0.5rem)] relative",
        props.iconOnly ? "min-w-[80px]" : "min-w-[110px] [&_svg]:absolute [&_svg]:left-5"
      )}
      onClick={() =>
        props.onClick({ providerId: "twitch", type: "supported-provider" })
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
        Twitch
      </span>
    </Button>
  );
}
