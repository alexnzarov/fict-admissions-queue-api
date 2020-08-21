import { Queue } from "../../db/entities/Queue";
import { ServiceException } from "../../core/exception";
import { Route, RequestMethod, IRequest } from "../../core/api";
import { check } from "express-validator";
import logger from "../../core/logger";

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

    let queue = await Queue.findOne({ name });
  
    if (queue) {
      throw ServiceException.build(409, 'Черга з такою назвою вже існує');
    }
  
    queue = await Queue.create({ name, active: true }).save()

    logger.info('Queue created', { id: queue.id, name: queue.name, user: authorization.name });

    return {
      queue: queue.dto(),
    }
  }
};
