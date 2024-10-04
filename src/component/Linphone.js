import React, { useState, useEffect } from "react";
import { Modal, message } from "antd";
import axios from "axios";

const Linphone = ({ isLinphoneOpened, setIsLinphoneOpened }) => {
    const [linphonePosition, setLinphonePosition] = useState({ x: 400, y: 80 });
    const [isLinphoneDragging, setLinphoneDragging] = useState(false);
    const [initialLinphonePosition, setLinphoneInitialPosition] = useState({ x: 0, y: 0 });

    const [contacts, setContacts] = useState([]);
    const [contactName, setContactName] = useState("");
    const [contactSipAddress, setContactSipAddress] = useState("");
    const [showAddContactForm, setShowAddContactForm] = useState(false);

    const [userSipAddress, setUserSipAddress] = useState("");

    const linphoneHandleMouseDown = (event) => {
        setLinphoneDragging(true);
        setLinphoneInitialPosition({
            x: event.clientX - linphonePosition.x,
            y: event.clientY - linphonePosition.y,
        });
    };

    const linphoneHandleMouseMove = (event) => {
        if (isLinphoneDragging) {
            setLinphonePosition({
                x: event.clientX - initialLinphonePosition.x,
                y: event.clientY - initialLinphonePosition.y,
            });
        }
    };

    const linphoneHandleMouseUp = () => {
        setLinphoneDragging(false);
    };

    useEffect(() => {
        if (isLinphoneDragging) {
            document.addEventListener("mousemove", linphoneHandleMouseMove);
            document.addEventListener("mouseup", linphoneHandleMouseUp);
        } else {
            document.removeEventListener("mousemove", linphoneHandleMouseMove);
            document.removeEventListener("mouseup", linphoneHandleMouseUp);
        }

        return () => {
            document.removeEventListener("mousemove", linphoneHandleMouseMove);
            document.removeEventListener("mouseup", linphoneHandleMouseUp);
        };
    }, [isLinphoneDragging, linphoneHandleMouseMove]);

    const handleAddClick = () => {
        setShowAddContactForm(true);
    };

    const handleOk = async () => {
        try {
            await axios.post('http://localhost:5000/api/contacts', {
                contactname: contactName,
                contactSipAddress: contactSipAddress,
            });
            message.success("Contact Added Successfully");
            setShowAddContactForm(false);
            fetchContacts();
        } catch (error) {
            console.error("Error adding contact:", error);
            message.error("Failed to add contact");
        }
    };

    const handleCancel = () => {
        setShowAddContactForm(false);
    };

    const fetchContacts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/contacts');
            setContacts(response.data);
        } catch (error) {
            console.error("Error fetching contacts:", error);
            message.error("Failed to fetch contacts");
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    return (
        <div
            className={`drag ${isLinphoneOpened ? "d-block" : "hidden"}`}
            style={{
                height: "550px",
                width: "700px",
                backgroundColor: "#222",
                position: "absolute",
                left: linphonePosition.x,
                top: linphonePosition.y,
                userSelect: "none",
                borderRadius: "10px",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
            }}
        >
            <div
                className="head flex justify-between items-center"
                onMouseDown={linphoneHandleMouseDown}
                style={{ height: "40px", backgroundColor: "#fff", cursor: "move", borderRadius: "10px 10px 0 0" }}
            >
                <span className="text-black text-sm ml-3">Phoenix Uplink</span>
                <span
                    className="cursor-pointer mr-3"
                    onClick={() => setIsLinphoneOpened(false)}
                >✕</span>
            </div>

            <div className="text-white p-4" style={{ height: "490px" }}>
            <div className="w-full flex justify-between mb-4">
    <a href="https://docs.google.com/document/d/1q9SY-3hIMA5F-QT_mXPIJQxfrcOa2i56/edit" target="_blank" rel="noreferrer" className="btn bg-blue-600 py-1 px-3 rounded hover:bg-blue-500">Uplink Guide</a>
    <a
        href={`sip:${userSipAddress}`} // Adjust the SIP address here
        className="btn bg-yellow-500 py-1 px-3 rounded hover:bg-yellow-400"
        target="_self" // Ensure it doesn't open in a new tab
        rel="noreferrer"
    >
        Open Linphone
    </a>
</div>

                <div className="mb-4 text-center">
                    <input
                        type="text"
                        className="form-control bg-gray-800 text-white py-2 px-4 mb-3 rounded"
                        onChange={(e) => setUserSipAddress(e.target.value)}
                        placeholder="username@sip.linphone.org"
                    />
                    <a href={`sip:${userSipAddress}`} className="btn bg-gray-700 text-white py-2 px-6 rounded hover:bg-gray-600">Call</a>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-3">
                        <span>Contacts</span>
                        <button onClick={handleAddClick} className="btn bg-gray-500 text-white rounded-full px-3 py-1 hover:bg-gray-400">+</button>
                    </div>
                    <div className="contacts-list overflow-y-auto" style={{ height: "300px" }}>
                        {contacts.map((contact, index) => (
                            <div key={index} className="flex justify-between mb-2">
                                <span>{contact.contactname}</span>
                                <span>{contact.contactSipAddress}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Add Contact Modal */}
            <Modal
                title="Add Contact"
                visible={showAddContactForm}
                onOk={handleOk}
                onCancel={handleCancel}
                centered={true} // Center the modal
                footer={[
                    <button key="cancel" onClick={handleCancel} className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-400">Cancel</button>,
                    <button key="submit" onClick={handleOk} className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-400">Add</button>,
                ]}
            >
                <input
                    className="form-control mb-3"
                    type="text"
                    placeholder="Name"
                    onChange={(e) => setContactName(e.target.value)}
                />
                <input
                    className="form-control"
                    type="text"
                    placeholder="SIP Address"
                    onChange={(e) => setContactSipAddress(e.target.value)}
                />
            </Modal>
        </div>
    );
};

export default Linphone;
