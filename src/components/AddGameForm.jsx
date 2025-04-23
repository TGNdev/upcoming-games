import React, { useState } from "react";
import { addGameToFirestore } from "../firebase/firebase";
import { Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const platformOptions = ["pc", "ps", "xbox", "switch", "switch_2"];
const platformLabels = {
  pc: "PC",
  ps: "PlayStation",
  xbox: "Xbox Series",
  switch: "Nintendo Switch",
  switch_2: "Nintendo Switch 2",
};

const AddGameForm = () => {
  const [form, setForm] = useState({
    name: "",
    link: "",
    releaseDate: "",
    developers: [],
    editors: [],
    platforms: platformOptions.reduce((acc, platform) => ({ ...acc, [platform]: false }), {}),
    ratings: { critics: 0, players: 0, link: "" },
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

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
    if (!form.releaseDate) errs.releaseDate = "Release date is required";
    if (!Object.values(form.platforms).some(Boolean)) {
      errs.platforms = "Select at least one platform";
    }
    if (form.developers.length === 0) errs.developers = "Enter at least one developer";
    if (form.developers.some(dev => !dev.name || !dev.link)) {
      errs.developers = "All developers must have a name and a link";
    }
    if (form.editors.length === 0) errs.editors = "Enter at least one editor";
    if (form.editors.some(ed => !ed.name || !ed.link)) {
      errs.editors = "All editors must have a name and a link";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await addGameToFirestore({
        name: form.name,
        link: form.link,
        release_date: Timestamp.fromDate(new Date(form.releaseDate)),
        developers: form.developers,
        editors: form.editors,
        platforms: form.platforms,
        ratings: form.ratings,
      });

      navigate("/");
    } catch (err) {
      console.error("Failed to add game:", err);
    }
  };

  return (
    <div className="bg-muted p-6 rounded-xl shadow-lg max-w-4xl mx-auto">
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
            <input
              type="date"
              name="releaseDate"
              className="px-4 py-2 rounded border"
              value={form.releaseDate}
              onChange={handleChange}
            />
            {errors.releaseDate && <span className="text-red-500 text-sm">{errors.releaseDate}</span>}
          </div>
        </div>

        <div>
          {/* Platform toggle buttons */}
          <label className="block text-sm mb-2">Platforms</label>
          <div className="flex flex-wrap gap-2">
            {platformOptions.map((platform) => (
              <button
                type="button"
                key={platform}
                onClick={() => handlePlatformToggle(platform)}
                className={`px-3 py-1 rounded-full border text-sm ${
                  form.platforms[platform] ? "bg-blue-500 text-white" : ""
                }`}
              >
                {platformLabels[platform]}
              </button>
            ))}
          </div>
          {errors.platforms && <span className="text-red-500 text-sm">{errors.platforms}</span>}
        </div>

        <div>
          <label className="block text-sm mb-2">Developers</label>
          {form.developers.map((dev, i) => (
            <div key={i} className="flex flex-row gap-2 mb-2 items-center">
              <input
                placeholder="Name"
                className="px-3 py-1 rounded border w-full"
                value={dev.name}
                onChange={(e) => updateEntry("developers", i, "name", e.target.value)}
              />
              <input
                placeholder="Link"
                className="px-3 py-1 rounded border w-full"
                value={dev.link}
                onChange={(e) => updateEntry("developers", i, "link", e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeEntry("developers", i)}
                className="text-sm hover:scale-105 transition"
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
            <div key={i} className="grid grid-cols-2 gap-2 mb-2">
              <label htmlFor={`editor-name-${i}`} className="sr-only">Editor Name</label>
              <input
                id={`editor-name-${i}`}
                placeholder="Name"
                className="px-3 py-1 rounded border"
                value={ed.name}
                onChange={(e) => updateEntry("editors", i, "name", e.target.value)}
              />
              <label htmlFor={`editor-link-${i}`} className="sr-only">Editor Link</label>
              <input
                id={`editor-link-${i}`}
                placeholder="Link"
                className="px-3 py-1 rounded border"
                value={ed.link}
                onChange={(e) => updateEntry("editors", i, "link", e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeEntry("editors", i)}
                className="text-sm hover:scale-105 transition"
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
          </div>
        </div>

        <button
          type="submit"
          className="rounded-md border px-6 py-2 bg-blue-500 text-white"
        >
          Add Game
        </button>
      </form>
    </div>
  );
};

export default AddGameForm;
