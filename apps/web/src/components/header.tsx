import { Link } from "@tanstack/react-router";
import { Github, MessageSquare } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { LanguageToggle } from "./language-toggle";
import { useLanguage } from "./language-provider";
import { motion } from "framer-motion";

export default function Header() {
	const { t } = useLanguage();
	
	return (
		<div>
			<div className="flex flex-row items-center justify-between px-4 py-3">
				<motion.div
					whileHover={{ scale: 1.05 }}
					transition={{ type: "spring", stiffness: 400 }}
				>
					<Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight">
						<motion.div
							animate={{ rotate: [0, 10, -10, 0] }}
							transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
						>
							<MessageSquare className="h-6 w-6 text-blue-600" />
						</motion.div>
						{t("appName")}
					</Link>
				</motion.div>
				<div className="flex items-center gap-2">
					<motion.a
						href="https://github.com/gunta/slidont"
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center justify-center rounded-md hover:bg-accent h-9 w-9 transition-colors"
						aria-label={t("viewSourceCode")}
						whileHover={{ scale: 1.1, rotate: 10 }}
						whileTap={{ scale: 0.9 }}
					>
						<Github className="h-5 w-5" />
					</motion.a>
					<LanguageToggle />
					<ModeToggle />
				</div>
			</div>
			<hr />
		</div>
	);
}
