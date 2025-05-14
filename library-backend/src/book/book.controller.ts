import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  //Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role, RoleGuard, Roles } from 'src/core/guards/roles.guard';
import { BookService } from './book.service';
import { CreateBookDto, UpdateBookDto } from './book.dto';

@Controller('book')
export class BookController {
  constructor(private bookService: BookService) {}
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Post('/add')
  @Roles(Role.Admin)
  async addBook(@Body() bookData: CreateBookDto) {
    const book = await this.bookService.createBook(bookData);
    return { message: 'book created', book };
  }
  @Patch('/update/:id')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  updateBook(@Param('id') id: string, @Body() dto: UpdateBookDto) {
    return this.bookService.updateBook(+id, dto);
  }
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getBooks() {
    const books = await this.bookService.getAllBooks();
    return { books };
  }
  @Delete('/delete/:id')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  deleteBook(@Param('id') id: string) {
    return this.bookService.deleteBook(+id);
  }
}
