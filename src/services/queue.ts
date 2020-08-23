import { Queue } from '../db/entities/Queue';
import { ServiceException } from '../core/exception';
import { QueuePosition, QueuePositionStatus } from '../db/entities/QueuePosition';
import { User } from '../db/entities/User';
import { FindOneOptions, FindManyOptions } from 'typeorm';

export const findQueueById = async (id: number | string, options?: FindOneOptions<Queue>) => {
  const queue = await Queue.findOne({
    id: typeof(id) === 'string' ? parseInt(id) : id,
  });

  if (!queue) {
    throw ServiceException.build(404, 'Такої черги не існує');
  }

  return queue;
};

export const createQueue = async (queue: Queue) => {
  if (await Queue.findOne({ name: queue.name })) {
    throw ServiceException.build(409, 'Черга з такою назвою вже існує');
  }

  return await queue.save();
};

export const createQueuePosition = async (position: QueuePosition) => {
  if (await QueuePosition.findOne({ user: position.user, queue: position.queue })) {
    throw ServiceException.build(409, 'Користувач вже у черзі');
  }

  const code = position.queue.generatePosition();
  
  position.code = code;
  position.position = code;

  return await position.save();
};

export const findQueuePosition = async (queue: Queue, user: User, options?: FindOneOptions<QueuePosition>) => {
  const position = await QueuePosition.findOne({ user: user, queue: queue }, options);
  
  if (!position) {
    throw ServiceException.build(404, 'Користувача немає у черзі');
  }

  return position;
};

export const findQueuePositionsByUser = async (user: User, options: FindManyOptions<QueuePosition> = {}) => QueuePosition.find({ where: { user }, ...options});

export const deleteQueuePosition = async (queue: Queue, user: User) => {
  const position = await findQueuePosition(queue, user);

  return await position.remove();
};

export const updateQueueCache = () => Queue.updatePositionCache();

export const advanceQueue = async (queue: Queue) => {
  const position = await QueuePosition.findOne({ status: QueuePositionStatus.WAITING, queue }, {
    order: {
      position: 'ASC',
    },
    relations: ['user'],
  });

  if (!position) {
    throw ServiceException.build(404, 'У черзі нікого немає');
  }

  position.status = QueuePositionStatus.PROCESSING;

  queue.setLastAdvanced(position.position);

  return await position.save();
};
