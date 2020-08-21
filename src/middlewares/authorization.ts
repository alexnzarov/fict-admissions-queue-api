import { IRequest } from "../core/api";
import { ServiceException } from "../core/exception";

export interface IAuthorizationOptions {
  basic?: boolean;
  bearer?: boolean;
};

export interface IAuthorization {
  name: string;
  type: string;
};

const tokens = {};
const users = JSON.parse(process.env.AUTH_USERS ?? '{}');

JSON.parse(process.env.AUTH_TOKENS ?? '[]').forEach(t => tokens[t] = true);
Object.keys(users).forEach(name => tokens[Buffer.from(`${name}:${users[name]}`, 'utf8').toString('base64')] = name);

export default () => (req: IRequest, res, next) => {
  const [type, token] = (req.headers.authorization ?? '').split(' ');
  const user = tokens[token];

  if (!user) {
    return next(ServiceException.build(401, 'Необхідна аутентифікація'));
  }

  req.authorization = {
    name: typeof(user) === 'string' ? user : 'system',
    type,
  };

  next();
};