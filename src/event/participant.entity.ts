import { BaseEntity } from 'src/db/base.entity';
import { Event } from 'src/event/event.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';


@Entity('participants')
export class Participant extends BaseEntity {
  @PrimaryColumn()
  walletAddress: string;

  @PrimaryColumn()
  eventId: string;

  // @ManyToOne(() => Event)
  // @JoinColumn({ name: 'eventId' })
  // event: Event;
}
