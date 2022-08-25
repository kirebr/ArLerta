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

  async getById(id: number) {
    const sessionToken = await this.getToken();
    const ambiente = await axios.get(`https://backend-api-floats.vercel.app/api/ambientes/${id}`, { headers: { sessiontoken: sessionToken }})
    if (ambiente.data.length > 0) { 
      this.updateLocalAmbiente(ambiente.data[0].id);
    }
    return ambiente;
  }

  private async updateLocalAmbiente(idFromAirPure: number) {
    const values = await this.limitAmbienteRepository.createQueryBuilder("LimitAmbiente")
      .where("LimitAmbiente.idFromAirPure = :idFromAirPure", { idFromAirPure }).select(["id"]).getMany();
    if (values === undefined || values.length === 0) {
      this.createLocalAmbiente(idFromAirPure);
    }
    return values;
  }

  private async createLocalAmbiente(idFromAirPure: number) {
    const limitEntity = new LimitAmbiente();
    limitEntity.idFromAirPure = idFromAirPure;
    limitEntity.co2 = 0;
    limitEntity.umidade = 0;
    limitEntity.temperatura = 0;
    limitEntity.tvoc = 0;
    limitEntity.dbo = 0;
    limitEntity.lux = 0;
    this.limitAmbienteRepository.save(limitEntity);
  }

  private async getToken() {
    const response = await axios.post('https://backend-api-floats.vercel.app/api/login', { 'usr': 'inf', 'pass': '25d55ad283aa400af464c76d713c07ad' });
    const { session_token } = response.data;
    return session_token;
  }
}