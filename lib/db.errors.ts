export function isForeignKeyError(error: any): boolean {
  return error?.code === "ER_ROW_IS_REFERENCED_2";
}

