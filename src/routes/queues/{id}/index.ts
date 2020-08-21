import { Queue } from "../../../db/entities/Queue";
import { ServiceException } from "../../../core/exception";
import { Route, RequestMethod, IRequest } from "../../../core/api";
import { check } from "express-validator";
import logger from "../../../core/logger";

interface IPostBody {
  active: boolean;
};

/** GET /queues/:id */
export class Get extends Route {
  url = '/queues/:id';
  method = RequestMethod.GET;

  async onRequest(req: IRequest) {
    const queue = await Queue.findOne({ id: parseInt(req.params.id) });

    if (!queue) {
      throw ServiceException.build(404, 'Такої черги не існує');
    }

    return {
      queue: queue.dto(),
      queueSize: await queue.getQueueSize(),
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
    const queue = await Queue.findOne({ id: parseInt(req.params.id) });
  
    if (!queue) {
      throw ServiceException.build(404, 'Такої черги не існує');
    }

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
