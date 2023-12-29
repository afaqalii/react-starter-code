import "./loader.css";
import logo from "replace_the_path_with_yours"
//========================== THIS IS Spinner COMPONENT ======================
const Spinner = ({ type }) => {
  //================== FIXED TYPE ===========================
  if (type === "fixed") {
    return (
      <div className="fixed-loading-wrapper">
        <div className="loader-wrap">
          <div className="loader-logo">
            <img src = {logo} alt="" />
          </div>
          <div className="loader"></div>
        </div>
      </div>
    );
  }
  //========================== NORMAL WEB LOADER TYPE =====================
  else if (type === "webLoader") {
    return (
      <div className="fixed-loading-wrapper web-loader">
        <img src = {logo} alt="" />
      </div>
    );
  }
  //=========== JUST SPINNER TYPE ==========
  if (type === "spinner") {
    return (
      <div className="loading-wrapper sm_spinner">
        <div className="loader-wrap">
          <div className="loader"></div>
        </div>
      </div>
    );
  }
  //=========== JUST SPINNER TYPE ==========
  return (
    <div className="loading-wrapper">
      <div className="loader-wrap">
        <div className="loader-logo">
          <img src = {logo} alt="" />
        </div>
        <div className="loader"></div>
      </div>
    </div>
  );
};

export default Spinner;