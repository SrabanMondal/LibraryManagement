import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
//import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}
  async borrowBook(bookId: number, memberId: number) {
    const book = await this.prisma.books.findUnique({
      where: { id: bookId },
    });
    const user = await this.prisma.users.findUnique({
      where: { id: memberId },
    });
    if (!user) throw new NotFoundException('User not found');
    if (!book) throw new NotFoundException('Book not found');
    if (book.available_copies < 1) {
      throw new BadRequestException('No copies available to borrow');
    }

    const transaction = await this.prisma.transactions.create({
      data: {
        book: { connect: { id: bookId } },
        member: { connect: { id: memberId } },
        borrowedAt: new Date(),
      },
    });

    await this.prisma.books.update({
      where: { id: bookId },
      data: { available_copies: { decrement: 1 } },
    });
    // await this.prisma.users.update({
    //     where: {id: memberId},
    //     data: { Transactions: { connect: {}}}}
    // })
    return transaction;
  }

  async returnBook(transactionId: number) {
    const transaction = await this.prisma.transactions.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) throw new NotFoundException('Transaction not found');
    if (transaction.returnedAt) {
      throw new BadRequestException('Book already returned');
    }

    const updated = await this.prisma.transactions.update({
      where: { id: transactionId },
      data: { returnedAt: new Date() },
    });

    await this.prisma.books.update({
      where: { id: transaction.bookId },
      data: { available_copies: { increment: 1 } },
    });

    return updated;
  }
}
