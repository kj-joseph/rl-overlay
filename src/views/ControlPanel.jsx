import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { v4 as uuidv4 } from "uuid";

import { styled } from '@mui/material/styles';
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid2";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";

import defaultConfig from "@/data/config.json";


import ("@/style/controlPanel.scss");


const ControlPanel = () => {

	const [clientId, setClientId] = useState("");
	const [config, setConfig] = useState();
	const [customIdIsOpen, setCustomIdIsOpen] = useState(false);
	const [seriesScore, setSeriesScore] = useState([0,0]);
	const [snackbarIsOpen, setSnackbarIsOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [customClientId, setCustomClientId] = useState("");

	const statsUrlPrefix = "http://rl.kdoughboy.com/stats/";

 	useEffect(() => {

		// on start, check for existing items in localstorage; if not, send default

		if (localStorage.hasOwnProperty("clientId")) {
			setClientId(localStorage.getItem("clientId"));
		} else {
			generateRandomClientId();
		}

		if (localStorage.hasOwnProperty("config")) {
			setConfig(JSON.parse(localStorage.getItem("config")));
		} else {
			setConfig(defaultConfig);
			localStorage.setItem("config", JSON.stringify(defaultConfig));
		}

		if (localStorage.hasOwnProperty("seriesScore")) {
			setSeriesScore(JSON.parse(localStorage.getItem("seriesScore")));
		} else {
			localStorage.setItem("seriesScore", JSON.stringify(seriesScore));
		}

	}, []);

	const openCustomIdDialog = () => {
		setCustomIdIsOpen(true);
	}

	const closeCustomIdDialog = () => {
		setCustomIdIsOpen(false);
		setCustomClientId("");
	}

	const saveCustomIdDialog = async () => {
		if (!customClientId) {
			openSnackbar("Client ID is required");
		} else {
			await setClientId(customClientId);
			try {
				await localStorage.setItem("clientId", customClientId);
				openSnackbar("New Client ID saved");
				closeCustomIdDialog();
			} catch (err) {
				console.error(err.message);
				openSnackbar("Error saving Client ID");
			}
		}
	}

	const openSnackbar = (message) => {
		setSnackbarMessage(message);
		setSnackbarIsOpen(true);
	}

	const closeSnackbar = () => {
		setSnackbarMessage(null);
		setSnackbarIsOpen(false);
	}

	const saveClientId = async (newClientId) => {
		await setClientId(newClientId);
		try {
			await localStorage.setItem("clientId", newClientId);
		} catch (err) {
			console.error(err.message);
			openSnackbar("Error saving Client ID");
		}
	}

	const generateRandomClientId = async () => {
		await saveClientId(uuidv4());
		openSnackbar("New random Client ID saved");
	}

	const copyClientIdToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(clientId);
			openSnackbar("Client ID Copied");
		} catch (err) {
			console.error(err.message);
			openSnackbar("Error copying Client ID");
		}
	}

	const copyStatsUrlToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(`${statsUrlPrefix}${clientId}`);
			openSnackbar("Stats page URL Copied");
		} catch (err) {
			console.error(err.message);
			openSnackbar("Error copying stats page URL");
		}
	}


	const Item = styled("div")(({ theme }) => ({
		background: "transparent",
		padding: theme.spacing(2),
		textAlign: "left",
		color: "#ffffff",
	  }));

	return (
		<div id="ControlPanel">

			<Dialog
				open={customIdIsOpen}
				onClose={closeCustomIdDialog}
			>
				<DialogContent>
{/* 					<TextField
						id=""
						variant="outlined"
						onChange={(e) => setCustomClientId(e.target.value)}
						value={customClientId}
					/>
 */}
					<FormControl variant="outlined" required>
						<InputLabel htmlFor="newClientId">New Client ID</InputLabel>
						<OutlinedInput
							id="newClientId"
							label="New Client ID"
							onChange={(e) => setCustomClientId(e.target.value)}
							value={customClientId}
						/>
					</FormControl>



				</DialogContent>
				<DialogActions>
					<Button onClick={saveCustomIdDialog}>Save</Button>
					<Button color="inherit" onClick={closeCustomIdDialog}>Cancel</Button>
				</DialogActions>
			</Dialog>

			<Snackbar
				autoHideDuration={4000}
				open={snackbarIsOpen}
				onClose={closeSnackbar}
				message={snackbarMessage}
			/>


			<Container>
				<Grid container spacing={2}>

					<Grid size={4}>
						<Item >
							<strong>Client ID:</strong> {clientId}<br />
							<strong>Stats page URL:</strong> {statsUrlPrefix}{clientId}

						</Item>
					</Grid>

					<Grid size={4}>
						<Item>
							<Button variant="contained" onClick={copyStatsUrlToClipboard}>Copy Stats URL</Button>
							<Button variant="outlined" onClick={copyClientIdToClipboard}>Copy Id</Button>
						</Item>
					</Grid>

					<Grid size={4}>
					<Item>
						<Button variant="contained" onClick={openCustomIdDialog}>Set Custom Id</Button>
						<Button variant="outlined" color="warning" onClick={generateRandomClientId}>New Random Id</Button>
					</Item>
					</Grid>

				</Grid>
			</Container>

{/* 			<Container>
				<Row>
					<Col>
					</Col>
					<Col>
						<Form.Control type="text" />
						<Button>Set Custom Id</Button>
						<Button onClick={generateRandomClientId}>New Random Id</Button>
					</Col>
					<Col>
						<Button variant="secondary" onClick={copyClientIdToClipboard}>Copy Id</Button>
						<Button variant="success" onClick={copyStatsUrlToClipboard}>Copy Stats URL</Button>
					</Col>


				</Row>



			</Container>
 */}


		</div>
	)

}

export default ControlPanel;
