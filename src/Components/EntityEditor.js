import React, {Component} from 'react';
import Form from "react-jsonschema-form";
import {Button, ButtonToolbar} from "react-bootstrap";
import {convertToJSONAndUISchema} from "../utils";
import {HTMLWidget} from "./widgets";



const widgets = {
    html: HTMLWidget
};

class EntityEditor extends Component {

    static propTypes = {
        schema: React.PropTypes.shape({
            columns: React.PropTypes.array.isRequired,
        }).isRequired,
        entity: React.PropTypes.object.isRequired,
        onSave: React.PropTypes.func.isRequired,
        onCancel: React.PropTypes.func.isRequired,
    };

    onSaveClick(e) {
        if (e.status === 'initial') {
            this.props.onCancel(e);
        } else { // if (e.status === 'editing')
            this.props.onSave(e.formData);
        }
    }

    render() {
        const {schema, entity} = this.props;
        const {JSONSchema, UISchema} = convertToJSONAndUISchema(schema);

        return (
            <Form schema={JSONSchema}
                  uiSchema={UISchema}
                  formData={entity}
                  liveValidate={true}
                  widgets={widgets}
                  onSubmit={this.onSaveClick.bind(this)}>
                <ButtonToolbar>
                    <Button type="submit" active bsStyle="info">Submit</Button>
                    <Button onClick={this.props.onCancel}>Cancel</Button>
                </ButtonToolbar>
            </Form>
        )
    }
}

export default EntityEditor;
