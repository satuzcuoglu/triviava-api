
import { Entity, Column, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Option } from './option.entity';
import { Event } from '../event/event.entity';
import { BaseEntity } from 'src/db/base.entity';
import { Validation } from './validation.entity';


@Entity('questions')
export class Question extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  text: string;

  @Column()
  language: string;

  @Column({ nullable: true })
  eventId?: number;

  @Column()
  creatorAddress: string;

  @ManyToOne(() => Event)
  event: Event;

  @OneToMany(() => Validation, (validation) => validation.question)
  validations: Validation[];

  @OneToMany(() => Option, (option) => option.question)
  options: Option[];
}
