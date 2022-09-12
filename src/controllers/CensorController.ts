import AmbienteService from "../services/AmbienteService"
import passport from "passport"
import { JsonController, Get, Put, Body, Param, UseBefore } from "routing-controllers";
import { Inject, Service } from "typedi";

@JsonController("/censor")
@UseBefore(passport.authenticate("bearer", { session: false }))
@Service()
export default class CensorController {

  constructor(
    @Inject("censorService") private censorService: AmbienteService
  ) {}

  @Get()
  async getAll() {
    return await (await this.censorService.get()).data;
  }

  @Get('/:ambienteId')
  async getById(@Param('id') id: number) {
    return await (await this.censorService.getById(id)).data;
  }

}