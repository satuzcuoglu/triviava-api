import { Column, Entity, PrimaryColumn } from "typeorm";

import { BaseEntity } from "src/db/base.entity";


@Entity('answers')
export class Answer extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  userAddress: string

  @Column()
  questionId: string;

  @Column()
  optionId: string;
}