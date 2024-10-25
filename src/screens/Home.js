import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function Home() {
  const [foodCat, setFoodCat] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [search, setSearch] = useState('');
  const [carouselImages, setCarouselImages] = useState([]);

  // Function to fetch food data
  const loadFoodItems = async () => {
    try {
      let response = await fetch("https://tomato-viveksinghfullstackfoodorderingapp.onrender.com/api/auth/foodData", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      response = await response.json();
      setFoodItems(response[0]); // Assuming the first element of response contains food items
      setFoodCat([...new Set(response[0].map(item => item.CategoryName))]); // Extract unique category names
    } catch (error) {
      console.error("Error loading food items:", error);
    }
  };

  // Function to fetch carousel images from Unsplash
  const loadCarouselImages = async () => {
    const accessKey = 'a-utk7ym1t3VotwXfsLJE80FiUJX3NlC0HtygzHPZMQ';
    try {
      const response = await fetch(`https://api.unsplash.com/photos/random?query=food&count=3&client_id=${accessKey}`);
      const data = await response.json();
      const imageUrls = data.map(image => image.urls.regular);
      setCarouselImages(imageUrls);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  // UseEffect to load items and images on mount
  useEffect(() => {
    loadFoodItems();
    loadCarouselImages();
  }, []);

  return (
    <div>
      <Navbar />
      {/* Carousel Section */}
      <div id="carouselExampleFade" className="carousel slide carousel-fade" data-bs-ride="carousel">
        <div className="carousel-inner" id='carousel'>
          {carouselImages.map((imageUrl, index) => (
            <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
              <img src={imageUrl} className="d-block w-100" style={{ filter: "brightness(30%)" }} alt="Food" />
            </div>
          ))}
          <div className="carousel-caption" style={{ zIndex: "9" }}>
            <div className="d-flex justify-content-center">
              <input
                className="form-control me-2 w-75 bg-white text-dark"
                type="search"
                placeholder="Search in here..."
                aria-label="Search"
                value={search}
                onChange={(e) => { setSearch(e.target.value) }}
              />
              <button className="btn text-white bg-danger" onClick={() => { setSearch('') }}>X</button>
            </div>
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* Food Items Section */}
      <div className='container'>
        {foodCat.map((category, index) => (
          <div className='row mb-3' key={index}>
            <div className='fs-3 m-3'>{category}</div>
            <hr id="hr-success" style={{ height: "4px", backgroundImage: "-webkit-linear-gradient(left,rgb(0, 255, 137),rgb(0, 0, 0))" }} />
            {foodItems
              .filter(
                (item) => (item.CategoryName === category) && (item.name.toLowerCase().includes(search.toLowerCase()))
              ).map((filteredItem) => (
                <div key={filteredItem._id} className='col-12 col-md-6 col-lg-3'>
                  <Card
                    foodName={filteredItem.name}
                    item={filteredItem}
                    options={filteredItem.options[0]}
                    ImgSrc={filteredItem.img}
                  />
                </div>
              ))}
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}
