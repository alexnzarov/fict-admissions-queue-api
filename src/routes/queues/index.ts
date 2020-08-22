import { Queue } from "../../db/entities/Queue";
import { Route, RequestMethod, IRequest } from "../../core/api";
import { check } from "express-validator";
import logger from "../../core/logger";
import { createQueue } from "../../services";

interface IPostBody {
  name: string;
};

/** GET /queues */
export class Get extends Route {
  url = '/queues';
  method = RequestMethod.GET;

  async onRequest() {
    const queues = await Queue.find();

    return {
      queues: queues.map(q => q.dto()),
    };
  }
};

/** POST /queues */
export class Post extends Route {
  url = '/queues';
  method = RequestMethod.POST;
  validation = [
    check('name').isString().isLength({ min: 1 }),
  ];
  authorization = true;

  async onRequest(req: IRequest<any, IPostBody>) {
    const { authorization } = req;
    const { name } = req.body; 

    const queue = await createQueue(
      Queue.create(
        {
          name,
          active: true,
        }
      )
    );

    logger.info('Queue created', { id: queue.id, name: queue.name, user: authorization.name });

    return {
      queue: queue.dto(),
    }
  }
};
