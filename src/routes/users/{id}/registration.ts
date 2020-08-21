import { ServiceException } from "../../../core/exception";
import { Route, RequestMethod, IRequest } from "../../../core/api";
import { check } from "express-validator";
import { User } from "../../../db/entities/User";
import { tokens } from "../../../core/registration";
import { pick } from "../../../util/object";
import logger from "../../../core/logger";

/** PUT /users/:id/registration */
export class Post extends Route {
  url = '/users/:id/registration';
  method = RequestMethod.PUT;
  validation = tokens.map(t => check(t.token).optional({ nullable: true }).isString());
  authorization = true;

  async onRequest(req: IRequest) {
    const { authorization } = req;
    const user = await User.findOne({ id: req.params.id });
    
    if (!user) {
      throw ServiceException.build(404, 'Такого користувача не існує');
    }
    
    const details = pick(req.body, tokens.map(t => t.token));
    user.details = details;

    logger.info('User details updated', { id: user.id, details, user: authorization.name });
    
    return {
      user: (await user.save()).dto(),
    };
  }
};
