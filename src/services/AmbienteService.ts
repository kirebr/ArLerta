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

  async put(id: number, limit: ILimitAmbiente) {
    const limitEntity = new LimitAmbiente();
    limitEntity.id = id;
    limitEntity.idFromAirPure = limit.idFromAirPure;
    limitEntity.co2 = limit.co2;
    limitEntity.umidade = limit.umidade;
    limitEntity.temperatura = limit.temperatura;
    limitEntity.tvoc = limit.tvoc;
    limitEntity.dbo = limit.dbo;
    limitEntity.lux = limit.lux;
    return this.limitAmbienteRepository.save(limitEntity);
  }

  async get() {
    const sessionToken = await this.getToken();
    const ambiente = await axios.get('https://backend-api-floats.vercel.app/api/ambientes/4', { headers: { sessiontoken: sessionToken }});
    return ambiente;
  }

  async getById(id: string) {
    const sessionToken = await this.getToken();
    const ambiente = await axios.get(`https://backend-api-floats.vercel.app/api/ambientes/${id}`, { headers: { sessiontoken: sessionToken }})
    this.updateLocalAmbiente(ambiente.data.id);
    return ambiente;
  }

  private updateLocalAmbiente(idFromAirPure: string) {
    const values = this.limitAmbienteRepository.createQueryBuilder("LimitAmbiente")
      .where("ambiente.idFromAirPure = :idFromAirPure", { idFromAirPure }).select(["id"]).getMany();
    console.log(values);
    return values;
  }

  private async getToken() {
    const response = await axios.post('https://backend-api-floats.vercel.app/api/login', { 'usr': 'inf', 'pass': '25d55ad283aa400af464c76d713c07ad' });
    const { session_token } = response.data;
    return session_token;
  }
}