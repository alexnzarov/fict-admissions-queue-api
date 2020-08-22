import { Route, RequestMethod, IRequest } from "../../../core/api";
import { check } from "express-validator";
import logger from "../../../core/logger";
import { findQueueById } from "../../../services";

interface IPostBody {
  active: boolean;
};

/** GET /queues/:id */
export class Get extends Route {
  url = '/queues/:id';
  method = RequestMethod.GET;

  async onRequest(req: IRequest) {
    const queue = await findQueueById(req.params.id);

    return {
      queue: queue.dto(),
      queueSize: await queue.getQueueSize(),
      lastPosition: queue.getLastPosition(),
    };
  }
};

/** PUT /queues/:id */
export class Post extends Route {
  url = '/queues/:id';
  method = RequestMethod.PUT;
  validation = [
    check('active').optional({ nullable: true }).isBoolean(),
  ];
  authorization = true;

  async onRequest(req: IRequest<any, IPostBody>) {
    const { authorization } = req;
    const { active } = req.body; 
    const queue = await findQueueById(req.params.id);

    if (active != null) {
      queue.active = active;
    }

    await queue.save();

    logger.info('Queue updated', { id: queue.id, user: authorization.name, body: req.body });

    return {
      queue: queue.dto(),
    }
  }
};
