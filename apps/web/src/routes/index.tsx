import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "@slidont/backend/convex/_generated/api";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});

const TITLE_TEXT = `
 ██████╗ ███████╗████████╗████████╗███████╗██████╗
 ██╔══██╗██╔════╝╚══██╔══╝╚══██╔══╝██╔════╝██╔══██╗
 ██████╔╝█████╗     ██║      ██║   █████╗  ██████╔╝
 ██╔══██╗██╔══╝     ██║      ██║   ██╔══╝  ██╔══██╗
 ██████╔╝███████╗   ██║      ██║   ███████╗██║  ██║
 ╚═════╝ ╚══════╝   ╚═╝      ╚═╝   ╚══════╝╚═╝  ╚═╝

 ████████╗    ███████╗████████╗ █████╗  ██████╗██╗  ██╗
 ╚══██╔══╝    ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
    ██║       ███████╗   ██║   ███████║██║     █████╔╝
    ██║       ╚════██║   ██║   ██╔══██║██║     ██╔═██╗
    ██║       ███████║   ██║   ██║  ██║╚██████╗██║  ██╗
    ╚═╝       ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
 `;

function HomeComponent() {
	const healthCheck = useQuery(api.healthCheck.get);

	return (
		<div className="container mx-auto max-w-3xl px-4 py-8">
			<pre className="overflow-x-auto font-mono text-sm mb-8">{TITLE_TEXT}</pre>
			<div className="grid gap-6">
				<section className="rounded-lg border p-4">
					<h2 className="mb-2 font-medium">API Status</h2>
					<div className="flex items-center gap-2">
						<div
							className={`h-2 w-2 rounded-full ${healthCheck === "OK" ? "bg-green-500" : healthCheck === undefined ? "bg-orange-400" : "bg-red-500"}`}
						/>
						<span className="text-sm text-muted-foreground">
							{healthCheck === undefined
								? "Checking..."
								: healthCheck === "OK"
									? "Connected"
									: "Error"}
						</span>
					</div>
				</section>

				<section className="rounded-lg border p-6">
					<h2 className="mb-4 text-xl font-semibold">Q&A Session</h2>
					<p className="mb-4 text-muted-foreground">
						Join the live Q&A session for Cursor Tokyo Meetup - Ryo's Q&A
					</p>
					<Link to="/q/cursor-tokyo-meetup-ryo-qa">
						<Button>Join Q&A Session</Button>
					</Link>
				</section>
			</div>
		</div>
	);
}
