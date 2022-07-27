const fetch = require("node-fetch");

const login = async (callbackSuccess, callbackError = (error) => { console.error('Error trying to login:', error) }) => {
  const body = {
    usr: "nome",
    pass: "password",
  };

  fetch("https://backend-api-airpure.vercel.app/api/login", {
    method: "post",
    body: JSON.stringify(body),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
  .then(response => {
    response.json()
      .then((responseLoginJson) => {
        const jsonError = JSON.parse(responseLoginJson.error);
        if (jsonError.success) {
          callbackSuccess(jsonError);
        } else {
          callbackError(jsonError.result);
        }
      })
      .catch(callbackError);
  })
  .catch(callbackError);
}

const fetchAmbiente = async ({ session_token }) => {
  fetch("https://backend-api-airpure.vercel.app/api/ambiente/1", {
    headers: { session_token: session_token },
  }).then((response) => {
    response
      .json()
      .then((json) => {
        console.log('Fetch ambiente:', json);
      })
      .catch((error) => {
        console.error('Error trying to fetch Ambiente:', error);
      });
  });
}

const fetchApi = async () => {  
  login(fetchAmbiente);
}

fetchApi();