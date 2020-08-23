import { Route, RequestMethod, IRequest, IQueryParameters } from "../../../../core/api";
import { check } from "express-validator";
import { QueuePosition } from "../../../../db/entities/QueuePosition";
import { findUserById, findQueueById, createQueuePosition } from "../../../../services";
import { paginationQuery } from "../../../../util/query";
import logger from "../../../../core/logger";

interface IGetQuery extends IQueryParameters {
  skip: string;
  take: string;
};

interface IPostBody {
  id: string;
};

/** GET /queues/:id/users */
export class Get extends Route {
  url = '/queues/:id/users';
  method = RequestMethod.GET;
  validation = [
    check('skip').optional().isInt(),
    check('take').optional().isInt(),
  ];
  authorization = true;

  async onRequest(req: IRequest<IGetQuery>) {
    const queue = await findQueueById(req.params.id);
    const count = await QueuePosition.count({ queue });
    const positions = await QueuePosition.find(
      paginationQuery(req.query, 
        { 
          where: { queue },
          relations: ['user'], 
          order: {
            code: 'ASC',
          },
        }
      )
    );

    return {
      count,
      positions: positions.map(p => ({ ...p.dto(), user: p.user.dto() })),
    };
  }
};

/** POST /queues/:id/users */
export class Post extends Route {
  url = '/queues/:id/users';
  method = RequestMethod.POST;
  validation = [
    check('id').isString(),
  ];
  authorization = true;

  async onRequest(req: IRequest<any, IPostBody>) {
    const { authorization } = req;
    const { id } = req.body;

    const queue = await findQueueById(req.params.id);
    const user = await findUserById(id);

    const position = await createQueuePosition(
      QueuePosition.create(
        {
          queue,
          user,
        }
      )
    );

    logger.info('Queue position created', { queue: queue.id, user: user.id, by: authorization.name });
    
    return {
      position: position.dto(),
    };
  }
};
