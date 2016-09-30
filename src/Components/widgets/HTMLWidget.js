import React from 'react';

function HTMLWidget({
    schema,
    id,
    placeholder,
    value,
    required,
    disabled,
    readonly,
    onChange
}) {
    return (
        <textarea
            id={id}
            className="form-control"
            value={typeof value === "undefined" ? "" : value}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            readOnly={readonly}
            onChange={(event) => onChange(event.target.value)} />
    );
}

export default HTMLWidget;

