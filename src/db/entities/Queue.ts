import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { ExtendedEntity } from "./ExtendedEntity";
import { QueuePosition, QueuePositionStatus } from "./QueuePosition";

@Entity("queues")
class Queue extends ExtendedEntity {
  @PrimaryGeneratedColumn('increment')
  public id: number;

  @Column()
  public name: string;

  @Column()
  public active: boolean;

  @OneToMany(type => QueuePosition, position => position.queue, { lazy: true })
  public positions: Promise<QueuePosition[]>;

  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt: Date;

  public dto() {
    return this.pick('id', 'name', 'active', 'createdAt');
  }

  public getWaitingPositions(size: number) {
    return QueuePosition.find({
      where: { 
        queue: this,
        status: QueuePositionStatus.WAITING,
      },
      order: {
        position: 'ASC',
      },
      take: size,
    });
  }

  public getQueueSize() {
    return QueuePosition.count({ 
      where: { 
        queue: this,
        status: QueuePositionStatus.WAITING,
      } 
    });
  }
}

export { Queue };