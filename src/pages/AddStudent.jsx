import React, { useState } from "react";
import axios from "axios";

const AddStudent = ({ setShowModal, refreshStudentList }) => {
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleCourseChange = (e) => {
    setCourse(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);

    // Create a preview URL for the selected image
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("course", course);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("image", avatar);

    try {
      setLoading(true);
      const response = await axios.post(
        "http://127.0.0.1:8000/api/students",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const addedStudent = response.data.student;
      setLoading(false);
      setShowModal(false);
      refreshStudentList(); // Refresh the student list after adding a new student
    } catch (error) {
      setLoading(false);
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  const handleDismiss = () => {
    setShowModal(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row">
        <div className="col">
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={name}
              onChange={handleNameChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="course" className="form-label">
              Course
            </label>
            <input
              type="text"
              className="form-control"
              id="course"
              value={course}
              onChange={handleCourseChange}
              required
            />
          </div>
          
        </div>
        <div className="col">
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="phone" className="form-label">
              Phone
            </label>
            <input
              type="text"
              className="form-control"
              id="phone"
              value={phone}
              onChange={handlePhoneChange}
              required
            />
          </div>
        </div>
      </div>
      <div className="mb-3">
            <label htmlFor="avatar" className="form-label">
              Avatar
            </label>
            <input
              type="file"
              className="form-control"
              id="avatar"
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </div>
      <div className="row">
        <div className="col">
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Avatar Preview"
              className="mt-2 d-flex mx-auto"
              width="200px"
            />
          )}
        </div>
      </div>
      <div className="row">
        <div className="col d-flex justify-content-between">
          <button type="submit" className="btn btn-primary">
            {loading ? "Adding..." : "Add"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleDismiss}
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddStudent;
