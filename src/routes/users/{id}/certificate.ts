import { ServiceException } from "../../../core/exception";
import { Route, RequestMethod, IRequest } from "../../../core/api";
import { check } from "express-validator";
import { User } from "../../../db/entities/User";
import { tokens } from "../../../core/registration";
import { pick } from "../../../util/object";
import logger from "../../../core/logger";

/** PUT /users/:id/certificate */
export class Post extends Route {
  url = '/users/:id/certificate';
  method = RequestMethod.PUT;
  validation = [];
  authorization = true;

  async onRequest(req: IRequest) {
    const user = await User.findOne({ id: req.params.id });
    
    if (!user) {
      throw ServiceException.build(404, 'Такого користувача не існує');
    }
    
    return {
      user: (await user.save()).dto(),
    };
  }
};
