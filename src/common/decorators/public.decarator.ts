/* eslint-disable prettier/prettier */
import { SetMetadata } from "@nestjs/common";

export const Public = () => SetMetadata('isPublic', true);

export * from './public.decarator';
