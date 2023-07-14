import { Technology } from "./../../../types/mapping.types";
import { pascalCase } from "change-case";
import { Property } from "../../generate.types";

export const mapper_writeMappingFromEntity = (
  prop: Property,
  technology: Technology
) => {
  const { type } = prop;
  const pascalCaseMappedName = pascalCase(type.mappedName);
  const pascalCaseTechnology = pascalCase(technology);

  if (
    type.isArray &&
    type.name === "bigint" &&
    technology === Technology.Mongo
  ) {
    return `(values: bigint[]) => values.map(value => MongoDB.Long.fromBigInt(value)),`;
  }

  if (type.isArray && (type.requiresCodeGen || type.requiresImport)) {
    return `(values: ${pascalCaseMappedName}[]) => values.map(value => new ${pascalCaseMappedName}${pascalCaseTechnology}Mapper().fromEntity(value)),`;
  }

  if (type.isArray) {
    return `(values: ${type.name}[]) => values,`;
  }

  if (type.name === "bigint" && technology === Technology.Mongo) {
    return `(value: bigint) => MongoDB.Long.fromBigInt(value),`;
  }

  if (type.requiresCodeGen || type.requiresImport) {
    return `(value: ${pascalCaseMappedName}) => new ${pascalCaseMappedName}${pascalCaseTechnology}Mapper().fromEntity(value),`;
  }

  return `(value: ${type.name}) => value,`;
};

export const mapper_writeMappingToEntity = (
  prop: Property,
  technology: Technology
) => {
  const { key, type } = prop;
  const pascalCaseMappedName = pascalCase(type.mappedName);
  const pascalCaseTechnology = pascalCase(technology);

  if (
    type.isArray &&
    type.name === "bigint" &&
    technology === Technology.Mongo
  ) {
    return `${key}?.map(value => value.toBigInt() || ${type.defaultValue}) || [],`;
  }

  if (type.isArray && type.name === "bigint") {
    return `${key}?.map(value => value || ${type.defaultValue}) || [],`;
  }

  if (type.isArray && (type.requiresCodeGen || type.requiresImport)) {
    return `${key}?.map(value => new ${pascalCaseMappedName}${pascalCaseTechnology}Mapper().toEntity(value)) || [],`;
  }

  if (type.name === "bigint" && technology === Technology.Mongo) {
    return `${key}?.toBigInt() || ${type.defaultValue},`;
  }

  if (type.requiresCodeGen || type.requiresImport) {
    return `new ${pascalCaseMappedName}${pascalCaseTechnology}Mapper().toEntity(${key}),`;
  }

  return `${key} || ${type.defaultValue},`;
};

export const mapper_writeArg_Id = (
  props: Property[],
  technology: Technology
) => {
  const id = props.find((prop) => prop.key === "id");

  if (id) {
    return "";
  }

  if (technology === Technology.Mongo) {
    return `_id instanceof MongoDB.ObjectId ? _id.toString() : undefined,`;
  }

  return "undefined,";
};

export const mapper_writeParam_Id = (
  props: Property[],
  technology: Technology
) => {
  const id = props.find((prop) => prop.key === "id");

  if (id) {
    return "";
  }

  if (technology === Technology.Mongo) {
    return `_id,`;
  }

  return "undefined,";
};
