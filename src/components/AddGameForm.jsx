import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addGameToFirestore } from "../firebase/firebase";
import { Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import SuggestionDropdown from "./SuggestionDropdown";

const platformOptions = ["pc", "ps", "xbox", "switch", "switch_2"];
const platformLabels = {
  pc: "PC",
  ps: "PlayStation",
  xbox: "Xbox Series",
  switch: "Nintendo Switch",
  switch_2: "Nintendo Switch 2",
};

const AddGameForm = ({ games, onSuccess }) => {
  const getInitialFormState = () => ({
    name: "",
    link: "",
    releaseDate: "",
    developers: [{ name: "", link: "" }],
    editors: [{ name: "", link: "" }],
    platforms: platformOptions.reduce((acc, platform) => ({ ...acc, [platform]: false }), {}),
    ratings: { critics: 0, players: 0, link: "" },
  });
  const [form, setForm] = useState(getInitialFormState());
  const [errors, setErrors] = useState({});
  const [addNew, setAddNew] = useState(false);
  const [existingDevs, setExistingDevs] = useState([]);
  const [existingEditors, setExistingEditors] = useState([]);
  const [suggestionTarget, setSuggestionTarget] = useState(null);
  const [releaseTba, setReleaseTba] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = () => {
      const devSet = new Map();
      const editorSet = new Map();

      games.forEach(game => {
        game.developers.forEach(dev => dev.name && devSet.set(dev.name, dev.link));
        game.editors.forEach(editor => editor.name && editorSet.set(editor.name, editor.link));
      })

      setExistingDevs(Array.from(devSet.entries()).map(([name, link]) => ({ name, link })));
      setExistingEditors(Array.from(editorSet.entries()).map(([name, link]) => ({ name, link })));
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("ratings.")) {
      const field = name.split(".")[1];
      setForm({ ...form, ratings: { ...form.ratings, [field]: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handlePlatformToggle = (platform) => {
    setForm((prev) => ({
      ...prev,
      platforms: {
        ...prev.platforms,
        [platform]: !prev.platforms[platform],
      },
    }));
  };

  const addEntry = (type) => {
    setForm({ ...form, [type]: [...form[type], { name: "", link: "" }] });
  };

  const removeEntry = (type, index) => {
    const updated = form[type].filter((_, i) => i !== index);
    setForm({ ...form, [type]: updated });
  }

  const updateEntry = (type, index, field, value) => {
    const updated = [...form[type]];
    updated[index][field] = value;
    setForm({ ...form, [type]: updated });
  };

  const validate = () => {
    const errs = {};
    if (!form.name) errs.name = "Name is required";
    if (!form.link) errs.link = "Link is required";
    if (form.developers.length === 0) errs.developers = "Enter at least one developer";
    if (form.developers.some(dev => !dev.name || !dev.link)) {
      errs.developers = "All developers must have a name and a link";
    }
    if (form.editors.length === 0) errs.editors = "Enter at least one editor";
    if (form.editors.some(ed => !ed.name || !ed.link)) {
      errs.editors = "All editors must have a name and a link";
    }
    if (!form.releaseDate) errs.releaseDate = "Release date is required"
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      const isValidDate = dateRegex.test(form.releaseDate) && !isNaN(Date.parse(form.releaseDate));
      const releaseDate = isValidDate
        ? Timestamp.fromDate(new Date(form.releaseDate))
        : form.releaseDate;

      await addGameToFirestore({
        name: form.name,
        link: form.link,
        release_date: releaseDate,
        developers: form.developers,
        editors: form.editors,
        platforms: form.platforms,
        ratings: form.ratings,
      });

      toast.success("Game added successfully!");

      if (!addNew) {
        if (onSuccess) onSuccess();
        navigate("/");
      }

      setForm(getInitialFormState());
      setAddNew(false);
    } catch (err) {
      console.error("Failed to add game:", err);
    }
  };

  return (
    <div className="sm:px-8 py-5">
      <h2 className="text-2xl font-bold mb-4">Add a new game</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Info */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="block text-sm mb-2">Name</label>
            <input
              className="px-4 py-2 rounded border"
              name="name"
              value={form.name}
              placeholder="with full notation (don't forget ':' or correct numbering such as 'VI' or '6')"
              onChange={handleChange}
            />
            {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
          </div>

          <div className="flex flex-col">
            <label className="block text-sm mb-2">Link</label>
            <input
              className="px-4 py-2 rounded border"
              name="link"
              placeholder="Game website (or IGN page if no website)"
              value={form.link}
              onChange={handleChange}
            />
            {errors.link && <span className="text-red-500 text-sm">{errors.link}</span>}
          </div>

          <div className="flex flex-col">
            <label className="block text-sm mb-2">Release date</label>
            <div className="flex flex-row justify-between gap-4">
              <input
                type={`${releaseTba ? "text" : "date"}`}
                placeholder={`${releaseTba && "'TBA 2026' or 'Q4 2025'"}`}
                name="releaseDate"
                className="px-4 py-2 rounded border w-full"
                value={form.releaseDate}
                onChange={handleChange}
              />
              <button
                type="button"
                className="px-3 py-1.5 min-w-fit bg-blue-500 rounded-md text-white"
                onClick={() => setReleaseTba(prev => !prev)}
              >
                TBA
              </button>
            </div>
            {errors.releaseDate && <span className="text-red-500 text-sm">{errors.releaseDate}</span>}
          </div>
        </div>

        {/* Developers */}
        <div>
          <label className="block text-sm mb-2">Developers</label>
          {form.developers.map((dev, i) => (
            <div key={i} className="flex flex-row gap-2 mb-2 items-center">
              <div className="relative w-full">
                <input
                  placeholder="Name"
                  className="px-3 py-1 rounded border w-full"
                  value={dev.name}
                  onFocus={() => {
                    if (!dev.name) setSuggestionTarget({ type: "developers", index: i, field: "name" });
                  }}
                  onChange={(e) => updateEntry("developers", i, "name", e.target.value)}
                />
                {suggestionTarget?.type === "developers" &&
                  suggestionTarget?.index === i &&
                  suggestionTarget?.field === "name" && (
                    <SuggestionDropdown
                      suggestions={existingDevs}
                      value={dev.name}
                      onSelect={(selected) => {
                        updateEntry("developers", i, "name", selected.name);
                        updateEntry("developers", i, "link", selected.link);
                        setSuggestionTarget(null);
                      }}
                    />
                  )}
              </div>

              <input
                placeholder="Link"
                className="px-3 py-1 rounded border w-full"
                value={dev.link}
                onChange={(e) => updateEntry("developers", i, "link", e.target.value)}
              />

              <button
                type="button"
                className="text-sm hover:scale-105 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  removeEntry("developers", i)
                }}
              >Remove</button>
            </div>
          ))}
          <div className="flex flex-col gap-2 items-start">
            <button
              type="button"
              onClick={() => addEntry("developers")}
              className="text-sm underline"
            >
              + Add Developer
            </button>
            {errors.developers && <span className="text-red-500 text-sm">{errors.developers}</span>}
          </div>
        </div>

        {/* Editors */}
        <div>
          <label className="block text-sm mb-2">Editors</label>
          {form.editors.map((ed, i) => (
            <div key={i} className="flex flex-row gap-2 mb-2 items-center">
              <div className="relative w-full">
                <input
                  placeholder="Name"
                  className="px-3 py-1 rounded border w-full"
                  value={ed.name}
                  onFocus={() => {
                    if (!ed.name) setSuggestionTarget({ type: "editors", index: i, field: "name" });
                  }}
                  onChange={(e) => updateEntry("editors", i, "name", e.target.value)}
                />
                {suggestionTarget?.type === "editors" &&
                  suggestionTarget?.index === i &&
                  suggestionTarget?.field === "name" && (
                    <SuggestionDropdown
                      suggestions={existingEditors}
                      value={ed.name}
                      onSelect={(selected) => {
                        updateEntry("editors", i, "name", selected.name);
                        updateEntry("editors", i, "link", selected.link);
                        setSuggestionTarget(null);
                      }}
                    />
                  )}
              </div>
              <input
                placeholder="Link"
                className="px-3 py-1 rounded border w-full"
                value={ed.link}
                onChange={(e) => updateEntry("editors", i, "link", e.target.value)}
              />
              <button
                type="button"
                className="text-sm hover:scale-105 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  removeEntry("editors", i)
                }}
              >Remove</button>
            </div>
          ))}
          <div className="flex flex-col gap-2 items-start">
            <button
              type="button"
              onClick={() => addEntry("editors")}
              className="text-sm underline"
            >
              + Add Editor
            </button>
            {errors.editors && <span className="text-red-500 text-sm">{errors.editors}</span>}
          </div>
        </div>

        {/* Platforms */}
        <div>
          <label className="block text-sm mb-2">Platforms</label>
          <div className="flex flex-wrap gap-2">
            {platformOptions.map((platform) => (
              <button
                type="button"
                key={platform}
                onClick={() => handlePlatformToggle(platform)}
                className={`px-3 py-1 rounded-full border text-sm hover:bg-blue-100 transition ${
                  form.platforms[platform] ? "bg-blue-500 text-white hover:bg-blue-400" : ""
                }`}
              >
                {platformLabels[platform]}
              </button>
            ))}
          </div>
          {errors.platforms && <span className="text-red-500 text-sm">{errors.platforms}</span>}
        </div>

        {/* Ratings */}
        <div>
          <label className="block text-sm mb-2">Ratings</label>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-xs mb-1" htmlFor="ratings.critics">Critics</label>
              <input
                id="ratings.critics"
                name="ratings.critics"
                type="number"
                placeholder="Critic Rating"
                value={form.ratings.critics}
                onChange={handleChange}
                className="px-3 py-2 rounded border"
                min={0}
                max={100}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs mb-1" htmlFor="ratings.players">Players</label>
              <input
                id="ratings.players"
                name="ratings.players"
                type="number"
                placeholder="Players Rating"
                value={form.ratings.players}
                onChange={handleChange}
                className="px-3 py-2 rounded border"
                min={0}
                max={100}
              />
            </div>
            <div className="flex flex-col col-span-2">
              <label className="text-xs mb-1" htmlFor="ratings.link">OpenCritic link</label>
              <input
                id="ratings.link"
                name="ratings.link"
                type="text"
                value={form.ratings.link}
                onChange={handleChange}
                className="px-3 py-2 rounded border"
                />
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-3">
          <button
            type="submit"
            className="rounded-md border px-3 py-1.5 bg-blue-500 text-white"
          >
            Add and go back
          </button>
          <button
            type="submit"
            className="rounded-md border px-3 py-1.5 bg-blue-500 text-white"
            onClick={() => setAddNew(true)}
          >
            Add and reset form
          </button>
        </div>
      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AddGameForm;
