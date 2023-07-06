import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import Loading from "../components/Loading";
import AddStudent from "./AddStudent";
import EditStudent from "./EditStudent";

function Student() {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const refreshStudentList = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/students");
      setStudents(response.data.students);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditModal = (student) => {
    setSelectedStudent(student);
    setShowEditModal(true);
  };

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchData = async () => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    await axios.post("http://127.0.0.1:8000/api/auth/me").then((response) => {
      // setUser(response.data);
    });
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    } else {
      fetchData();
    }
  }, [navigate]);

  const logoutHandler = async () => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    await axios
      .post("http://127.0.0.1:8000/api/auth/logout")
      .then(() => {
        localStorage.removeItem("token");
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/students`)
      .then((res) => {
        setStudents(res.data.students);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false); // Stop loading on error
      });
  }, []);

  useEffect(() => {
    const filteredStudents = students.filter((student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredStudents(filteredStudents);
  }, [searchQuery, students]);

  const deleteStudent = async (e, id) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "Delete Student",
      text: "Are you sure you want to delete this student?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/students/${id}/delete`);
        setStudents((prevStudents) =>
          prevStudents.filter((student) => student.id !== id)
        );
        Swal.fire({
          title: "Deleted!",
          text: "The student has been deleted.",
          icon: "success",
        });
      } catch (error) {
        if (error.response) {
          if (error.response.status === 404) {
            setInputErrorList(error.response.data.message);
          }
          if (error.response.status === 500) {
            Swal.fire({
              title: "Error",
              text: error.response.data,
              icon: "error",
            });
          }
        } else {
          Swal.fire({
            title: "Error",
            text: "An error occurred. Please try again later.",
            icon: "error",
          });
        }
      }
    }
  };

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  let studentDetails;
  if (currentStudents.length > 0) {
    studentDetails = currentStudents.map((item, index) => (
      <tr key={index}>
        <td>{indexOfFirstStudent + index + 1}</td>
        <td>{item.name}</td>
        <td>{item.course}</td>
        <td>{item.email}</td>
        <td>{item.phone}</td>
        <td>
          {item.image && (
            <img
              src={`http://127.0.0.1:8000/storage/${item.image}`}
              alt="Student"
              style={{ maxWidth: "100px" }}
            />
          )}
        </td>
        <td>
          <Button
            variant="info"
            size="sm"
            className="me-1 text-white"
            onClick={() => handleEditModal(item)}
          >
            Edit
          </Button>
          <button
            type="button"
            onClick={(e) => deleteStudent(e, item.id)}
            className="btn btn-danger btn-sm"
          >
            Delete
          </button>
        </td>
      </tr>
    ));
  } else {
    studentDetails = (
      <tr>
        <td colSpan="7" className="text-center">
          No data available.
        </td>
      </tr>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h4>
                Student List
                <Button
                  variant="primary"
                  className="float-end"
                  onClick={() => setShowModal(true)}
                >
                  Add Student
                </Button>
              </h4>
              <div className="mt-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="card-body">
              {filteredStudents.length > 0 ? (
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Course</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Image</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>{studentDetails}</tbody>
                </table>
              ) : (
                <div className="text-center mx-auto mt-5">
                  <span>No data available.</span>
                </div>
              )}
              <Pagination
                studentsPerPage={studentsPerPage}
                totalStudents={filteredStudents.length}
                paginate={paginate}
              />
            </div>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
            <Modal.Title>Add Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <AddStudent setShowModal={setShowModal} refreshStudentList={refreshStudentList} />
        </Modal.Body>
        </Modal>    

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EditStudent
            student={selectedStudent}
            refreshStudentList={refreshStudentList}
            setShowModal={setShowEditModal}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}

const Pagination = ({ studentsPerPage, totalStudents, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalStudents / studentsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map((number) => (
          <li key={number} className="page-item">
            <button onClick={() => paginate(number)} className="page-link">
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Student;
