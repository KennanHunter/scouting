import { GenerateResponseSchemaType } from "types";
import { z } from "zod";

export const successfulResponse = <
  TSchema extends z.AnyZodObject,
  TVal extends z.infer<TSchema>,
>(
  schema: TSchema,
  val: TVal
): Response => {
  return new Response(
    JSON.stringify({
      status: "success",
      data: schema.parse(val),
    }),
    {
      status: 200,
    }
  );
};

export const errorResponse = (error: string): Response =>
  new Response(
    JSON.stringify({
      status: "error",
      error: {
        errorMessage: error,
      },
    })
  );
