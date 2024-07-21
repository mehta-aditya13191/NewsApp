// import React, { useContext, useRef } from "react";
// import InputBox from "../components/input.component";
// import googleIcon from "../imgs/google.png";
// import { Link, Navigate } from "react-router-dom";
// import AnimationWrapper from "../common/page-animation";
// import { toast, Toaster } from "react-hot-toast";
// import axios from "axios";
// import { storeInSession } from "../common/session";
// import { UserContext } from "../App";
// import { authWithGoogle } from "../common/firebase";

// const UserAuthForm = ({ type }) => {
//   const authForm = useRef(null); //this is used to select html element..reeact will store the form inside the authform

//   let {
//     userAuth: { access_token },
//     setUserAuth,
//   } = useContext(UserContext);

//   //serverRoute->where it has to send data and formData->what edata it has to send
//   const userAuthThroughServer = (serverRoute, formData) => {
//     axios
//       .post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
//       .then(({ data }) => {
//         // console.log(data);
//         storeInSession("user", JSON.stringify(data));
//         // console.log(sessionStorage);
//         setUserAuth(data);
//       })
//       .catch(({ response }) => {
//         toast.error(response.data.error);
//       });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     let serverRoute = type === "sign-in" ? "/signin" : "/signup";

//     let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
//     let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

//     //form data
//     let form = new FormData(authForm.current);
//     // console.log(form);
//     let formData = {};
//     for (let [key, value] of form.entries()) {
//       formData[key] = value;
//     }

//     // form validation
//     let { fullname, email, password } = formData;

//     if (fullname) {
//       if (fullname.length < 3) {
//         return toast.error("fullname must be at least 3 letters long");
//       }
//     }
//     if (!email.length) {
//       return toast.error("Enter the email");
//     }

//     if (!emailRegex.test(email)) {
//       return toast.error("email is invalid");
//     }

//     if (!passwordRegex.test(password)) {
//       return toast.error(
//         "password is 6 to 20 characeter long withs a numeric.1 lowercase and 1 uppercase letter"
//       );
//     }

//     userAuthThroughServer(serverRoute, formData); //this function is created to make req to server while making gooogle authentication
//   };

//   const handleGoogleAuth = (e) => {
//     e.preventDefault();

//     authWithGoogle()
//       .then((user) => {
//         let serverRoute = "/google-auth";
//         let formData = {
//           access_token: user.accessToken,
//         };

//         userAuthThroughServer(serverRoute, formData);
//         // console.log(user);
//       })
//       .catch((err) => {
//         toast.error("trouble in login through google");
//         return console.log(err);
//       });
//   };

//   return access_token ? (
//     <Navigate to="/" />
//   ) : (
//     <AnimationWrapper keyValue={type}>
//       <section className="h-cover flex items-center justify-center">
//         <Toaster />
//         <form ref={authForm} className="w-[80%] max-w-[400px]">
//           <h1
//             className="text-4xl font-gelasio capitalize text-center
//         mb-24"
//           >
//             {type === "sign-in" ? "Welcome Buddy" : "Join us today"}
//           </h1>
//           {type !== "sign-in" ? (
//             <InputBox
//               name="fullname"
//               type="text"
//               placeholder="Full Name"
//               icon="fi-rr-user"
//             />
//           ) : (
//             ""
//           )}

//           <InputBox
//             name="email"
//             type="email"
//             placeholder="Email"
//             icon="fi-rr-envelope"
//           />

//           <InputBox
//             name="password"
//             type="password"
//             placeholder="Password"
//             icon="fi-rr-key"
//           />

//           <button
//             className="btn-dark center mt-14"
//             type="submit"
//             onClick={handleSubmit}
//           >
//             {type.replace("-", " ")}
//           </button>

//           <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
//             <hr className="w-1/2 border-black" />
//             <p>or</p>
//             <hr className="w-1/2 border-black" />
//           </div>

//           <button
//             className="btn-dark flex items-center justify-center gap-4 w-[90%] center "
//             onClick={handleGoogleAuth}
//           >
//             <img src={googleIcon} className="w-5" />
//             continue with google
//           </button>

//           {type === "sign-in" ? (
//             <p className="mt-6 text-dark-grey text-xl text-center">
//               Don't have an account ?
//               <Link to="/signup" className="underline text-black text-xl ml-1">
//                 Join us today
//               </Link>
//             </p>
//           ) : (
//             <p className="mt-6 text-dark-grey text-xl text-center">
//               Already have an account ?
//               <Link to="/signin" className="underline text-black text-xl ml-1">
//                 Sign in here
//               </Link>
//             </p>
//           )}
//         </form>
//       </section>
//     </AnimationWrapper>
//   );
// };

// export default UserAuthForm;

import React, { useContext, useRef } from "react";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png";
import { Link, Navigate } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import { storeInSession } from "../common/session";
import { UserContext } from "../App";
import { authWithGoogle } from "../common/firebase";

const UserAuthForm = ({ type }) => {
  const authForm = useRef(null);

  const {
    userAuth: { access_token },
    setUserAuth,
  } = useContext(UserContext);

  //this function is created to make req to server while making gooogle authentication

  const userAuthThroughServer = async (serverRoute, formData) => {
    try {
      const { data } = await axios.post(
        import.meta.env.VITE_SERVER_DOMAIN + serverRoute,
        formData
      );

      // console.log(data);------>//
      //       access_token
      // :
      // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjcxOTQ3MGNlZmE1NzA3N2MyZjA0YzkiLCJpYXQiOjE3MTg3MTk2MDF9.Ign-gXpzuQJDEhTfHU-WHX6kRZjd5mnpqjF3GxsD5fc"
      // fullname
      // :
      // "aditya mehta"
      // profile_img
      // :
      // "https://api.dicebear.com/6.x/notionists-neutral/svg?seed=Cali"
      // username
      // :
      // "amehta13191"
      storeInSession("user", JSON.stringify(data));
      setUserAuth(data);
    } catch ({ response }) {
      toast.error(response.data.error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const serverRoute = type == "sign-in" ? "/signin" : "/signup";

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

    const form = new FormData(authForm.current);
    const formData = {};
    form.forEach((value, key) => {
      formData[key] = value;
    });

    const { fullname, email, password } = formData;

    if (fullname && fullname.length < 3) {
      return toast.error("Full name must be at least 3 letters long");
    }
    if (!email.length) {
      return toast.error("Enter the email");
    }
    if (!emailRegex.test(email)) {
      return toast.error("Email is invalid");
    }
    if (!passwordRegex.test(password)) {
      return toast.error(
        "Password must be 6 to 20 characters long with at least one numeric, one lowercase, and one uppercase letter"
      );
    }

    userAuthThroughServer(serverRoute, formData);
  };

  // const handleGoogleAuth = async (e) => {
  //   e.preventDefault();

  //   const user = await authWithGoogle();
  //   if (user) {
  //     const serverRoute = "/google-auth";
  //     const formData = {
  //       // access_token: await user.getIdToken(),
  //       access_token: await user.accessToken,
  //     };

  //     userAuthThroughServer(serverRoute, formData);
  //   } else {
  //     toast.error("Trouble logging in through Google");
  //   }
  // };

  const handleGoogleAuth = (e) => {
    e.preventDefault();

    authWithGoogle()
      .then((user) => {
        let serverRoute = "/google-auth";

        let formData = {
          access_token: user.accessToken,
        };

        userAuthThroughServer(serverRoute, formData);
      })
      .catch((err) => {
        toast.error("trouble login through google");
        return console.log(err);
      });
  };

  return access_token ? (
    <Navigate to="/" />
  ) : (
    <AnimationWrapper keyValue={type}>
      <section className="h-cover flex items-center justify-center">
        <Toaster />
        <form ref={authForm} className="w-[80%] max-w-[400px]">
          <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
            {type === "sign-in" ? "Welcome Buddy" : "Join us today"}
          </h1>
          {type !== "sign-in" && (
            <InputBox
              name="fullname"
              type="text"
              placeholder="Full Name"
              icon="fi-rr-user"
            />
          )}

          <InputBox
            name="email"
            type="email"
            placeholder="Email"
            icon="fi-rr-envelope"
          />

          <InputBox
            name="password"
            type="password"
            placeholder="Password"
            icon="fi-rr-key"
          />

          <button
            className="btn-dark center mt-14"
            type="submit"
            onClick={handleSubmit}
          >
            {type.replace("-", " ")}
          </button>

          <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
            <hr className="w-1/2 border-black" />
            <p>or</p>
            <hr className="w-1/2 border-black" />
          </div>

          <button
            className="btn-dark flex items-center justify-center gap-4 w-[90%] center"
            onClick={handleGoogleAuth}
          >
            <img src={googleIcon} className="w-5" />
            Continue with Google
          </button>

          {type === "sign-in" ? (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Don't have an account?
              <Link to="/signup" className="underline text-black text-xl ml-1">
                Join us today
              </Link>
            </p>
          ) : (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Already have an account?
              <Link to="/signin" className="underline text-black text-xl ml-1">
                Sign in here
              </Link>
            </p>
          )}
        </form>
      </section>
    </AnimationWrapper>
  );
};

export default UserAuthForm;
