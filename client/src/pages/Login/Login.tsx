import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { post } from "../../apis";
import Loading from "../../components/Custom/Loading/Loading";
import Logo from "../../components/Custom/Logo/Logo";
import { setLogin } from "../../store/actions/user.action";
import "./Login.scss";

interface ILogin {
  email: string;
  password: string;
}
const Login = () => {
  const [data, setData] = useState<ILogin>({ email: "", password: "" });
  const loadingLogin = "";
  const history = useHistory();
  const dispatch = useDispatch();
  const handleSubmitLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (data.email !== "" && data.password !== "") {
      try {
        // setLoading(true);
        const res = await post("/user/login", data);
        localStorage.setItem("firstLogin", "true");
        dispatch(setLogin());
        // setLoading(false);
        history.push("/");
        alert(res.data.message);
      } catch (error) {
        // setLoading(false);
        alert(error.response?.data?.message);
      }
    } else {
      alert("Phải điền đủ email và password!");
    }
  };
  const handleOnchangeLogin = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  return (
    <div className="login">
      <Logo />
      <form onSubmit={handleSubmitLogin}>
        <label htmlFor="email" className="text-input">
          <input
            type="text"
            name="email"
            id="email"
            value={data.email}
            onChange={handleOnchangeLogin}
            placeholder="Tài Khoản"
          />
        </label>
        <label htmlFor="password" className="text-input">
          <input
            type="password"
            name="password"
            id="password"
            value={data.password}
            onChange={handleOnchangeLogin}
            placeholder="Mật Khẩu"
          />
        </label>
        <button type="submit" className="btn-submit btn-slice">
          <span className="child">{loadingLogin ? <Loading /> : "Đăng Nhập"} </span>
        </button>
        <hr className="hr-slice"></hr>
        <p className="forgot" onClick={() => history.push("/register")}>
          Đăng ký
        </p>
        <hr className="hr-slice2"></hr>
      </form>
    </div>
  );
};

export default Login;
