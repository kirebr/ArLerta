const fetch = require("node-fetch");
const nodeMailer = require("nodemailer");
const Pool = require("pg").Pool;

const login = async () => {
  const body = {
    usr: "inf",
    pass: "25d55ad283aa400af464c76d713c07ad",
  };
  const response = await fetch(
    "https://backend-api-floats.vercel.app/api/login",
    {
      method: "post",
      body: JSON.stringify(body),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
  const responseJson = await response.json();
  return responseJson.session_token;
};

const fetchAmbiente = async (sessionToken: string) => {
  const response = await fetch(
    "https://backend-api-floats.vercel.app/api/ambientes/4",
    {
      headers: { sessiontoken: sessionToken },
    }
  );
  console.log(response);
  return response.json();
};

const sendEmail = () => {
  let transporter = nodeMailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "65c6d9d3c85737",
      pass: "d4eeda4c68bf7a",
    },
  });
  let mailOptions = {
    from: '"Arlerta Mail" <arlerta@gmail.com>', // sender address
    to: "teste@gmail.com", // list of receivers
    subject: "Arlerta", // Subject line
    text: "Arlerta problema encontrado.", // plain text body
  };
  // @ts-ignore
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message %s sent: %s", info.messageId, info.response);
  });
};

const getLimits = async () => {
  const pool = new Pool({
    host: "kesavan.db.elephantsql.com",
    port: 5432,
    user: "ptjmxdyr",
    password: "SjUNpyKKFfOKsYS3iT5vDKEfAFwZygx-",
    database: "ptjmxdyr",
  });
  const limitAmbiente = await pool.query(
    "SELECT * FROM limit_ambiente ORDER BY id ASC"
  );
  return limitAmbiente.rows;
};

// @ts-ignore
const verifyAndSendEmail = (limits, ambientes) => {
  // @ts-ignore
  limits.forEach((limit) => {
    const ambiente = ambientes.find(
      // @ts-ignore
      (ambiente) => ambiente.id == limit.idFromAirPure
    );
    if (ambiente != undefined) {
      const { co2, umidade, temperatura, tvoc, db, lux } = ambiente;
      console.log("Founded ambiente");
      if (
        limit.co2 < co2 ||
        limit.umidade < umidade ||
        limit.temperatura < temperatura ||
        limit.tvoc < tvoc ||
        limit.db < db ||
        limit.lux < lux
      ) {
        sendEmail();
      }
    }
  });
};

const fetchApi = async () => {
  const limits = await getLimits();
  const sessionToken = await login();
  const ambientes = await fetchAmbiente(sessionToken);
  verifyAndSendEmail(limits, ambientes);
  console.log(limits, ambientes);
};

const timer = 15000;

export default () => {
  setInterval(fetchApi, timer);
};
