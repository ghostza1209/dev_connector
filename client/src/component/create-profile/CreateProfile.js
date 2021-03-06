import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import TextFieldGroup from "../common/TextFieldGroup";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import SelectListGroup from "../common/SelectListGroup";
import InputGroup from "../common/InputGroup";

import { createProfile } from "../../actions/profileActions";

class CreateProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displaySocialInputs: false,
      handle: "",
      company: "",
      website: "",
      location: "",
      status: "",
      skills: "",
      githubusername: "",
      bio: "",
      twitter: "",
      youtube: "",
      facebook: "",
      linkedin: "",
      instagram: "",
      errors: {}
    };
  }
  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  onSubmit = e => {
    e.preventDefault();
    const profileData = {
      handle: this.state.handle,
      company: this.state.company,
      website: this.state.website,
      location: this.state.location,
      status: this.state.status,
      skills: this.state.skills,
      githubusername: this.state.githubusername,
      bio: this.state.bio,
      twitter: this.state.twitter,
      youtube: this.state.youtube,
      facebook: this.state.facebook,
      linkedin: this.state.linkedin,
      instagram: this.state.instagram
    };
    this.props.createProfile(profileData, this.props.history);
  };

  render() {
    const { errors, displaySocialInputs } = this.state;
    let socialInputs;

    if (displaySocialInputs) {
      socialInputs = (
        <div>
          <InputGroup
            placeholder="Twitter profile url"
            name="twitter"
            icon="fab fa-twitter"
            value={this.state.twitter}
            onChange={this.onChange}
          />
          <InputGroup
            placeholder="facebook profile url"
            name="facebook"
            icon="fab fa-facebook"
            value={this.state.facebook}
            onChange={this.onChange}
          />
          <InputGroup
            placeholder="ํYoutube profile url"
            name="youtube"
            icon="fab fa-youtube"
            value={this.state.youtube}
            onChange={this.onChange}
          />
          <InputGroup
            placeholder="Linkedin profile url"
            name="linkedin"
            icon="fab fa-linkedin"
            value={this.state.linkedin}
            onChange={this.onChange}
          />
          <InputGroup
            placeholder="instagram page url"
            name="instagram"
            icon="fab fa-instagram"
            value={this.state.instagram}
            onChange={this.onChange}
          />
        </div>
      );
    }
    //Select option for status
    const options = [
      { label: "Select Professional Status", value: 0 },
      { label: "Developer", value: "Developer" },
      { label: "Junior Developer", value: "Junior Developer" },
      { label: "Senior Developer", value: "Senior Developer" },
      { label: "Manager", value: "Manager" },
      { label: "Student or Learning", value: "Student or Learning" },
      { label: "Intern", value: "Intern" },
      { label: "Other", value: "Other" }
    ];
    return (
      <div className="create-profile col-7 m-auto">
        <div className="container">
          <div className="col-md-8 m-auto" />
          <h1 className="display-4 text-center">Create your profile</h1>
          <p className="lead text-center">
            Let's get some information to make your profile standout
          </p>
          <small className="d-block pb-3">*= Require fields</small>
          <form action="" onSubmit={this.onSubmit}>
            <TextFieldGroup
              placeholder="* Profile Handle"
              name="handle"
              value={this.state.handle}
              onChange={this.onChange}
              error={errors.handle}
            />
            <SelectListGroup
              placeholder="Status"
              name="status"
              value={this.state.status}
              onChange={this.onChange}
              error={errors.status}
              options={options}
              info="Give us and idea of where your are in career"
            />
            <TextFieldGroup
              placeholder="Company"
              name="company"
              value={this.state.company}
              onChange={this.onChange}
              error={errors.company}
              info="Could be your own company or one you are work for"
            />
            <TextFieldGroup
              placeholder="Your Website"
              name="website"
              value={this.state.website}
              onChange={this.onChange}
              error={errors.website}
              info="Could be your own website"
            />
            <TextFieldGroup
              placeholder="Location"
              name="location"
              value={this.state.location}
              onChange={this.onChange}
              error={errors.location}
              info="City (eg.Phuket,Bangkok)"
            />
            <TextFieldGroup
              placeholder="* Skills"
              name="skills"
              value={this.state.skills}
              onChange={this.onChange}
              error={errors.skills}
              info="Please use comma seperate values (eg. HTML,CSS,Javascript,PHP)"
            />
            <TextFieldGroup
              placeholder="Github Username"
              name="githubusername"
              value={this.state.githubusername}
              onChange={this.onChange}
              error={errors.githubusername}
              info="If you want your latest repos and a Github link, include your username here"
            />
            <TextAreaFieldGroup
              placeholder="Short Bio"
              name="bio"
              value={this.state.bio}
              onChange={this.onChange}
              error={errors.bio}
              info="Tell us a little about yourself"
            />
            <div className="mg-3">
              <button
                type="button"
                onClick={() => {
                  this.setState(prevState => ({
                    //get current state and toggle displaySocialInputs variable
                    displaySocialInputs: !prevState.displaySocialInputs
                  }));
                }}
                className="btn btn-light"
              >
                Add Social Network Links
              </button>
              <small className="text-muted">Optional</small>
            </div>
            {socialInputs}
            <input
              type="submit"
              value="Submit"
              className="btn btn-info btn-block mt-4"
            />
          </form>
        </div>
      </div>
    );
  }
}

CreateProfile.propTypes = {
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.errors
});

// export default connect(
//   mapStateToProps,
//   { createProfile }
// )(CreateProfile);
export default compose(
  withRouter,
  connect(
    mapStateToProps,
    { createProfile }
  )
)(CreateProfile);
