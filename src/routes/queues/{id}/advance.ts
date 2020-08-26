import { Route, RequestMethod, IRequest } from "../../../core/api";
import { findQueueById, advanceQueue } from "../../../services";
import logger from "../../../core/logger";

/** POST /queues/:id/advance */
export class Post extends Route {
  url = '/queues/:id/advance';
  method = RequestMethod.POST;
  authorization = true;

  async onRequest(req: IRequest) {
    const { authorization } = req; 
    const queue = await findQueueById(req.params.id);

    const position = await queue.consecutive(() => advanceQueue(queue, authorization));

    logger.info('Queue advanced', { queue: queue.id, position: position.user.id, by: authorization.name });

    return {
      position: position.dto(),
      user: position.user.dto(),
    };
  }
};
