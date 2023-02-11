const BASE_API_URL = 'http://localhost:8000';

// Load planets and return as JSON.
async function httpGetPlanets() {
  const response = await fetch(`${BASE_API_URL}/planets`);
  return await response.json();
}

// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
  const response = await fetch(`${BASE_API_URL}/launches`);
  return await response.json();
}

// Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {
  try {
    return await fetch(`${BASE_API_URL}/launches`, {
      method: 'POST',
      body: JSON.stringify(launch),
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    return {ok: false}
  }
}

// Delete launch with given ID.
async function httpAbortLaunch(id) {
  try{
    return await fetch(`${BASE_API_URL}/launches/${id}`, {
      method: 'DELETE'
    });
  } catch(error) {
    return {ok: false};
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};