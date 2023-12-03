import "./App.css";
import { FaEdit, FaTrash } from 'react-icons/fa';
import { MdFirstPage, MdLastPage } from 'react-icons/md';
import { BiRightArrowAlt, BiLeftArrowAlt } from 'react-icons/bi';

import { useState, useEffect } from 'react';

function Demo() {

  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const [page, setPage] = useState(1);
  const membersPerPage = 10;

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    const response = await fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json');
    const data = await response.json();
    setMembers(data);
    setFilteredMembers(data);
  }

  function filterMembers(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = members.filter(m => {
      return Object.values(m).some(val =>
        String(val).toLowerCase().includes(searchTerm)
      );
    });
    setFilteredMembers(filtered);
  }

  function deleteSelected() {
    const updatedMembers = members.filter(m => !selectedMembers.includes(m.id));
    setMembers(updatedMembers);
    setFilteredMembers(updatedMembers);
    setSelectedMembers([]);
  }



  const toggleSelectAll = (members) => {
    const selectStatus = members.length === selectedMembers.length;
    setSelectedMembers(selectStatus ? [] : members.map(m => m.id))
  }

  const toggleSelectMember = (id) => {
    if (selectedMembers.includes(id)) {
      setSelectedMembers(selectedMembers.filter(sid => sid !== id));
    } else {
      setSelectedMembers([...selectedMembers, id]);
    }
  }

  const setEditMember = (member) => {
    // display modal/inline editing UI
    // setCurrentlyEdited(member);    
  }

  const deleteMember = (e) => {
    setMembers(
      filteredMembers.filter(member => member.id !== e.id)
    );
    setFilteredMembers(filteredMembers.filter(member => member.id !== e.id))
  }

  // additional functions to handle select, pagination, 
  // editing, deleting individual rows, etc

  return (
    <>
    <h1 className="header">Admin Dashboard</h1>

    <div className="srch">
    <input
        className="search-input"
        placeholder="Search"
        onChange={filterMembers}
      />
    </div>
   

      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={() => toggleSelectAll(filteredMembers.slice((page - 1) * membersPerPage, page * membersPerPage))}
              />
            </th>
            <th>Id</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredMembers.slice((page - 1) * membersPerPage, page * membersPerPage).map(member => (
            <tr key={member.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedMembers.includes(member.id)}
                  onChange={() => toggleSelectMember(member.id)}
                />
              </td>
              <td>{member.id}</td>
              <td>{member.name}</td>
              <td>{member.email}</td>
              <td>{member.role}</td>
              <td>
                <button
                  className="edit"
                  onClick={() => setEditMember(member)}
                >
                  <FaEdit />
                </button>
                <button
                  className="delete"
                  onClick={() => deleteMember(member)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


      <div className="secondComp">
        <div className="pagination">
          <button
            className="first-page"
            onClick={() => setPage(1)}
          >
            <MdFirstPage />
          </button>
          <button
            className="previous-page"
            onClick={() => setPage(page - 1)}
          >
            <BiLeftArrowAlt />
          </button>

          <button
            className="next-page"
            onClick={() => setPage(page + 1)}
          >
            <BiRightArrowAlt />
          </button>
          <button
            className="last-page"
            onClick={() => setPage(Math.ceil(filteredMembers.length / membersPerPage))}
          >
            <MdLastPage />
          </button>
        </div>

        <button
          className="delete-selected"
          onClick={deleteSelected}
        >
          Delete Selected
        </button>
      </div>

    </>
  );
}

export default Demo;