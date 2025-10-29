import Header from "@/components/header";
import Loader from "@/components/loader";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/language-provider";
import { TabProvider } from "@/components/tab-provider";
import { Toaster } from "@/components/ui/sonner";
import {
	HeadContent,
	Outlet,
	createRootRouteWithContext,
	useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import "../index.css";

export interface RouterAppContext {}

export const Route = createRootRouteWithContext<RouterAppContext>()({
	component: RootComponent,
	head: () => ({
		meta: [
			{
				title: "slidont",
			},
			{
				name: "description",
				content: "slidont is a web application",
			},
		],
		links: [
			{
				rel: "icon",
				href: "/favicon.ico",
			},
		],
	}),
});

function RootComponent() {
	const isFetching = useRouterState({
		select: (s) => s.isLoading,
	});
	
	const location = useRouterState({
		select: (s) => s.location,
	});
	
	const isPresenterPage = location.pathname.startsWith("/p/");

	return (
		<>
			<HeadContent />
			<LanguageProvider>
				<TabProvider>
					<ThemeProvider
						attribute="class"
						defaultTheme="dark"
						disableTransitionOnChange
						storageKey="vite-ui-theme"
					>
					{isPresenterPage ? (
						<>{isFetching ? <Loader /> : <Outlet />}</>
					) : (
						<div className="flex flex-col h-svh">
							<div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
								<Header />
							</div>
							<div className="flex-1 overflow-auto">
								{isFetching ? <Loader /> : <Outlet />}
							</div>
						</div>
					)}
						<Toaster richColors />
					</ThemeProvider>
				</TabProvider>
			</LanguageProvider>
			<TanStackRouterDevtools position="bottom-left" />
		</>
	);
}
