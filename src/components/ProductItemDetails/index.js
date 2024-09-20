import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'

import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import {ThreeDots} from 'react-loader-spinner'


import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productData: {},
    addToCartMsg:"",
    apiStatus: apiStatusConstants.initial,
    quantity: 1,
  }

  componentDidMount() {
    this.getProductData()
  }

  

  getProductData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://shopper-backend-app.onrender.com/products/${id}/`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type':'application/json'
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const {productDetails} = fetchedData
    
      this.setState({
        productData: productDetails,
        apiStatus: apiStatusConstants.success,
      })
    }
    else  {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    
    <div className="products-details-loader-container" >
        <ThreeDots color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="product-details-failure-view-container">
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        className="failure-view-image"
      />
      <h1 className="product-not-found-heading">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  onDecrementQuantity = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }

  onIncrementQuantity = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  addProductToCart=async()=>{
    const {match}=this.props
    const jwtToken=Cookies.get('jwt_token')
    const {id} =match.params
   
    const {quantity}=this.state
    const productDetails={productId:id,quantity}
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body:JSON.stringify(productDetails)
    }
    const response=await fetch("http://localhost:4000/cart/add",options)
    if(response.ok){ 
    const data=await response.json()
    const {message}=data
  
    this.setState({addToCartMsg:message})
    }

  }

  onAddToCart=()=>{
      this.addProductToCart()

  }
   

  renderProductDetailsView = () => {
    const {productData, quantity ,addToCartMsg } = this.state
    const {
      name,
      description,
      imageUrl,
      price,
      stock,
      category
    } = productData

    return (
      <div className="product-details-success-view">
        <div className="product-details-container">
          <img src={imageUrl} alt="product" className="product-image" />
          <div className="product">
            <h1 className="product-name">{name}</h1>
            <p className="product-details">{description}</p>
            <div className="rating-and-stock-price-container">
                <div className="product-rating-container">
                  <p className="rating">4</p>
                  <img
                    src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                    alt="star"
                    className="star"
                  />
                </div>
                
            </div>
            <div style={{display:'flex'}}>
            <p className="stock-text">Stock : <span style={{color:'red',fontWeight:'bold'}}>{stock}</span> </p>
            <p className='price-text'>Rs {price}/-</p>
            </div>
            <p className="product-description">{category}</p>
            
            
            <hr className="horizontal-line" />
            <div className="quantity-container">
              <button
                type="button"
                className="quantity-controller-button"
                onClick={this.onDecrementQuantity}
                
              >
                <BsDashSquare className="quantity-controller-icon" />
              </button>
              <p className="quantity">{quantity}</p>
              <button
                type="button"
                className="quantity-controller-button"
                onClick={this.onIncrementQuantity}
                
              >
                <BsPlusSquare className="quantity-controller-icon" />
              </button>
            </div>
            <button type="button" onClick={this.onAddToCart} className="button add-to-cart-btn">
              ADD TO CART
            </button>
            <p className='item-cart-status-msg'>{addToCartMsg}</p>
          </div>
        </div>
        
      </div>
    )
  }

  renderProductDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
       
        <div className="product-item-details-container">
          {this.renderProductDetails()}
        </div>
      </>
    )
  }
}

export default ProductItemDetails
