import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import { Question } from './question.entity';

@Entity('options')
export class Option {
  @PrimaryColumn()
  id: string;

  @Column()
  text: string;

  @Column()
  isCorrect: boolean;

  @Column()
  questionId: string;

  @ManyToOne(() => Question)
  question: Question;
}
