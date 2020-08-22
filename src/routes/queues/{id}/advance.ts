import { Queue } from "../../../db/entities/Queue";
import { ServiceException } from "../../../core/exception";
import { Route, RequestMethod, IRequest } from "../../../core/api";
import { check } from "express-validator";
import { findQueueById } from "../../../services";

/** PUT /queues/:id/advance */
export class Post extends Route {
  url = '/queues/:id/advance';
  method = RequestMethod.PUT;
  authorization = true;

  async onRequest(req: IRequest) {
    const { authorization } = req; 
    const queue = await findQueueById(req.params.id);



    return {};
  }
};
