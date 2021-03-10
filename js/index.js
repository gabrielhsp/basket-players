'use strict';

const BASE_URL = 'https://nba-players.herokuapp.com';
const endpoints = {
	getPlayer: '/players-stats',
	playerImage: '/players'
}

/**
 * A function to fetch player stats from API
 *
 * @param {string} firstName - Player's first name to search
 * @param {string} lastName - Player's last name to search
 * @return {Promise} - A promise to be handled with API response
 */
function apiRequest(apiPath, firstName, lastName) {
	const requestUrl = `${BASE_URL}${apiPath}/${lastName}/${firstName}`;
	
	return fetch(requestUrl);
}

/**
 * A function to handle with form submit event listener
 * To avoid the default submit, we add a prevent default at form element
 */
function handleFormSubmit() {
	const form = document.querySelector('#players-form');

	form.addEventListener('submit', element => {
		element.preventDefault();
		searchPlayers();
	});
}

/**
 * A function to make the search to NBA players API
 * We get the name fields and treat before sending to API
 */
async function searchPlayers() {
	const playerContent = document.querySelector('#player');
	const firstName = document.querySelector('#first-name').value.toLowerCase();
	const lastName = document.querySelector('#last-name').value.toLowerCase();

	playerContent.innerHTML = '<div class="loading"><div></div><div></div></div>';
	
	try {
		const playerResponse = await apiRequest(endpoints.getPlayer, firstName, lastName);
		const playerData = await playerResponse.json();
	
		const imageResponse = await apiRequest(endpoints.playerImage, firstName, lastName);
		const imageData = await imageResponse.blob();
	
		const imageReader = handleImageResponse(imageData);
	
		imageReader.onloadend = () => playerContent.innerHTML = createPlayerStructure(playerData, imageReader.result);
	} catch(error) {
		playerContent.innerHTML = createErrorStructure(error);
	}
}

function createPlayerStructure(player, playerImage) {
	return `
		<div class="player-card">
			<img class="player-image" src="${playerImage}" alt="${player.name}">

			<div class="player-content">
				<h2 class="player-name">${player.name}</h2>
				<p class="player-team">${player.team_name}</p>
				<ul class="player-stats">
					<li>Minutes per game <span class="value">${player.minutes_per_game}</span></li>
					<li>Points <span class="value">${player.points_per_game}</span></li>
					<li>Rebounds <span class="value">${player.rebounds_per_game}</span></li>
					<li>Steals <span class="value">${player.steals_per_game}</span></li>
					<li>Free throw percentage <span class="value">${player.free_throw_percentage}%</span></li>
				</ul>
			</div>
		</div>
	`;
}

function createErrorStructure(error) {
	return `<div class="player-error" data-error="${error.message}">Player not founded</div>`;
}

function handleImageResponse(blob) {
	let reader = new FileReader();

	reader.readAsDataURL(blob);

	return reader
}

handleFormSubmit();