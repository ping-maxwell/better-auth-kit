import { createContext, useContext, useState } from "react";

interface BuilderContextType {
	builder: any;
	setBuilder: (builder: any) => void;
}

//@ts-ignore
export const BuilderContext = createContext<BuilderContextType>({});

export function BuilderProvider({
	children,
	defaultValue,
}: {
	children: React.ReactNode;
	defaultValue: any;
}) {
	const [builder, setBuilder] = useState(defaultValue);
	return (
		<BuilderContext.Provider value={{ builder, setBuilder }}>
			{children}
		</BuilderContext.Provider>
	);
}

export function useBuilder() {
	if (!useContext(BuilderContext)) {
		throw new Error("useBuilder must be used within a BuilderProvider");
	}
	return useContext(BuilderContext);
}
