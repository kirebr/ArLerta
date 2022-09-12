import { Service } from 'typedi';
import axios from "axios"
import LimitAmbiente, { ILimitAmbiente } from '../models/LimitAmbiente';
import Repository from '../repository';

@Service("ambienteService")
export default class AmbienteService {

  private limitAmbienteRepository: any;

  constructor() {
    this.limitAmbienteRepository = Repository(LimitAmbiente);
  }
  
  async get() {
    const sessionToken = await this.getToken();
    const ambiente = await axios.get('https://backend-api-floats.vercel.app/api/ambientes/4', { headers: { sessiontoken: sessionToken }});
    return ambiente;
  }

  async getById(id: number) {
    const sessionToken = await this.getToken();
    const ambiente = await axios.get(`https://backend-api-floats.vercel.app/api/ambientes/${id}`, { headers: { sessiontoken: sessionToken }})
    if (ambiente.data.length > 0) { 
      this.updateLocalAmbiente(ambiente.data[0].id);
    }
    return ambiente;
  }
}