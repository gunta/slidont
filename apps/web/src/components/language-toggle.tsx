import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "./language-provider";

export function LanguageToggle() {
	const { language, setLanguage } = useLanguage();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon">
					<Languages className="h-[1.2rem] w-[1.2rem]" />
					<span className="sr-only">Toggle language</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem 
					onClick={() => setLanguage("en")} 
					className="gap-2"
				>
					<span className={language === "en" ? "font-semibold" : ""}>🇬🇧</span>
					English
				</DropdownMenuItem>
				<DropdownMenuItem 
					onClick={() => setLanguage("ja")} 
					className="gap-2"
				>
					<span className={language === "ja" ? "font-semibold" : ""}>🇯🇵</span>
					日本語
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

