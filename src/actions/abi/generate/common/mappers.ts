export const getDefault = (type: string) => {
  switch (type) {
    case "string":
      return "''";
    case "boolean":
      return "false";
    case "number":
      return "0";
    case "bigint":
      return "0n";
    case "Date":
      return "new Date(0)";
    default:
      return "undefined";
  }
};
