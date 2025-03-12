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
    viewBox="0 -1.5 48 48"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g transform="translate(-800.000000, -363.000000)" fill="#0F82E2">
        <path d="M824,389.033255 L814.1195,397.34573 L800,388.053538 L809.7635,380.17347 L823.999971,389.033238 L838.2362,380.172109 L847.9997,388.05369 L833.8802,397.345881 L823.9997,389.033406 Z M814.1198,363 L800.0003,372.292191 L809.7638,380.17226 L824.0003,371.312475 L814.1198,363 Z M824.02895,390.821692 L814.11995,399.109976 L809.87945,396.318993 L809.87945,399.447132 L824.02895,408 L838.17845,399.447132 L838.17845,396.318993 L833.93795,399.109976 L824.02895,390.821692 Z M848,372.292343 L833.8805,363.000151 L824,371.312626 L838.2365,380.172411 L848,372.292343 Z"></path>
      </g>
    </g>
  </svg>
);

export function DropboxOAuth(props: Props) {
  return (
    <Button
      className={cn(
        "grow cursor-pointer basis-[calc(33.33%-0.5rem)]",
        props.iconOnly ? "min-w-[80px]" : "min-w-[110px]"
      )}
      onClick={() =>
        props.onClick({ providerId: "dropbox", type: "supported-provider" })
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
        Dropbox
      </span>
    </Button>
  );
}
