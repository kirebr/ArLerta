import UserService from "../services/UserService"
import User from '../models/User';
import { JsonController, Get, Put, Body, Param, Post, Delete } from "routing-controllers";
import { Inject, Service } from "typedi";

@JsonController("/user")
// @UseBefore(passport.authenticate("bearer", { session: false }))
@Service()
export default class UserController {

  constructor(
    @Inject("userService") private userService: UserService
  ) {}

  @Get()
  async getAll() {
    return await this.userService.get();
  }

  @Get('/:id')
  async getById(@Param('id') id: number) {
    return await this.userService.getById(id);
  }

  @Post('')
  async post(@Body() user: User) {
    return await this.userService.create(user);
  }

  @Put('/:id')
  async put(@Param('id') id: number, @Body() limitAmbiente: any) {
    return await this.userService.update(id, limitAmbiente);
  }

  @Delete('/:id')
  async delete(@Param('id') id: number) {
    return await this.userService.delete(id);
  }

}