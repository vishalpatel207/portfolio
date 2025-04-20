import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // API endpoints configuration
  const formEndpoints = [
    {
      name: "FormSubmit",
      url: "https://formsubmit.co/ajax/patelvishal77890@gmail.com",
      config: {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          _subject: formData.subject,
          message: formData.message,
          _captcha: "false"
        })
      }
    },
    {
      name: "Formspree",
      url: "https://formspree.io/f/moqgpqzd",
      config: {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        })
      }
    }
  ];

  const validateForm = () => {
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error("Please enter a valid email address", { theme: "dark" });
      return false;
    }
    if (formData.message.length < 10) {
      toast.error("Message should be at least 10 characters long", { theme: "dark" });
      return false;
    }
    return true;
  };

  const submitForm = async (endpoint) => {
    try {
      const response = await fetch(endpoint.url, endpoint.config);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`${endpoint.name} submission error:`, error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Try each endpoint until one succeeds
      for (const endpoint of formEndpoints) {
        try {
          const data = await submitForm(endpoint);
          
          if (data.success || data.success === "true") {
            toast.success("Message sent successfully! ✅", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "dark",
            });
            
            setFormData({
              name: '',
              email: '',
              subject: '',
              message: ''
            });
            
            return; // Exit on success
          }
        } catch (error) {
          console.log(`Failed with ${endpoint.name}, trying next...`);
          continue; // Try next endpoint
        }
      }
      
      // If all endpoints failed
      throw new Error('All form submission methods failed');
    } catch (error) {
      console.error('Final submission error:', error);
      
      let errorMessage = "Failed to send message. Please try again later.";
      if (error.message.includes("Failed to fetch")) {
        errorMessage = "Network error. Please check your internet connection.";
      }

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="flex flex-col items-center justify-center py-24 px-[12vw] md:px-[7vw] lg:px-[20vw]"
    >
      <ToastContainer />

      {/* Section Title */}
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-white">CONTACT</h2>
        <div className="w-32 h-1 bg-purple-500 mx-auto mt-4"></div>
        <p className="text-gray-400 mt-4 text-lg font-semibold">
          I'd love to hear from you—reach out for any opportunities or questions!
        </p>
      </div>

      {/* Contact Form */}
      <div className="mt-8 w-full max-w-md bg-[#0d081f] p-6 rounded-lg shadow-lg border border-gray-700">
        <h3 className="text-xl font-semibold text-white text-center">
          Connect With Me <span className="ml-1">🚀</span>
        </h3>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col space-y-4">
          <div className="flex flex-col space-y-1">
            <label htmlFor="email" className="text-gray-300 text-sm">Email*</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="your.email@example.com"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-[#131025] text-white border border-gray-600 focus:outline-none focus:border-purple-500"
            />
          </div>
          
          <div className="flex flex-col space-y-1">
            <label htmlFor="name" className="text-gray-300 text-sm">Name*</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Your Name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-[#131025] text-white border border-gray-600 focus:outline-none focus:border-purple-500"
            />
          </div>
          
          <div className="flex flex-col space-y-1">
            <label htmlFor="subject" className="text-gray-300 text-sm">Subject*</label>
            <input
              id="subject"
              type="text"
              name="subject"
              placeholder="What's this about?"
              required
              value={formData.subject}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-[#131025] text-white border border-gray-600 focus:outline-none focus:border-purple-500"
            />
          </div>
          
          <div className="flex flex-col space-y-1">
            <label htmlFor="message" className="text-gray-300 text-sm">Message*</label>
            <textarea
              id="message"
              name="message"
              placeholder="Your message here..."
              rows="4"
              required
              value={formData.message}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-[#131025] text-white border border-gray-600 focus:outline-none focus:border-purple-500"
            />
          </div>
          
          <input type="hidden" name="_captcha" value="false" />
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-gradient-to-r from-purple-600 to-pink-500 py-3 text-white font-semibold rounded-md hover:opacity-90 transition ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            } flex items-center justify-center`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </>
            ) : 'Send Message'}
          </button>
        </form>
        
        {/* Alternative contact method */}
        <div className="mt-6 text-center text-gray-400 text-sm">
          <p>Prefer email? Contact me directly at:</p>
          <a 
            href="mailto:patelvishal77890@gmail.com" 
            className="text-purple-400 hover:text-purple-300 transition-colors break-all"
          >
            patelvishal77890@gmail.com
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;