import { Button } from "./ui/button";
import Link from "next/link";
import { SquareArrowOutUpRight } from "lucide-react";
export const NpmButton = ({ url }: { url: string }) => {
	return (
		<Link href={url} target="_blank" rel="noopener noreferrer">
			<Button variant="outline" className="cursor-pointer">
				<svg
					className="fill-black dark:fill-white"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<g>
						<g>
							<rect width="24" height="24" opacity="0" />
							<path d="M18 3H6a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h7V11h4v10h1a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3z" />
						</g>
					</g>
				</svg>
				NPM
				<SquareArrowOutUpRight className="size-3" />
			</Button>
		</Link>
	);
};
