import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { v4 as uuidv4 } from "uuid";


import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid2";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import { styled, ThemeProvider, createTheme } from "@mui/material/styles";

import defaultConfig from "@/data/config.json";


import ("@/style/controlPanel.scss");

const defaultTeamData = [
	{
		"color_primary": "",
		"color_secondary": "",
		"name": "",
		"score": 0
	},
	{
		"color_primary": "",
		"color_secondary": "",
		"name": "",
		"score": 0
	}
];

const defaultSeriesScore = [0, 0];

const panelTheme = createTheme({
	palette: {
		mode: "dark",
		primary: {
			main: "#ffffff",
			secondary: "#999999",
		},
	},
});

const Item = styled("div")(({ theme }) => ({
	background: "transparent",
	padding: theme.spacing(1),
	textAlign: "left",
	color: "#ffffff",
  }));

const ControlPanel = () => {

	const [clientId, setClientId] = useState("");
	const [config, setConfig] = useState(defaultConfig);
	const [customClientId, setCustomClientId] = useState("");
	const [currentDialog, setCurrentDialog] = useState(null);
	const [seriesScore, setSeriesScore] = useState(defaultSeriesScore);
	const [teamData, setTeamData] = useState(defaultTeamData);
	const [snackbarIsOpen, setSnackbarIsOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");

	const [fieldsWithChanges, setFieldsWithChanges] = useState([]);
	const [logoOverride, setLogoOverride] = useState("");
	const [headerOverride, setHeaderOverride] = useState(""); // TODO: handle multiple headers
	const [showSeriesOverride, setShowSeriesOverride] = useState(false);
	const [seriesTypeOverride, setSeriesTypeOverride] = useState("");
	const [seriesLengthOverride, setSeriesLengthOverride] = useState(0);
	const [teamNameOverride, setTeamNameOverride] = useState(["", ""]);
	const [franchiseOverride, setFranchiseOverride] = useState(["", ""]);
	const [teamLogoOverride, setTeamLogoOverride] = useState(["", ""]);
	const [seriesScoreOverride, setSeriesScoreOverride] = useState(defaultSeriesScore);

	const statsUrlPrefix = "http://rl.kdoughboy.com/stats/";

 	useEffect(() => {

		// on start, check for existing items in localstorage; if not, send default

		if (localStorage.hasOwnProperty("clientId")) {
			setClientId(localStorage.getItem("clientId"));
		} else {
			generateRandomClientId();
		}

		if (localStorage.hasOwnProperty("config")) {
			setConfigValuesFromLocalStorage();
		} else {
			setConfigValuesToDefault();
		}

		if (localStorage.hasOwnProperty("seriesScore")) {
			setSeriesScoreFromLocalStorage();
		} else {
			localStorage.setItem("seriesScore", JSON.stringify(seriesScore));
		}

		if (localStorage.hasOwnProperty("teamData")) {
			setTeamData(JSON.parse(localStorage.getItem("teamData")));
		} else {
			setConfig(defaultTeamData);
			localStorage.setItem("teamData", JSON.stringify(defaultTeamData));
		}

		// listen for localstorage updates for game data and series score
		window.onstorage = (event) => {
			switch(event.key) {
				case "teamData":
					if(event.newValue !== null) {
						setTeamData(JSON.parse(event.newValue));
					}
					break;

				case "seriesScore":
					const seriesScoreIn = JSON.parse(localStorage.getItem("seriesScore"));
					setSeriesScore(seriesScoreIn);
					setSeriesScoreOverride(seriesScoreIn);
					break;
			}
		};
	}, []);

	// check for unsaved changes
	useEffect(() => {
		if (config.hasOwnProperty("teams")) {
			const tempFieldsWithChanges = [];
			for (let teamnum in config.teams) {
				if (teamNameOverride[teamnum] !== config.teams[teamnum].name) {
					tempFieldsWithChanges.push(`teamNameOverride${teamnum}`);
				}
				if (franchiseOverride[teamnum] !== config.teams[teamnum].franchise) {
					tempFieldsWithChanges.push(`franchiseOverride${teamnum}`);
				}
				if (teamLogoOverride[teamnum] !== config.teams[teamnum].logo) {
					tempFieldsWithChanges.push(`teamLogoOverride${teamnum}`);
				}
				if (seriesScoreOverride[teamnum] !== seriesScore[teamnum]) {
					tempFieldsWithChanges.push(`seriesScoreOverride${teamnum}`);
				}
				// TODO: handle multiple headers
				if (headerOverride !== config.general.headers[0]) {
					tempFieldsWithChanges.push("headerOverride");
				}
				if (seriesTypeOverride !== config.series.type) {
					tempFieldsWithChanges.push("seriesTypeOverride");
				}
				if (seriesLengthOverride !== config.series.maxGames) {
					tempFieldsWithChanges.push("seriesLengthOverride");
				}
				if (showSeriesOverride !== config.series.show) {
					tempFieldsWithChanges.push("showSeriesOverride");
				}
				if (logoOverride !== config.general.brandLogo) {
					tempFieldsWithChanges.push("logoOverride");
				}
			}
			setFieldsWithChanges(tempFieldsWithChanges);
		}

	}, [teamNameOverride, franchiseOverride, teamLogoOverride, seriesScoreOverride, headerOverride, seriesTypeOverride, seriesLengthOverride, showSeriesOverride, logoOverride]);

	const fieldHasChanges = (fieldName) => fieldsWithChanges.indexOf(fieldName) > -1;

	const openDialog = (dialog) => {
		setCurrentDialog(dialog);
	}

	const closeDialog = () => {
		setCurrentDialog(null);
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
				closeDialog();
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

	const changeSeriesScoreOverride = (score, team) => {
		if (Number.isInteger(Number(score))) {
			const tempSeriesScoreOverride = [... seriesScoreOverride];
			tempSeriesScoreOverride[team]= Number(score);
			setSeriesScoreOverride(tempSeriesScoreOverride);
		}
	}

	const changeTeamNameOverride = (name, team) => {
		const tempTeamNameOverride = [... teamNameOverride];
		tempTeamNameOverride[team]= name;
		setTeamNameOverride(tempTeamNameOverride);
	}

	const changeFranchiseOverride = (name, team) => {
		const tempFranchiseOverride = [... franchiseOverride];
		tempFranchiseOverride[team]= name;
		setFranchiseOverride(tempFranchiseOverride);
	}

	const changeTeamLogoOverride = (logo, team) => {
		const tempTeamLogoOverride = [... teamLogoOverride];
		tempTeamLogoOverride[team]= logo;
		setTeamLogoOverride(tempTeamLogoOverride);
	}

	const changeShowSeriesOverride = (value) => {
		setShowSeriesOverride(value);
	}

	const changeSeriesTypeOverride = (type) => {
		setSeriesTypeOverride(type);
	}

	const changeSeriesLengthOverride = (length) => {
		if (Number.isInteger(Number(length))) {
			setSeriesLengthOverride(Number(length));
		}
	}

	const setConfigValuesFromLocalStorage = () => {
		const loadedConfig = JSON.parse(localStorage.getItem("config"));
		setConfig(loadedConfig);
		setTeamNameOverride([loadedConfig.teams[0].name, loadedConfig.teams[1].name]);
		setFranchiseOverride([loadedConfig.teams[0].franchise, loadedConfig.teams[1].franchise]);
		setTeamLogoOverride([loadedConfig.teams[0].logo, loadedConfig.teams[1].logo]);
		setSeriesTypeOverride(loadedConfig.series.type);
		setSeriesLengthOverride(loadedConfig.series.maxGames);
		setShowSeriesOverride(loadedConfig.series.show);
		setHeaderOverride(loadedConfig.general.headers[0]);
		setLogoOverride(loadedConfig.general.brandLogo);
	}

	const setConfigValuesToDefault = () => {
		setConfig(defaultConfig);
		localStorage.setItem("config", JSON.stringify(defaultConfig));
	}

	const setSeriesScoreToDefault = () => {
		setSeriesScore(defaultSeriesScore);
		setSeriesScoreOverride(defaultSeriesScore);
		localStorage.setItem("seriesScore", JSON.stringify(defaultSeriesScore))
	}

	const setAllValuesToDefault = () => {
		setConfigValuesToDefault();
		setSeriesScoreToDefault();
		closeDialog();
	}

	const setSeriesScoreFromLocalStorage = () => {
		const seriesScoreIn = JSON.parse(localStorage.getItem("seriesScore"));
		setSeriesScore(seriesScoreIn);
		setSeriesScoreOverride(seriesScoreIn);
	}

	// TODO: handle multiple headers
	const changeHeaderOverride = (text) => {
		setHeaderOverride(text);
	}

	const changeLogoOverride = (logo) => {
		setLogoOverride(logo);
	}

	const resetFieldValues = () => {
		setConfigValuesFromLocalStorage();
		setSeriesScoreFromLocalStorage();
	}

	const saveToLocalStorage = () => {
		setSeriesScore(seriesScoreOverride);
		localStorage.setItem("seriesScore", JSON.stringify(seriesScoreOverride));

		const newConfig = {
			general: {
				...config.general,
				headers: [headerOverride],
				brandLogo: logoOverride,
			},
			series: {
				show: showSeriesOverride,
				type: seriesTypeOverride,
				display: "both",
				maxGames: seriesLengthOverride,
				override: "",
			},
			teams: [
				{
					...config.teams[0],
					name: teamNameOverride[0],
					franchise: franchiseOverride[0],
					logo: teamLogoOverride[0],
				},
				{
					...config.teams[1],
					name: teamNameOverride[1],
					franchise: franchiseOverride[1],
					logo: teamLogoOverride[1],
				},
			],
		};

		localStorage.setItem("config", JSON.stringify(newConfig));
		setConfig(newConfig);
		setFieldsWithChanges([]);
	}


	return (
		<div id="ControlPanel">
{/*
			<div>{JSON.stringify(config)}</div>
			<div>{JSON.stringify(teamData)}</div>
			<div>{JSON.stringify(fieldsWithChanges)}</div>
 */}

			<Dialog
				open={currentDialog === "customId"}
				onClose={closeDialog}
			>
				<DialogContent>
					<p>Make this unique; don't cross the streams.</p>
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
					<Button color="inherit" onClick={closeDialog}>Cancel</Button>
				</DialogActions>
			</Dialog>

			<Dialog
				open={currentDialog === "confirmDefault"}
				onClose={closeDialog}
			>
				<DialogContent>
					<p>This will set <strong><em>everything</em></strong> to default and save immediately.  Are you sure?</p>
				</DialogContent>
				<DialogActions>
					<Button onClick={setAllValuesToDefault}>Set to Default</Button>
					<Button color="inherit" onClick={closeDialog}>Cancel</Button>
				</DialogActions>
			</Dialog>

			<Snackbar
				autoHideDuration={4000}
				open={snackbarIsOpen}
				onClose={closeSnackbar}
				message={snackbarMessage}
			/>

			<h1>Overlay control panel</h1>

			<ThemeProvider theme={panelTheme}>

				<Container>
					<Grid container spacing={0} className="idGrid">

{/*
 						<Grid size={{xs: 12, md: 3}}>
							<Item >
								<strong>Client ID:</strong><br />{clientId}
							</Item>
						</Grid>
*/}

						<Grid size={{xs: 12, md: 5}}>
							<Item >
							<strong>Stats page URL:</strong><br />{statsUrlPrefix}{clientId}
							</Item>
						</Grid>

						<Grid size={{xs: 12, md: 4}} justifyContent="flex-end" offset="auto" display="flex">
							<Item>
								<Button
									size="small"
									variant="contained"
									color="inherit"
									onClick={() => {setCurrentDialog("customId")}}
								>
									Set Custom Id
								</Button>
								<Button
									variant="outlined"
									color="warning"
									onClick={generateRandomClientId}
								>
									New Random Id
								</Button>
							</Item>
						</Grid>

	{/* can't copy from within OBS; figure out later? */
	/* 					<Grid size={{xs: 12, md: 4}}>
							<Item>
								<Button variant="contained" onClick={copyStatsUrlToClipboard}>Copy Stats URL</Button>
								<Button variant="outlined" onClick={copyClientIdToClipboard}>Copy Id</Button>
							</Item>
						</Grid>
	*/}

						</Grid>

						<Grid container spacing={2} className="buttons">

							<Grid size={12}>
								<Button
									disabled={!fieldsWithChanges.length}
									variant="contained"
									color="success"
									onClick={saveToLocalStorage}
								>
									Save
								</Button>
								<Button
									disabled={!fieldsWithChanges.length}
									variant="outlined"
									color="warning"
									onClick={resetFieldValues}
								>
									Reset
								</Button>
								<Button
									// disabled={!hasChanges}
									variant="outlined"
									color="error"
									onClick={() => openDialog("confirmDefault")}
								>
									Set to Default
								</Button>
							</Grid>

						</Grid>

						<Grid container size={12} spacing={0} className="gridRow">

							<Grid size={{xs: 12, md: 3}}>
								<Item>
									<FormControl size="small" fullWidth>
										<InputLabel id="logoLabel" shrink>Logo</InputLabel>
										<Select
											notched
											labelId="logoLabel"
											id="logo"
											value={logoOverride}
											label="Logo"
											className={fieldHasChanges("logoOverride") ? "changedField" : ""}
											onChange={(e) => changeLogoOverride(e.target.value)}
										>
											<MenuItem value="">None</MenuItem>
											<MenuItem value="RSC-3s.png">RSC 3s</MenuItem>
											<MenuItem value="RSC-2s.png">RSC 2s</MenuItem>

										</Select>
									</FormControl>
								</Item>
							</Grid>

							<Grid size={{xs: 12, md: 9}}>
								<Item>
									<FormControl variant="outlined" size="small" fullWidth>
										<InputLabel shrink htmlFor={`header`}>Header</InputLabel>
										<OutlinedInput
											notched
											id="header"
											label="Header"
											onChange={(e) => changeHeaderOverride(e.target.value)}
											value={headerOverride}
											className={fieldHasChanges(`headerOverride`) ? "changedField" : ""}
										/>
									</FormControl>
								</Item>
							</Grid>

						</Grid>

						<Grid container size={12} spacing={0} className="gridRow">

							{/* TODO: Handle custom series text */}

							<Grid size={3}>
								<Item>
									<FormControl size="small" fullWidth>
										<InputLabel id="showSeriesLabel" shrink>Show Series?</InputLabel>
										<Select
											notched
											labelId="showSeriesLabel"
											id="showSeries"
											value={showSeriesOverride}
											label="Show Series?"
											className={fieldHasChanges("showSeriesOverride") ? "changedField" : ""}
											onChange={(e) => changeShowSeriesOverride(e.target.value)}
										>
											<MenuItem value={true}>Yes</MenuItem>
											<MenuItem value={false}>No</MenuItem>

										</Select>
									</FormControl>
								</Item>


{/* 								Show Series?
								<Checkbox
									value={showSeriesOverride}
									className={fieldHasChanges("showSeriesOverride") ? "changedField" : ""}
									onChange = {(e) => changeShowSeriesOverride(e.target.checked)}
								>

								</Checkbox>
 */}
							</Grid>

							<Grid size={6}>
								<Item>
									<FormControl size="small" fullWidth>
										<InputLabel id="seriesTypeLabel" shrink>Series Type</InputLabel>
										<Select
											notched
											labelId="seriesTypeLabel"
											id="seriesType"
											value={seriesTypeOverride}
											label="Series Type"
											className={fieldHasChanges("seriesTypeOverride") ? "changedField" : ""}
											onChange={(e) => changeSeriesTypeOverride(e.target.value)}
										>
											<MenuItem value="bestof">Best of</MenuItem>
											<MenuItem value="set">Set number of games</MenuItem>
											<MenuItem value="unlimited">Unlimited</MenuItem>

										</Select>
									</FormControl>

								</Item>
							</Grid>

							<Grid size={3}>
								<Item>
									<TextField
										fullWidth
										required
										inputProps={{
											min: 1,
											step: 1,
										}}
										id="seriesLength"
										type="number"
										size="small"
										label="Games"
										disabled={seriesTypeOverride === "unlimited"}
										value={seriesLengthOverride}
										onChange={(e) => changeSeriesLengthOverride(e.target.value)}
										className={fieldHasChanges("seriesLengthOverride") ? "changedField" : ""}
									/>
								</Item>
							</Grid>

						</Grid>


						<Grid container size={12} spacing={2} className="mainPanelGrid">
							{teamData.map((team, teamnum) => (
							<Grid container
								spacing={0}
								key={teamnum}
								size={{xs:12, md: 6}}
								className={`team team${teamnum}`}
								style={{
									"borderColor": `#${config.teams[teamnum].color ? config.teams[teamnum].color : team.color_primary}`,
								}}
							>

								<Grid size={12}>
									<Item>
										<strong>In Game:</strong> {team.name}
									</Item>
								</Grid>

								<Grid size={9}>
									<Item>
										<FormControl variant="outlined" size="small" fullWidth>
											<InputLabel shrink htmlFor={`teamNameOverride${teamnum}`}>Team Name</InputLabel>
											<OutlinedInput
												notched
												id={`teamNameOverride${teamnum}`}
												label="Team Name"
												onChange={(e) => changeTeamNameOverride(e.target.value, teamnum)}
												value={teamNameOverride[teamnum]}
												className={fieldHasChanges(`teamNameOverride${teamnum}`) ? "changedField" : ""}
											/>
										</FormControl><br />
										<FormControl variant="outlined" size="small" fullWidth>
											<InputLabel shrink htmlFor={`franchiseOverride${teamnum}`}>Franchise Name</InputLabel>
											<OutlinedInput
												notched
												id={`franchiseOverride${teamnum}`}
												label="Franchise Name"
												onChange={(e) => changeFranchiseOverride(e.target.value, teamnum)}
												value={franchiseOverride[teamnum]}
												className={fieldHasChanges(`franchiseOverride${teamnum}`) ? "changedField" : ""}
											/>
										</FormControl>
										<FormControl variant="outlined" size="small" fullWidth>
											<InputLabel shrink htmlFor={`teamLogoOverride${teamnum}`}>Team Logo</InputLabel>
											<OutlinedInput
												notched
												id={`teamLogoOverride${teamnum}`}
												label="Team Logo"
												onChange={(e) => changeTeamLogoOverride(e.target.value, teamnum)}
												value={teamLogoOverride[teamnum]}
												className={fieldHasChanges(`teamLogoOverride${teamnum}`) ? "changedField" : ""}
											/>
										</FormControl><br />
									</Item>
								</Grid>

								<Grid size={3}>
									<Item>
										<TextField
											required
											inputProps={{
												min: 0,
												step: 1,
											}}
											id={`seriesScoreOverride${teamnum}`}
											type="number"
											size="small"
											label="Games"
											value={seriesScoreOverride[teamnum]}
											onChange={(e) => changeSeriesScoreOverride(e.target.value, teamnum)}
											className={fieldHasChanges(`seriesScoreOverride${teamnum}`) ? "changedField" : ""}
										/>
									</Item>
								</Grid>

							</Grid>

						))}

					</Grid>


				</Container>

			</ThemeProvider>




		</div>
	)

}

export default ControlPanel;
