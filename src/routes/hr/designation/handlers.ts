import type { AppRouteHandler } from "@/lib/types";
import type { CreateRoute, GetOneRoute, ListRoute, PatchRoute, RemoveRoute } from "./routes";
import db from "@/db";

import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from "@/lib/constants";

import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import * as HttpStatusPhrases from "stoker/http-status-phrases";

import { designation } from "../schema";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const designation = await db.query.designation.findMany();
  return c.json(designation);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const value = c.req.valid("json");
  const [inserted] = await db.insert(designation).values(value).returning();
  return c.json(inserted, HttpStatusCodes.OK);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { uuid } = c.req.valid("param");
  const value = await db.query.designation.findFirst({
    where(fields, operators) {
      return operators.eq(fields.uuid, uuid);
    },
  });

  if (!value) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(value, HttpStatusCodes.OK);
};

export const patch: AppRouteHandler<PatchRoute> = async (c) => {
  const { uuid } = c.req.valid("param");
  const updates = c.req.valid("json");

  if (Object.keys(updates).length === 0) {
    return c.json(
      {
        success: false,
        error: {
          issues: [
            {
              code: ZOD_ERROR_CODES.INVALID_UPDATES,
              path: [],
              message: ZOD_ERROR_MESSAGES.NO_UPDATES,
            },
          ],
          name: "ZodError",
        },
      },
      HttpStatusCodes.UNPROCESSABLE_ENTITY,
    );
  }

  const [task] = await db.update(designation)
    .set(updates)
    .where(eq(designation.uuid, uuid))
    .returning();

  if (!task) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(task, HttpStatusCodes.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const { uuid } = c.req.valid("param");
  const result = await db.delete(designation)
    .where(eq(designation.uuid, uuid));

  if (result.rowCount === 0) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};
