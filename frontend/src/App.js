import React, { useState, useEffect } from "react";
import "./App.css";
import { motion } from "framer-motion";
import { FaHome, FaRupeeSign } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [lotArea, setLotArea] = useState("");
  const [yearBuilt, setYearBuilt] = useState("");
  const [overallQual, setOverallQual] = useState("");
  const [overallCond, setOverallCond] = useState("");
  const [predictedPrice, setPredictedPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const predictPrice = async () => {
    setLoading(true);
    const data = {
      LotArea: parseFloat(lotArea),
      YearBuilt: parseFloat(yearBuilt),
      OverallQual: parseFloat(overallQual),
      OverallCond: parseFloat(overallCond),
    };

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      setPredictedPrice(result.predicted_price);
      toast.success("Prediction successful!");
    } catch (error) {
      console.error("Error:", error);
      setPredictedPrice("Error fetching prediction");
      toast.error("Prediction failed!");
    } finally {
      setLoading(false);
    }
  };

  // 🌀 Parallax effect on mouse move
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (window.innerWidth / 2 - e.pageX) / 40;
      const y = (window.innerHeight / 2 - e.pageY) / 40;
      setOffset({ x, y });
    };
    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div>
      <div
        className="parallax-bg"
        style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
      ></div>
      <div className="overlay"></div>

      <motion.div
        className="container"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <ToastContainer />
        <h2>
          <FaHome style={{ marginRight: "10px" }} /> House Price Predictor
        </h2>

        <label>Lot Area (sq ft):</label>
        <input
          type="number"
          value={lotArea}
          onChange={(e) => setLotArea(e.target.value)}
        />

        <label>Year Built:</label>
        <input
          type="number"
          value={yearBuilt}
          onChange={(e) => setYearBuilt(e.target.value)}
        />

        <label>Overall Quality (1–10):</label>
        <input
          type="number"
          value={overallQual}
          onChange={(e) => setOverallQual(e.target.value)}
        />

        <label>Overall Condition (1–10):</label>
        <input
          type="number"
          value={overallCond}
          onChange={(e) => setOverallCond(e.target.value)}
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={predictPrice}
          disabled={loading}
        >
          {loading ? "Predicting..." : "Predict Price"}
        </motion.button>

        {predictedPrice !== null && (
          <motion.div
            className="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <FaRupeeSign style={{ marginRight: "5px" }} />
            {predictedPrice}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default App;
