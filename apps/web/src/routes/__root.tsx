import Header from "@/components/header";
import Loader from "@/components/loader";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/language-provider";
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
	
	const isPresenterPage = location.pathname.startsWith("/presenter/");

	return (
		<>
			<HeadContent />
			<LanguageProvider>
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					disableTransitionOnChange
					storageKey="vite-ui-theme"
				>
					{isPresenterPage ? (
						<>{isFetching ? <Loader /> : <Outlet />}</>
					) : (
						<div className="grid grid-rows-[auto_1fr] h-svh">
							<Header />
							{isFetching ? <Loader /> : <Outlet />}
						</div>
					)}
					<Toaster richColors />
				</ThemeProvider>
			</LanguageProvider>
			<TanStackRouterDevtools position="bottom-left" />
		</>
	);
}
