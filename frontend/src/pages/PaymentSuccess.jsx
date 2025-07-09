import { useParams, Link } from "react-router-dom"

function PaymentSuccess() {
  const { id } = useParams()

  return (
    <div className="payment-container">
      <div className="payment-card success ">
        <div className="payment-icon">✅</div>
        <h2 className="success-heading">Payment Successful</h2>
        <p className="success-message">
          Your payment for invoice <strong>{id}</strong> has been received.
        </p>
        <Link to="/" className="btn btn-primary">
          Go to Homepage
        </Link>
      </div>
    </div>
  )
}

export default PaymentSuccess
