import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "@slidont/backend/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare, Wifi, WifiOff, AlertCircle, Users, Rocket } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { motion } from "framer-motion";
import { Sparkle } from "@/components/ui/sparkle";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});

function HomeComponent() {
	const healthCheck = useQuery(api.healthCheck.get);
	const { t } = useLanguage();

	return (
		<div className="container mx-auto max-w-4xl px-4 py-12">
			<motion.div
				className="text-center mb-12"
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
			>
				<div className="flex items-center justify-center gap-3 mb-4">
					<motion.div
						animate={{ rotate: [0, 10, -10, 0] }}
						transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
					>
						<MessageSquare className="h-12 w-12 text-blue-600" />
					</motion.div>
					<h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
						{t("appName")}
					</h1>
				</div>
				<motion.p
					className="text-xl text-muted-foreground flex items-center justify-center gap-2"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.3 }}
				>
					<Sparkle size={20} />
					{t("realTimeQA")}
				</motion.p>
			</motion.div>

			<div className="grid gap-6 mb-8">
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.2 }}
				>
					<Card className="p-6 hover:shadow-lg transition-shadow">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<motion.div
									animate={{ rotate: [0, 360] }}
									transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
								>
									{healthCheck === "OK" ? (
										<Wifi className="h-5 w-5 text-green-500" />
									) : healthCheck === undefined ? (
										<WifiOff className="h-5 w-5 text-orange-400" />
									) : (
										<AlertCircle className="h-5 w-5 text-red-500" />
									)}
								</motion.div>
								<div>
									<h2 className="mb-2 font-semibold">{t("connectionStatus")}</h2>
									<div className="flex items-center gap-2">
										{healthCheck === "OK" && (
											<motion.div
												className="h-2 w-2 rounded-full bg-green-500"
												animate={{
													scale: [1, 1.5, 1],
													opacity: [1, 0.5, 1],
												}}
												transition={{
													duration: 2,
													repeat: Infinity,
													ease: "easeInOut",
												}}
											/>
										)}
										{healthCheck === undefined && (
											<motion.div
												className="h-2 w-2 rounded-full bg-orange-400"
												animate={{
													scale: [1, 1.5, 1],
													opacity: [1, 0.5, 1],
												}}
												transition={{
													duration: 2,
													repeat: Infinity,
													ease: "easeInOut",
												}}
											/>
										)}
										{healthCheck !== "OK" && healthCheck !== undefined && (
											<div className="h-2 w-2 rounded-full bg-red-500" />
										)}
										<span className="text-sm text-muted-foreground">
											{healthCheck === undefined
												? t("checking")
												: healthCheck === "OK"
													? t("connected")
													: t("error")}
										</span>
									</div>
								</div>
							</div>
						</div>
					</Card>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.4 }}
				>
					<Card className="p-8 hover:shadow-lg transition-shadow">
						<div className="flex items-center gap-3 mb-2">
							<motion.div
								whileHover={{ scale: 1.2, rotate: 10 }}
								transition={{ type: "spring", stiffness: 400 }}
							>
								<Users className="h-6 w-6 text-blue-600" />
							</motion.div>
							<h2 className="text-2xl font-semibold">{t("cursorTokyoMeetup")}</h2>
						</div>
						<p className="mb-6 text-muted-foreground">
							{t("joinDescription")}
						</p>
						<Link to="/q/$eventSlug" params={{ eventSlug: "cursor-tokyo-meetup-ryo-qa" }}>
							<motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
								<Button size="lg" className="w-full gap-2">
									<motion.div
										animate={{ y: [0, -5, 0] }}
										transition={{ duration: 1.5, repeat: Infinity }}
									>
										<Rocket className="h-5 w-5" />
									</motion.div>
									{t("joinQASession")}
								</Button>
							</motion.div>
						</Link>
					</Card>
				</motion.div>
			</div>
		</div>
	);
}
