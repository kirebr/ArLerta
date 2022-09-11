const fetch = require("node-fetch");
const nodeMailer = require('nodemailer');
const LimitAmbiente = require('../models/LimitAmbiente');
const Repository = require('../repository');

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

const sendEmail = () => {
  let transporter = nodeMailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "65c6d9d3c85737",
      pass: "d4eeda4c68bf7a"
    }
  });
  let mailOptions = {
      from: '"Arlerta Mail" <arlerta@gmail.com>', // sender address
      to: 'teste@gmail.com', // list of receivers
      subject: 'Arlerta', // Subject line
      text: 'Arlerta problema encontrado.', // plain text body
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
  });
}

const getLimits = async () => {
  const limitAmbienteRepository = Repository(LimitAmbiente);
  const limits = await limitAmbienteRepository.find();
  return limits;
}

const fetchApi = async () => {  
  getLimits();
  login(fetchAmbiente);
}

fetchApi();