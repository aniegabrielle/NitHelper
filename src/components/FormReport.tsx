import React, { useContext, useRef } from "react";

import {
	Box,
	Grid,
	Card,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	TextField,
	Button,
} from "@mui/material";
import { Report } from "../types/post";
import { child, push, ref, update } from "firebase/database";
import { AuthContext } from "../AuthProvider";
import { db } from "../utils/firebase";

export const FormReport = ({}) => {
	const { user } = useContext(AuthContext);

	const addressReportRef = useRef<HTMLInputElement>();
	const descriptionReportRef = useRef<HTMLInputElement>();

	const [reportType, setReportType] = React.useState("");

	function writeReportData(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const data = {
			type: reportType,
			address: addressReportRef.current?.value,
			description: descriptionReportRef.current?.value,
			status: "não atendido",
			createdAt: new Date().toLocaleString(),
			user: {
				id: user?.uid,
				name: user?.displayName,
			},
		} as unknown as Report;

		let newReportKey = push(child(ref(db), "reports")).key;

		const updates: any = {};
		updates["/reports/" + newReportKey] = data;
		updates["/users/" + user?.uid + "/reports/" + newReportKey] = data;

		return update(ref(db), updates);
	}

	return (
		<Card sx={{ borderRadius: 3, padding: 4, mt: 3 }}>
			<FormControl fullWidth>
				<Box component="form" onSubmit={writeReportData} noValidate>
					<FormControl fullWidth>
						<Grid container spacing={2}>
							<Grid item xs={6}>
								<InputLabel>Tipo de denúncia</InputLabel>
								<Select
									value={reportType}
									label="Tipo de denúncia"
									onChange={(e) => setReportType(e.target.value)}
									sx={{ width: "100%" }}
									size="small"
								>
									<MenuItem value={"iluminacao"}>Iluminação</MenuItem>
									<MenuItem value={"transporte"}>Transporte</MenuItem>
									<MenuItem value={"Condicoes de vias publicas"}>
										Condições de vias públicas
									</MenuItem>
									<MenuItem value={"outros"}>Outros</MenuItem>
								</Select>
							</Grid>
							<Grid item xs={6}>
								<TextField
									required
									fullWidth
									name="address-report"
									label="Endereço da denúncia"
									type="address"
									id="address_report"
									inputRef={addressReportRef}
									size="small"
								/>
							</Grid>
						</Grid>
					</FormControl>
					<TextField
						margin="normal"
						required
						fullWidth
						name="description-report"
						label="Descricao da denuncia"
						type="description"
						id="description_report"
						inputRef={descriptionReportRef}
						multiline
						rows={2}
						maxRows={4}
					/>
					<Box
						sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}
					>
						<Button type="submit" variant="contained" sx={{ mt: 1 }}>
							Registrar Problema
						</Button>
					</Box>
				</Box>
			</FormControl>
		</Card>
	);
};
