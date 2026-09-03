import axios from "axios";
import { useState, useEffect } from "react";

function ContactList({ setContacts, contacts }) {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All Status");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);

      try {
        const res = await axios.get(
          "http://localhost:5000/contacts"
        );

        setContacts(res.data);
      } catch (err) {
        console.log("GET ERROR:", err);
      }

      const delay = new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );

      await delay;
      setLoading(false);
    };

    fetchContacts();
  }, [setContacts]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/contacts/${id}`
      );

      setContacts((prev) =>
        prev.filter((contact) => contact._id !== id)
      );
    } catch (err) {
      console.log("DELETE ERROR:", err);
      alert("Failed to delete contact");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(
        `http://localhost:5000/contacts/${id}`,
        { status }
      );

      setContacts((prev) =>
        prev.map((c) =>
          c._id === id ? { ...c, status } : c
        )
      );
    } catch (err) {
      console.log("PATCH ERROR:", err);
      alert("Failed to update status");
    }
  };

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All Status" || c.status === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <>
      {/* Search and Filter */}
      <div className="flex gap-10">
        <select
          className="p-2 rounded bg-[#00277a] text-white cursor-pointer outline-0"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All Status">All Status</option>
          <option value="Interested">Interested</option>
          <option value="Follow-up">Follow-up</option>
          <option value="Closed">Closed</option>
        </select>

        <input
          type="text"
          placeholder="Search by name or company"
          className="p-3 rounded w-full bg-[#eff4ff] outline-0"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Loading */}
      {loading ? (
        <div className="w-full h-[415px] flex flex-col items-center justify-center rounded-[5px] p-[20px] mt-10 gap-4">
          <img
            src="/cat.png"
            alt="Loading"
            width={200}
            height={200}
          />

          <p className="text-[#00277a] text-2xl font-semibold">
            Loading...
          </p>
        </div>
      ) : (
        <>
          {/* No Contacts */}
          {filteredContacts.length === 0 ? (
            <div className="w-full h-[415px] flex flex-col items-center justify-center rounded-[5px] p-[20px] mt-10 gap-4 bg-[#eff4ff]">
              <img
                src="/notfound.jpg"
                alt="No contacts found"
                width={200}
                height={200}
              />

              <p className="text-[#00277a] text-2xl font-semibold">
                No contacts Found
              </p>
            </div>
          ) : (
            /* Contact Cards */
            <div className="grid grid-cols-2 gap-10 mt-10">
              {filteredContacts.map((c) => (
                <div key={c._id}>
                  <div className="bg-[#eff4ff] shadow-md rounded p-4 flex flex-col justify-between hover:shadow-lg transition">

                    {/* Name and Company */}
                    <div>
                      <div className="text-gray-500 text-sm flex gap-2 mb-5 mt-0 justify-between items-center">
                        <h3 className="font-bold text-2xl text-[#00277a]">
                          {c.name}
                        </h3>

                        <p className="rounded bg-[#d3e6ff] font-medium px-2 py-1">
                          {c.company}
                        </p>
                      </div>

                      {/* Email and Phone */}
                      <div className="text-[16px] flex gap-2 my-3 justify-between border-2 border-[#00277a21] px-3 p-3 rounded">
                        <p>📧 {c.email}</p>
                        <p>📞 {c.phone}</p>
                      </div>

                      {/* Status and Delete */}
                      <div>
                        <div className="flex justify-between items-center mt-4">

                          <select
                            value={c.status}
                            className="p-1 rounded cursor-pointer outline-0 shadow"
                            onChange={(e) =>
                              handleStatusChange(
                                c._id,
                                e.target.value
                              )
                            }
                          >
                            <option value="Interested">
                              Interested
                            </option>

                            <option value="Follow-up">
                              Follow-up
                            </option>

                            <option value="Closed">
                              Closed
                            </option>
                          </select>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(c._id)
                            }
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition cursor-pointer"
                          >
                            Delete
                          </button>

                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}

export default ContactList;