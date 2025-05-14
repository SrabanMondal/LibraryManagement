import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateBookDto } from './book.dto';

@Injectable()
export class BookService {
  constructor(private prisma: PrismaService) {}
  async createBook(
    bookdata: Omit<
      Prisma.BooksCreateInput,
      'publisher' | 'category' | 'authors'
    > & {
      publisherName: string;
      categoryName: string;
      authorNames: string[];
    },
  ) {
    const book = await this.prisma.books.findUnique({
      where: { title: bookdata.title },
    });
    if (book) {
      throw new BadRequestException('Book with same title already exists');
    }
    return this.prisma.$transaction(async (tx) => {
      const publisher = await tx.publishers.upsert({
        where: { name: bookdata.publisherName },
        update: {},
        create: { name: bookdata.publisherName },
      });

      const category = await tx.categories.upsert({
        where: { name: bookdata.categoryName },
        update: {},
        create: { name: bookdata.categoryName },
      });

      const authorConnections = await Promise.all(
        bookdata.authorNames.map(async (name) => {
          const author = await tx.authors.upsert({
            where: { name },
            update: {},
            create: { name },
          });
          return { id: author.id };
        }),
      );

      const createdBook = await tx.books.create({
        data: {
          title: bookdata.title,
          published_year: bookdata.published_year,
          total_copies: bookdata.total_copies,
          available_copies: bookdata.available_copies,
          publisher: { connect: { id: publisher.id } },
          category: { connect: { id: category.id } },
          authors: { connect: authorConnections },
        },
      });

      return createdBook;
    });
  }
  async getAllBooks() {
    return this.prisma.books.findMany({
      include: {
        publisher: true,
        category: true,
        authors: true,
      },
    });
  }
  async updateBook(id: number, bookData: UpdateBookDto) {
    return this.prisma.$transaction(async (tx) => {
      const updates: Prisma.BooksUpdateInput = {};

      if (bookData.title) updates.title = bookData.title;
      if (bookData.published_year)
        updates.published_year = bookData.published_year;
      if (bookData.total_copies) updates.total_copies = bookData.total_copies;
      if (bookData.available_copies)
        updates.available_copies = bookData.available_copies;

      if (bookData.publisherName) {
        const publisher = await tx.publishers.upsert({
          where: { name: bookData.publisherName },
          update: {},
          create: { name: bookData.publisherName },
        });
        updates.publisher = { connect: { id: publisher.id } };
      }

      if (bookData.categoryName) {
        const category = await tx.categories.upsert({
          where: { name: bookData.categoryName },
          update: {},
          create: { name: bookData.categoryName },
        });
        updates.category = { connect: { id: category.id } };
      }

      if (bookData.authorNames && bookData.authorNames.length > 0) {
        const authors = await Promise.all(
          bookData.authorNames.map((name) =>
            tx.authors.upsert({
              where: { name },
              update: {},
              create: { name },
            }),
          ),
        );
        updates.authors = {
          set: authors.map((a) => ({ id: a.id })),
        };
      }

      return tx.books.update({
        where: { id },
        data: updates,
      });
    });
  }
  async deleteBook(id: number) {
    return this.prisma.books.delete({
      where: { id },
    });
  }
}
