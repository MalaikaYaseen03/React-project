import { useState, useEffect } from "react";
import useFetch from "../../Components/useFetch";

const AddServiceForm = ({ serviceToEdit }) => {

    // const [errors, setErrors] = useState({});
    const { data: services, setData: setServices } = useFetch("http://localhost:8000/services");

    const [formObject, setFormObject] = useState({
        title: "",
        desc: "",
        // isActive: false
    });

    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (serviceToEdit) {
            setFormObject({
                title: serviceToEdit.sTitle || "",
                desc: serviceToEdit.sDescription || "",
                isActive: serviceToEdit.isActive || false
            });
            setIsEditing(true);
        } else {
            setFormObject({
                title: "",
                desc: "",
                isActive: false
            });
            setIsEditing(false);
        }
    }, [serviceToEdit]);

    const [editingId, setEditingId] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormObject(prevFormObject => ({
            ...prevFormObject,
            [name]: value
        }));
    };
    console.log('Service List Before Update:', services);

    const validateForm = () => {
        const { title, desc } = formObject;
        let isValid = true;

        if (!title.trim()) {
            alert("Title is required.");
            isValid = false;
        }
        if (!desc.trim()) {
            alert("Description is required.");
            isValid = false;
        }

        return isValid;
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const updatedServiceData = {
            sTitle: formObject.title,
            sDescription: formObject.desc,
            isActive: formObject.isActive
        };

        if (isEditing) {
            // Update existing service
            const response = await fetch(`http://localhost:8000/services/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formObject)
            });
            console.log('Editing ID:', editingId);
            const updatedService = await response.json();
            console.log('updated service: ', updatedService);

            setServices(prevServices =>
                prevServices.map(service =>
                    service.id === editingId ? updatedService : service
                )
            );
            console.log('new updated service: ', services);
            alert('Service updated successfully');
        } else {
            // Add new service
            const response = await fetch("http://localhost:8000/services", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedServiceData)
            });
            const newService = await response.json();

            console.log('new service: ', newService);

            setServices(prevServices => [...prevServices, newService]);

            console.log('Added service: ', services);

            alert('Service added successfully');
        }

        // Reset form
        setFormObject({ title: "", desc: ""/*, isActive: false*/ });
        setIsEditing(false);
        setEditingId(null);
    };

    const onEdit = (service) => {
        setFormObject({
            title: service.sTitle || "",
            desc: service.sDescription || ""
            // isActive: service.isActive || false
        });
        setIsEditing(true);
        setEditingId(service.id);
    };

    const onDelete = async (id) => {
        await fetch(`http://localhost:8000/services/${id}`, {
            method: 'DELETE'
        });

        setServices(services.filter(service => service.id !== id));
        alert('Service deleted successfully');
    };

    const onReset = (e) => {
        e.preventDefault();
        setFormObject({
            title: '',
            desc: '',
            // isActive: false,
            id: null
        });
        setIsEditing(false);
        setEditingId(null);
    };

    return (
        <>
            {/* Service Form Start */}
            <section id="service-form" className="form">
                <div className="container">
                    <div className="row">
                        <div className="service-container">
                            <div className="col-12">
                                <h2>Add Services Info!</h2>
                            </div>
                            <div className="col-12">
                                <form onSubmit={onSubmit} noValidate>
                                    <input
                                        type="text"
                                        name="title"
                                        placeholder="Title of Service"
                                        value={formObject.title || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                    {/* {errors.title && <p className="error-message">{errors.title}</p>} */}
                                    <textarea
                                        name="desc"
                                        placeholder="Description"
                                        value={formObject.desc || ""}
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                    {/* {errors.desc && <p className="error-message">{errors.desc}</p>} */}
                                    {/* <div className="isActive">
                                        <input
                                            type="checkbox"
                                            id="active"
                                            name="isActive"
                                            className="mx-2"
                                            checked={formObject.isActive}
                                            onChange={handleChange}
                                            required
                                        />
                                        <label htmlFor="active">
                                            isActive
                                        </label>
                                    </div> */}
                                    {/* {errors.isActive && <p className="error-message">{errors.isActive}</p>} */}
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
            {/* Service Form End */}
            {/* Services Section Start */}
            <section>
                <div className="container">
                    <div className="row">
                        {services && services.map(service => (
                            <div className="col-md-4" key={service.id}>
                                <div className="service-box">
                                    <div className="service-ico">
                                        <span className="ico-circle"><i className={service.sIcon} /></span>
                                    </div>
                                    <div className="service-content">
                                        <h2 className="s-title">{service.sTitle}</h2>
                                        <p className="s-description text-center">
                                            {service.sDescription}
                                        </p>
                                        <button onClick={() => onEdit(service)}>Edit</button>
                                        <button onClick={() => onDelete(service.id)}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            {/* Services Section End */}
        </>
    );
}

export default AddServiceForm;