import { Service } from 'typedi';
import { getCustomRepository } from 'typeorm';

import UserRepository from '../repositories/UserRepository';

@Service("userService")
export default class UserService {
  private userRepository: UserRepository

  constructor() {
    this.userRepository = getCustomRepository(UserRepository)
  }
}