import { Entity, Column, PrimaryColumn, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { ExtendedEntity } from "./ExtendedEntity";
import { QueuePosition } from "./QueuePosition";

@Entity("users")
class User extends ExtendedEntity {
  @PrimaryColumn()
  public id: string;

  @Column({ nullable: true })
  public username: string;

  @Column({ name: 'first_name', nullable: true })
  public firstName: string;

  @Column({ name: 'last_name', nullable: true })
  public lastName: string;

  @Column({ type: 'simple-json', default: '{}' })
  public details: any;

  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt: Date;

  @OneToMany(type => QueuePosition, position => position.user, { lazy: true })
  public queuePositions: Promise<QueuePosition[]>;

  public dto() {
    return this.pick('id', 'username', 'firstName', 'lastName', 'details', 'createdAt', 'updatedAt');
  }
}

export { User };