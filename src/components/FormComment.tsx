import {
	Box,
	Button,
	FormControl,
	Grid,
	InputLabel,
	Modal,
	TextField,
} from "@mui/material";
import { child, push, ref, set, update } from "firebase/database";
import React, { useContext, useEffect, useRef, useState } from "react";
import { db } from "../utils/firebase";
import { AuthContext } from "../AuthProvider";
import { Comment } from "../types/post";

export const FormComment = ({
	currentReportId,
}: {
	currentReportId: string;
}) => {
	const { user } = useContext(AuthContext);
	const [comment, setComment] = useState<string>();

	const postCommentRef = useRef<HTMLInputElement>();

	function writeCommentData(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const data = {
			description: postCommentRef.current?.value,
			createdAt: new Date().toLocaleString(),
			reportId: currentReportId,
			user: {
				id: user?.uid,
				name: user?.displayName,
			},
		} as unknown as Comment;

		let newCommentKey = push(child(ref(db), "comments")).key;

		const updates: any = {};
		updates["/comments/" + newCommentKey] = data;
		updates["/reports/" + currentReportId + "/comments/" + newCommentKey] =
			data;

		setComment("");
		return update(ref(db), updates);
	}

	return (
		<FormControl fullWidth>
			<Box
				component="form"
				onSubmit={writeCommentData}
				noValidate
				sx={{ mt: 1, width: "100%" }}
			>
				<Grid container spacing={2}>
					<Grid item xs={9}>
						<TextField
							required
							fullWidth
							name="description-report"
							label="Comente aqui"
							type="description"
							id="description_report"
							inputRef={postCommentRef}
							multiline
							maxRows={4}
							size="small"
							value={comment}
							onChange={(e) => setComment(e.target.value)}
						/>
					</Grid>
					<Grid item xs={3}>
						<Button type="submit" fullWidth variant="contained">
							Comentar
						</Button>
					</Grid>
				</Grid>
			</Box>
		</FormControl>
	);
};
