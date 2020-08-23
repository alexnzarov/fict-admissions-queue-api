import { Route, RequestMethod, IRequest } from "../../../core/api";
import { check } from "express-validator";
import { tokens } from "../../../core/registration";
import { pick } from "../../../util/object";
import logger from "../../../core/logger";
import { findUserById } from "../../../services";

/** PUT /users/:id/registration */
export class Post extends Route {
  url = '/users/:id/registration';
  method = RequestMethod.PUT;
  validation = tokens.map(t => check(t.token).optional({ nullable: true }).isString());
  authorization = true;

  async onRequest(req: IRequest) {
    const { authorization } = req;
    const user = await findUserById(req.params.id);
    
    const details = pick(req.body, tokens.map(t => t.token));
    user.details = details;

    logger.info('User details updated', { id: user.id, details, by: authorization.name });

    await user.save();
    
    return {
      user: user.dto(),
    };
  }
};
