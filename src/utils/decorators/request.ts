/* eslint-disable prettier/prettier */
import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import Web3 from 'web3';

export const GetWalletAddress = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const signedMessage = request.headers['signed-message'];
    const pureMessage = request.headers['pure-message'];
    if (!pureMessage) throw new HttpException('pure-message is required', 400);
    if (!signedMessage)
      throw new HttpException('signed-message is required', 400);
    const walletAddress = recoverUsingWeb3(pureMessage, signedMessage).toLowerCase();
    console.log(walletAddress);
    return walletAddress;
  },
);

export const recoverUsingWeb3 = (message: string, signature: string) => {
  try {
    const web3 = new Web3(
      new Web3.providers.HttpProvider(
        'https://api.avax-test.network/ext/bc/C/rpc',
      ),
    );
    return web3.eth.accounts.recover(message, `0x${signature}`);
  } catch (error) {
    throw new HttpException(error.message, HttpStatus.FORBIDDEN);
  }
};
