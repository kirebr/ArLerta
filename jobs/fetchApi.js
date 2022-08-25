const fetch = require("node-fetch");

const login = async (callbackSuccess, callbackError = (error) => { console.error('Error trying to login:', error) }) => {
  const body = {
    usr: "inf",
    pass: "25d55ad283aa400af464c76d713c07ad",
  };

  fetch("https://backend-api-floats.vercel.app/api/login", {
    method: "post",
    body: JSON.stringify(body),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
  .then(response => {
    response.json().then(response => {
      console.log('RESPONSE', response);
      const tokenDeAcesso = response?.session_token;
      if (tokenDeAcesso) {
        callbackSuccess(tokenDeAcesso);
      } else {
        callbackError("Ocorreu um erro.");
      }
    }).catch(callbackError);
  })
  .catch(callbackError);
}

const fetchAmbiente = async (sessionToken) => {
  fetch("https://backend-api-floats.vercel.app/api/ambientes/4", {
    headers: { sessiontoken: sessionToken },
  }).then((response) => {
    response.json().then(response => {
      console.log('Fetch ambiente:', response);
    }).catch((error) => {
      console.error('Error trying to fetch Ambiente:', error);  
    });
  }).catch((error) => {
    console.error('Error trying to fetch Ambiente:', error);
  });
}

const fetchApi = async () => {  
  login(fetchAmbiente);
}

fetchApi();