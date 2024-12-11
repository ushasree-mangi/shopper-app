

import './index.css'

const Home = () => {
  

  return (
    <div>
     
        <div className='hero-container'>
            <div className="hero-left">
              
              <div>
                  <div className="hero-hand-icon">
                      <p>new</p>
                      <img src="https://res.cloudinary.com/dtcogqxhp/image/upload/v1725466895/hand_icon_mhr6zx.png" alt="" />
                  </div>
                  <p className='hero-left-text'>collections</p>
                  <p className='hero-left-text'>for everyone</p>
              </div>
              <div className="hero-latest-btn">
                  <div>Latest Collection</div>
                  <img src="https://res.cloudinary.com/dtcogqxhp/image/upload/v1725467042/arrow_q94dxd.png" alt="" />
              </div>
            </div>
            <div className="hero-right">
              <img src="https://res.cloudinary.com/dtcogqxhp/image/upload/v1725466921/hero_image_kwtzeu.png"
              alt="hero" />
            </div>
        </div>
    
   
        <div className='home-page-brand-section-container'>
            <div>
                <h1>Shopper – Your Ultimate Fashion Destination</h1>
                <p>Shopper is a premier online clothing platform designed to cater to your every fashion need. Whether you're looking for the latest trends in men’s, women’s, or kids' apparel, Shopper offers a curated collection of stylish, high-quality clothing that blends comfort with chic design. Our user-friendly platform ensures a seamless shopping experience, from browsing to checkout, offering personalized recommendations to help you find exactly what you're looking for.</p>
            </div>
        </div>
        <div className='offers'>
              <div className="offers-left">
                <h1>Exclusive</h1>
                <h1>Offers For You</h1>
                <p>ONLY ON BEST SELLERS PRODUCTS</p>
                <button>Check Now</button>
              </div>
              <div className="offers-right">
                <img src="https://res.cloudinary.com/dtcogqxhp/image/upload/v1725713537/exclusive_image_ppn5wk.png" alt="" />
              </div>
        </div>
        

        <div className='footer'>
            <div className="footer-logo">
              <img src="https://res.cloudinary.com/dtcogqxhp/image/upload/v1725714491/logo_big_ng9at3.png" alt="" />
              <p>SHOPPER</p>
            </div>
            <ul className="footer-links">
              <li>Company</li>
              <li>Products</li>
              <li>Offices</li>
              <li>About</li>
              <li>Contact</li>
            </ul>
            <div className="footer-social-icon">
              <div className="footer-icons-container">
                  <img src="https://res.cloudinary.com/dtcogqxhp/image/upload/v1725714480/instagram_icon_rolnmx.png" alt="" />
              </div>
              <div className="footer-icons-container">
                  <img src="https://res.cloudinary.com/dtcogqxhp/image/upload/v1725714512/pintester_icon_lb3wtt.png" alt="" />
              </div>
              <div className="footer-icons-container">
                  <img src="https://res.cloudinary.com/dtcogqxhp/image/upload/v1725714463/whatsapp_icon_ismymg.png" alt="" />
              </div>
            </div>
            <div className="footer-copyright">
              <hr />
              <p>Copyright @ 2023 - All Right Reserved.</p>
            </div>
        </div>
  </div>
  )
}

export default Home
