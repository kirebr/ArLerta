import Repository from '../repository';
import Client from '../models/Client'

const clientRepository = Repository(Client);

export default () => {
  const client = new Client();
  client.name = "Frontend service";
  client.clientId = "mobileV1";
  client.clientSecret = "abc123456";
  clientRepository.save(client);
}