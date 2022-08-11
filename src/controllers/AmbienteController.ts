import passport from "passport";
import AmbienteService from "../services/AmbienteService"
import { JsonController, UseBefore } from "routing-controllers";
import { Inject, Service } from "typedi";


@JsonController("/ambiente")
@UseBefore(passport.authenticate("bearer", { session: false }))
@Service()
export default class AmbienteController {

  constructor(
    @Inject("ambienteService") private ambienteService: AmbienteService
  ) {}

}