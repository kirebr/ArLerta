
import { Service } from 'typedi';
import axios from "axios"
import NotificationHistory from '../models/NotificationHistory';
import Repository from '../repository';

interface INotificationHistoryDTO {
  "id": number;
  "type": string;
  "deviceValue": number,
  "createdAt": Date,
  "ambienteIdAirPure": number,
}

@Service("notificationHistoryambienteService")
export default class NotificationHistoryService {

  private notificationHistoryRepository: any;

  constructor() {
    this.notificationHistoryRepository = Repository(NotificationHistory);
  }

  async get() {
    return await this.notificationHistoryRepository.find().map((notificationHistory: NotificationHistory) => this.buildNotificationDTO(notificationHistory));
  }

  async getById(ambienteIdAirPure: number) {
    const values = await this.notificationHistoryRepository.createQueryBuilder("NotificationHistory")
      .where("NotificationHistory.limit.idFromAirPure = :idFromAirPure", { ambienteIdAirPure }).select(["id"]).getMany();
      console.log("Values:", values);
    return values;
  }

  buildNotificationDTO(notificationHistory: NotificationHistory) {
    const dto: INotificationHistoryDTO = { 
      "id": notificationHistory.id,
      "type": notificationHistory.type,
      "deviceValue": notificationHistory.deviceValue,
      "createdAt": notificationHistory.createdAt,
      "ambienteIdAirPure": notificationHistory.limit.id
    };
    return dto;
  }
}