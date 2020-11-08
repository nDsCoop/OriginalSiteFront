import React from "react";
import {
  // FormControl,
  TextField,
  Button,
  Grid,
  // CircularProgress,
  LinearProgress,
  Typography,
  Container,
} from "@material-ui/core";
import { loadReCaptcha, ReCaptcha } from "react-recaptcha-v3";
import axios from "../../apis/axios";
// import { GlobalContext } from "../GlobalState";

let captchaToken;
const FeedbackApp = () => {
  // const [{}, dispatch] = useContext(GlobalContext);

  // const setSnackbarMsg = React.useCallback(
  //   data => {
  //     dispatch({ type: "setSnackbarMsg", snippet: data });
  //   },
  //   [dispatch]
  // );
  const [isFormActive, setIsFormActive] = React.useState(false);
  const [isEmail, setIsEmail] = React.useState(false);
  const [isSending, setIsSending] = React.useState(false);
  const formEl = React.useRef(null);
  const formElEmail = React.useRef(null);

  const handleButton = (e) => {
    e.preventDefault();
    setIsFormActive(true);
    setIsEmail(!isEmail);
  }

  const submitFormEmail = async (e) => {
    setIsSending(true);
    const formData = new FormData(formElEmail.current);
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");
    
    e.preventDefault();
    const post = {
      email: email,
      message: message,
      token: captchaToken,
      name: name,
      }
      await axios
      .post('/ndsapi/mail', post)
      .then(function(response) {
        console.log(response.data.status);
        // console.log(response.data.message);
        // also clear the form
        alert("Your Message Sent"); 
        formElEmail.current.reset();
        // setSnackbarMsg(response.data.status);
        setIsSending(false);
        setIsFormActive(false);

      })
      .catch(function(error) {
        // console.log(error.response.status);
        if (error.response) {
          if (error.response.status === 429) {
            formElEmail.current.reset();
            alert("Message failed to send please try again")
            // setSnackbarMsg("We accept limited feedback!");
          }
        }
        setIsSending(false);
      });
  //   const response = await fetch("http://localhost:9150", { 
  //     method: 'POST', 
  //     headers: { 
  //         'Content-type': 'application/json'
  //     }, 
  //     body: JSON.stringify({email, message, token}) 
  //   }); 
  //     const resData = await response.json(); 
  //     if (resData.status === 'success'){
  //       setIsSending(false);
  //       formElEmail.current.reset();
       
  //       this.resetForm()
  //   }else if(resData.status === 'fail'){
  //       setIsSending(false);
        
        
  //   }

  }

  const submitForm = async (e) => {
    // set state to sending
    setIsSending(true);
    const formData = new FormData(formEl.current);
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");

    e.preventDefault();

    const post = {
      name: name,
      email: email,
      message: message,
      token: captchaToken,
      timestamp: new Date(),
      }

    await axios
          .post('/ndsapi/feedback', post)
          .then(function(response) {
            console.log(response.data.status);
            console.log(response.data.message);
            // also clear the form
            formEl.current.reset();
            alert("Your Message Sent");
            // setSnackbarMsg(response.data.status);
            setIsSending(false);
            setIsFormActive(false);
          })
          .catch(function(error) {
            // console.log(error.response.status);
            if (error.response) {
              if (error.response.status === 429) {
                formEl.current.reset();
                alert("Message failed to send please try again")
                // setSnackbarMsg("We accept limited feedback!");
              }
            }
            setIsSending(false);
          });
      };

  React.useEffect(() => {
    loadReCaptcha("6Le1toEUAAAAAITyNwqEMaz3hFAYzciSJDMomrgN");
  }, []);

  const verifyCallback = token => {
    console.log(token);
    captchaToken = token;
    const captchaBox = document.querySelector(".grecaptcha-badge");
    captchaBox.remove();
    // remove captcha badge
  };

  return (
    <div className="privacy-app">
       <Container maxWidth="sm">
       <header>
        <Typography variant="h4" gutterBottom={true}>
            Feedbacks{" "}
        </Typography>
      </header>
      <div className="deliver"></div>
      <div className="header-feedback">
        <p>Bạn có câu hỏi hoặc bất kỳ đóng góp về việc sử dụng ứng dụng, dịch vụ hoặc báo cáo lỗi hoặc vi phạm người dùng hãy gửi về cho chúng tôi. 
        <br/>(If you have any questions or suggestions regarding the use of the application, the service or the report of a bug or user violation, please send it to us.)
        Chúng tôi hoan nghênh điều đó và bạn vui lòng không gửi các thông tin nhạy cảm, bạo lực. Tiếp tục với 2 cách bên dưới..</p>
        (We welcome that and please do not submit sensitive or violent information. Continue with 2 ways below..)
        <br />     
      </div>
      <div className="buttons-send">
        <Button
            style={{ marginTop: "10px" }}
            variant="outlined"
            color="secondary"
            type="button"
            disabled={isEmail ? false : true}
            onClick = {handleButton}
        >
         Via Server
        </Button>
        <Button
            style={{ marginTop: "10px" }}
            variant="outlined"
            color="secondary"
            type="button"
            disabled={isEmail ? true : false}
            onClick = {handleButton}
        >
          {/* if sending is true then show circular progress */}
          Via Email
        </Button>
      </div>
      {
        isFormActive ? <div className="form-feedback">
        <Grid
          component="form"
          ref={ isEmail ? formElEmail : formEl }
          onSubmit={ isEmail ? submitFormEmail : submitForm}
          container
          required
          justify="center"
          style={{ width: "100%", margin: "0 auto", padding: '1rem' }}
        >
          <ReCaptcha
            sitekey="6Le1toEUAAAAAITyNwqEMaz3hFAYzciSJDMomrgN"
            action="action_name"
            verifyCallback={verifyCallback}
          />
          <TextField
            id="outlined-email-input"
            label="Name"
            type="text"
            name="name"
            autoComplete="name"
            margin="normal"
            variant="outlined"
            fullWidth
            required
          />
          <TextField
            id="outlined-email-input"
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            margin="normal"
            variant="outlined"
            fullWidth
            required
          />
          <TextField
            id="outlined-email-input"
            label="Feedback"
            multiline
            rows="4"
            type="text"
            name="message"
            autoComplete="feedback"
            margin="normal"
            variant="outlined"
            fullWidth
            required
          />
          {isSending ? (
            <LinearProgress
              style={{
                width: "100%",
                transform: "translateY(-12px)",
                borderRadius: "2px"
              }}
            />
          ) : null}
          <Button
            style={{ marginTop: "10px" }}
            variant="outlined"
            color="primary"
            type="submit"
            disabled={isSending ? true : false}
          >
            {/* if sending is true then show circular progress */}
            {isSending ? "Sending" : "Send"}{" "} {isEmail ? "to Email" : "to Server"}
          </Button>
        </Grid>
      </div>
      : null
      } 
      
      <div className="deliver"></div>

      <i>Sử dụng email của bạn để nhận được sự hỗ trợ tốt nhất của chúng tôi(Khuyến Nghị Dùng)<br />
        (Use your email to get the most support from us (Recommended))</i> 
       </Container>
    </div>
  );
};

export default FeedbackApp;
