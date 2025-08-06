import { useState, useEffect, useRef } from "react";

export default function TaskModal({ visible, onClose, onSubmit, initialData = {}, mode = "Add" }) {
     const modalRef = useRef(null);

     const [form, setForm] = useState({
          title: "",
          description: "",
          dueDate: "",
          status: "Pending",
     });

     useEffect(() => {
          if (initialData) {
               setForm({
                    title: initialData.title || "",
                    description: initialData.description || "",
                    dueDate: initialData.dueDate?.slice(0, 10) || "",
                    status: initialData.status || "Pending",
               });
          }
     }, [initialData]);

     const handleChange = (e) => {
          setForm({ ...form, [e.target.name]: e.target.value });
     };

     const handleSubmit = (e) => {
          e.preventDefault();
          onSubmit(form);
          setForm({ title: "", description: "", dueDate: "", status: "Pending" });
     };

     const handleBackdropClick = (e) => {
          if (modalRef.current && !modalRef.current.contains(e.target)) {
               onClose();
          }
     };

     if (!visible) return null;

     return (
          <div
               className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
               onClick={handleBackdropClick}
          >
               <div ref={modalRef} className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg">
                    <h2 className="text-xl font-bold mb-4">{mode} Task</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                         <input
                              type="text"
                              name="title"
                              placeholder="Title"
                              className="w-full border p-2 rounded"
                              value={form.title}
                              onChange={handleChange}
                              required
                         />
                         <textarea
                              name="description"
                              placeholder="Description"
                              className="w-full border p-2 rounded"
                              value={form.description}
                              onChange={handleChange}
                         />
                         <input
                              type="date"
                              name="dueDate"
                              className="w-full border p-2 rounded"
                              value={form.dueDate}
                              onChange={handleChange}
                         />
                         <select
                              name="status"
                              value={form.status}
                              onChange={handleChange}
                              className="w-full border p-2 rounded"
                         >
                              <option>Pending</option>
                              <option>In Progress</option>
                              <option>Completed</option>
                         </select>

                         <div className="flex justify-end space-x-2 pt-2">
                              <button
                                   type="button"
                                   onClick={onClose}
                                   className="px-6 py-2 rounded-full bg-gray-300 hover:bg-gray-400"
                              >
                                   Cancel
                              </button>
                              <button
                                   type="submit"
                                   className="px-8 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
                              >
                                   {mode === "Edit" ? "Update" : "Add"}
                              </button>
                         </div>
                    </form>
               </div>
          </div>
     );
}
