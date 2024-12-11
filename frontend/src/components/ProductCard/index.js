import {Link} from 'react-router-dom'

import './index.css'

const ProductCard = props => {
  const {productData} = props
  const {name,  imageUrl, price, id} = productData

  const imgStyle = {
    width: '70%',
    height: '300px',
    borderRadius: '10px',
    alignSelf:'center'
  };

  return (
    <li className="product-item" >
     <Link to={`/products/${id}`} className="link-item">
        <img src={imageUrl} id="thumbnail"  alt="product" style={imgStyle} />
        
        <h1 className="title">{name}</h1>
      
        <div className="product-details">
          <p className="price">Rs {price}/-</p>
          <div className="rating-container">
           
            <img
              src="https://assets.ccbp.in/frontend/react-js/star-img.png"
              alt="star"
              className="star"
            />
          </div>
        </div>
       
      </Link>
     
    </li>
  )
}
export default ProductCard
