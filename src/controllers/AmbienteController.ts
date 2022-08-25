import AmbienteService from "../services/AmbienteService"
import { JsonController, Get, Put, Body, Param } from "routing-controllers";
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

  @Put('/:id')
  async put(@Param('id') id: number, @Body() limitAmbiente: any) {
    console.log('id and ambiente:', id, limitAmbiente);
    return await (await this.ambienteService.put(id, limitAmbiente));
  }

}