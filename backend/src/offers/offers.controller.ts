import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Logger,
  Req,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {
    this.logger = new Logger(OffersController.name);
  }

  private readonly logger: Logger;

  @Post()
  async create(@Body() createOfferDto: CreateOfferDto, @Req() req) {
    await this.offersService.create(createOfferDto, req.user.id);

    return {};
  }

  @Get()
  async findAll() {
    return await this.offersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.offersService.findOne(+id);
  }
}
