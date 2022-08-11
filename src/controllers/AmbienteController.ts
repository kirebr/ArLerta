import passport from "passport";
import AmbienteService from "../services/AmbienteService"
import { JsonController, UseBefore, Get } from "routing-controllers";
import { Inject, Service } from "typedi";


@JsonController("/ambiente")
// @UseBefore(passport.authenticate("bearer", { session: false }))
@Service()
export default class AmbienteController {

  constructor(
    @Inject("ambienteService") private ambienteService: AmbienteService
  ) {}

  @Get()
  async getAll() {
    return await (await this.ambienteService.get()).data;
  }

}