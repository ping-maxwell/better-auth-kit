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
    version="1.1"
    x="0px"
    y="0px"
    viewBox="0 0 302.7 302.7"
    className="fill-black dark:fill-white"
  >
    <path
      id="path20"
      d="M120.5,271.7c-110.9-28.6-120-31-119.9-31.5
C0.7,239.6,62.1,0.5,62.2,0.4c0,0,54,13.8,119.9,30.8S302.1,62,302.2,62c0.2,0,0.2,0.4,0.1,0.9c-0.2,1.5-61.5,239.3-61.7,239.5
C240.6,302.5,186.5,288.7,120.5,271.7z M174.9,158c3.2-12.6,5.9-23.1,6-23.4c0.1-0.5-2.3-1.2-23.2-6.6c-12.8-3.3-23.5-5.9-23.6-5.8
c-0.3,0.3-12.1,46.6-12,46.7c0.2,0.2,46.7,12.2,46.8,12.1C168.9,180.9,171.6,170.6,174.9,158L174.9,158z"
    />
  </svg>
);

export function RobloxOAuth(props: Props) {
  return (
    <Button
      className={cn(
        "grow cursor-pointer basis-[calc(33.33%-0.5rem)] relative",
        props.iconOnly
          ? "min-w-[80px]"
          : "min-w-[110px] [&_svg]:absolute [&_svg]:left-5"
      )}
      onClick={() =>
        props.onClick({ providerId: "roblox", type: "supported-provider" })
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
        Roblox
      </span>
    </Button>
  );
}
