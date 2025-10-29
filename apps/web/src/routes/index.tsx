import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "@slidont/backend/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});

function HomeComponent() {
	const healthCheck = useQuery(api.healthCheck.get);

	return (
		<div className="container mx-auto max-w-4xl px-4 py-12">
			<div className="text-center mb-12">
				<h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
					Slidont
				</h1>
				<p className="text-xl text-muted-foreground">
					Real-time Q&A made simple
				</p>
			</div>

			<div className="grid gap-6 mb-8">
				<Card className="p-6">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="mb-2 font-semibold">Connection Status</h2>
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
						</div>
					</div>
				</Card>

				<Card className="p-8">
					<h2 className="mb-2 text-2xl font-semibold">Cursor Tokyo Meetup</h2>
					<p className="mb-6 text-muted-foreground">
						Join the live Q&A session - Ask your questions, vote for your favorites, and engage with the community in real-time.
					</p>
					<Link to="/q/cursor-tokyo-meetup-ryo-qa">
						<Button size="lg" className="w-full">
							Join Q&A Session
						</Button>
					</Link>
				</Card>
			</div>
		</div>
	);
}
