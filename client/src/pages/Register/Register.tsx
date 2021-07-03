import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { post } from "../../apis";
import Loading from "../../components/Custom/Loading/Loading";
import Logo from "../../components/Custom/Logo/Logo";
import "./Register.scss";

interface IRegister {
  email: string;
  password: string;
  passwordCheck: string;
  name: string;
}
const initRegister = {
  email: "",
  password: "",
  passwordCheck: "",
  name: "",
};
const Register = () => {
  const [data, setData] = useState<IRegister>(initRegister);
  const loadingRegister = "";
  const history = useHistory();

  const handleSubmitRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (Object.values(data).every((item) => item !== "")) {
      try {
        // setLoading(true);
        const res = await post("/user/register", data);

        // setLoading(false);

        alert(res.data.message);

        setData({ email: "", password: "", passwordCheck: "", name: "" });
        history.push("/login");
      } catch (error) {
        // setLoading(false);
        alert(error.response.data.message);
      }
    } else {
      alert("Phải điền đủ thông tin!");
    }
  };
  const handleOnchangeRegister = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  return (
    <div className="register">
      <Logo />

      <form onSubmit={handleSubmitRegister}>
        <label htmlFor="emailReg" className="text-input">
          <input
            type="text"
            name="email"
            id="emailReg"
            value={data.email}
            onChange={handleOnchangeRegister}
            placeholder="Email"
          />
        </label>
        <label htmlFor="name" className="text-input">
          <input
            type="text"
            name="name"
            id="name"
            value={data.name}
            onChange={handleOnchangeRegister}
            placeholder="Họ tên đầy đủ"
          />
        </label>

        <label htmlFor="passwordReg" className="text-input">
          <input
            type="password"
            name="password"
            id="passwordReg"
            value={data.password}
            onChange={handleOnchangeRegister}
            placeholder="Mật khẩu"
          />
        </label>
        <label htmlFor="passwordRegCheck" className="text-input">
          <input
            type="password"
            name="passwordCheck"
            id="passwordRegCheck"
            value={data.passwordCheck}
            onChange={handleOnchangeRegister}
            placeholder="Xác nhận mật khẩu"
          />
        </label>
        <label htmlFor="photo-url" className="photo-url"></label>
        <button type="submit" className="btn-submit btn-slice">
          <span className="child"> {loadingRegister ? <Loading /> : "Đăng Ký"}</span>
        </button>
        <hr className="hr-slice"></hr>
        <p className="forgot" onClick={() => history.push("/login")}>
          Đăng nhập ngay!
        </p>
        <hr className="hr-slice2"></hr>
      </form>
    </div>
  );
};

export default Register;
