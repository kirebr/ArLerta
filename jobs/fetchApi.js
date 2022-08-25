const fetch = require("node-fetch");
const nodeMailer = require('nodemailer');

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
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'xxx@xx.com',
        pass: 'xxxx'
    }
  });
  let mailOptions = {
      from: '"Krunal Lathiya" <xx@gmail.com>', // sender address
      to: req.body.to, // list of receivers
      subject: req.body.subject, // Subject line
      text: req.body.body, // plain text body
      html: '<b>NodeJS Email Tutorial</b>' // html body
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
  });
}

const fetchApi = async () => {  
  login(fetchAmbiente);
}

fetchApi();