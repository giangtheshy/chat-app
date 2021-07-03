import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { post } from "../../apis";

const Activation = () => {
  const { token }: any = useParams();
  useEffect(() => {
    (async () => {
      const { data } = await post(`/user/activate_email`, { activation_token: token });
      alert(data.message);
    })();
  }, []);
  return <div>Activation Email Page</div>;
};

export default Activation;
