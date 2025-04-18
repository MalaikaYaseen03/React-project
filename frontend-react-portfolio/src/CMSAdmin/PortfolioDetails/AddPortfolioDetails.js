import { useCallback, useRef } from "react";
import { useState, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import validationSchema from "./PortfolioDetailsValidation";
import PortfolioDetails from "../../Components/PortfolioDetails";
import useFetch from "../../Components/useFetch";
import {
  useParams,
  useHistory,
  useLocation,
} from "react-router-dom/cjs/react-router-dom";
import Loading from "../../Components/Loading/Loading";
import Error from "../../Components/Error/Error";
import "./PortfolioDetailsForm.css";
import ImageCropper from "../ImageCropper/ImageCropper";
import { uploadImageToFirebase } from "../Util Functions/uploadImageToFirebase";
import { getImageAspectRatio } from "../Util Functions/getImageAspectRatio";
import ImageUpload from "../ImageUpload/ImageUpload";
import ReusableForm from "../ReusableForm/ReusableForm";

const AddPortfolioDetails = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      client: "",
      category: "",
      date: "",
      link: "",
      desc: "",
      isActive: false,
    },
  });

  const token = localStorage.getItem("token");
  const childRef = useRef();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const history = useHistory();
  const { id: workId } = useParams();
  // console.log("Initial workId", workId);

  const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

  const {
    data: details,
    setData: setDetails,
    isPending,
    error,
  } = useFetch(`${API_URL}/api/workDetails`);

  const [currentDetails, setCurrentDetails] = useState(null);
  const [base64Images, setBase64Images] = useState([]);
  const imageRefs = useRef([]);
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission status
  const [cropData, setCropData] = useState({
    isCropping: false,
    imageSrc: null,
    fileName: null,
    croppingIndex: null,
    cropAspectRatio: null,
  });

  const fields = [
    {
      name: "client",
      type: "text",
      placeholder: "Client Company",
      validation: { required: true },
    },
    {
      name: "category",
      type: "text",
      placeholder: "Category of Project",
      validation: { required: true },
    },
    {
      name: "date",
      type: "date",
      placeholder: "Date (YY-MM-DD)",
      validation: { required: true },
    },
    {
      name: "link",
      type: "text",
      placeholder: "Enter link to your project",
      validation: { required: true },
    },
    {
      name: "desc",
      type: "textarea",
      placeholder: "Description",
      validation: { required: true },
    },
  ];

  const loadDetails = useCallback(() => {
    // console.log("Loading details:", currentDetails); // Debugging line
    if (currentDetails) {
      setValue("client", currentDetails.pClient);
      setValue("category", currentDetails.pCategory);
      setValue("date", currentDetails.pDate);
      setValue("link", currentDetails.pURL);
      setValue("desc", currentDetails.desc);
      setValue("isActive", currentDetails.isActive);
      // Set existing images or empty array
      setBase64Images(
        currentDetails.slideImages?.map((imageUrl) => ({
          file: null,
          preview: imageUrl,
        })) || []
      );
    } else {
      reset();
      setBase64Images([]);
    }
  }, [currentDetails, setValue, reset]);

  useEffect(() => {
    loadDetails();
  }, [loadDetails]);

  const handleImageClick = (index) => {
    imageRefs.current[index].click();
  };

  const addNewImageInput = () => {
    setBase64Images((prevState) => [...prevState, ""]);
  };

  const removeImage = (index) => {
    setBase64Images((prevState) => prevState.filter((_, i) => i !== index));
  };

  const handleImageChange = async (e, index) => {
    const file = e.target.files[0];
    if (file) {
      // console.log("file:", file);
      // console.log("filename:", file.name);

      const imageDataUrl = URL.createObjectURL(file);
      // console.log("imageDataUrl", imageDataUrl);
      const aspect = await getImageAspectRatio(imageDataUrl); // Dynamically determine aspect ratio
      // console.log("aspect", aspect);
      setCropData((prev) => ({
        ...prev,
        fileName: file.name, // Ensure fileName is updated correctly
        isCropping: true,
        imageSrc: imageDataUrl,
        croppingIndex: index,
        cropAspectRatio: aspect,
      }));
    }
  };

  const handleCropComplete = async (croppedImg) => {
    // console.log("cropped image in handlecropcomplete:", croppedImg);
    if (croppedImg) {
      try {
        const imagePreviewUrl = URL.createObjectURL(croppedImg); // Create preview URL

        setBase64Images((prevImages) => {
          const updatedImages = [...prevImages];
          updatedImages[cropData.croppingIndex] = {
            file: croppedImg, // Store the actual file
            preview: imagePreviewUrl, // Store preview URL
          };
          return updatedImages;
        });
        setCropData({ ...cropData, isCropping: false });
      } catch (error) {
        console.error("Failed to upload cropped image.", error);
      }
    } else {
      console.error("Cropped image is not valid");
    }
  };

  const uploadAllImages = async () => {
    try {
      const uploadedUrls = await Promise.all(
        base64Images.map(async (imageData) => {
          if (imageData.file) {
            // console.log("Uploading file:", imageData.file.name);
            // Upload new files to Firebase
            return await uploadImageToFirebase(imageData.file, "detailsImages");
          }
          // console.log("Using existing image URL:", imageData.preview);
          return imageData.preview; // Keep existing image URL
        })
      );
      // console.log("Uploaded URLs:", uploadedUrls);
      return uploadedUrls;
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Image upload failed. Please try again.");
      throw error;
    }
  };

  const onSubmit = async (formData) => {
    // console.log("formdata", formData);

    setIsSubmitting(true);

    const uploadedImageUrls = await uploadAllImages();

    const updatedData = {
      pCategory: formData.category,
      pClient: formData.client,
      pDate: formData.date,
      pURL: formData.link,
      desc: formData.desc,
      slideImages: uploadedImageUrls,
    };

    try {
      const method = currentDetails ? "PUT" : "POST";
      const url = currentDetails
        ? `${API_URL}/api/workDetails/${currentDetails._id}`
        : `${API_URL}/api/workDetails`;
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const result = await response.json();
        if (currentDetails) {
          setDetails(
            details.map((detail) =>
              detail._id === result._id ? result : detail
            )
          );
          childRef.current.childFunction();
          toast.success("Project Details Updated Successfully");
        } else {
          const updatedWorkResponse = await fetch(
            `${API_URL}/api/works/${workId}`,
            {
              method: "PATCH",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ workDetailsId: result._id }),
            }
          );
          // console.log("updatedWorkResponse", updatedWorkResponse);

          if (!updatedWorkResponse.ok) {
            throw new Error(
              `Failed to update work: ${updatedWorkResponse.statusText}`
            );
          }
          queryParams.set("workDetailsId", result._id);
          history.push({
            pathname: location.pathname,
            search: queryParams.toString(),
          });

          childRef.current.childFunction(result._id);

          setDetails([...details, result]);
          childRef.current.childFunction();
          toast.success("Project Details Added Successfully");
        }
        reset();
        setCurrentDetails(null);
      } else {
        throw new Error("Failed to save project details info");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
      setBase64Images([]);
    }
  };

  const onReset = () => {
    reset();
    setCurrentDetails(null);
    setBase64Images([]);
  };

  const handleEdit = (details) => {
    setCurrentDetails(details);
    // console.log("onEditClick: ", details);
  };

  const handleDelete = async (detailsId, workId) => {
    try {
      const response = await fetch(`${API_URL}/api/workDetails/${detailsId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to delete details: ${response.statusText}`);
      }
      // console.log("delete workId", workId);
      const updatedWorkResponse = await fetch(
        `${API_URL}/api/works/${workId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ workDetailsId: null }),
        }
      );
      if (!updatedWorkResponse.ok) {
        throw new Error(
          `Failed to update work: ${updatedWorkResponse.statusText}`
        );
      }

      // Update the URL
      setDetails(details.filter((detail) => detail._id !== detailsId));

      toast.success("Details deleted successfully");
      history.push("/form/portfolio-form");
    } catch (error) {
      // console.log("Error deleting details:", error);
      toast.error("Failed to delete details");
    }
  };

  if (isPending) return <Loading />;

  if (error) return <Error message={error} />;

  return (
    <>
      {/* PortfolioDetails Form Start */}
      <section
        id="portfolioDetails-form"
        className="portfolioDetails-form form"
      >
        <div className="container">
          <div className="row">
            <div className="portfolioDetails-container">
              <div className="col-12">
                <h2>Add Portfolio Details Info!</h2>
              </div>
              <div className="col-12">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="form-container"
                  noValidate
                >
                  <div className="text-center">
                    {base64Images &&
                      base64Images.map((imageData, index) => (
                        <div className="image" key={index}>
                          <ImageUpload
                            index={index}
                            register={register}
                            base64Image={imageData.preview}
                            handleImageClick={handleImageClick}
                            imageRefs={imageRefs}
                            handleImageChange={handleImageChange}
                            removeImage={removeImage}
                          />
                          <button
                            type="button"
                            className="btn btn-danger btn-sm mt-2"
                            onClick={() => removeImage(index)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    <button
                      type="button"
                      className="btn add-more-btn my-3 text-center"
                      onClick={addNewImageInput}
                    >
                      {/* {images.length === 0 ? "Add Project Image" : "Add More +"} */}
                      {base64Images.length === 0
                        ? "Add Project Image"
                        : "Add More +"}
                    </button>
                    {cropData.isCropping && (
                      <ImageCropper
                        imageSrc={cropData.imageSrc}
                        fileName={cropData.fileName}
                        onCropComplete={handleCropComplete}
                        onClose={() =>
                          setCropData({ ...cropData, isCropping: false })
                        }
                        width={688} // Pass the desired width
                        height={398} // Pass the desired height
                        aspect={cropData.cropAspectRatio}
                        cropShape="rect"
                      />
                    )}
                  </div>
                  <ReusableForm
                    fields={fields}
                    register={register}
                    errors={errors}
                    isSubmitting={isSubmitting}
                    onReset={onReset}
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
        <hr />
      </section>
      {/* PortfolioDetails Form End */}
      {/* <Portfolio /> */}
      <PortfolioDetails
        onEditClick={handleEdit}
        onDeleteClick={handleDelete}
        ref={childRef}
      />
    </>
  );
};

export default AddPortfolioDetails;
