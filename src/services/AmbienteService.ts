import { Service } from 'typedi';
import axios from "axios"

@Service("ambienteService")
export default class AmbienteService {

  constructor() {
  }

  async get() {
    const sessionToken = await this.getToken();
    return await axios.get('https://backend-api-floats.vercel.app/api/ambientes/4', { headers: { sessiontoken: sessionToken }});
  }

  async getById(id: string) {
    const sessionToken = await this.getToken();
    return await axios.get(`https://backend-api-floats.vercel.app/api/ambientes/${id}`, { headers: { sessiontoken: sessionToken }})
  }

  private async getToken() {
    const response = await axios.post('https://backend-api-floats.vercel.app/api/login', { 'usr': 'inf', 'pass': '25d55ad283aa400af464c76d713c07ad' });
    const { session_token } = response.data;
    return session_token;
  }
}