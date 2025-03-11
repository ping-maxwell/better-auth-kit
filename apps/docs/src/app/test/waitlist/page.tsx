"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useCallback, useState } from "react";

export default function TestWaitlistPage() {
	const [email, setEmail] = useState("test@gmail.com");
	const [name, setName] = useState("Bob");

	const createWaitlistUser = useCallback(async () => {
		// const res = await authClient.waitlist.addUser({
		// 	email: email,
		// 	name: name,
		// });
		// console.log(res);
	}, [email, name]);

	return (
		<div className="flex justify-center items-center w-screen h-screen flex-col gap-10 p-32">
			<div className="w-[500px] h-[500px] flex justify-center items-center gap-10 flex-col">
				<Input
					placeholder="Name"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
				<Input
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<Button onClick={() => createWaitlistUser()}>Add waitlist user</Button>
			</div>
		</div>
	);
}
