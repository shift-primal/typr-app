import { useForm } from "@tanstack/react-form";
import { z } from "zod";

import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { toast } from "#/components/ui/toast";
import type { Socket } from "#/hooks/use-socket";
import type { ClientMessage } from "#/server/realtime/protocol";

const formSchema = z.object({
	roomId: z.string().length(4, 'Invalid Room ID. Valid Format: "A1B2"'),
	name: z.string().min(2, "Minimum 2 characters").max(16, "Max 16 characters"),
});

const requestRoom = async (
	socket: Socket,
	message: ClientMessage,
	successTitle: string,
) => {
	try {
		const reply = await socket.request(message);
		if (reply.type === "room_error") {
			toast.add({ title: "Could not enter room", description: reply.message });
			return;
		}
		if (reply.type !== "room_joined") return;
		toast.add({
			title: successTitle,
			description: `Successfully entered room ${reply.roomId}`,
		});
	} catch (e) {
		console.error(e);
	}
};

const joinRoom = (socket: Socket, roomId: string) =>
	requestRoom(socket, { type: "join_room", roomId }, "Joined room!");

const createRoom = (socket: Socket) =>
	requestRoom(socket, { type: "create_room" }, "Created room!");

export const EnterRoom = ({ socket }: { socket: Socket }) => {
	const form = useForm({
		defaultValues: {
			roomId: "",
			name: "",
		},
		validators: {
			onSubmit: formSchema,
		},
		onSubmit: ({ value }) => {
			joinRoom(socket, value.roomId);
		},
	});

	return (
		<Card className="w-full sm:max-w-md">
			<CardHeader>
				<CardTitle>Join a room</CardTitle>
				<CardDescription>
					To start, join a room with an ID, or create one
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form
					id="join-or-create-room"
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
				>
					<FieldSet>
						<FieldGroup>
							<form.Field name="roomId">
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>Room ID</FieldLabel>
											<Input
												type="text"
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												aria-invalid={isInvalid}
												placeholder="A1B2"
												autoComplete="off"
											/>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
											<FieldDescription>
												The ID for the room you want to join
											</FieldDescription>
										</Field>
									);
								}}
							</form.Field>
						</FieldGroup>
						<FieldGroup>
							<form.Field name="name">
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>Name</FieldLabel>
											<Input
												type="text"
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												aria-invalid={isInvalid}
												placeholder="Kasper"
												autoComplete="off"
											/>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
											<FieldDescription>
												Your display name (will be shown to others)
											</FieldDescription>
										</Field>
									);
								}}
							</form.Field>
						</FieldGroup>
					</FieldSet>
				</form>
			</CardContent>
			<CardFooter>
				<Field orientation="horizontal">
					<Button type="button" variant="outline" onClick={() => form.reset()}>
						Reset
					</Button>
					<Button type="submit" form="join-or-create-room" variant="outline">
						Submit
					</Button>
					<Button
						type="button"
						variant="default"
						onClick={() => createRoom(socket)}
					>
						Create
					</Button>
				</Field>
			</CardFooter>
		</Card>
	);
};
