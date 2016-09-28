

export function getSchemaKey(schema) {
    return schema.columns.filter(col => col.isKey)[0].name;   // todo: support multiple key columns
}
