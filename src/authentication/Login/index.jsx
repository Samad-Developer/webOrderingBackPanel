import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FormButton from "../../components/general/FormButton";
import FormTextField from "../../components/general/FormTextField";
import { LoginAction } from "../../redux/actions/authAction";
import { Typography, Row } from "antd";
import { LockFilled, LoginOutlined, MailFilled } from "@ant-design/icons";
import "./styles.css";
import { BUTTON_SIZE, INPUT_SIZE } from "../../common/ThemeConstants";
import ygen from '../../assets/images/ygen.png'

const initialValues = {
  Username: "",
  Password: "",
};

const Login = () => {
  const navigate = useNavigate();
  const [formFields, setFormFields] = useState(initialValues);
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.authReducer);

  const handleFormFields = (data) => {
    setFormFields({ ...formFields, [data.name]: data.value });
  };

  const timeoutFunction = () => {
    navigate("/");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(LoginAction(formFields, navigate, timeoutFunction));
  };

  return (
    <div>
    <div style={{ display: 'flex', height: '100vh' }}>
  <div style={{ flex: 1, backgroundColor: '#017971', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <div style={{ padding: '1rem 1.5rem' }}>
      <div
        style={{
          display: 'grid',
          gap: '1.5rem',
          gridTemplateColumns: '1fr',
          '@media(min-width: 1024px)': {
            gridTemplateColumns: '1fr 550px',
            gap: '3rem',
          },
          '@media(min-width: 1280px)': {
            gridTemplateColumns: '1fr 650px',
          },
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem' }}>
          <div style={{ gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <img src={ygen} alt="ygen" style={{ width: '100px', height: '100px', marginBottom: '20px', borderRadius: '50%' }} />
            </div>
            <h1
              style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                lineHeight: '1',
                color: 'white',
                letterSpacing: '-0.025em',
                '@media(min-width: 640px)': {
                  fontSize: '3rem',
                },
                '@media(min-width: 1280px)': {
                  fontSize: '3.75rem',
                },
              }}
            >
              Elevate Your Restaurant's Online Presence
            </h1>
            <p
              style={{
                maxWidth: '600px',
                color: 'white', // Assuming text-muted-foreground is a shade of gray
                '@media(min-width: 768px)': {
                  fontSize: '1.25rem',
                },
              }}
            >
              Our software solutions and services help restaurants and food ordering websites streamline operations,
              enhance customer experience, and drive growth.
            </p>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '0.5rem',
            }}
          >
            <a
              href="#"
              style={{
                display: 'inline-flex',
                height: '2.5rem',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '0.375rem',
                backgroundColor: 'white', // Assuming primary is blue
                paddingLeft: '2rem',
                paddingRight: '2rem',
                fontSize: '0.875rem',
                fontWeight: 'medium',
                color: 'black', // Assuming primary-foreground is white
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                transition: 'background-color 0.2s',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1E40AF')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1D4ED8')}
            >
              Learn More
            </a>
            <a
              href="#"
              style={{
                display: 'inline-flex',
                height: '2.5rem',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '0.375rem',
                border: '1px solid white', // Assuming input border is a light gray
                backgroundColor: 'transparent', // Assuming background is white
                paddingLeft: '2rem',
                paddingRight: '2rem',
                fontSize: '0.875rem',
                fontWeight: 'medium',
                color: 'white',
                boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
                transition: 'background-color 0.2s, color 0.2s',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F3F4F6'; // Assuming accent is a light gray
                e.currentTarget.style.color = '#1F2937'; // Assuming accent-foreground is a dark gray
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.color = '#000000';
              }}
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <form onSubmit={handleSubmit}>
      
      <Row className="authChild">
        <FormTextField
          colSpan={24}
          name="Username"
          value={formFields.Username}
          onChange={handleFormFields}
          required={true}
          size={'large'}
          className="textInput"
          label="Username"
          style={{ borderRadius: '8px' }}
          prefix={<MailFilled />}
        />
        <FormTextField
          colSpan={24}
          name="Password"
          type="password"
          value={formFields.Password}
          onChange={handleFormFields}
          required={true}
          size={'large'}
          style={{ borderRadius: '8px' }}
          className="textInput"
          label="Password"
          prefix={<LockFilled />}
        />
        <div className="forgotPasswordDiv">
          <Typography.Text className="forgotPassword">
            <Link to="/forgotPassword">Forgot Password?</Link>
          </Typography.Text>
        </div>
        <div className="formAction">
          <FormButton
            colSpan={24}
            title="Login"
            htmlType="submit"
            type="primary"
            size={'large'}
            style={{ width: '100%', marginTop: '50px', borderRadius: '7px', backgroundColor: '#017971' }}
            className="actionButton"
            loading={userInfo.authLoading}
            icon={<LoginOutlined />}
          />
        </div>
         {/* <Typography.Text className="signUpTxt">
              Don't have an account?
              <Link to="/signup">
                <b> Sign Up</b>
              </Link>
            </Typography.Text> */}
      </Row>
    </form>
    
  </div>
  
</div>
<Typography.Text style={{display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px', backgroundColor: '#E8EEF0'}}>
      Copyright ygen © {new Date().getFullYear()}
    </Typography.Text>
</div>
  );
};

export default Login;
