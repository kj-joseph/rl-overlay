import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { v4 as uuidv4 } from "uuid";

import { getTierList } from "@/services/tierService";

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

	const [leagueId, setLeagueId] = useState(-1);
	const [tierLists, setTierLists] = useState({});

	const [fieldsWithChanges, setFieldsWithChanges] = useState([]);
	const [streamTypeField, setStreamTypeField] = useState("RSC3-regular"); // default to regular season if not already set
	const [logoField, setLogoField] = useState("");
	const [headerField, setHeaderField] = useState(""); // TODO: handle multiple headers? or send season/matchday/tier data separately?
	const [seasonNumberField, setSeasonNumberField] = useState(22); // TODO: pull default from elsewhere?
	const [matchdayNumberField, setmatchdayNumberField] = useState(1);
	const [tierField, setTierField] = useState(""); // TODO: pull default from elsewhere?
	const [showSeriesField, setShowSeriesField] = useState(false);
	const [seriesTypeField, setSeriesTypeField] = useState("");
	const [seriesLengthField, setSeriesLengthField] = useState(0);
	const [teamNameField, setTeamNameField] = useState(["", ""]);
	const [franchiseField, setFranchiseField] = useState(["", ""]);
	const [teamLogoField, setTeamLogoField] = useState(["", ""]);
	const [seriesScoreField, setSeriesScoreField] = useState(defaultSeriesScore);

	const statsUrlPrefix = "https://rl.kdoughboy.com/stats/";

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
					setSeriesScoreField(seriesScoreIn);
					break;
			}
		};
	}, []);

	// check for unsaved changes
	useEffect(() => {
		if (config.hasOwnProperty("teams")) {
			const tempFieldsWithChanges = [];
			for (let teamnum in config.teams) {
				if (teamNameField[teamnum] !== config.teams[teamnum].name) {
					tempFieldsWithChanges.push(`teamNameField${teamnum}`);
				}
				if (franchiseField[teamnum] !== config.teams[teamnum].franchise) {
					tempFieldsWithChanges.push(`franchiseField${teamnum}`);
				}
				if (teamLogoField[teamnum] !== config.teams[teamnum].logo) {
					tempFieldsWithChanges.push(`teamLogoField${teamnum}`);
				}
				if (seriesScoreField[teamnum] !== seriesScore[teamnum]) {
					tempFieldsWithChanges.push(`seriesScoreField${teamnum}`);
				}
				// TODO: handle multiple headers
				if (headerField !== config.general.headers[0]) {
					tempFieldsWithChanges.push("headerField");
				}
				if (seriesTypeField !== config.series.type) {
					tempFieldsWithChanges.push("seriesTypeField");
				}
				if (seriesLengthField !== config.series.maxGames) {
					tempFieldsWithChanges.push("seriesLengthField");
				}
				if (showSeriesField !== config.series.show) {
					tempFieldsWithChanges.push("showSeriesField");
				}
				if (logoField !== config.general.brandLogo) {
					tempFieldsWithChanges.push("logoField");
				}
				if (streamTypeField !== config.general.streamType) {
					tempFieldsWithChanges.push("streamTypeField");
				}
				if (seasonNumberField !== config.general.season) {
					tempFieldsWithChanges.push("seasonNumberField");
				}
				if (matchdayNumberField !== config.general.matchday) {
					tempFieldsWithChanges.push("matchdayNumberField");
				}
				if (tierField !== config.general.tier) {
					tempFieldsWithChanges.push("tierField");
				}
			}

			setFieldsWithChanges(tempFieldsWithChanges);
		}

	}, [teamNameField, franchiseField, teamLogoField, seriesScoreField, headerField, seriesTypeField, seriesLengthField, showSeriesField, logoField, streamTypeField, seasonNumberField, matchdayNumberField, tierField]);

	// load tiers on league change
	useEffect(() => {
		if(leagueId > -1) {
			loadTierList(leagueId);
		}
	}, [leagueId]);

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

	const loadTierList = (league) => {
		const currentTierLists = {...tierLists};
		if(!Array.isArray(tierLists[league]) || tierLists[league].length < 1 ) {
			openDialog("loading");
			getTierList(league)
				.then((loadedTierList) => {
					currentTierLists[league] = loadedTierList;
					setTierLists(currentTierLists);
					closeDialog();
				})
				.catch((error) => {
					closeDialog();
					console.error(error);
					openSnackbar("Error getting tier list from API");
				});
		}
	}

	const changeSeriesScoreField = (score, team) => {
		if (Number.isInteger(Number(score))) {
			const tempSeriesScoreField = [... seriesScoreField];
			tempSeriesScoreField[team]= Number(score);
			setSeriesScoreField(tempSeriesScoreField);
		}
	}

	const changeTeamNameField = (name, team) => {
		const tempTeamNameField = [... teamNameField];
		tempTeamNameField[team]= name;
		setTeamNameField(tempTeamNameField);
	}

	const changeFranchiseField = (name, team) => {
		const tempFranchiseField = [... franchiseField];
		tempFranchiseField[team]= name;
		setFranchiseField(tempFranchiseField);
	}

	const changeTeamLogoField = (logo, team) => {
		const tempTeamLogoField = [... teamLogoField];
		tempTeamLogoField[team]= logo;
		setTeamLogoField(tempTeamLogoField);
	}

	const changeShowSeriesField = (value) => {
		setShowSeriesField(value);
	}

	const changeSeriesTypeField = (type) => {
		setSeriesTypeField(type);
	}

	const changeSeriesLengthField = (length) => {
		if (Number.isInteger(Number(length))) {
			setSeriesLengthField(Number(length));
		}
	}

	const changeSeasonNumberField = (season) => {
		setSeasonNumberField(season);
	}

	const changeMatchdayNumberField = (matchday) => {
		setmatchdayNumberField(matchday);
	}

	const changeTierField = (tier) => {
		setTierField(tier);
	}

	const setConfigValuesFromLocalStorage = () => {
		const loadedConfig = JSON.parse(localStorage.getItem("config"));
		setConfig(loadedConfig);
		setTeamNameField([loadedConfig.teams[0].name, loadedConfig.teams[1].name]);
		setFranchiseField([loadedConfig.teams[0].franchise, loadedConfig.teams[1].franchise]);
		setTeamLogoField([loadedConfig.teams[0].logo, loadedConfig.teams[1].logo]);
		setSeriesTypeField(loadedConfig.series.type);
		setSeriesLengthField(loadedConfig.series.maxGames);
		setShowSeriesField(loadedConfig.series.show);
		setHeaderField(loadedConfig.general.headers[0]);
		setLogoField(loadedConfig.general.brandLogo);
		changeStreamTypeField(loadedConfig.general.streamType);
	}

	const setConfigValuesToDefault = () => {
		setConfig(defaultConfig);
		localStorage.setItem("config", JSON.stringify(defaultConfig));
	}

	const setSeriesScoreToDefault = () => {
		setSeriesScore(defaultSeriesScore);
		setSeriesScoreField(defaultSeriesScore);
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
		setSeriesScoreField(seriesScoreIn);
	}

	// TODO: handle multiple headers
	const changeHeaderField = (text) => {
		setHeaderField(text);
	}

	const changeLogoField = (logo) => {
		setLogoField(logo);
	}

	const changeStreamTypeField = (streamType) => {
		setStreamTypeField(streamType);

		// TODO: If another league happens, clear tier selection when switching leagues
		switch(streamType) {
			case "RSC3-regular":
				setSeriesTypeField("set");
				setSeriesLengthField(4);
				setShowSeriesField(true);
				setLeagueId(1);
				break;

			case "RSC3-final":
				setSeriesTypeField("bestof");
				setSeriesLengthField(7);
				setShowSeriesField(true);
				setLeagueId(1);

			default:
				setLeagueId(-1);
				break;
		}

	}

	const resetFieldValues = () => {
		setConfigValuesFromLocalStorage();
		setSeriesScoreFromLocalStorage();
	}

	const saveToLocalStorage = () => {
		setSeriesScore(seriesScoreField);
		localStorage.setItem("seriesScore", JSON.stringify(seriesScoreField));

		let tierName = "";
		// TODO: handle multiple leagues
		if(tierField !== "" && leagueId > -1 && Array.isArray(tierLists[leagueId]) && tierLists[leagueId].length > 0) {
			tierName = tierLists[leagueId].filter((tier) => tier.id == Number(tierField))[0].name;
		}

		const newConfig = {
			general: {
				...config.general,
				headers: [headerField],
				season: seasonNumberField,
				matchday: matchdayNumberField,
				tier: tierName,
				brandLogo: logoField,
			},
			series: {
				show: showSeriesField,
				type: seriesTypeField,
				display: "both",
				maxGames: seriesLengthField,
				override: "",
			},
			teams: [
				{
					...config.teams[0],
					name: teamNameField[0],
					franchise: franchiseField[0],
					logo: teamLogoField[0],
				},
				{
					...config.teams[1],
					name: teamNameField[1],
					franchise: franchiseField[1],
					logo: teamLogoField[1],
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

			<Dialog
				open={currentDialog === "loading"}
				onClose={closeDialog}
			>
				<DialogContent>
					<p>Loading...</p>
				</DialogContent>
			</Dialog>

			<Snackbar
				autoHideDuration={4000}
				open={snackbarIsOpen}
				onClose={closeSnackbar}
				message={snackbarMessage}
			/>

			<h1>RSC overlay control panel</h1>

			<ThemeProvider theme={panelTheme}>

				<Container>
					<Grid container spacing={0} className="idGrid">

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
										<InputLabel id="streamTypeLabel" shrink>Stream Type</InputLabel>
										<Select
											notched
											labelId="streamTypeLabel"
											id="streanType"
											value={streamTypeField}
											label="Stream Type"
											className={fieldHasChanges("streamTypeField") ? "changedField" : ""}
											onChange={(e) => changeStreamTypeField(e.target.value)}
										>
											<MenuItem value="RSC3-regular">RSC 3s Regular Season</MenuItem>
											<MenuItem value="RSC3-final">RSC 3s Finals</MenuItem>
											<MenuItem value="RSC3-event">RSC 3s Other Event</MenuItem>
											<MenuItem value="other">No RSC branding</MenuItem>
										</Select>
									</FormControl>
								</Item>
							</Grid>

						</Grid>

						<Grid container size={12} spacing={0} className="gridRow">

							{streamTypeField === "RSC3-regular" || streamTypeField === "RSC3-final" ?

								<>

									<Grid size={3}>
										<Item>
											<TextField
												fullWidth
												required
												inputProps={{
													min: 1,
													step: 1,
												}}
												id="seasonNumber"
												type="number"
												size="small"
												label="Season"
												value={seasonNumberField}
												onChange={(e) => changeSeasonNumberField(e.target.value)}
												className={fieldHasChanges("seasonNumberField") ? "changedField" : ""}
											/>
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
												id="matchdayNumberField"
												type="number"
												size="small"
												label="Matchday"
												value={matchdayNumberField}
												onChange={(e) => changeMatchdayNumberField(e.target.value)}
												className={fieldHasChanges("matchdayNumberField") ? "changedField" : ""}
											/>
										</Item>
									</Grid>

									<Grid size={6}>
										<Item>
											<FormControl size="small" fullWidth>
												<InputLabel id="tierFieldLabel" shrink>Tier</InputLabel>
												<Select
													notched
													labelId="tierFieldLabel"
													id="tierField"
													disabled = {!Array.isArray(tierLists[leagueId]) || tierLists[leagueId].length < 1}
													value={tierField}
													required
													label="Tier"
													className={fieldHasChanges("tierField") ? "changedField" : ""}
													onChange={(e) => changeTierField(e.target.value)}
												>
													{Array.isArray(tierLists[leagueId]) && tierLists[leagueId].length > 0 ?
														tierLists[leagueId]
															.sort((a,b) => Number(a.position) < Number(b.position) ? 1 : Number(a.position) > Number(b.position) ? -1 : 0)
															.map(tier => (
																<MenuItem key={tier.id} value={tier.id}>{tier.name}</MenuItem>
														))
													:
														<MenuItem value="">Loading...</MenuItem>
													}
												</Select>
											</FormControl>
										</Item>
									</Grid>

									<div>{tierField}</div>

								</>

							:

								<Grid size={{xs: 12, md: 9}}>
									<Item>
										<FormControl variant="outlined" size="small" fullWidth>
											<InputLabel shrink htmlFor={`header`}>Header</InputLabel>
											<OutlinedInput
												notched
												id="header"
												label="Header"
												onChange={(e) => changeHeaderField(e.target.value)}
												value={headerField}
												className={fieldHasChanges(`headerField`) ? "changedField" : ""}
											/>
										</FormControl>
									</Item>
								</Grid>

							}

						</Grid>

						<Grid container size={12} spacing={0} className="gridRow">

							{/* TODO: Handle custom series text */}

							{streamTypeField !== "RSC3-regular" && streamTypeField !== "RSC3-final" ?

								<>

									<Grid size={3}>
										<Item>
											<FormControl size="small" fullWidth>
												<InputLabel id="showSeriesLabel" shrink>Show Series?</InputLabel>
												<Select
													notched
													labelId="showSeriesLabel"
													id="showSeries"
													value={showSeriesField}
													label="Show Series?"
													className={fieldHasChanges("showSeriesField") ? "changedField" : ""}
													onChange={(e) => changeShowSeriesField(e.target.value)}
												>
													<MenuItem value={true}>Yes</MenuItem>
													<MenuItem value={false}>No</MenuItem>

												</Select>
											</FormControl>
										</Item>
									</Grid>

									<Grid size={6}>
										<Item>
											<FormControl size="small" fullWidth>
												<InputLabel id="seriesTypeLabel" shrink>Series Type</InputLabel>
												<Select
													notched
													labelId="seriesTypeLabel"
													id="seriesType"
													value={seriesTypeField}
													label="Series Type"
													className={fieldHasChanges("seriesTypeField") ? "changedField" : ""}
													onChange={(e) => changeSeriesTypeField(e.target.value)}
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
												disabled={seriesTypeField === "unlimited"}
												value={seriesLengthField}
												onChange={(e) => changeSeriesLengthField(e.target.value)}
												className={fieldHasChanges("seriesLengthField") ? "changedField" : ""}
											/>
										</Item>
									</Grid>

								</>

							: null}

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
											<InputLabel shrink htmlFor={`teamNameField${teamnum}`}>Team Name</InputLabel>
											<OutlinedInput
												notched
												id={`teamNameField${teamnum}`}
												label="Team Name"
												onChange={(e) => changeTeamNameField(e.target.value, teamnum)}
												value={teamNameField[teamnum]}
												className={fieldHasChanges(`teamNameField${teamnum}`) ? "changedField" : ""}
											/>
										</FormControl><br />
										<FormControl variant="outlined" size="small" fullWidth>
											<InputLabel shrink htmlFor={`franchiseField${teamnum}`}>Franchise Name</InputLabel>
											<OutlinedInput
												notched
												id={`franchiseField${teamnum}`}
												label="Franchise Name"
												onChange={(e) => changeFranchiseField(e.target.value, teamnum)}
												value={franchiseField[teamnum]}
												className={fieldHasChanges(`franchiseField${teamnum}`) ? "changedField" : ""}
											/>
										</FormControl>
										<FormControl variant="outlined" size="small" fullWidth>
											<InputLabel shrink htmlFor={`teamLogoField${teamnum}`}>Team Logo</InputLabel>
											<OutlinedInput
												notched
												id={`teamLogoField${teamnum}`}
												label="Team Logo"
												onChange={(e) => changeTeamLogoField(e.target.value, teamnum)}
												value={teamLogoField[teamnum]}
												className={fieldHasChanges(`teamLogoField${teamnum}`) ? "changedField" : ""}
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
											id={`seriesScoreField${teamnum}`}
											type="number"
											size="small"
											label="Games"
											value={seriesScoreField[teamnum]}
											onChange={(e) => changeSeriesScoreField(e.target.value, teamnum)}
											className={fieldHasChanges(`seriesScoreField${teamnum}`) ? "changedField" : ""}
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
