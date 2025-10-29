import { Link } from "@tanstack/react-router";
import { Github, MessageSquare } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { LanguageToggle } from "./language-toggle";
import { useLanguage } from "./language-provider";

export default function Header() {
	const { t } = useLanguage();
	
	return (
		<div>
			<div className="flex flex-row items-center justify-between px-4 py-3">
				<Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight">
					<MessageSquare className="h-6 w-6 text-blue-600" />
					{t("appName")}
				</Link>
				<div className="flex items-center gap-2">
					<a
						href="https://github.com/gunta/slidont"
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center justify-center rounded-md hover:bg-accent h-9 w-9 transition-colors"
						aria-label={t("viewSourceCode")}
					>
						<Github className="h-5 w-5" />
					</a>
					<LanguageToggle />
					<ModeToggle />
				</div>
			</div>
			<hr />
		</div>
	);
}
