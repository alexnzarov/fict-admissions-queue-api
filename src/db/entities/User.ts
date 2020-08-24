import { Entity, Column, PrimaryColumn, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { ExtendedEntity } from "./ExtendedEntity";
import { QueuePosition } from "./QueuePosition";
import { sendMessage } from "../../core/bot";

const messages = {
  processing: (u, d) => `<b>${d.queue}</b>\n\nВаша заявка вже оброблюється оператором. Можете підходити до 339 кабінету.`,
  moved: (u, d) => `<b>${d.queue}</b>\n\nВашу заявку посунули у черзі.`,
  position: (u, d) => `<b>${d.queue}</b>\n\nВаша позиція у черзі: ${d.position}`,
};

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

  @Column({ default: true })
  public telegram: boolean;

  @Column({ type: 'simple-json', default: '{}' })
  public details: any;

  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt: Date;

  @OneToMany(type => QueuePosition, position => position.user, { lazy: true })
  public queuePositions: Promise<QueuePosition[]>;

  public async sendMessage(type: 'processing' | 'position' | 'moved', data: any = {}) {
    if (!this.telegram) { return; }

    const text = await messages[type](this, data);
    sendMessage(this.id, text, 'HTML');
  }

  public dto() {
    return this.pick('id', 'username', 'firstName', 'lastName', 'telegram', 'details', 'createdAt', 'updatedAt');
  }
}

export { User };