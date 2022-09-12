import { Service } from 'typedi';
import axios from "axios"
import LimitAmbiente, { ILimitAmbiente } from '../models/LimitAmbiente';
import Repository from '../repository';

@Service("limitambienteService")
export default class LimitAmbienteService {

  private LimitAmbienteRepository: any;

  constructor() {
    this.LimitAmbienteRepository = Repository(LimitAmbiente);
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
    return this.LimitAmbienteRepository.save(limitEntity);
  }

  async get() {
    const sessionToken = await this.getToken();
    const limitambiente = await axios.get('https://backend-api-floats.vercel.app/api/ambiente/4', { headers: { sessiontoken: sessionToken }});
    return limitambiente;
  }

  async getById(id: number) {
    const sessionToken = await this.getToken();
    const limitambiente = await axios.get(`https://backend-api-floats.vercel.app/api/ambiente/${id}`, { headers: { sessiontoken: sessionToken }})
    if (limitambiente.data.length > 0) { 
      this.updateLocalLimitAmbiente(limitambiente.data[0].id);
    }
    return limitambiente;
  }

  private async updateLocalLimitAmbiente(idFromAirPure: number) {
    const values = await this.LimitAmbienteRepository.createQueryBuilder("LimitAmbiente")
      .where("LimitAmbiente.idFromAirPure = :idFromAirPure", { idFromAirPure }).select(["id"]).getMany();
    if (values === undefined || values.length === 0) {
      this.createLocalLimitAmbiente(idFromAirPure);
    }
    return values;
  }

  private async createLocalLimitAmbiente(idFromAirPure: number) {
    const limitEntity = new LimitAmbiente();
    limitEntity.idFromAirPure = idFromAirPure;
    limitEntity.co2 = 0;
    limitEntity.umidade = 0;
    limitEntity.temperatura = 0;
    limitEntity.tvoc = 0;
    limitEntity.dbo = 0;
    limitEntity.lux = 0;
    this.LimitAmbienteRepository.save(limitEntity);
  }

  private async getToken() {
    const response = await axios.post('https://backend-api-floats.vercel.app/api/login', { 'usr': 'inf', 'pass': '25d55ad283aa400af464c76d713c07ad' });
    const { session_token } = response.data;
    return session_token;
  }
}