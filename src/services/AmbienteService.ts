import { Service } from 'typedi';
import axios from "axios"

@Service("ambienteService")
export default class AmbienteService {

  constructor() {
  }

  async get() {
    const response = await axios.post('https://backend-api-floats.vercel.app/api/login', { 'usr': 'inf', 'pass': '25d55ad283aa400af464c76d713c07ad' });
    console.log(response);
    const { session_token } = response.data;
    const config = {
      headers: {
        session_token
      }
    };
    return await axios.get('https://backend-api-floats.vercel.app/api/ambientes/4', config);
  }
}