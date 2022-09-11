import { Service } from 'typedi';
import User, { UserStatusEnum, UserTypeEnum } from '../models/User';
import Repository from '../repository';

interface IUserDTO {
  id: number;
  name: string;
  email: string;
  type: UserTypeEnum;
  status: UserStatusEnum;
  createdAt: Date;
  updatedAt: Date;
}

@Service("userService")
export default class UserService {

  private userRepository: any;

  constructor() {
    this.userRepository = Repository(User);
  }

  async get() {
    return await this.userRepository.find().map((user: User) => this.buildUserDTO(user));
  }

  async getById(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    return this.buildUserDTO(user);
  }
  
  async create(user: User) {
    user.password = user.encryptAsSha1(user.password);
    return this.buildUserDTO(await this.userRepository.save(user));
  }

  async update(id: number, user: User) {
    user.id = id;
    user.password = user.encryptAsSha1(user.password);
    return this.buildUserDTO(await this.userRepository.save(user));
  }

  async delete(id: number) {
    const userToRemove = await this.userRepository.findOneBy({ id });
    return this.buildUserDTO(await this.userRepository.remove(userToRemove));
  }
  
  buildUserDTO(user: User) {
    const dto: IUserDTO = { 
      id: user.id,
      name: user.name,
      email: user.email,
      type: user.type,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
    return dto;
  }

}