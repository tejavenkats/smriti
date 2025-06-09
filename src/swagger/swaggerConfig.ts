import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Smriti",
      version: "1.0.0",
      description: "The brain and memory of Heimdall/Nimeshika",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // Path to the API routes files
};

const specs = swaggerJsdoc(options);

export default specs;
