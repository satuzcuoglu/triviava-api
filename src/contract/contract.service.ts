import { Injectable } from '@nestjs/common';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';

import { Event } from 'src/event/event.entity';
import { Option } from 'src/question/option.entity';
import { Question } from 'src/question/question.entity';

@Injectable()
export class ContractService {
  private mainContractAddress = '0x7Af9b65bA5f239612D5879b12221a97649A3caC4';
  private mainContractABI: AbiItem[] = [
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: 'questionHash',
          type: 'bytes32',
        },
        {
          internalType: 'bytes32[]',
          name: '_optionHashes',
          type: 'bytes32[]',
        },
      ],
      name: 'createQuestion',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'quizId',
          type: 'uint256',
        },
        {
          internalType: 'bytes32[]',
          name: '_questionHashes',
          type: 'bytes32[]',
        },
        {
          internalType: 'uint256',
          name: '_startTime',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: '_endTime',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: '_entryFee',
          type: 'uint256',
        },
      ],
      name: 'createQuiz',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'creatorStake',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'quizId',
          type: 'uint256',
        },
        {
          internalType: 'bytes32[]',
          name: '_correctOptionHashes',
          type: 'bytes32[]',
        },
      ],
      name: 'finalizeQuiz',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'quizId',
          type: 'uint256',
        },
      ],
      name: 'joinQuiz',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_triavaManager',
          type: 'address',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'creator',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'stakingAmount',
          type: 'uint256',
        },
      ],
      name: 'CreatorStaking',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'creator',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'slashingAmount',
          type: 'uint256',
        },
      ],
      name: 'LogCreatorSlashing',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'creator',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'bytes32',
          name: 'questionHash',
          type: 'bytes32',
        },
      ],
      name: 'NewQuestion',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'previousOwner',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'newOwner',
          type: 'address',
        },
      ],
      name: 'OwnershipTransferred',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'validator',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'bytes32',
          name: 'questionHash',
          type: 'bytes32',
        },
        {
          indexed: false,
          internalType: 'bool',
          name: 'isApproved',
          type: 'bool',
        },
      ],
      name: 'QuestionValidated',
      type: 'event',
    },
    {
      inputs: [],
      name: 'renounceOwnership',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'quizId',
          type: 'uint256',
        },
        {
          internalType: 'bytes32[]',
          name: '_optionHashes',
          type: 'bytes32[]',
        },
      ],
      name: 'submitQuiz',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'newOwner',
          type: 'address',
        },
      ],
      name: 'transferOwnership',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: 'questionHash',
          type: 'bytes32',
        },
        {
          internalType: 'bool',
          name: 'isApproved',
          type: 'bool',
        },
      ],
      name: 'validateQuestion',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'validatorStake',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'validator',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'stakingAmount',
          type: 'uint256',
        },
      ],
      name: 'ValidatorStaking',
      type: 'event',
    },
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: 'questionHash',
          type: 'bytes32',
        },
        {
          internalType: 'string',
          name: 'optionText',
          type: 'string',
        },
        {
          internalType: 'bool',
          name: 'isCorrect',
          type: 'bool',
        },
        {
          internalType: 'address',
          name: 'creatorAddress',
          type: 'address',
        },
      ],
      name: 'calculateOptionHash',
      outputs: [
        {
          internalType: 'bytes32',
          name: 'prefixedHash',
          type: 'bytes32',
        },
      ],
      stateMutability: 'pure',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'string',
          name: 'qText',
          type: 'string',
        },
        {
          internalType: 'address',
          name: 'creatorAddress',
          type: 'address',
        },
      ],
      name: 'calculateQuestionHash',
      outputs: [
        {
          internalType: 'bytes32',
          name: 'prefixedHash',
          type: 'bytes32',
        },
      ],
      stateMutability: 'pure',
      type: 'function',
    },
    {
      inputs: [],
      name: 'creatorRate',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      name: 'creatorSlashings',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      name: 'creatorStakings',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'quizId',
          type: 'uint256',
        },
      ],
      name: 'getQuizParticipants',
      outputs: [
        {
          internalType: 'address[]',
          name: '',
          type: 'address[]',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'minCreatorStaking',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'minimumVoteRequired',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'minValidatorStaking',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: '',
          type: 'bytes32',
        },
      ],
      name: 'options',
      outputs: [
        {
          internalType: 'string',
          name: 'text',
          type: 'string',
        },
        {
          internalType: 'bool',
          name: 'isCorrect',
          type: 'bool',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'owner',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: '',
          type: 'bytes32',
        },
      ],
      name: 'questions',
      outputs: [
        {
          internalType: 'bool',
          name: 'isUsed',
          type: 'bool',
        },
        {
          internalType: 'address',
          name: 'creator',
          type: 'address',
        },
        {
          internalType: 'string',
          name: 'text',
          type: 'string',
        },
        {
          internalType: 'bool',
          name: 'isRewarded',
          type: 'bool',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      name: 'quizzes',
      outputs: [
        {
          internalType: 'uint256',
          name: 'startTime',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'endTime',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'entryFee',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'triavaManager',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'validatorRate',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      name: 'validatorSlashings',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      name: 'validatorStakings',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
  ];

  private walletPrivateKey: string =
    '0x2f4e480534ff71c4fb129321894e782ffbef584bf8225f8c27484267dc40610f';
  private walletAddress: string = '0xcD76cd3605547c9aF99520f6a48c811b79D4bAE7';
  // private walletMnemonics: string = "lava flip legend funny wear clock broccoli pyramid abstract suspect cart sniff";

  private web3: Web3;
  private mainContract: Contract;

  constructor() {
    this.initWeb3();
    this.initContract();
    this.web3.eth.accounts.wallet.add(this.walletPrivateKey);
  }

  private initContract() {
    if (this.mainContract) return;
    this.mainContract = new this.web3.eth.Contract(
      this.mainContractABI,
      this.mainContractAddress,
    );
  }

  async createQuiz(event: Event, questions: Question[], joinFee: number) {
    await this.mainContract.methods
      .createQuiz(
        event.id,
        questions.map((q) => q.id),
        new Date(event.startDate).getTime(),
        new Date(event.endDate).getTime(),
        this.web3.utils.toWei(joinFee.toString(), 'ether'),
      )
      .send({ from: this.walletAddress, gas: 300000 });
  }

  async finalizeQuiz(eventId: number, answers: Option[]) {
    const answerIds = answers.map((a) => a.id);
    console.log(answerIds);
    await this.mainContract.methods
      .finalizeQuiz(eventId, answerIds)
      .send({ from: this.walletAddress, gas: 5000000 });
  }

  async calculateQuestionHash(text: string, creatorAddress: string) {
    const result = await this.mainContract.methods
      .calculateQuestionHash(text, creatorAddress)
      .call();
    return result;
  }

  async getValidatorsByQuestionId(questionId: string) {
    const result = await this.mainContract.methods.questions(questionId).call();
    return result;
  }

  async getParticipantsByEventId(eventId: number) {
    const result = await this.mainContract.methods.questions(eventId).call();
    return result;
  }

  async calcualateOptionHash(
    questionId: string,
    text: string,
    isCorrect: boolean,
    creatorAddress: string,
  ) {
    const result = await this.mainContract.methods
      .calculateOptionHash(questionId, text, isCorrect, creatorAddress)
      .call();
    return result;
  }

  private initWeb3() {
    if (this.web3) {
      return this.web3;
    } else {
      this.web3 = new Web3(
        new Web3.providers.HttpProvider(
          'https://api.avax-test.network/ext/bc/C/rpc',
        ),
      );
    }
  }
}
