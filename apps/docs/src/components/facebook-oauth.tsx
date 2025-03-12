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
    <circle cx="16" cy="16" r="14" fill="url(#paint0_linear_87_7208)" />
    <path
      d="M21.2137 20.2816L21.8356 16.3301H17.9452V13.767C17.9452 12.6857 18.4877 11.6311 20.2302 11.6311H22V8.26699C22 8.26699 20.3945 8 18.8603 8C15.6548 8 13.5617 9.89294 13.5617 13.3184V16.3301H10V20.2816H13.5617V29.8345C14.2767 29.944 15.0082 30 15.7534 30C16.4986 30 17.2302 29.944 17.9452 29.8345V20.2816H21.2137Z"
      fill="white"
    />
    <defs>
      <linearGradient
        id="paint0_linear_87_7208"
        x1="16"
        y1="2"
        x2="16"
        y2="29.917"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#18ACFE" />
        <stop offset="1" stopColor="#0163E0" />
      </linearGradient>
    </defs>
  </svg>
);

export function FacebookOAuth(props: Props) {
  return (
    <Button
      className={cn(
        "grow basis-[calc(33.33%-0.5rem)] cursor-pointer",
        props.iconOnly ? "min-w-[80px]" : "min-w-[110px]"
      )}
      onClick={() =>
        props.onClick({ providerId: "facebook", type: "supported-provider" })
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
        Facebook
      </span>
    </Button>
  );
}
