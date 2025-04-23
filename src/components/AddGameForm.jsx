import React, { useState } from "react";
import { addGameToFirestore } from "../firebase/firebase";

const platformOptions = ["pc", "ps", "xbox", "switch", "switch_2"];

const AddGameForm = () => {
  const [form, setForm] = useState({
    name: "",
    link: "",
    releaseDate: "",
    developers: [],
    editors: [],
    platforms: [],
    ratings: { critics: 0, recommend: 0, players: 0, link: "" },
  });

  const [errors, setErrors] = useState({});

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
    const updated = form.platforms.includes(platform)
      ? form.platforms.filter((p) => p !== platform)
      : [...form.platforms, platform];
    setForm({ ...form, platforms: updated });
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
    if (form.platforms.length === 0) errs.platforms = "Select at least one platform";
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
        release_date: new Date(form.releaseDate),
        developers: form.developers,
        editors: form.editors,
        platforms: form.platforms,
        ratings: form.ratings,
      });
      setForm({
        name: "",
        link: "",
        releaseDate: "",
        developers: [],
        editors: [],
        platforms: [],
        ratings: { critics: 0, recommend: 0, players: 0, link: "" },
      });
    } catch (err) {
      console.error("Failed to add game:", err);
    }
  };

  return (
    <div className="bg-muted p-6 rounded-xl shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-highlight">Add a new game</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Info */}
        <div className="grid gap-4">
          <input
            className="px-4 py-2 rounded border border-accent"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
          />
          {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}

          <input
            className="px-4 py-2 rounded border border-accent"
            name="link"
            placeholder="Link (Website or IGN)"
            value={form.link}
            onChange={handleChange}
          />
          {errors.link && <span className="text-red-500 text-sm">{errors.link}</span>}

          <input
            type="date"
            name="releaseDate"
            className="px-4 py-2 rounded border border-accent"
            value={form.releaseDate}
            onChange={handleChange}
          />
          {errors.releaseDate && <span className="text-red-500 text-sm">{errors.releaseDate}</span>}
        </div>

        {/* Platforms */}
        <div>
          <label className="block text-sm mb-2 text-muted">Platforms</label>
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {form.platforms.map((platform) => (
                <div key={platform} className="px-3 py-1 rounded-md border border-highlight">
                  {platform.toUpperCase()}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {platformOptions.map((platform) => (
              <button
                type="button"
                key={platform}
                onClick={() => handlePlatformToggle(platform)}
                className="px-3 py-1 rounded-full border border-highlight"
              >
                {platform.toUpperCase()}
              </button>
            ))}
          </div>
          {errors.platforms && <span className="text-red-500 text-sm">{errors.platforms}</span>}
        </div>

        {/* Developers */}
        <div>
          <label className="block text-sm mb-2 text-muted">Developers</label>
          {form.developers.map((dev, i) => (
            <div key={i} className="flex flex-row gap-2 mb-2 items-center">
              <input
                placeholder="Name"
                className="px-3 py-1 rounded border border-accent w-full"
                value={dev.name}
                onChange={(e) => updateEntry("developers", i, "name", e.target.value)}
              />
              <input
                placeholder="Link"
                className="px-3 py-1 rounded border border-accent w-full"
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
          <button
            type="button"
            onClick={() => addEntry("developers")}
            className="text-sm text-highlight underline"
          >
            + Add Developer
          </button>
        </div>

        {/* Editors */}
        <div>
          <label className="block text-sm mb-2 text-muted">Editors</label>
          {form.editors.map((ed, i) => (
            <div key={i} className="grid grid-cols-2 gap-2 mb-2">
              <input
                placeholder="Name"
                className="px-3 py-1 rounded border border-accent"
                value={ed.name}
                onChange={(e) => updateEntry("editors", i, "name", e.target.value)}
              />
              <input
                placeholder="Link"
                className="px-3 py-1 rounded border border-accent"
                value={ed.link}
                onChange={(e) => updateEntry("editors", i, "link", e.target.value)}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => addEntry("editors")}
            className="text-sm text-highlight underline"
          >
            + Add Editor
          </button>
        </div>

        {/* Ratings */}
        <div className="grid grid-cols-3 gap-4">
          <input
            name="ratings.critics"
            type="number"
            placeholder="Critic Rating"
            value={form.ratings.critics}
            onChange={handleChange}
            className="px-3 py-2 rounded border border-accent"
          />
          <input
            name="ratings.players"
            type="number"
            placeholder="Players Rating"
            value={form.ratings.players}
            onChange={handleChange}
            className="px-3 py-2 rounded border border-accent"
          />
          <input
            name="ratings.recommend"
            type="number"
            placeholder="Recommend %"
            value={form.ratings.recommend}
            onChange={handleChange}
            className="px-3 py-2 rounded border border-accent"
          />
        </div>

        <button
          type="submit"
          className="px-6 py-2 bg-highlight text-white rounded hover:bg-highlight/90 transition"
        >
          Add Game
        </button>
      </form>
    </div>
  );
};

export default AddGameForm;
