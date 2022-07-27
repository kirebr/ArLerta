import passport from "passport";
import UserService from "../services/UserService"
import { JsonController, UseBefore } from "routing-controllers";
import { Inject, Service } from "typedi";

@JsonController("/any")
@UseBefore(passport.authenticate("bearer", { session: false }))
@Service()
export class AnyController {

  constructor(
    @Inject("userService") private userService: UserService
  ) {}

}