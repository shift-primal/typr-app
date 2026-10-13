import { charStatus, type TypingState } from "#/game/typing";

export const TargetText = ({ state }: { state: TypingState }) => {
	const styles = {
		pending: "text-muted-foreground",
		correct: "text-success",
		incorrect: "text-destructive",
	};

	return (
		<div className="pointer-events-none select-none w-lg mx-auto">
			<p className="font-mono text-2xl leading-relaxed">
				{[...state.target].map((char, i) => (
					<span
						key={i}
						className={[
							styles[charStatus(state, i)],
							i === state.typed.length && "border-l-2 border-primary", // cursor
						]
							.filter(Boolean)
							.join(" ")}
					>
						{char}
					</span>
				))}
			</p>
		</div>
	);
};
