import { Route, RequestMethod, IRequest } from "../../../../core/api";
import { check } from "express-validator";
import { QueuePosition } from "../../../../db/entities/QueuePosition";
import { findUserById, findQueueById, createQueuePosition } from "../../../../services";

interface IPostBody {
  id: string;
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
    
    return {
      position: position.dto(),
    };
  }
};
