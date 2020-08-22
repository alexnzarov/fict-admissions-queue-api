import { Route, RequestMethod } from "../../core/api";
import { User } from "../../db/entities/User";

/** GET /users/count */
export class Get extends Route {
  url = '/users/count';
  method = RequestMethod.GET;
  authorization = true;

  async onRequest() {
    const count = await User.count();

    return { count };
  }
};
