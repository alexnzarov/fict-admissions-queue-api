import { Route, RequestMethod, IRequest } from "../../../../../core/api";
import { findUserById, findQueueById, deleteQueuePosition, findQueuePosition } from "../../../../../services";
import logger from "../../../../../core/logger";
import { QueuePositionStatus, QueuePosition } from "../../../../../db/entities/QueuePosition";
import { check } from "express-validator";

interface IPutBody {
  position?: number;
  status?: QueuePositionStatus;
};

/** DELETE /queues/:id/users/:user_id */
export class Delete extends Route {
  url = '/queues/:id/users/:user_id';
  method = RequestMethod.DELETE;
  authorization = true;

  async onRequest(req: IRequest) {
    const { authorization } = req;
    const queue = await findQueueById(req.params.id);
    const user = await findUserById(req.params.user_id);

    await deleteQueuePosition(queue, user);

    logger.info('Queue position deleted', { queue: queue.id, user: user.id, by: authorization.name });
  }
};

/** PUT /queues/:id/users/:user_id */
export class Put extends Route {
  url = '/queues/:id/users/:user_id';
  method = RequestMethod.PUT;
  authorization = true;
  validation = [
    check('position').optional({ nullable: true }).isInt({ min: 1 }),
    check('status').optional({ nullable: true }).custom(v => {
      const exists = Object.keys(QueuePositionStatus).map(k => QueuePositionStatus[k]).find(s => s === v);
      
      if (!exists) {
        throw new Error("Invalid QueuePositionStatus enum value");
      }

      return true;
    }),
  ];

  async onRequest(req: IRequest<any, IPutBody>) {
    const { authorization } = req;
    const { position: positionNum, status } = req.body;
    const queue = await findQueueById(req.params.id);
    const user = await findUserById(req.params.user_id);
    const position = await findQueuePosition(queue, user);
    
    if (positionNum) {
      position.position = positionNum;
    }

    if (status) {
      position.status = status;
    }

    await position.save();

    logger.info('Queue position updated', { queue: queue.id, user: user.id, data: { position: positionNum, status }, by: authorization.name });

    return {
      position: position.dto(),
    };
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
