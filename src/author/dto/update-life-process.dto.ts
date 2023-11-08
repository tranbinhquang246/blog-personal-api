import { PartialType } from '@nestjs/swagger';
import { CreateLifeProcessDto } from './create-life-process.dto';

// Coming soon feature
export class UpdateLifeProcessDto extends PartialType(CreateLifeProcessDto) {}
