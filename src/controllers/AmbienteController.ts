import AmbienteService from "../services/AmbienteService"
import passport from "passport"
import { JsonController, Get, Put, Body, Param, UseBefore } from "routing-controllers";
import { Inject, Service } from "typedi";

@JsonController("/ambiente")
@UseBefore(passport.authenticate("bearer", { session: false }))
@Service()
export default class AmbienteController {

  constructor(
    @Inject("ambienteService") private ambienteService: AmbienteService
  ) {}

  @Get()
  async getAll() {
    return await (await this.ambienteService.get()).data;
  }

  @Get('/:id')
  async getById(@Param('id') id: number) {
    return await (await this.ambienteService.getById(id)).data;
  }

  @Put('/:id')
  async put(@Param('id') id: number, @Body() limitAmbiente: any) {
    return await (await this.ambienteService.put(id, limitAmbiente));
  }

}