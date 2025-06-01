import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface PackageData {
	name: string;
	description: string;
	downloads: number;
	version: string;
	docs: string;
	isReleased: boolean;
}

interface NpmPackageStatsProps {
	package: PackageData;
}

export function NpmPackageStats({ package: pkg }: NpmPackageStatsProps) {
	return (
		<Card className={cn("overflow-hidden", pkg.isReleased ? "opacity-100" : "opacity-50")}>
			<CardHeader className="pb-2">
				<div className="flex justify-between items-start">
					<div>
						<CardTitle className="font-bold hover:underline">
							<Link href={pkg.docs} prefetch>
								{pkg.name}
							</Link>
						</CardTitle>
						<CardDescription className="mt-2 text-xs">
							{pkg.description}
						</CardDescription>
					</div>
					<Badge variant="outline" className="ml-2 shrink-0">
						v{pkg.version}
					</Badge>
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-4 mt-8 mb-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<Download className="h-4 w-4 mr-2 text-primary" />
							<span className="text-sm font-medium">Downloads</span>
						</div>
						<span className="font-bold">{pkg.downloads.toLocaleString()}</span>
					</div>
					<div className="w-full bg-secondary h-3 rounded-full overflow-hidden">
						<div
							className="bg-primary h-full rounded-full"
							style={{
								width: `${Math.min(100, (pkg.downloads / 1000) * 100)}%`,
							}}
						/>
					</div>
					<div className="flex justify-between text-xs text-muted-foreground">
						<span>0</span>
						<span>100</span>
						<span>500</span>
						<span>1,000+</span>
					</div>
				</div>
			</CardContent>
			<CardFooter className="pt-2 flex gap-2 w-full -ml-1">
				<Button variant="outline" size="sm" className="w-1/2" asChild>
					<Link
						href={`https://www.npmjs.com/package/${pkg.name}`}
						target="_blank"
					>
						NPM
					</Link>
				</Button>
				<Button variant="outline" size="sm" className="w-1/2" asChild>
					<Link href={pkg.docs} target="_blank">
						Docs
					</Link>
				</Button>
			</CardFooter>
		</Card>
	);
}
