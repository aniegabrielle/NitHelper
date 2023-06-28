import React, { useState } from "react";

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
import { child, push, ref, update } from "firebase/database";
import { useAuth } from "../AuthProvider";
import { db } from "../utils/firebase";
import { useNavigate } from "react-router-dom";

export const FormReport = () => {
	const { currentUser } = useAuth();
	const navigate = useNavigate();

	const [formValues, setFormValues] = useState({
		address: "",
		description: "",
		type: ""
	});

	function writeReportData(e) {
		e.preventDefault();

		const data = {
			type: formValues.type,
			address: formValues.address,
			description: formValues.description,
			status: "Não atendido",
			createdAt: new Date().toLocaleString(),
			user: {
				id: currentUser.uid,
				name: currentUser.displayName,
			},
		};

		let newReportKey = push(child(ref(db), "reports")).key;

		const updates = {};
		updates["/reports/" + newReportKey] = data;
		updates["/users/" + currentUser.uid + "/reports/" + newReportKey] = data;

		setFormValues({
			address: "",
			description: "",
			type: ""
		})

		navigate(0);

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
									value={formValues.type}
									label="Tipo de denúncia"
									onChange={(e) => setFormValues({ ...formValues, type: e.target.value })}
									sx={{ width: "100%" }}
									size="small"
								>
									<MenuItem value={"Iluminação"}>Iluminação</MenuItem>
									<MenuItem value={"Transporte"}>Transporte</MenuItem>
									<MenuItem value={"Condições de vias públicas"}>
										Condições de vias públicas
									</MenuItem>
									<MenuItem value={"Outros"}>Outros</MenuItem>
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
									size="small"
									onChange={(e) => setFormValues({ ...formValues, address: e.target.value })}
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
						multiline
						rows={2}
						maxRows={4}
						onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
					/>
					<Box
						sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}
					>
						<Button
							type="submit"
							variant="contained"
							sx={{ mt: 1, borderRadius: 10 }}
						>
							Registrar Problema
						</Button>
					</Box>
				</Box>
			</FormControl>
		</Card>
	);
};
