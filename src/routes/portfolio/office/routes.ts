import * as HSCode from 'stoker/http-status-codes';
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers';
import { createErrorSchema } from 'stoker/openapi/schemas';

import { notFoundSchema } from '@/lib/constants';
import * as param from '@/lib/param';
import { createRoute, z } from '@hono/zod-openapi';

import { insertSchema, patchSchema, selectSchema } from './utils';

const tags = ['portfolio.office'];

export const list = createRoute({
  path: '/portfolio/office',
  method: 'get',
  tags,
  responses: {
    [HSCode.OK]: jsonContent(z.array(selectSchema), 'The list of office'),
  },
});

export const create = createRoute({
  path: '/portfolio/office',
  method: 'post',
  request: {
    body: {
      content: {
        'multipart/form-data': {
          schema: {
            ...insertSchema,
          },
        },
      },
    },
  },
  tags,
  responses: {
    [HSCode.OK]: jsonContent(selectSchema, 'The created office'),
    [HSCode.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertSchema),
      'The validation error(s)',
    ),
  },
});

export const getOne = createRoute({
  path: '/portfolio/office/{uuid}',
  method: 'get',
  request: {
    params: param.uuid,
  },
  tags,
  responses: {
    [HSCode.OK]: jsonContent(selectSchema, 'The requested office'),
    [HSCode.NOT_FOUND]: jsonContent(notFoundSchema, 'office not found'),
    [HSCode.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(param.uuid),
      'Invalid id error',
    ),
  },
});

export const patch = createRoute({
  path: '/portfolio/office/{uuid}',
  method: 'patch',
  request: {
    params: param.uuid,
    body: jsonContentRequired(patchSchema, 'The office updates'),
  },
  tags,
  responses: {
    [HSCode.OK]: jsonContent(selectSchema, 'The updated office'),
    [HSCode.NOT_FOUND]: jsonContent(notFoundSchema, 'office not found'),
    [HSCode.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(patchSchema).or(createErrorSchema(param.uuid)),
      'The validation error(s)',
    ),
  },
});

export const remove = createRoute({
  path: '/portfolio/office/{uuid}',
  method: 'delete',
  request: {
    params: param.uuid,
  },
  tags,
  responses: {
    [HSCode.NO_CONTENT]: {
      description: 'office deleted',
    },
    [HSCode.NOT_FOUND]: jsonContent(notFoundSchema, 'office not found'),
    [HSCode.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(param.uuid),
      'Invalid id error',
    ),
  },
});

export const getOfficeAndOfficeEntryDetailsByOfficeUuid = createRoute({
  path: '/portfolio/office-and-office-entry/details/by-office-uuid/{uuid}',
  method: 'get',
  request: {
    params: param.uuid,
  },
  tags,
  responses: {
    [HSCode.OK]: jsonContent(selectSchema, 'The requested office-entry'),
    [HSCode.NOT_FOUND]: jsonContent(notFoundSchema, 'office-entry not found'),
    [HSCode.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(param.uuid),
      'Invalid id error',
    ),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type PatchRoute = typeof patch;
export type RemoveRoute = typeof remove;
export type GetOfficeAndOfficeEntryDetailsByOfficeUuidRoute = typeof getOfficeAndOfficeEntryDetailsByOfficeUuid;
