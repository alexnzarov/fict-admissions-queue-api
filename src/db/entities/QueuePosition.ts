import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, OneToOne, ManyToOne, ManyToMany, JoinColumn, Index } from "typeorm";
import { ExtendedEntity } from "./ExtendedEntity";
import { User } from "./User";
import { Queue } from "./Queue";

export enum QueuePositionStatus {
  WAITING = 'waiting',
  PROCESSING = 'processing',
};

@Entity("queue_positions")
class QueuePosition extends ExtendedEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(type => User, user => user.queuePositions)
  public user: User;

  @JoinColumn({ name: 'queue_id' })
  @ManyToOne(type => Queue, queue => queue.positions)
  public queue: Queue;

  @Column({ type: 'int' })
  public code: number;

  @Column({ type: 'int' })
  public position: number;

  @Column({ default: QueuePositionStatus.WAITING })
  public status: QueuePositionStatus;

  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt: Date;

  public dto() {
    return this.pick('id', 'code', 'position', 'status', 'createdAt', 'updatedAt');
  }
}

export { QueuePosition };