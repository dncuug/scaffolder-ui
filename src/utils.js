

export function getSchemaKey(schema) {
    return schema.columns.filter(col => col.isKey)[0].name;   // todo: decide support multiple key columns or drop
}

export function findByKey(items, key) {
    return items.filter(item => item[key] === key)[0];
}


export const COLUMN_TYPE = {
    String: 9, /* will be changed */
    Text: 10,
    Email: 11,
    Url: 12,
    Phone: 13,
    HTML: 14,
    Password: 15,
    Date: 20,
    Time: 21,
    DateTime: 22,
    File: 30,
    Integer: 40,
    Double: 50,
    Image: 60,
    Binary: 70,
    Lookup: 80,
    Boolean: 90
};

const COL_TO_PROP_TYPE = {
    [COLUMN_TYPE.String]: {type: 'String'},
    [COLUMN_TYPE.Text]: {type: 'string'},
    [COLUMN_TYPE.Email]: {type: 'string', format: 'email'},
    [COLUMN_TYPE.Url]: {type: 'string', format: 'uri'},
    [COLUMN_TYPE.Phone]: {type: 'string'},
    [COLUMN_TYPE.HTML]: {type: 'string'},
    [COLUMN_TYPE.Password]: {type: 'string'},
    [COLUMN_TYPE.Date]: {type: 'string', format: 'date'},
    [COLUMN_TYPE.Time]: {type: 'string', format: 'date-time'},
    [COLUMN_TYPE.DateTime]: {type: 'string', format: 'date-time'},
    // [COLUMN_TYPE.File]: {type: 'string', format: 'data-url'},
    [COLUMN_TYPE.File]: {type: 'string'},
    [COLUMN_TYPE.Integer]: {type: 'integer'},
    [COLUMN_TYPE.Double]: {type: 'number'},
    // [COLUMN_TYPE.Image]: {type: 'string', format: 'data-url'},
    [COLUMN_TYPE.Image]: {type: 'string'},
    [COLUMN_TYPE.Binary]: {type: 'string'},
    [COLUMN_TYPE.Lookup]: {type: 'string'},
    [COLUMN_TYPE.Boolean]: {type: 'boolean'},
};

const COL_TO_PROP_WIDGET = {
    // [COLUMN_TYPE.String]: {'ui:widget': 'input'},
    [COLUMN_TYPE.Text]: {'ui:widget': 'textarea'},
    // [COLUMN_TYPE.Email]: {'ui:widget': ''},
    // [COLUMN_TYPE.Url]: {'ui:widget': ''},
    // [COLUMN_TYPE.Phone]: {},
    [COLUMN_TYPE.HTML]: {'ui:widget': 'textarea'},
    [COLUMN_TYPE.Password]: {'ui:widget': 'password'},
    // [COLUMN_TYPE.Date]: {'ui:widget': 'alt-date'},
    // [COLUMN_TYPE.Time]: {},
    // [COLUMN_TYPE.DateTime]: {'ui:widget': 'alt-datetime'},
    // [COLUMN_TYPE.File]: {'ui:widget': 'textarea'},
    [COLUMN_TYPE.Integer]: {'ui:widget': 'updown'},
    // [COLUMN_TYPE.Double]: {'ui:widget': 'number'},
    // [COLUMN_TYPE.Image]: {'ui:widget': '', },
    // [COLUMN_TYPE.Binary]: {'ui:widget': 'textarea'},
    // [COLUMN_TYPE.Lookup]: {'ui:widget': 'textarea'},
    // [COLUMN_TYPE.Boolean]: {'ui:widget': 'boolean'},
};

function columnsToProperties(columns) {
    let result = {};

    columns.forEach(col => {
        const properties = {
            title: col.title,
            ...COL_TO_PROP_TYPE[col.type],
        };
        if (typeof col.minLength === 'number') properties.minLength = col.minLength;
        if (typeof col.maxLength === 'number') properties.maxLength = col.maxLength;
        if (typeof col.minValue === 'number') properties.minimum = col.minValue;
        if (typeof col.maxValue === 'number') properties.maximum = col.maxValue;
        result[col.name] = properties;
    });
    return result
}

export function convertToJSONAndUISchema(schema) {
    const JSONSchema = {
        title: schema.title,
        description: schema.description,
        type: "object",
        required: schema.columns.filter(col => !col.isNullable).map(col => col.name),
        properties: columnsToProperties(schema.columns),
    };
    const UISchema = {};
    schema.columns.forEach(col => {
        if (col.isKey) {
            UISchema[col.name] = {"ui:widget": "hidden"};
        } else {
            const widgetOverride = COL_TO_PROP_WIDGET[col.type];
            if (widgetOverride) {
                UISchema[col.name] = {
                    ...widgetOverride,
                    readonly: col.readonly,
                };
            }
        }
    });
    return {
        JSONSchema,
        UISchema,
    }
}


