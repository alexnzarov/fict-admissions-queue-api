import { Route, RequestMethod, IRequest } from "../../../core/api";
import { findUserById, findQueuePositionsByUser } from "../../../services";

/** GET /users/:id */
export class Get extends Route {
  url = '/users/:id';
  method = RequestMethod.GET;
  authorization = true;

  async onRequest(req: IRequest) {
    const user = await findUserById(req.params.id);
    const positions = await findQueuePositionsByUser(user, { relations: ['queue'] });
    
    return {
      user: user.dto(),
      queues: positions.map(p => ({ ...p.queue.dto(), position: { ...p.dto(), relativePosition: p.queue.getRelativePosition(p) } })),
    };
  }
};
