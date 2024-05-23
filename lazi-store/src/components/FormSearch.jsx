import React, { useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';

function FormSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();


  const handleSubmit = (e) => {
    e.preventDefault();
    // Navigate to cua-hang.html with search query parameter
   
    navigate(`/lazi-store/cua-hang.html?search=${searchTerm}`);

  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Form onSubmit={handleSubmit} className="m-0 p-0 d-flex w-100">
      <Form.Group className="d-flex justify-content-center" controlId="formGroupEmail">
        <Form.Control
          className="rounded-start"
          type="text"
          placeholder="Tìm kiếm sản phẩm"
          value={searchTerm}
          onChange={handleChange}
        />
        <Button className="rounded-end" type="submit">
          <i className="fas fa-search"></i>
        </Button>
      </Form.Group>
    </Form>
  );
}

export default FormSearch;
