import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import config from '../config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import '../style/app.css';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles'; // Add this import

const useStyles = makeStyles((theme) => ({
  // Define your styles here
}));

function FaqTable() {
  const classes = useStyles();
  const history = useHistory();

  if (!localStorage.getItem('admin')) {
    history.push('/');
  }

  const [isArray, setIsArray] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('Add Faq');
  const [values, setValues] = useState({
    question: '',
    answer: '',
  });
  const [FAQId, setFAQId] = useState('');
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const { question, answer } = values;

  const fetchData = () => {
    axios({
      method: 'POST',
      url: `${config.SERVER_URL}/admin/all_faq`,
    })
      .then((response) => {
        setIsArray(response.data);
      })
      .catch((err) => {
        toast.error('Error getting data. Please try again.');
      });
  };

  const openPopupModal = (title, faq) => {
    setShowModal(true);
    setModalTitle(title);

    if (faq) {
      setValues({
        question: faq.question || '',
        answer: faq.answer || '',
      });
      setFAQId(faq._id || '');
    } else {
      setValues({
        question: '',
        answer: '',
      });
      setFAQId('');
    }
  };

  const closePopupModal = () => {
    setShowModal(false);
    setModalTitle('Add Faq');
  };

  const clearData = () => {
    setValues({
      question: '',
      answer: '',
    });
    setFAQId('');
  };

  const addFAQ = (event) => {
    event.preventDefault();

    if (question === '' || answer === '') {
      toast.error('Please fill all fields.');
      return;
    } else {
      axios({
        method: 'POST',
        url: `${config.SERVER_URL}/admin/add_faq`,
        data: { question, answer },
      })
        .then((response) => {
          toast.success(response.data.message);
          closePopupModal();
          fetchData();
          clearData();
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    }
  };

  const editFAQ = (event) => {
    event.preventDefault();

    axios({
      method: 'POST',
      url: `${config.SERVER_URL}/admin/edit_faq`,
      data: { _id: FAQId, question, answer },
    })
      .then((response) => {
        toast.success(response.data.message);
        closePopupModal();
        fetchData();
        clearData();
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const deleteEvent = (_id) => {
    const item = isArray.find((faq) => faq._id === _id);
    setItemToDelete(item);
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteConfirmation(false);

    if (itemToDelete) {
      const _id = itemToDelete._id;
      axios({
        method: 'POST',
        url: `${config.SERVER_URL}/admin/delete_faq`,
        data: { _id },
      })
        .then((response) => {
          toast.success(response.data.message);
          fetchData();
        })
        .catch((err) => {
          toast.error(err.response.data.message);
        });
    }
  };
  return (
    <div className="App">
      <div className="page-wrapper">
        <div className="page-content">
        <h1 style={{ margin: '0' }}>FAQ</h1>
          <hr style={{ borderTop: '2px solid #333' }} />
          <div className="container mt-3">
            <div className="row justify-content-center">
              <div className="col-lg-11">

                <div className="card-body">
                  <div className="d-lg-flex align-items-center mb-4 gap-3">
                    <div className="ms-auto">
                      <Button variant="primary" onClick={() => openPopupModal('Add Faq')}>
                        <i className="bx bxs-plus-square"></i> Add FAQ
                      </Button>
                    </div>
                  </div>
                  <div class="table-responsive">
                    <table class="table mb-0">
                      <thead class="table-light">
                        <tr>
                          <th>No.</th>
                          <th>Question</th>
                          <th>Answer</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isArray.map((faq, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td style={{ whiteSpace: 'normal' }}>{faq.question}</td>
                            <td style={{ whiteSpace: 'normal' }}>{faq.answer}</td>
                            <td><div class="d-flex order-actions">
                              <a title="edit" href="javascript:;" onClick={() => openPopupModal('Update Faq', faq)}>
                                <i className='bx bxs-edit'></i>
                              </a>

                              <a title="delete" href="javascript:;" className="ms-3" onClick={() => deleteEvent(faq._id)}>
                                <i className="bx bxs-trash"></i></a>
                            </div>
                            </td>
                          </tr>))}
                      </tbody>
                    </table>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal show={showDeleteConfirmation} onHide={() => setShowDeleteConfirmation(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this item?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirmation(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Modal */}
      <Modal show={showModal} onHide={closePopupModal} dialogClassName="custom-modal-width">
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={modalTitle === 'Add Faq' ? addFAQ : editFAQ}>
            <div className="modal-body">
              <div className="row mb-3">
                <div className="col-md-8 mx-auto">
                  <label htmlFor="question" className="form-label">Question</label>
                  <input
                    type="text"
                    className="form-control"
                    id="question"
                    name="question"
                    value={values.question}
                    onChange={(e) => setValues({ ...values, question: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-8 mx-auto">
                  <label htmlFor="answer" className="form-label">Answer</label>
                  <textarea
                    className="form-control"
                    id="answer"
                    name="answer"
                    rows="4"
                    value={values.answer}
                    onChange={(e) => setValues({ ...values, answer: e.target.value })}
                    required
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="submit" className="btn btn-primary custom-submit-button">
                {modalTitle === 'Add Faq' ? 'Submit' : 'Update'}
              </button>

            </div>
          </form>
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </div>
  );
}

export default FaqTable;