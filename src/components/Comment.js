import React from "react";

import { Typography, Box, Grid } from "@mui/material";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";

export const CommentReport = ({ item }) => {
	return (
		<Box mt={2} mb={4}>
			<Grid container spacing={2}>
				<Grid item>
					<ChatBubbleIcon />
				</Grid>
				<Grid item>
					<Typography fontWeight="bold">{item.user.name}</Typography>
				</Grid>
			</Grid>

			<Box ml={4} mt={1}>
				<Typography>{item.description}</Typography>
			</Box>
		</Box>
	);
};
