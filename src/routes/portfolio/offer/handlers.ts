import type { AppRouteHandler } from '@/lib/types';

import { desc, eq, sql } from 'drizzle-orm';
// import { alias } from 'drizzle-orm/pg-core';
import * as HSCode from 'stoker/http-status-codes';

import db from '@/db';
import * as hrSchema from '@/routes/hr/schema';
import { createToast, DataNotFound, ObjectNotFound } from '@/utils/return';
import { deleteFile, insertFile, updateFile } from '@/utils/upload_file';

import type {
  CreateRoute,
  GetOneRoute,
  ListRoute,
  PatchRoute,
  RemoveRoute,
} from './routes';

import { info, offer } from '../schema';

// const user_information = alias(hrSchema.users, 'user_information');

export const create: AppRouteHandler<CreateRoute> = async (c: any) => {
  // const value = c.req.valid('json');
  const formData = await c.req.parseBody();
  const file = formData.file;

  let filePath = '';

  if (file && typeof file === 'object') {
    filePath = await insertFile(file, 'public/offer');
  }

  const value = {
    uuid: formData.uuid,
    serial: formData.serial,
    title: formData.title,
    subtitle: formData.subtitle,
    file: filePath,
    deadline: formData.deadline,
    created_at: formData.created_at,
    updated_at: formData.updated_at,
    created_by: formData.created_by,
    remarks: formData.remarks,
  };

  const [data] = await db.insert(offer).values(value).returning({
    name: offer.title,
  });

  return c.json(createToast('create', data.name ?? ''), HSCode.OK);
};

export const patch: AppRouteHandler<PatchRoute> = async (c: any) => {
  const { uuid } = c.req.valid('param');

  // const formData = c.req.valid('json');
  const formData = await c.req.parseBody();

  // updates includes file then do it else exclude it

  if (formData.file && typeof formData.file === 'object') {
    // get offer file name

    const offerData = await db.query.offer.findFirst({
      where(fields, operators) {
        return operators.eq(fields.uuid, uuid);
      },
    });

    if (offerData && offerData.file) {
      const filePath = await updateFile(formData.file, offerData.file, 'public/offer');
      formData.file = filePath;
    }
    else {
      const filePath = await insertFile(formData.file, 'public/offer');
      formData.file = filePath;
    }
  }

  if (Object.keys(formData).length === 0)
    return ObjectNotFound(c);

  const [data] = await db
    .update(offer)
    .set(formData)
    .where(eq(offer.uuid, uuid))
    .returning({
      name: offer.title,
    });

  if (!data)
    return DataNotFound(c);

  return c.json(createToast('update', data.name ?? ''), HSCode.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c: any) => {
  const { uuid } = c.req.valid('param');

  const offerData = await db.query.offer.findFirst({
    where(fields, operators) {
      return operators.eq(fields.uuid, uuid);
    },
  });

  if (offerData && offerData.file) {
    deleteFile(offerData.file);
  }

  const [data] = await db
    .delete(offer)
    .where(eq(offer.uuid, uuid))
    .returning({
      name: offer.title,
    });

  if (!data)
    return DataNotFound(c);

  return c.json(createToast('delete', data.name ?? ''), HSCode.OK);
};

export const list: AppRouteHandler<ListRoute> = async (c: any) => {
  // const data = await db.query.offer.findMany();

  const { is_offer } = c.req.valid('query');

  const resultPromise = db.select({
    id: offer.id,
    uuid: offer.uuid,
    serial: offer.serial,
    title: offer.title,
    subtitle: offer.subtitle,
    file: offer.file,
    deadline: offer.deadline,
    created_at: offer.created_at,
    updated_at: offer.updated_at,
    created_by: offer.created_by,
    created_by_name: hrSchema.users.name,
    remarks: offer.remarks,
    type: sql`'offer'`,
  })
    .from(offer)
    .leftJoin(hrSchema.users, eq(offer.created_by, hrSchema.users.uuid))
    .orderBy(desc(offer.created_at));

  // const infoPromise = db.select({
  //   id: info.id,
  //   uuid: info.uuid,
  //   serial: sql`null as serial`,
  //   title: info.description,
  //   subtitle: sql`null as subtitle`,
  //   file: info.file,
  //   deadline: sql`null as deadline`,
  //   created_at: info.created_at,
  //   updated_at: info.updated_at,
  //   created_by: info.created_by,
  //   created_by_name: hrSchema.users.name,
  //   remarks: info.remarks,
  //   type: sql`'info'`,
  // })
  //   .from(info)
  //   .leftJoin(hrSchema.users, eq(info.created_by, hrSchema.users.uuid))
  //   .where(eq(info.is_offer, true));

  // const [offerData, infoData] = await Promise.all([resultPromise, infoPromise]);

  // const combinedData = [...offerData, ...infoData];

  // return c.json(combinedData || [], HSCode.OK);

  let infoData: any[] = [];
  if (is_offer) {
    const infoPromise = db.select({
      id: info.id,
      uuid: info.uuid,
      serial: sql`null as serial`,
      title: info.description,
      subtitle: sql`null as subtitle`,
      file: info.file,
      deadline: sql`null as deadline`,
      created_at: info.created_at,
      updated_at: info.updated_at,
      created_by: info.created_by,
      created_by_name: hrSchema.users.name,
      remarks: info.remarks,
      type: sql`'info'`,
    })
      .from(info)
      .leftJoin(hrSchema.users, eq(info.created_by, hrSchema.users.uuid))
      .where(eq(info.is_offer, true))
      .orderBy(desc(info.created_at));

    const [offerData, infoResult] = await Promise.all([resultPromise, infoPromise]);
    infoData = infoResult;
    const combinedData = [...offerData, ...infoData];
    return c.json(combinedData || [], HSCode.OK);
  }
  else {
    const offerData = await resultPromise;
    return c.json(offerData || [], HSCode.OK);
  }
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c: any) => {
  const { uuid } = c.req.valid('param');

  // const data = await db.query.offer.findFirst({
  //   where(fields, operators) {
  //     return operators.eq(fields.uuid, uuid);
  //   },
  // });

  const resultPromise = db.select({
    id: offer.id,
    uuid: offer.uuid,
    serial: offer.serial,
    title: offer.title,
    subtitle: offer.subtitle,
    file: offer.file,
    deadline: offer.deadline,
    created_at: offer.created_at,
    updated_at: offer.updated_at,
    created_by: offer.created_by,
    created_by_name: hrSchema.users.name,
    remarks: offer.remarks,
  })
    .from(offer)
    .leftJoin(hrSchema.users, eq(offer.created_by, hrSchema.users.uuid))
    .where(eq(offer.uuid, uuid));

  const [data] = await resultPromise;

  if (!data)
    return DataNotFound(c);

  return c.json(data || {}, HSCode.OK);
};
