import React from "react";

const Button = ({ callBack, buttonText }) => {
  function handleButtonClick() {
    callBack();
  }
  return (
    <button
      onClick={handleButtonClick}
      className="text-slate-300  bg-slate-800 rounded-md font-semibold px-3 py-1"
    >
      {buttonText}
    </button>
  );
};

export default Button;
