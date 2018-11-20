import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import PropTypes from "prop-types";
import Moment from "react-moment";
import "moment/locale/th";
import { deleteExperience } from "../../actions/profileActions";

class Experience extends Component {
  onDeleteClick = id => {
    if (window.confirm("Are your sure ?")) {
      this.props.deleteExperience(id);
    }
  };

  render() {
    const experience = this.props.experience.map(exp => (
      <tr key={exp._id}>
        <td>{exp.company}</td>
        <td>{exp.title}</td>
        <td>
          <Moment element="span" format="YYYY/MM/DD">
            {exp.from}
          </Moment>
          {" - "}
          {exp.to === null ? (
            "Now"
          ) : (
            <Moment element="span" format="YYYY/MM/DD">
              {exp.to}
            </Moment>
          )}
        </td>
        <td>
          <button
            onClick={this.onDeleteClick.bind(this, exp._id)}
            className="btn btn-danger"
          >
            Delete
          </button>
        </td>
      </tr>
    ));
    return (
      <div>
        <h4 className="mb-4">Experience Credentials</h4>
        <table className="table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Title</th>
              <th>Years</th>
              <th />
            </tr>
          </thead>
          <tbody>{experience}</tbody>
        </table>
      </div>
    );
  }
}
Experience.propTypes = {
  deleteExperience: PropTypes.func.isRequired
};

export default compose(
  connect(
    null,
    { deleteExperience }
  )
)(Experience);
