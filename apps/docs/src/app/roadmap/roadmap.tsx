import { RoadmapTimeline } from "./roadmap-timeline";

export function Roadmap() {
	return (
		<div className="container mx-auto px-4 py-12 mt-[65px]">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-4xl font-bold tracking-tight mb-4">
					Better-Auth-Kit Roadmap
				</h1>
				<p className="text-lg text-muted-foreground mb-12">
					The active development roadmap for Better-Auth-Kit, including the
					latest features and improvements.
				</p>

				<RoadmapTimeline />
			</div>
		</div>
	);
}
