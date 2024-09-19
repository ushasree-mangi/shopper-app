import {Component} from 'react'
import CartItem from '../CartItem'
import Cookies from 'js-cookie'
import './index.css'

import { ThreeDots } from 'react-loader-spinner'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Cart extends Component { 
  state = {
    cartItemsList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getCartItems()
  }

  

  getCartItems=async()=>{
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://shopper-backend-app.onrender.com/cart/`
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
      const {cartItems} = fetchedData
     
      this.setState({
        cartItemsList:cartItems,
        apiStatus: apiStatusConstants.success,
      })
    }
    else  {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  deleteCartItem=async(id)=>{
    console.log(id)
    const apiUrl = `https://shopper-backend-app.onrender.com/cart/`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type':'application/json'
      },
      method: 'DELETE',
      body:JSON.stringify({productId:id})
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      this.getCartItems()
    }
    else{
      alert("An Error occurred while deleting cart item")
    }
  }
    
    renderLoadingView = () => (
      <div className="products-loader-container">
        
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
      <h1 className="product-not-found-heading">No Items Found</h1>
     
    </div>
  )

  renderCartItems=()=>{
    const {cartItemsList}=this.state 
    const totalPrice=cartItemsList.reduce((acc,eachItem)=>acc+(eachItem.price*eachItem.quantity ), 0 )
      
    
    return(
      <div className='cart-container'>
      <p className='cart-heading'>Cart Items</p>
      
      <div className='cart-items-container'>
          {cartItemsList.map((eachItem)=>{
           
            return <CartItem deleteCartItem={this.deleteCartItem} productId={eachItem.product_id} name={eachItem.name} imageUrl={eachItem.imageUrl} quantity={eachItem.quantity} price={eachItem.price}/>
          })}
         
      </div>
      <div className='total_price-container'>
            <h1>Cart Total Price : {totalPrice}</h1>
          </div>
      </div>

    )

  }

  renderCart = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderCartItems()
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
          {this.renderCart()}
        </div>
      </>
    )
  }
}

export default Cart
