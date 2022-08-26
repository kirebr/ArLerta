import { Service } from 'typedi';
import User from '../models/User';
import Repository from '../repository';

@Service("userService")
export default class UserService {

  private userRepository: any;

  constructor() {
    this.userRepository = Repository(User);
  }

  async get() {
    return await this.userRepository.find();
  }

  async getById(id: number) {
    return await this.userRepository.findOneBy({ id });
  }
  
  async create(user: User) {
    return await this.userRepository.save(user);
  }

  async update(id: number, user: User) {
    user.id = id;
    return await this.userRepository.save(user);
  }

  async delete(id: number) {
    const userToRemove = await this.userRepository.findOneBy({ id });
    return await this.userRepository.remove(userToRemove);
  }
}