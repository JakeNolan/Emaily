import React, { Component } from "react";
import { reduxForm, Field } from "redux-form"; // allows our form to communicate with the redux store that is at the top of our app with the provider tag
import _ from "lodash";
import { Link } from "react-router-dom";
import SurveyField from "./SurveyField";
import validateEmails from "../../utils/validateEmails";
import formFields from "./formFields";

class SurveyForm extends Component {
  renderFields() {
    return _.map(formFields, field => {
      return (
        <Field
          key={field.name}
          component={SurveyField}
          type="text"
          label={field.label}
          name={field.name}
        />
      );
    });
  }

  render() {
    return (
      <div>
        <form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}>
          {this.renderFields()}
          <Link to="/surveys" className="red btn-flat white-text">
            Cancel
          </Link>
          <button type="submit" className="teal btn-flat right white-text">
            Next
            <i className="material-icons right">done</i>
          </button>
        </form>
      </div>
    );
  }
}

function validate(values) {
  const errors = {};

  errors.recipients = validateEmails(values.recipients || "");

  // reduxForm will automatically map this error message to the right field
  // if the property names on the error object and the property names on the Field object match
  _.each(formFields, ({ name }) => {
    if (!values[name]) {
      errors[name] = `You must provide ${name}`;
    }
  });

  return errors;
}

export default reduxForm({
  validate,
  form: "surveyForm",
  destroyOnUnmount: false
})(SurveyForm);

// <Field
// label="Survey Title"
// type="text"
// name="title"
// component={SurveyField}
// />
// <Field
// label="Subject Line"
// type="text"
// name="subject"
// component={SurveyField}
// />
// <Field
// label="Email Body"
// type="text"
// name="body"
// component={SurveyField}
// />
// <Field
// label="Recipient List"
// type="text"
// name="emails"
// component={SurveyField}
// />

// if (!values.title) {
//     errors.title = "You must provide a title";
//   }

//   if (!values.subject) {
//     errors.subject = "You must provide a subject";
//   }

//   if (!values.body) {
//     errors.body = "You must provide a body";
//   }
