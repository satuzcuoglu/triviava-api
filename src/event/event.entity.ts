import { BaseEntity } from 'src/db/base.entity';
import { Question } from 'src/question/question.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('events')
export class Event extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  language: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @OneToMany(() => Question, (question) => question.event)
  questions: Question[];

  // @OneToMany(() => Participant, (participant) => participant.event)
  // participants: Participant[];
}
