import NotificationHistoryService from "../services/NotificationHistoryService"
import passport from "passport"
import { JsonController, Get, Put, Body, Param, UseBefore } from "routing-controllers";
import { Inject, Service } from "typedi";

@JsonController("/notificationhistory")
@UseBefore(passport.authenticate("bearer", { session: false }))
@Service()
export default class NotificationHistoryController {

  constructor(
    @Inject("notificationHistoryService") private notificationHistoryService: NotificationHistoryService
  ) {}

  @Get()
  async getAll() {
    return await (await this.notificationHistoryService.get()).data;
  }

  @Get('/:ambienteId')
  async getById(@Param('id') id: number) {
    return await (await this.notificationHistoryService.getById(id)).data;
  }

}