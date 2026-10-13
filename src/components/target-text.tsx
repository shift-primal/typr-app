import { charStatus, type TypingState } from "#/game/typing";

export const TargetText = ({ state }: { state: TypingState }) => {
	const styles = {
		pending: "text-muted-foreground",
		correct: "text-success",
		incorrect: "text-destructive",
	};

	return (
		<div className="pointer-events-none select-none w-lg">
			<p className="font-mono text-2xl leading-relaxed">
				{[...state.target].map((char, i) => (
					<span
						key={i}
						className={[
							styles[charStatus(state, i)],
							i === state.typed.length && "outline outline-offset-1.5", // cursor
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
