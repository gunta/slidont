import { Link } from "@tanstack/react-router";
import { ModeToggle } from "./mode-toggle";

export default function Header() {
	return (
		<div>
			<div className="flex flex-row items-center justify-between px-4 py-3">
				<Link to="/" className="text-2xl font-bold tracking-tight">
					Slidont
				</Link>
				<div className="flex items-center gap-2">
					<ModeToggle />
				</div>
			</div>
			<hr />
		</div>
	);
}
