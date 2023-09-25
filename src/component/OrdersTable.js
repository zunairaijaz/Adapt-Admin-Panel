import React, { useState,useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import config from '../config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import '../style/app.css';

function OrderTable() {
	const [newsData, setNewsData] = useState([]); // To store news data
	
	const [videoLink, setVideoLink] = useState('');
	const [imageFile, setImageFile] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [modalTitle, setModalTitle] = useState('Add News');
	const [editOpen, setEditOpen] = useState(false);
	const [isArray, setisArray] = useState([]);
	const [addOpen, setAddOpen] = useState(false);
	const [itemToDelete, setItemToDelete] = useState(null);
	const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
	
	///--------->
	const [values, setValues] = useState({
		title: '',
		description: '',
		newsVideoLink: '',
		newsImage:''
	  });
	  const [isImageSelected, setImageSelected] = useState(null);
	  const [showImage, setShowImage] = useState(null);
	  const [newsId, setNewsId] = useState('');
	useEffect(() => {
		fetchData();
	  }, []);
	  
	  const fetchData = () => {
		axios({
		  method: 'POST',
		  url: `${config.SERVER_URL}/admin/allNews`,
		 

		})
		
		  .then((response) => {
			console.log("im calllled--------->",response.data);
			setisArray(response.data);
		  })
		  .catch((err) => {
			console.log('error', err);
		  });
	  };
	  
	const openPopupModal = (title, news) => {
  console.log("openPopupModal called");

  setShowModal(true);
  setModalTitle(title);

  if (news) {
    console.log("Received news data:", news); // Log the received news object
    console.log("newsImage value:", news.newsImage); // Log the value of newsImage

    setValues({
      title: news.title || '',
      description: news.description || '',
      newsVideoLink: news.newsVideoLink || '',
      newsImage: news.newsImage || '', // Set the image URL if it exists
    });

    setNewsId(news._id || '');

    // If there's an image URL, you can set it to display in the modal
    if (news.newsImage) {
      setShowImage(news.newsImage);
    } else {
      setShowImage(null);
    }
  } else {
    setValues({
      title: '',
      description: '',
      newsVideoLink: '',
      newsImage: '',
    });
    setNewsId('');
    setShowImage(null);
  }
};

	  
	  
  const closePopupModal = () => {
    setShowModal(false);
    setModalTitle('Add News'); // Reset the modal title when closing
  };
  const handleCloseEditNews = () => {
    setEditOpen(false);
  };
  const handleCloseAddNews = () => {
    setAddOpen(false);
  };
  const clearData = () => {
    setValues({
      title: '',
      description: '',
      newsVideoLink: '',
	
    });
    setImageSelected(null);
    setShowImage(null);
    setNewsId('');
  };
  const addNews = (event) => {
    event.preventDefault();

	if (
		!values.newsVideoLink.trim() && // Check if video link is empty or contains only spaces
		(!isImageSelected || !isImageSelected.name) // Check if no image is selected
	  ) {
		toast.error('Please add Video Link or Image',{
			position: 'top-right', // You can change the position as needed
				autoClose: 3000, // Close the notification after 3 seconds (adjust as needed)
				hideProgressBar: false, // Show the progress bar
			});	
    } else {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);

      if (values.newsVideoLink !== '') {
        // formData.append('newsVideoLink', values.newsVideoLink);

        axios({
          method: 'POST',
          url: `${config.SERVER_URL}/admin/newsVideoLink`,
		  data: {"title":values.title,"description":values.description,"newsVideoLink":values.newsVideoLink},

        })
          .then((response) => {
			toast.success('News added successfully.', {
				position: 'top-right', // You can change the position as needed
				autoClose: 3000, // Close the notification after 3 seconds (adjust as needed)
				hideProgressBar: false, // Show the progress bar
			  });
			  closePopupModal();

						  handleCloseAddNews();
            fetchData();
            clearData();
          })
          .catch((error) => {
            toast.error(error.response.data.message);
          });
      } else {
        formData.append('newsImage', isImageSelected);
        axios({
          method: 'POST',
          url: `${config.SERVER_URL}/admin/newsImage`,
          data: formData,
        })
          .then((response) => {
			toast.success('News added successfully.', {
				position: 'top-right', // You can change the position as needed
				autoClose: 3000, // Close the notification after 3 seconds (adjust as needed)
				hideProgressBar: false, // Show the progress bar
			  });
			  closePopupModal();
              handleCloseAddNews();
            fetchData();
            clearData();
          })
          .catch((error) => {
            toast.error(error.response.data.message);
          });
      }
    }
  };
  const editNews = (event) => {
	event.preventDefault();
  
	const formData = new FormData();
	formData.append('title', values.title);
	formData.append('description', values.description);
	formData.append('_id', newsId);
  
	if (
	  (isImageSelected === null || isImageSelected === '') &&
	  values.newsVideoLink === ''
	) {
	  toast.error('Please select Image or Video Link');
	} else {
	  if (values.newsVideoLink !== '') {
		formData.append('newsVideoLink', values.newsVideoLink);
		formData.append('newsImage', isImageSelected);
  
		axios({
		  method: 'POST',
		  url: `${config.SERVER_URL}/admin/editNewsVideoLink`,
		  data: formData,
		})
		  .then((response) => {
			toast.success('News Updated successfully.', {
				position: 'top-right', // You can change the position as needed
				autoClose: 3000, // Close the notification after 3 seconds (adjust as needed)
				hideProgressBar: false, // Show the progress bar
			  });
			  closePopupModal();		
			  	handleCloseEditNews();
			fetchData();
			clearData();
		  })
		  .catch((error) => {
			toast.error(error.response.data.message);
		  });
	  } else {
		formData.append('newsImage', isImageSelected);
		console.log("data of image--->",formData);
		axios({
		  method: 'POST',
		  url: `${config.SERVER_URL}/admin/editNewsImage`,
		  data: formData,
		})
		  .then((response) => {
			toast.success('News Updated successfully.', {
				position: 'top-right', // You can change the position as needed
				autoClose: 3000, // Close the notification after 3 seconds (adjust as needed)
				hideProgressBar: false, // Show the progress bar
			  });	
			  closePopupModal();			
			  handleCloseEditNews();
			fetchData();
			clearData();
		  })
		  .catch((error) => {
			toast.error(error.response.data.message);
		  });
	  }
	}
  };
  const deleteEvent = (_id) => {
	// Set the item to be deleted
	const item = isArray.find((news) => news._id === _id);
	setItemToDelete(item);
	
	// Show the delete confirmation modal
	setShowDeleteConfirmation(true);
  };
  
  const handleConfirmDelete = () => {
	// Close the delete confirmation modal
	setShowDeleteConfirmation(false);
  
	// Delete the item here
	if (itemToDelete) {
	  const _id = itemToDelete._id;
	  axios({
		method: 'POST',
		url: `${config.SERVER_URL}/admin/deleteNews`,
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
		<div className="container mt-3">
            <div className="row justify-content-center">
              <div className="col-lg-11">

                  <div className="card-body">
                    <div className="d-lg-flex align-items-center mb-4 gap-3">
                      <div className="ms-auto">
					  <Button variant="primary" onClick={() => openPopupModal('Add News')}>
                      <i className="bx bxs-plus-square"></i> Add NEWS
                    </Button>
                    </div>
                    </div>
                    <div class="table-responsive">
						<table class="table mb-0">
								<thead class="table-light">
									<tr>
										<th>No.</th>
										<th>Title</th>
										<th>Description</th>
										<th>Image</th>
										<th>VideoLink</th>
										<th>Actions</th>
									</tr>
								</thead>
                            <tbody>
                                {isArray.map((news, index) => (
                                 <tr key={index}>
                                 <td>{index + 1}</td>
                                 <td style={{ whiteSpace: 'normal' }}>{news.title}</td>
                                 <td style={{ whiteSpace: 'normal' }}>{news.description}</td>
	                             <td>{news.newsImage ? (<img src={news.newsImage} 
								                  alt={news.title} width="50" height="50" />) : null}</td>
                               <td style={{ whiteSpace: 'normal' }}>
                                  {news.newsVideoLink ? (
                                  <a href={news.newsVideoLink} target="_blank" rel="noopener noreferrer">
                                   {news.newsVideoLink}
                                  </a>
                                  ) : null}
                                  </td>
                                 <td><div class="d-flex order-actions">
                                 <a title="edit" href="javascript:;" onClick={() => openPopupModal('Update News', news)}>
                                 <i className='bx bxs-edit'></i>
                                 </a>

                                 <a title= "delete" href="javascript:;" className="ms-3" onClick={() => deleteEvent(news._id)}>
                                 <i className="bx bxs-trash"></i></a>
                                 </div>
                                 </td>
                                </tr> ))}
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
		<form onSubmit={modalTitle === 'Add News' ? addNews : editNews}>
            <div className="modal-body">
              <div className="row mb-3">
                <div className="col-md-8 mx-auto">
                  <label htmlFor="title" className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={values.title}
                    onChange={(e) => setValues({ ...values, title: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-8 mx-auto">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    rows="4"
                    value={values.description}
                    onChange={(e) => setValues({ ...values, description: e.target.value })}
                    required
                  ></textarea>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-8 mx-auto">
                  <label htmlFor="videoLink" className="form-label">Video Link</label>
                  <input
                    type="url"
                    className="form-control"
                    id="videoLink"
                    name="newsVideoLink"
                    value={values.newsVideoLink}
                    onChange={(e) => setValues({ ...values, newsVideoLink: e.target.value })}
                  />
                </div>
              </div>
			      <div className="row mb-3">
             <div className="col-md-8 mx-auto">
                <label htmlFor="image" className="form-label">Image</label>
                <input
                  type="file"
                  className="form-control"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={(e) => {
                  setImageSelected(e.target.files[0]);
                  setValues({ ...values, newsImage: URL.createObjectURL(e.target.files[0]) });
                }}/>
            {modalTitle === 'Update News' ? (
          <img
          src={values.newsImage}
          alt="News Image"
          style={{ width: '200px', height: '150px' }} // Adjust the width and height here
           />) : null}
              </div>
            </div>
            </div>
            <div className="modal-footer">
		      	<button type="submit" className="btn btn-primary custom-submit-button">
            {modalTitle === 'Add News' ? 'Submit' : 'Update'}
            </button>

            </div>
          </form>
        </Modal.Body>
      </Modal>
	  <ToastContainer />
    </div>
  );
}

export default OrderTable;