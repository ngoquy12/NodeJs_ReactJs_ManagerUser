import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { formatDate, formatDate1 } from "../fomatDatas/FormatData";
import Loading from "./Loading";
import { notification } from "antd";
import debounce from "lodash.debounce";

export default function ManagerUser() {
  const [users, setUsers] = useState([]);
  const [userName, setUserName] = useState("");
  const [nameSearch, setNameSearch] = useState("");
  const [gender, setGender] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dateOFBirth, setDateOfBirth] = useState("");
  const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalpage, setTotalPage] = useState(0);

  console.log("currentPage", currentPage);

  const loadData = async () => {
    setLoading(true);
    await axios
      .get(
        `http://localhost:3000/api/v1/users/?UserName=${nameSearch}&LIMIT=${record}&OFFSET=${currentPage}`
      )
      .then((res) => {
        console.log("resdata", res.data);
        setUsers(res.data.data);
        setTotalPage(res.data.totalPages);
      })
      .catch((err) => console.log(err));
    setLoading(false);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalpage) {
      setCurrentPage(page);
    }
  };

  const records = [
    {
      id: 1,
      value: 10,
    },
    {
      id: 2,
      value: 20,
    },
    {
      id: 3,
      value: 50,
    },
    {
      id: 4,
      value: 100,
    },
  ];

  useEffect(() => {
    const delayedSearch = debounce(loadData, 500); // Đặt thời gian debounce là 500ms

    delayedSearch();

    return delayedSearch.cancel; // Hủy debounce khi component bị hủy
  }, [nameSearch, currentPage, record]);

  const handleDelete = async (id) => {
    await axios
      .delete(`http://localhost:3000/api/v1/users/${id}`)
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
    loadData();
    notification.success({
      message: "Xóa thành công",
    });
  };

  const genders = [
    {
      id: 0,
      lable: "Male",
    },
    {
      id: 1,
      lable: "Female",
    },
    {
      id: 2,
      lable: "Other",
    },
  ];

  const newUser = {
    UserName: userName,
    Gender: gender,
    DateOfBirth: dateOFBirth,
    CreatedDate: formatDate1(new Date()),
    CreatedBy: "Ngọ Văn Quý",
    ModifiedDate: formatDate1(new Date()),
    ModifiedBy: "Ngọ Văn Quý",
    Email: email,
    Password: password,
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    await axios
      .post("http://localhost:3000/api/v1/users/register", newUser)
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
    notification.success({
      message: "Thêm tài khoản thành công",
    });
    loadData();
  };

  return (
    <div>
      <Navbar />
      <div style={{ margin: 20 }}>
        <div className="d-flex justify-content-between p-3">
          <h1>Manager User</h1>
          <>
            {/* Button trigger modal */}
            <div className="d-flex gap-3">
              <input
                value={nameSearch}
                onChange={(e) => setNameSearch(e.target.value)}
                className="form-control"
                type="text"
                placeholder="Search username..."
              />
              <select
                onChange={(e) => setRecord(e.target.value)}
                className="form-control"
              >
                {records.map((r) => (
                  <option key={r.id} value={r.value}>
                    Hiển thị {r.value} bản ghi{" "}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
              >
                Add user
              </button>
            </div>
            {/* Modal */}
            <div
              className="modal fade"
              id="exampleModal"
              tabIndex={-1}
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">
                      Add user
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    />
                  </div>
                  <div className="modal-body">
                    <form onSubmit={handleAddUser}>
                      <div className="mb-3">
                        <label
                          htmlFor="exampleInputEmail1"
                          className="form-label"
                        >
                          Username
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="exampleInputEmail1"
                          aria-describedby="emailHelp"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                        />
                      </div>
                      <div className="d-flex gap-3">
                        <label htmlFor="">Gender</label>

                        {genders.map((gend) => (
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="flexRadioDefault"
                              id="flexRadioDefault1"
                              checked={gender === gend.id}
                              onChange={() => setGender(gend.id)}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="flexRadioDefault1"
                            >
                              {gend.lable}
                            </label>
                          </div>
                        ))}
                      </div>

                      <div className="mb-3">
                        <label
                          htmlFor="exampleInputEmail1"
                          className="form-label"
                        >
                          DateOfBirth
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          id="exampleInputEmail1"
                          aria-describedby="emailHelp"
                          value={dateOFBirth}
                          onChange={(e) => setDateOfBirth(e.target.value)}
                        />
                      </div>

                      <div className="mb-3">
                        <label
                          htmlFor="exampleInputEmail1"
                          className="form-label"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          id="exampleInputEmail1"
                          aria-describedby="emailHelp"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="mb-3">
                        <label
                          htmlFor="exampleInputEmail1"
                          className="form-label"
                        >
                          Password
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          id="exampleInputEmail1"
                          aria-describedby="emailHelp"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          data-bs-dismiss="modal"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          data-bs-dismiss="modal"
                          className="btn btn-primary"
                        >
                          Submit
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </>
        </div>
        <table className="table table-striped table-hover table-bordered ">
          <thead>
            <tr>
              <th scope="col">STT</th>
              <th scope="col">Username</th>
              <th scope="col">Gender</th>
              <th scope="col">Address</th>
              <th scope="col">Email</th>
              <th className="text-center" colSpan={2} scope="col">
                Option
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <>
                <tr key={index}>
                  <td className="text-center">{index + 1}</td>
                  <td>{user.UserName}</td>
                  <td>
                    {user.Gender === 0
                      ? "Nam"
                      : user.Gender === 1
                      ? "Nữ"
                      : "Khác"}
                  </td>
                  <td>{formatDate(user.DateOfBirth)}</td>
                  <td>{user.Email}</td>
                  <td>
                    <>
                      {/* Button trigger modal */}
                      <button
                        type="button"
                        className="btn btn-warning"
                        data-bs-toggle="modal"
                        data-bs-target="#"
                      >
                        Edit
                      </button>
                      {/* Modal */}
                      <div
                        className="modal fade"
                        id=""
                        tabIndex={-1}
                        aria-labelledby="exampleModalLabel"
                        aria-hidden="true"
                      >
                        <div className="modal-dialog">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h5
                                className="modal-title"
                                id="exampleModalLabel"
                              >
                                Modal title
                              </h5>
                              <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                              />
                            </div>
                            <div className="modal-body">...</div>
                            <div className="modal-footer">
                              <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                              >
                                Close
                              </button>
                              <button type="button" className="btn btn-primary">
                                Save changes
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(user.UserId)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </div>
      {/* paging */}
      <div className="d-flex justify-content-end p-2">
        <nav aria-label="Page navigation example">
          <ul className="pagination">
            <li className="page-item">
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous"
              >
                <span aria-hidden="true">«</span>
              </button>
            </li>
            <li className={`page-item ${currentPage === 1 ? "active" : ""}`}>
              <button className="page-link" onClick={() => handlePageChange(1)}>
                1
              </button>
            </li>
            <li className={`page-item ${currentPage === 2 ? "active" : ""}`}>
              <button className="page-link" onClick={() => handlePageChange(2)}>
                2
              </button>
            </li>
            <li className="page-item">
              <button className="page-link">...</button>
            </li>
            <li
              className={`page-item ${
                currentPage === totalpage ? "active" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(totalpage)}
              >
                {totalpage}
              </button>
            </li>

            <li className="page-item">
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalpage}
                aria-label="Next"
              >
                <span aria-hidden="true">»</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
      {loading ? <Loading /> : <></>}
    </div>
  );
}
