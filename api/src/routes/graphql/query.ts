import { typeAdder } from ".";

export const addQuery: typeAdder = (schema) =>
  schema.queryType({
    fields: (t) => ({
      greet: t.string({
        args: {
          name: t.arg.string({
            required: false,
            defaultValue: "Kennan",
            description: "ti's the name",
          }),
        },
        resolve: (_source, { name }, context, _info) => {
          console.log("Hi");
          console.log(
            JSON.stringify(
              {
                subResolverContext: context ?? "this shit is undefined",
              },
              undefined,
              4
            )
          );

          return `Hello ${name}`;
        },
      }),
    }),
  });
