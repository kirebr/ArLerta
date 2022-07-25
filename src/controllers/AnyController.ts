import passport from "passport";

@JsonController("/any")
@UseBefore(passport.authenticate("bearer", { session: false }))
@Service()
export class AnyController {

  constructor(
    @Inject("userService") private userService: UserService
  ) {}

}