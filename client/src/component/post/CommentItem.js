import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { deleteComment } from "../../actions/postActions";

class CommentItem extends Component {
  onDeleteClick = (postId, commentId) => {
    if (window.confirm("Are you sure?")) {
      this.props.deleteComment(postId, commentId);
    }
  };
  render() {
    const { comment, postId, auth } = this.props;
    return (
      <div className="card card-body mb-3">
        <div className="row">
          <div className="col-md-2">
            {/* <Link to="/profile"> */}
            <img
              className="rounded-circle d-none d-md-block"
              src={comment.avatar}
              alt=""
            />
            {/* </Link> */}
            <br />
            <p className="text-center">{comment.name}</p>
          </div>
          <div className="col-md-10">
            <p className="lead">{comment.text}</p>
            <span style={{ position: "absolute", top: 0, right: 0 }}>
              {comment.user === auth.user.id ? (
                <button
                  onClick={this.onDeleteClick.bind(this, postId, comment._id)}
                  type="button"
                  className="btn btn-danger mr-1"
                >
                  <i className="fas fa-times" />
                </button>
              ) : null}
            </span>
          </div>
        </div>
      </div>
    );
  }
}

CommentItem.propTypes = {
  auth: PropTypes.object.isRequired,
  comment: PropTypes.object.isRequired,
  deleteComment: PropTypes.func.isRequired,
  postId: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});
export default compose(
  connect(
    mapStateToProps,
    { deleteComment }
  )
)(CommentItem);
