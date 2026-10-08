import { useState } from "react";
import "./Contact.css";

function Contact() {
  const [message, setMessage] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim().length > 0) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setMessage("");
      }, 3000);
    }
  };

  return (
    <div className="contact">
      <h1>Contact Me</h1>
      <p className="contact-subtitle">
        Feel free to reach out for collaborations or queries regarding academic practicals.
      </p>

      <form className="contact-card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Student Developer:</label>
          <input
            type="text"
            value="Deep Bhalani (Charotar University of Science and Technology)"
            disabled
          />
        </div>

        <div className="form-group">
          <label>Your Message:</label>
          <textarea
            rows="4"
            placeholder="Enter your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div className="form-meta">
          <p className="count-display">
            Character Count: <strong>{message.length}</strong>
          </p>
          <button
            type="button"
            className="help-toggle-btn"
            onClick={() => setShowHelp(!showHelp)}
          >
            {showHelp ? "Hide Instructions" : "Need Help?"}
          </button>
        </div>

        {showHelp && (
          <div className="help-box">
            Please enter your feedback, question, or note into the message box above. Character count updates in real-time using React useState.
          </div>
        )}

        {submitted && (
          <div className="success-box">
            Thank you! Your message has been recorded successfully.
          </div>
        )}

        <button type="submit" className="send-btn" disabled={!message.trim()}>
          Submit Message
        </button>
      </form>
    </div>
  );
}

export default Contact;
