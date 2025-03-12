import { Button } from "@/components/ui/button";
import type { OAuthButtonPressEvent } from "@/components/oauth";
import { cn } from "@/lib/utils";

interface Props {
	onClick: OAuthButtonPressEvent;
	iconOnly?: boolean;
	isLoading: boolean;
}

const logo = (
	<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
		<circle cx="24" cy="24" r="20" fill="#0077B5" />
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M18.7747 14.2839C18.7747 15.529 17.8267 16.5366 16.3442 16.5366C14.9194 16.5366 13.9713 15.529 14.0007 14.2839C13.9713 12.9783 14.9193 12 16.3726 12C17.8267 12 18.7463 12.9783 18.7747 14.2839ZM14.1199 32.8191V18.3162H18.6271V32.8181H14.1199V32.8191Z"
			fill="white"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M22.2393 22.9446C22.2393 21.1357 22.1797 19.5935 22.1201 18.3182H26.0351L26.2432 20.305H26.3322C26.9254 19.3854 28.4079 17.9927 30.8101 17.9927C33.7752 17.9927 35.9995 19.9502 35.9995 24.219V32.821H31.4922V24.7838C31.4922 22.9144 30.8404 21.6399 29.2093 21.6399C27.9633 21.6399 27.2224 22.4999 26.9263 23.3297C26.8071 23.6268 26.7484 24.0412 26.7484 24.4574V32.821H22.2411V22.9446H22.2393Z"
			fill="white"
		/>
	</svg>
);

export function LinkedInOAuth(props: Props) {
	return (
		<Button
			className={cn(
				"grow cursor-pointer basis-[calc(33.33%-0.5rem)]",
				props.iconOnly ? "min-w-[80px]" : "min-w-[110px]",
			)}
			onClick={() =>
				props.onClick({ providerId: "linkedin", type: "supported-provider" })
			}
			variant={"outline"}
			disabled={props.isLoading}
		>
			{logo}{" "}
			<span
				className={cn(
					props.iconOnly && "hidden",
					"text-muted-foreground font-normal",
				)}
			>
				LinkedIn
			</span>
		</Button>
	);
}
