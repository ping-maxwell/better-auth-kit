import { DatabaseExplorer } from "./database-explorer";

export default function Home() {
	return (
		<div className="w-screen h-screen flex justify-center items-center">
			<DatabaseExplorer baseURL="http://localhost:3572" />
		</div>
	);
}
