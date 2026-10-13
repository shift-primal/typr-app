import { RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { InvisibleInput } from "#/components/invisible-input";
import { TargetText } from "#/components/target-text";
import { Timer } from "#/components/timer";
import { applyInput, createTyping, type TypingState } from "#/game/typing";

const blankTyping = (): TypingState => ({
	target: "",
	typed: "",
	startedAt: null,
	finishedAt: null,
	keystrokes: 0,
	errors: 0,
});

export const Typing = () => {
	const [typingState, setTypingState] = useState<TypingState>(blankTyping);

	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		setTypingState(createTyping());
	}, []);

	const restart = () => {
		setTypingState(createTyping());
		inputRef.current?.focus();
	};

	const handleChange = (value: string) =>
		setTypingState((p) => applyInput(p, value, Date.now()));

	return (
		<div
			className="w-full h-full flex items-center justify-center relative"
			onClick={() => {
				inputRef.current?.focus();
			}}
		>
			<InvisibleInput
				ref={inputRef}
				value={typingState.typed}
				onChange={handleChange}
			/>
			<TargetText state={typingState} />
			<div
				id="ui"
				className="absolute bottom-10 right-1/2 translate-1/2 w-md flex items-center justify-between"
			>
				<Timer
					startedAt={typingState.startedAt}
					finishedAt={typingState.finishedAt}
				/>
				<button
					type="button"
					onClick={restart}
					className="border border-foreground p-.5 cursor-pointer"
				>
					<RotateCcw />
				</button>
			</div>
		</div>
	);
};
