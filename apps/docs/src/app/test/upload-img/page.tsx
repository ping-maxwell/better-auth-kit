"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { compressImage } from "@better-auth-kit/profile-image";
import { useState } from "react";

export default function Page() {
	const [image, setImage] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(null);

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setImage(file);
		setPreview(URL.createObjectURL(file));
	};

	const uploadImage = async () => {
		if (!image) return;
		console.log("Uploading", image);

		const blob = await compressImage(image);
		if (!blob) return;

		// const res = await authClient.profileImage.upload({
		// 	image: blob,
		// 	test: 2,
		// });
		// console.log(res);
	};

	return (
		<div className="w-screen h-screen flex justify-center items-center">
			<div className="flex flex-col gap-4 w-full max-w-sm">
				<Label htmlFor="image-upload">Upload Image</Label>
				<Input
					id="image-upload"
					type="file"
					accept="image/*"
					onChange={handleFileChange}
				/>
				{preview && (
					<img
						src={preview}
						alt="Preview"
						className="rounded-xl shadow-md object-cover max-h-64"
					/>
				)}
				{image && (
					<>
						<Button onClick={uploadImage}>Upload Image</Button>
						<Button
							variant="secondary"
							onClick={() => {
								setImage(null);
								setPreview(null);
							}}
						>
							Clear Image
						</Button>
					</>
				)}
			</div>
		</div>
	);
}
