import { useEffect, useState } from 'react'
import './App.css'
import io from "socket.io-client"
import { v4 as uuidv4 } from "uuid";

function App() {
const [formInputs, setFormInputs] = useState({})
const [crudData, setCrudData]= useState([])
const [isEdit, setIsEdit] = useState(false)
const socket = io('localhost:3000')

const handleInput = (event) => {
  const {name, value} = event.target

  let obj = {
    [name]: value
  }

  setFormInputs((prev) => ({...prev, ...obj}))
}

const handleSubmit = () => {
  socket.emit("data", { ...formInputs, id: uuidv4()});

  socket.on('crudData', (response) =>{

    setCrudData(response)

    setFormInputs({
      name: '',
      age: '',
      phone: ''
    })

  })
}

useEffect(() => {
    socket.on('crudData', (response) =>{
    setCrudData(response)
    })
}, [])

const getEditedData = (data) => {
  setFormInputs(data)
  setIsEdit(true)
};

const handleEdit = () => {
   console.log(formInputs)

   socket.emit('editData', formInputs)
}

  return (
    <>
      <h1>CRUD OPERATIONS</h1>
      <div className="form-fields">
        <input
          onChange={handleInput}
          className="input-field"
          placeholder="Enter Your Name"
          name="name"
          value={formInputs.name}
        />
        <input
          onChange={handleInput}
          className="input-field"
          placeholder="Enter Your Age"
          name="age"
          value={formInputs.age}
        />
        <input
          onChange={handleInput}
          className="input-field"
          placeholder="Enter Your Phone Number"
          name="phone"
          value={formInputs.phone}
        />
      </div>
      <button onClick={isEdit ? handleEdit: handleSubmit}>
        {isEdit ? "Edit " : "Add "}Data
      </button>

      <div className="">
        <table>
          <tbody>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Phone Number</th>
            </tr>

            {crudData.map((data) => (
              <tr>
                <td>{data.name}</td>
                <td>{data.age}</td>
                <td>{data.phone}</td>
                <td>
                  <button onClick={() => getEditedData(data)}>Edit</button>
                </td>
                <td>
                  <button>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default App
