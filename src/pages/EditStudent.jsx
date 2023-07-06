import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";

const EditStudent = ({ student, refreshStudentList, setShowModal }) => {
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputErrorList, setInputErrorList] = useState({});

  useEffect(() => {
    if (student) {
      setName(student.name);
      setCourse(student.course);
      setEmail(student.email);
      setPhone(student.phone);
      setPreviewImage(student.image ? `http://127.0.0.1:8000/storage/${student.image}` : null);
    }
  }, [student]);

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
    setPreviewImage(URL.createObjectURL(selectedImage));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append("name", name);
    formData.append("course", course);
    formData.append("email", email);
    formData.append("phone", phone);
    if (image) {
      formData.append("image", image);
    }

    console.log("Form Data:", formData);

    setLoading(true);

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/students/${student.id}/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("API Response:", response.data); 

      Swal.fire({
        icon: "success",
        title: "Success",
        text: response.data.message,
      });

      refreshStudentList();
      setShowModal(false);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 422) {
          setInputErrorList(error.response.data.errors);
        } else {
          alert(error.response.data);
        }
      } else {
        alert("An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
              onChange={(e) => setName(e.target.value)}
            />
            {inputErrorList.name && (
              <div className="text-danger">{inputErrorList.name[0]}</div>
            )}
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
              onChange={(e) => setCourse(e.target.value)}
            />
            {inputErrorList.course && (
              <div className="text-danger">{inputErrorList.course[0]}</div>
            )}
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
              onChange={(e) => setEmail(e.target.value)}
            />
            {inputErrorList.email && (
              <div className="text-danger">{inputErrorList.email[0]}</div>
            )}
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
              onChange={(e) => setPhone(e.target.value)}
            />
            {inputErrorList.phone && (
              <div className="text-danger">{inputErrorList.phone[0]}</div>
            )}
          </div>
        </div>
      </div>
      <div className="mb-3">
        <label htmlFor="image" className="form-label">
          Image
        </label>
        <input
          type="file"
          className="form-control"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
        />
        {previewImage && (
          <div className="mb-3">
            <img src={previewImage} alt="Preview" className="img-thumbnail" width="200px" />
          </div>
        )}
        {inputErrorList.image && (
          <div className="text-danger">{inputErrorList.image[0]}</div>
        )}
      </div>
      <div className="mt-3">
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update"}
        </Button>
      </div>
    </form>
  );
};

export default EditStudent;
