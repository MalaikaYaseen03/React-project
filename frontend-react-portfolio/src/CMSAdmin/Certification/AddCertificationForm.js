import Certifications from "../../Components/Certifications";
import { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import validationSchema from "./CertificationValidation";
import { toast } from "react-toastify";
import useFetch from "../../Components/useFetch";

const AddCertificationForm = () => {
  const [currentCertifications, setCurrentCertifications] = useState(null);
  const token = localStorage.getItem("token");
  const {
    data: certifications,
    setData: setCertifications,
    refetch,
  } = useFetch("/certifications");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      title: "",
      category: "",
      description: "",
      name: "",
      time: "",
      isActive: false,
    },
  });

  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const image1Ref = useRef(null);
  const image2Ref = useRef(null);
  const [base64Image1, setBase64Image1] = useState("");
  const [base64Image2, setBase64Image2] = useState("");

  const acceptedFileTypes =
    "image/x-png, image/png, image/jpg, image/webp, image/jpeg";

  const handleImageClick = (inputId) => {
    document.getElementById(inputId).click();
  };

  const handleImage1Change = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertBase64(file);
    // console.log("base64", base64);
    setBase64Image1(base64);
    setImage1(file);
  };

  const handleImage2Change = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertBase64(file);
    setBase64Image2(base64);
    setImage2(file);
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader(file);
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  useEffect(() => {
    if (currentCertifications) {
      setValue("title", currentCertifications.cardTitle);
      setValue("description", currentCertifications.cardDescription);
      setValue("category", currentCertifications.cardCategory);
      setValue("name", currentCertifications.authorName);
      setValue("time", currentCertifications.postDate);
      setValue("isActive", currentCertifications.isActive);
      setBase64Image1(currentCertifications.image);
      setBase64Image2(currentCertifications.authorImage);
      setImage1(null); // or set to a placeholder if needed
      setImage2(null); // or set to a placeholder if needed
    } else {
      reset();
    }
  }, [currentCertifications, setValue, reset]);

  console.log("currentCertifications", currentCertifications);

  const uploadImage = async (imageFile) => {
    // console.log("image file", imageFile);
    const formData = new FormData();
    formData.append("file", imageFile);
    try {
      const response = await fetch("http://localhost:8000/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      return data.file; // Assuming the server responds with the URL of the uploaded image
    } catch (error) {
      console.error("Error uploading the image:", error);
      throw new Error("Image upload failed");
    }
  };
  const onSubmit = async (formObject, e) => {
    e.preventDefault();

    console.log("Certification Data:", formObject);

    try {
      formObject.image = base64Image1; // Add the base64 image to the form object
      formObject.authorImage = base64Image2; // Add the base64 image to the form object

      let imageUrl1 = formObject.image; // Default to base64 if no upload is necessary
      let imageUrl2 = formObject.authorImage;

      // Upload images to the backend if the user selected new ones
      if (image1) {
        console.log("image1", image1);
        imageUrl1 = await uploadImage(image1);
      }
      if (image2) {
        console.log("image2", image2);
        imageUrl2 = await uploadImage(image2);
      }

      const updatedData = {
        cardTitle: formObject.title,
        cardCategory: formObject.category,
        cardDescription: formObject.description,
        postDate: formObject.time,
        authorName: formObject.name,
        image: imageUrl1,
        authorImage: imageUrl2,
        isActive: formObject.isActive,
      };

      console.log("imageUrl1", imageUrl1);
      console.log("imageUrl2", imageUrl2);

      if (currentCertifications) {
        const response = await fetch(
          `/certifications/${currentCertifications._id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData),
          }
        );
        const result = await response.json();
        console.log("Updated certification response:", result);
        setCertifications(
          certifications.map((certification) =>
            certification._id === result._id ? result : certification
          )
        );
        console.log("Updated certification:", certifications);
        toast.success("Certificate updated successfully");
      } else {
        const response = await fetch("/certifications", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        });
        if (response.ok) {
          const result = await response.json();
          console.log("Added certification response:", result);
          setCertifications((prevCertificationList) => [
            ...prevCertificationList,
            result,
          ]);
          console.log("Added certification:", certifications);
          toast.success("Certificate added successfully");
        } else {
          toast.error("Failed to add Certificate info");
        }
      }

      reset();
      setImage1(null);
      setImage2(null);
      setBase64Image1("");
      setBase64Image2("");
      setCurrentCertifications(null);
      refetch();
    } catch (error) {
      toast.error("Failed to upload images or submit the form");
      console.error("Error submitting the form:", error);
    }
  };

  const onReset = () => {
    reset();
    setImage1(null);
    setImage2(null);
    setBase64Image1("");
    setBase64Image2("");
    setCurrentCertifications(null);
  };

  const handleEdit = (certification) => {
    setCurrentCertifications(certification);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/certifications/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setCertifications(
          certifications.filter((certification) => certification._id !== id)
        );
        console.log("Deleted certification:", certifications);
        toast.success("Certificate deleted successfully");
      } else {
        toast.error("Failed to delete Certificate");
      }
    } catch (error) {
      console.error("Error deleting Certificate:", error);
    }
  };

  return (
    <>
      {/* Certification Form Start */}
      <section id="certification-form" className="certification-form form">
        <div className="container">
          <div className="row">
            <div className="certification-container">
              <div className="col-12">
                <h2>Add Certifications Info!</h2>
              </div>
              <div className="col-12">
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                  <div className="img-container d-flex">
                    <div
                      className="image mx-auto"
                      onClick={() => handleImageClick("file-input1")}
                    >
                      {image1 ? (
                        <img
                          src={URL.createObjectURL(image1)}
                          alt=""
                          className="img-display-before"
                        />
                      ) : (
                        <img
                          src={
                            base64Image1 ||
                            "../assets/img/default-work-image.webp"
                          }
                          alt="default"
                          className="img-display-before"
                        />
                      )}
                      <input
                        type="file"
                        name="file1"
                        id="file-input1"
                        accept={acceptedFileTypes}
                        multiple={false}
                        onChange={handleImage1Change}
                        ref={image1Ref}
                        style={{ display: "none" }}
                        required
                      />
                      {errors.file1 && (
                        <p className="error-message">{errors.file1.message}</p>
                      )}
                    </div>
                    <div
                      className="image mx-auto"
                      onClick={() => handleImageClick("file-input2")}
                    >
                      {image2 ? (
                        <img
                          src={URL.createObjectURL(image2)}
                          alt=""
                          className="profile"
                        />
                      ) : (
                        <img
                          src={
                            base64Image2 || "../assets/img/default-image.jpg"
                          }
                          alt="default"
                          className="profile"
                        />
                      )}
                      <input
                        type="file"
                        name="file2"
                        id="file-input2"
                        accept={acceptedFileTypes}
                        multiple={false}
                        onChange={handleImage2Change}
                        ref={image2Ref}
                        style={{ display: "none" }}
                        required
                      />
                      {errors.file2 && (
                        <p className="error-message">{errors.file2.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="label-container d-flex">
                    <label className="mx-auto my-3">
                      <b>Choose Project Image</b>
                    </label>
                    <label className="mx-auto my-3">
                      <b>Choose Your Image</b>
                    </label>
                  </div>

                  <div className="form-group">
                    <input
                      type="text"
                      name="title"
                      className="form-control"
                      {...register("title")}
                      placeholder="Tille of Certificate"
                      required
                    />
                  </div>
                  {errors.title && (
                    <p className="error-message">{errors.title.message}</p>
                  )}

                  <div className="form-group">
                    <input
                      type="text"
                      name="category"
                      className="form-control"
                      {...register("category")}
                      placeholder="Category of Certificate"
                      required
                    />
                  </div>
                  {errors.category && (
                    <p className="error-message">{errors.category.message}</p>
                  )}

                  <div className="form-group">
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      {...register("name")}
                      placeholder="Your Name"
                      required
                    />
                  </div>
                  {errors.name && (
                    <p className="error-message">{errors.name.message}</p>
                  )}

                  <div className="form-group">
                    <input
                      type="text"
                      name="time"
                      id="time"
                      className="form-control"
                      placeholder="Time (10 min)"
                      {...register("time")}
                      required
                    />
                  </div>
                  {errors.time && (
                    <p className="error-message">{errors.time.message}</p>
                  )}

                  <div className="form-group">
                    <textarea
                      name="description"
                      className="form-control"
                      {...register("description")}
                      placeholder="Description"
                      required
                    ></textarea>
                  </div>
                  {errors.description && (
                    <p className="error-message">
                      {errors.description.message}
                    </p>
                  )}

                  <div className="isActive">
                    <input
                      type="checkbox"
                      id="active"
                      name="isActive"
                      {...register("isActive")}
                      className="mx-2"
                      required
                    />
                    <label htmlFor="active">isActive</label>
                    {errors.isActive && (
                      <p className="error-message">{errors.isActive.message}</p>
                    )}
                  </div>

                  <div className="buttons">
                    <button className="reset" type="reset" onClick={onReset}>
                      Reset
                    </button>
                    <button className="submit" type="submit">
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <hr />
      </section>
      {/* Certification Form End */}
      <Certifications
        title="Certifications"
        subtitle="Lorem ipsum, dolor sit amet consectetur adipisicing elit."
        onEditClick={handleEdit}
        onDeleteClick={handleDelete}
        certifications={certifications}
      />
    </>
  );
};

export default AddCertificationForm;
