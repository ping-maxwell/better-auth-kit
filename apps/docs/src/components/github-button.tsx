import { Github, SquareArrowOutUpRight } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

export const GithubButton = ({ url }: { url: string }) => {
	return (
		<Link href={url} target="_blank" rel="noopener noreferrer">
			<Button variant="outline" className="cursor-pointer">
				<Github />
				Github
				<SquareArrowOutUpRight className="size-3" />
			</Button>
		</Link>
	);
};
