import {
	Box,
	Button,
	FormControl,
	Grid,
	TextField,
} from "@mui/material";
import { child, push, ref, update } from "firebase/database";
import React, { useRef, useState } from "react";
import { db } from "../utils/firebase";
import { useAuth } from "../AuthProvider";

export const FormComment = ({ currentReportId }) => {
	const { currentUser } = useAuth();
	const [comment, setComment] = useState();

	const postCommentRef = useRef();

	function writeCommentData(e) {
		e.preventDefault();

		const data = {
			description: postCommentRef.current?.value,
			createdAt: new Date().toLocaleString(),
			reportId: currentReportId,
			user: {
				id: currentUser?.uid,
				name: currentUser?.displayName,
			},
		};

		let newCommentKey = push(child(ref(db), "comments")).key;

		const updates = {};
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
