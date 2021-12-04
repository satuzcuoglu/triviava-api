import { Option } from "./option.entity";


export class CreateQuestionDTO {
  text: string;
  language: string;
  options: Array<CreateOptionDTO>
}

export class CreateOptionDTO {
  text: string;
  isCorrect: boolean;
}