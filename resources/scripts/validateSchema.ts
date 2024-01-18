import Ajv from "ajv";

import * as schemaConfig from "../schema.json";
import * as data2024 from "../2024.json";

const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}

console.log("TODO: still getting weird errors");

// console.log(JSON.stringify(schemaConfig, null, 4));
// const validate = ajv.compile((schemaConfig as any).default);
// const valid = validate(data2024);

// if (valid) {
//   console.log("Schema Valid!");
// } else {
//   console.log(validate.errors);
//   throw new Error("Schema Invalid");
// }
