import React from "react";

const Login = (props) => {
  const submit = () => {};
  return (
    <form onSubmit={submit}>
      <div className="input-group">
        <label htmlFor="" className="input-label"></label>
        <input type="text" className="input" />
      </div>
    </form>
  );
};

export default Login;
