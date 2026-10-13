import { useEffect, useRef, useState } from "react";

import { InvisibleInput } from "#/components/invisible-input";
import { TargetText } from "#/components/target-text";
import { generateText } from "#/game/text";
import { createTyping, type TypingState } from "#/game/typing";

export const Typing = () => {
	const target = generateText();

	const [typingState, setTypingState] = useState<TypingState>(() =>
		createTyping(target),
	);

	const [now, setNow] = useState(() => Date.now());

	const inputRef = useRef<HTMLInputElement>(null);

	const running =
		typingState.startedAt !== null && typingState.finishedAt !== null;

	useEffect(() => {
		if (!running) return;
		const id = setInterval(() => setNow(Date.now()), 250);
		return () => clearInterval(id);
	}, [running]);

	const restart = () => {
		setTypingState(createTyping(target));
		inputRef.current?.focus();
	};

	const handleChange = (value: string) =>
		setTypingState((p) => ({ ...p, typed: value }));

	return (
		<div
			className="w-full h-full"
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
			<button type="button" onClick={restart}>
				restart
			</button>
		</div>
	);
};
