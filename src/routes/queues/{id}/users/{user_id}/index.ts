import { Route, RequestMethod, IRequest } from "../../../../../core/api";
import { findUserById, findQueueById, deleteQueuePosition, findQueuePosition } from "../../../../../services";

/** DELETE /queues/:id/users/:user_id */
export class Post extends Route {
  url = '/queues/:id/users/:user_id';
  method = RequestMethod.DELETE;
  authorization = true;

  async onRequest(req: IRequest) {
    const queue = await findQueueById(req.params.id);
    const user = await findUserById(req.params.user_id);

    await deleteQueuePosition(queue, user);
  }
};

/** GET /queues/:id/users/:user_id */
export class Get extends Route {
  url = '/queues/:id/users/:user_id';
  method = RequestMethod.GET;
  authorization = true;

  async onRequest(req: IRequest) {
    const queue = await findQueueById(req.params.id);
    const user = await findUserById(req.params.user_id);
    const position = await findQueuePosition(queue, user);

    return {
      queue: queue.dto(),
      user: user.dto(),
      position: position.dto(),
    };
  }
};
