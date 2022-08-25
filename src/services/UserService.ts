import { Service } from 'typedi';
import User from '../models/User';
import Repository from '../repository';

@Service("userService")
export default class UserService {

  private userRepository: any;

  constructor() {
    this.userRepository = Repository(User);
  }

  getUser(id: string) {
    return this.userRepository.get(id);
  }
}