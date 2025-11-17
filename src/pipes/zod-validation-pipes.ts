import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ZodError, ZodType } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(
    private schema: ZodType,
    private errorMessage = 'Validation failed'
  ) {}

  transform(value: unknown) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      if (error instanceof ZodError) {
        const issueMessage = error.issues.find(issue => issue.message)?.message;
        const message =
          issueMessage && issueMessage.trim().length > 0
            ? issueMessage
            : this.errorMessage;

        throw new BadRequestException(message);
      }

      throw new BadRequestException(this.errorMessage);
    }
  }
}
