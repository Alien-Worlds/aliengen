import { Property } from "../../generate.types";

export const buildParam_Id = (props: Property[], access) => {
  const id = props.find((prop) => prop.key === "id");
  return id
    ? ""
    : `${typeof access === "string" ? access + " " : ""}id?: string,`;
};

export const buildArg_Id = (props: Property[]) => {
  const id = props.find((prop) => prop.key === "id");
  return id ? "" : `id,`;
};
