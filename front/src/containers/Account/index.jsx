import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import "../../scss/Home.scss";
import Loader from "react-loader-spinner";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';


const Account = () => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {

  }, []);

  if (loaded === true) {
    return (
      <div>
      </div>
    )
  }
  else {
    return (
      <div id="home">
        <Loader type="ThreeDots" color="#7909c4" height={80} width={80} />
      </div>
    )
  }
}

function mapStateToProps(state) {
  const token = state.authentication.auth.access_token
  return { accessToken: token }
}

export default connect(mapStateToProps, {})(Account);