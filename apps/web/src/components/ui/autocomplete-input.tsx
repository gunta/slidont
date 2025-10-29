import * as React from "react";
import { Input } from "./input";
import { cn } from "@/lib/utils";

export interface Option {
	name: string;
	firstName: string;
	lastName: string;
}

interface AutocompleteInputProps extends Omit<React.ComponentProps<"input">, "onChange"> {
	options: Option[];
	onValueChange?: (value: string) => void;
	maxSuggestions?: number;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function AutocompleteInput({
	options,
	onValueChange,
	maxSuggestions = 5,
	className,
	...props
}: AutocompleteInputProps) {
	const [inputValue, setInputValue] = React.useState(props.value?.toString() || "");
	const [showSuggestions, setShowSuggestions] = React.useState(false);
	const [selectedIndex, setSelectedIndex] = React.useState(-1);
	const inputRef = React.useRef<HTMLInputElement>(null);
	const listRef = React.useRef<HTMLUListElement>(null);

	// Sync inputValue with props.value
	React.useEffect(() => {
		if (props.value !== undefined) {
			setInputValue(props.value.toString());
		}
	}, [props.value]);

	// Filter options based on input value
	const filteredOptions = React.useMemo(() => {
		if (!inputValue.trim()) return [];
		
		const searchTerm = inputValue.toLowerCase();
		return options
			.filter((option) => {
				const name = option.name.toLowerCase();
				const firstName = option.firstName.toLowerCase();
				const lastName = option.lastName.toLowerCase();
				const fullName = `${firstName} ${lastName}`.toLowerCase();
				
				return (
					name.includes(searchTerm) ||
					firstName.includes(searchTerm) ||
					lastName.includes(searchTerm) ||
					fullName.includes(searchTerm)
				);
			})
			.slice(0, maxSuggestions);
	}, [inputValue, options, maxSuggestions]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setInputValue(value);
		setShowSuggestions(true);
		setSelectedIndex(-1);
		onValueChange?.(value);
		props.onChange?.(e);
	};

	const handleSelect = (option: Option) => {
		setInputValue(option.name);
		setShowSuggestions(false);
		setSelectedIndex(-1);
		onValueChange?.(option.name);
		// Trigger onChange event for form compatibility
		if (inputRef.current) {
			const syntheticEvent = {
				target: { value: option.name },
				currentTarget: inputRef.current,
			} as React.ChangeEvent<HTMLInputElement>;
			props.onChange?.(syntheticEvent);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (!showSuggestions || filteredOptions.length === 0) {
			if (e.key === "ArrowDown" || e.key === "ArrowUp") {
				e.preventDefault();
			}
			return;
		}

		switch (e.key) {
			case "ArrowDown":
				e.preventDefault();
				setSelectedIndex((prev) =>
					prev < filteredOptions.length - 1 ? prev + 1 : prev
				);
				break;
			case "ArrowUp":
				e.preventDefault();
				setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
				break;
			case "Enter":
				e.preventDefault();
				if (selectedIndex >= 0 && selectedIndex < filteredOptions.length) {
					handleSelect(filteredOptions[selectedIndex]);
				}
				break;
			case "Escape":
				setShowSuggestions(false);
				setSelectedIndex(-1);
				break;
		}
	};

	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		// Delay hiding suggestions to allow click on suggestion
		setTimeout(() => {
			setShowSuggestions(false);
			setSelectedIndex(-1);
		}, 200);
	};

	React.useEffect(() => {
		// Scroll selected item into view
		if (selectedIndex >= 0 && listRef.current) {
			const selectedElement = listRef.current.children[selectedIndex] as HTMLElement;
			if (selectedElement) {
				selectedElement.scrollIntoView({ block: "nearest" });
			}
		}
	}, [selectedIndex]);

	return (
		<div className="relative w-full">
			<Input
				{...props}
				ref={inputRef}
				value={inputValue}
				onChange={handleInputChange}
				onKeyDown={handleKeyDown}
				onBlur={handleBlur}
				onFocus={() => inputValue && setShowSuggestions(true)}
				className={className}
				autoComplete="off"
				data-1p-ignore
			/>
			{showSuggestions && filteredOptions.length > 0 && (
				<ul
					ref={listRef}
					className="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-md border bg-popover shadow-md animate-in fade-in-0 zoom-in-95"
				>
					{filteredOptions.map((option, index) => (
						<li
							key={`${option.name}-${index}`}
							className={cn(
								"cursor-pointer px-3 py-2 text-sm transition-colors",
								index === selectedIndex
									? "bg-accent text-accent-foreground"
									: "hover:bg-accent hover:text-accent-foreground"
							)}
							onMouseDown={(e) => {
								e.preventDefault(); // Prevent input blur
								handleSelect(option);
							}}
							onMouseEnter={() => setSelectedIndex(index)}
						>
							<div className="font-medium">{option.name}</div>
							{(option.firstName || option.lastName) && (
								<div className="text-xs text-muted-foreground">
									{option.firstName} {option.lastName}
								</div>
							)}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

