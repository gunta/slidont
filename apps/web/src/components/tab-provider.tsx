import * as React from "react";

type TabType = "buzz" | "qa";

interface TabContextType {
	activeTab: TabType;
	setActiveTab: (tab: TabType) => void;
}

const TabContext = React.createContext<TabContextType | undefined>(undefined);

export function TabProvider({ children }: { children: React.ReactNode }) {
	const [activeTab, setActiveTab] = React.useState<TabType>("buzz");

	return (
		<TabContext.Provider value={{ activeTab, setActiveTab }}>
			{children}
		</TabContext.Provider>
	);
}

export function useTab() {
	const context = React.useContext(TabContext);
	if (context === undefined) {
		throw new Error("useTab must be used within a TabProvider");
	}
	return context;
}

