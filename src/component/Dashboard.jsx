
import React from 'react';
import { useEffect, useState } from 'react'
import axios from 'axios';
import DataTable from 'react-data-table-component';

import { FaEdit, FaTrash } from 'react-icons/fa';



function Dashboard() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("")
  const [filteredData, setFilteredData] = useState("")
  const [selectedMembers, setSelectedMembers] = useState([]);
  const getData = async () => {
    try {
      const res = await axios.get("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json");
      setData(res.data);
      console.log(res.data);
      setFilteredData(res.data);
    } catch (er) {
      console.log(er);
    }
  };

  function handleEdit(row) {
    // Open modal or set row to editable  
  }

  function handleDelete(id) {
    // Filter data and remove row with this id
    setData(filteredData.filter(d => d.id !== id));
    setFilteredData(filteredData.filter(d => d.id !== id));
    
  }

  function deleteSelected() {
  const selectedIds = selectedMembers.map(ob =>{
   return ob.id
  } );
  const updatedData = filteredData.filter(item => !selectedIds.includes(item.id));
  console.log(selectedIds);
  setFilteredData(updatedData);
  setData(updatedData);
  setSelectedMembers([]); 
  }

  
  const toggleSelectMember = (id) => {
    if(selectedMembers.includes(id)) {
      setSelectedMembers(selectedMembers.filter(sid => sid !== id));
    } else {
      setSelectedMembers([...selectedMembers, id]);  
    }
  }
  




  const col = [
    {
      name: "email",
      selector: (row) => row.email
    },
    {
      name: "id",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "name",
      selector: (row) => row.name
    },
    {
      name: "role",
      selector: (row) => row.role
    },
    {
      name: "Action",
      cell: (row) => {
        return (
          <>
            <button  onClick={() => handleEdit(row)}>  <FaEdit /></button>
            <button  onClick={() => handleDelete(row.id)}> <FaTrash /></button>
          </>
        )
      }
    }

   

  ]


  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    const res = data.filter((d) => {
      return d.name.toLowerCase().match(search.toLowerCase())
    });
    setFilteredData(res);
  }, [search]);

 


  return (
    <>
      {/* <div>table</div> */}
      <DataTable title="Admin Dashboard"
        columns={col}
        data={filteredData} pagination
        fixedHeader
        fixedHeaderScrollHeight='450px'
        selectableRows selectableRowsHighlight
        onSelectedRowsChange={toggleSelectMember}
        subHeader
        subHeaderComponent={<input type='search' placeholder='search here' className='w-50 form-control' value={search} onChange={(e) => setSearch(e.target.value)} />}
        subHeaderAlign='center'
        noDataComponent
      />
      <button 
        className="delete-selected"
        onClick={deleteSelected}  
      >
        Delete Selected
      </button>

    </>

  )
}

export default Dashboard