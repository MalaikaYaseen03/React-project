import { useRef, useState } from "react";
import About from "../../Components/About";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from 'react-toastify';
import validationSchema from "./AboutValidation";

const AddForm = () => {

    const { register, handleSubmit, formState: { errors }, setValue, trigger  } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            file: '',
            name: '',
            profile: '',
            skills: '',
            email: '',
            phone: '',
            desc: '',
            isActive: false
        }
    })

    const [image, setImage] = useState(null);
    const imageRef = useRef(null);
    const [base64Image, setBase64Image] = useState("");

    const acceptedFileTypes = "image/x-png, image/png, image/jpg, image/webp, image/jpeg";

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        const base64 = await convertBase64(file);
        setBase64Image(base64);
        console.log("base64", base64);
        setImage(file);

        setValue("file", file);
        await trigger("file");

        const imgname = e.target.files[0].name;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            const img = new Image();
            img.src = reader.result;
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const maxSize = Math.max(img.width, img.height);
                canvas.width = maxSize;
                canvas.height = maxSize;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(
                    img,
                    (maxSize - img.width) / 2,
                    (maxSize - img.height) / 2
                );
                canvas.toBlob(
                    (blob) => {
                        const file = new File([blob], imgname, {
                            type: "image/png",
                            lastModified: Date.now(),
                        });

                        console.log(file);
                        setImage(file);
                    },
                    "image/jpeg",
                    0.8
                );
            };
        };
    };

    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader(file);
            reader.readAsDataURL(file);

            reader.onload = () => {

                resolve(reader.result);
            }

            reader.onerror = (error) => {
                reject(error);
            }
        })

    }

    const handleImageClick = () => {
        imageRef.current.click();
    }

    const onSubmit = async (formObject, e) => {
        e.preventDefault();

        formObject.aboutImage = base64Image; // Add the base64 image to the form object

        console.log('Form Data:', formObject);

        let imageUrl = formObject.aboutImage;

        // If a new image is selected, upload it
        if (image) {
            const imageFormData = new FormData();
            imageFormData.append('file', image);

            try {
                const response = await fetch('http://localhost:8000/upload', {
                    method: 'POST',
                    body: imageFormData
                });
                const data = await response.json();
                imageUrl = data.url; // Assuming the server responds with the URL of the uploaded image
            } catch (error) {
                console.error('Error uploading the image:', error);
            }
        }

        const updatedData = {
            name: formObject.name,
            profile: formObject.profile,
            email: formObject.email,
            phone: formObject.phone,
            desc1: formObject.desc, // Assuming all desc is in one textarea
            desc2: "",
            desc3: "",
            img: imageUrl,
            id: "1"
        };
        console.log("imageUrl", imageUrl)

        // Send PUT request to update the JSON data
        try {
            const response = await fetch('http://localhost:8000/about/1', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });
            const data = await response.json();
            console.log('Success:', data);
            toast.success('Data updated successfully!')
            e.target.reset();  // Reset the form after successful submission
            setImage(null);
            setBase64Image("");   // Clear the image state 
        } catch (error) {
            console.error('Error updating the JSON data:', error);
        }

        e.target.reset();

    };

    const onReset = (e) => {
        e.preventDefault();
        e.target.form.reset();
        setImage(null);
        setBase64Image("");      // Clear the image state
    };

    return (
        <>
            <section id="about-form" className="form">
                <div className="container">
                    <div className="row">
                        <div className="add-container">
                            <div className="col-12">
                                <h2>Add About Info!</h2>
                            </div>
                            <div className="col-12">
                                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                                    <div className="img-container text-center">
                                        <div className="image" onClick={handleImageClick}>
                                            {image ?
                                                <img
                                                    src={URL.createObjectURL(image)}
                                                    alt=""
                                                    className="img-display-after"
                                                />
                                                : <img
                                                    src="../assets/img/default-image.jpg"
                                                    alt="default"
                                                    className="img-display-before"
                                                />
                                            }
                                            <input
                                                type="file"
                                                name="file"
                                                {...register('file')}
                                                accept={acceptedFileTypes}
                                                multiple={false}
                                                onChange={handleImageChange}
                                                ref={imageRef}
                                                style={{ "display": "none" }}
                                            />
                                        </div>
                                        <label className="my-3"><b>Choose Profile Image</b></label>
                                    </div>
                                        {errors.file && <p className="error-message">{errors.file.message}</p>}
                                    <input
                                        type="text"
                                        name="name"
                                        {...register('name')}
                                        placeholder="Full Name"
                                        required
                                    />
                                    {errors.name && <p className="error-message">{errors.name.message}</p>}
                                    <input
                                        type="text"
                                        name="profile"
                                        {...register('profile')}
                                        placeholder="Occupation"
                                        required
                                    />
                                    {errors.profile && <p className="error-message">{errors.profile.message}</p>}
                                    <input
                                        type="email"
                                        name="email"
                                        {...register('email')}
                                        placeholder="Email"
                                        required
                                    />
                                    {errors.email && <p className="error-message">{errors.email.message}</p>}
                                    <input
                                        type="number"
                                        name="phone"
                                        {...register('phone')}
                                        placeholder="Phone Number"
                                        required
                                    />
                                    {errors.phone && <p className="error-message">{errors.phone.message}</p>}
                                    <textarea
                                        name="desc"
                                        {...register('desc')}
                                        placeholder="Description"
                                        required
                                    ></textarea>
                                    {errors.desc && <p className="error-message">{errors.desc.message}</p>}
                                    <div className="isActive">
                                        <input
                                            type="checkbox"
                                            id="active"
                                            name="isActive"
                                            {...register('isActive')}
                                            className="mx-2"
                                            required
                                        />
                                        <label htmlFor="active">
                                            isActive
                                        </label>
                                    </div>
                                    {errors.isActive && <p className="error-message">{errors.isActive.message}</p>}
                                    <div className="buttons">
                                        <button className="reset" type="reset" onClick={onReset}>Reset</button>
                                        <button className="cancel">Cancel</button>
                                        <button className="submit" type="submit">Submit</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <hr />
            </section>
            <About />
        </>
    );
}

export default AddForm;