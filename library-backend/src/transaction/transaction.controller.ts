import { Body, Controller, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { AuthGuard } from '@nestjs/passport';
import { Prisma } from 'generated/prisma';

@Controller('transaction')
export class TransactionController {
  constructor(private transactionsService: TransactionService) {}
  @Post('borrow')
  @UseGuards(AuthGuard('jwt'))
  borrowBook(
    @Req()
    req: Request & {
      user: Prisma.UsersGetPayload<{
        select: { id: true; email: true; name: true; role: true };
      }>;
    },
    @Body() { bookId }: { bookId: number },
  ) {
    return this.transactionsService.borrowBook(bookId, req.user.id);
  }

  @Patch('return')
  @UseGuards(AuthGuard('jwt'))
  returnBook(
    @Req()
    req: Request & {
      user: Prisma.UsersGetPayload<{
        select: { id: true; email: true; name: true; role: true };
      }>;
    },
    @Body() { transactionId }: { transactionId: number },
  ) {
    return this.transactionsService.returnBook(transactionId);
  }
}
