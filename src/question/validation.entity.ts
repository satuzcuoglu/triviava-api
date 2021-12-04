import { BaseEntity } from 'src/db/base.entity';
import { Question } from 'src/question/question.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';


@Entity('validations')
export class Validation extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  validatorAddress: string;

  @Column()
  questionId: string;

  @Column()
  isValidated: boolean;

  @ManyToOne(() => Question)
  question: Question;
}
