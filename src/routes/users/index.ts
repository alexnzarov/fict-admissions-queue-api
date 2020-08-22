import { Route, RequestMethod, IRequest, IQueryParameters } from "../../core/api";
import { check } from "express-validator";
import { User } from "../../db/entities/User";
import { searchQuery } from "../../util/query";
import logger from "../../core/logger";
import { createUser } from "../../services";

interface IGetQuery extends IQueryParameters {
  skip: string;
  take: string;
};

interface IPostBody {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
};

/** GET /users */
export class Get extends Route {
  url = '/users';
  method = RequestMethod.GET;
  validation = [
    check('search').optional().isString(),
    check('skip').optional().isInt(),
    check('take').optional().isInt(),
  ];
  authorization = true;

  async onRequest(req: IRequest<IGetQuery>) {
    const users = await User.find(searchQuery(['username', 'firstName', 'lastName'], req.query));

    return {
      users: users.map(u => u.dto()),
    };
  }
};

/** POST /users */
export class Post extends Route {
  url = '/users';
  method = RequestMethod.POST;
  validation = [
    check('id').isString(),
    check('username').optional({ nullable: true }).isString(),
    check('first_name').isString(),
    check('last_name').optional({ nullable: false }).isString(),
  ];
  authorization = true;

  async onRequest(req: IRequest<any, IPostBody>) {
    const { authorization } = req;
    const { id, username, first_name, last_name } = req.body; 

    const user = await createUser(
      User.create(
        { 
          id, 
          username, 
          firstName: first_name,
          lastName: last_name,
        }
      )
    );

    logger.info('User created', { id, user: authorization.name });
  
    return {
      user: user.dto(),
    }
  }
};
