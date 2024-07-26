import React, { useContext, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../imgs/logo.png";
import AnimationWrapper from "../common/page-animation";
import defaultBanner from "../imgs/blog banner.png";
import { uploadImage } from "../common/aws";
import { ToastBar, Toaster, toast } from "react-hot-toast";
import { EditorContext } from "../pages/editor.pages";
import EditorJs from "@editorjs/editorjs";
import { tools } from "./tools.component";
import { UserContext } from "../App";

const BlogEditor = () => {
  // let blogBannerRef = useRef();

  let {
    blog,
    blog: { title, banner, content, tags, des },
    setBlog,
    textEditor,
    setTextEditor,
    setEditorState,
  } = useContext(EditorContext);

  let {
    userAuth: { access_token },
  } = useContext(UserContext);

  let navigate = useNavigate();

  //useEffect
  useEffect(() => {
    if (!textEditor.isReady) {
      setTextEditor(
        new EditorJs({
          holderId: "textEditor",
          data: content,
          tools: tools,
          placeholder: "Let's write some recent news",
        })
      );
    }
  }, []);

  //   const handleBannerUpload = (e) => {
  //     let img = e.target.files[0];
  //     // console.log(img);
  //     if (img) {
  //       let loadingToast = toast.loading("Uploading....");

  //       uploadImage(img)
  //         .then((url) => {
  //           if (url) {
  //             toast.dismiss(loadingToast);
  //             toast.success("Uploaded 👍 ");
  //             blogBannerRef.current.src = url;
  //             setBlog({ ...blog, banner: url });
  //           }
  //         })
  //         .catch((err) => {
  //           toast.dismiss(loadingToast);
  //           return toast.error(err);
  //         });
  //     }
  //   };

  const handleBannerUpload = async (e) => {
    let img = e.target.files[0];

    if (img) {
      let loadingToast = toast.loading("Uploading...");

      try {
        const url = await uploadImage(img);

        if (url) {
          toast.dismiss(loadingToast);
          toast.success("Uploaded 👍");
          setBlog({ ...blog, banner: url });
        } else {
          throw new Error("Failed to upload image");
        }
      } catch (err) {
        toast.dismiss(loadingToast);
        toast.error(err.message);
      }
    }
  };

  const handleTitleKeyDown = (e) => {
    // console.log(e);
    if (e.keyCode == 13) {
      //user press the enter key
      e.preventDefault();
    }
  };

  const handleTitleChange = (e) => {
    // console.log(e);
    let input = e.target;

    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";
    setBlog({ ...blog, title: input.value });
  };

  const handleError = (e) => {
    let img = e.target;
    img.src = defaultBanner;
  };

  const handlePublishEvent = (e) => {
    if (!banner.length) {
      return toast.error("Upload a news banner to publish it");
    }

    if (!title.length) {
      return toast.error("Write news title to  publish it");
    }

    if (textEditor.isReady) {
      textEditor
        .save()
        .then((data) => {
          if (data.blocks.length) {
            setBlog({ ...blog, content: data });
            setEditorState("publish");
          } else {
            return toast.error("Write something on your news to publish it");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleSaveDraft = (e) => {
    if (e.target.className.includes("disable")) {
      return;
    }

    if (!title.length) {
      return toast.error("Write news title before saving it as draft");
    }

    let loadingToast = toast.loading("Saving Draft...");

    e.target.classList.add("disable");

    if (textEditor.isReady) {
      textEditor.save().then((content) => {
        let blogObj = {
          title,
          banner,
          des,
          content,
          tags,
          draft: true,
        };

        axios
          .post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", blogObj, {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          })
          .then(() => {
            e.target.classList.remove("disable");
            toast.dismiss(loadingToast);
            toast.success("Saved 👍");

            setTimeout(() => {
              navigate("/");
            }, 500);
          })
          .catch(({ response }) => {
            e.target.classList.remove("disable");
            toast.dismiss(loadingToast);

            return toast.error(response.data.error);
          });
      });
    }
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="flex-none w-10">
          <img src={logo} />
        </Link>

        <p className="max-md:hidden text-black line-clamp-1 w-full">
          {/* {title.length ? title : "New Blog"} */}
          {title.length ? title : "Recent News"}
        </p>

        <div className="flex gap-4 ml-auto py-2">
          <button className="btn-dark" onClick={handlePublishEvent}>
            Publish
          </button>

          <button className="btn-light py-2" onClick={handleSaveDraft}>
            Save Draft
          </button>
        </div>
      </nav>
      <Toaster />
      <AnimationWrapper>
        <section>
          <div className="mx-auto max-w-[900px] w-full">
            <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
              <label htmlFor="uploadBanner">
                <img
                  // ref={blogBannerRef}
                  // src={defaultBanner}
                  src={banner}
                  className="z-20"
                  onError={handleError}
                />
                <input
                  id="uploadBanner"
                  type="file"
                  accept=".png,.jpg,.jpeg"
                  hidden
                  onChange={handleBannerUpload}
                />
              </label>
            </div>

            <textarea
              defaultValue={title}
              // placeholder="Blog-Title"
              placeholder="News-Title"
              className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40"
              onKeyDown={handleTitleKeyDown}
              onChange={handleTitleChange}
            ></textarea>

            <hr className="w-full opacity-10 my-5" />

            <div id="textEditor" className="font-gelasio"></div>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default BlogEditor;
