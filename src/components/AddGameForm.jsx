// src/components/AddGameForm.jsx
import React, { useState } from "react";
import { addGameToFirestore } from "../firebase/firebase";

const AddGameForm = () => {
  const [form, setForm] = useState({
    name: "",
    link: "",
    releaseDate: "",
    developers: [{ name: "", link: "" }],
    editors: [{ name: "", link: "" }],
    platforms: ["pc"], // default platform
    ratings: {
      critics: 0,
      recommend: 0,
      players: 0,
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("developers") || name.includes("editors")) {
      const [type, index, field] = name.split(".");
      const updatedList = [...form[type]];
      updatedList[index][field] = value;
      setForm({ ...form, [type]: updatedList });
    } else if (name === "platforms") {
      setForm({ ...form, platforms: value.split(",") });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      developers: [{ name: "", link: "" }],
      editors: [{ name: "", link: "" }],
      platforms: ["pc"],
      ratings: { critics: 0, recommend: 0, players: 0 },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          name="name"
          placeholder="Game Name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          name="link"
          placeholder="Game Link"
          value={form.link}
          onChange={handleChange}
        />
        <input
          name="releaseDate"
          type="date"
          value={form.releaseDate}
          onChange={handleChange}
        />
      </div>
      
      {/* Developers */}
      {form.developers.map((dev, index) => (
        <div key={index}>
          <input
            name={`developers.${index}.name`}
            placeholder="Developer Name"
            value={dev.name}
            onChange={handleChange}
          />
          <input
            name={`developers.${index}.link`}
            placeholder="Developer Link"
            value={dev.link}
            onChange={handleChange}
          />
        </div>
      ))}

      {/* Editors */}
      {form.editors.map((editor, index) => (
        <div key={index}>
          <input
            name={`editors.${index}.name`}
            placeholder="Editor Name"
            value={editor.name}
            onChange={handleChange}
          />
          <input
            name={`editors.${index}.link`}
            placeholder="Editor Link"
            value={editor.link}
            onChange={handleChange}
          />
        </div>
      ))}

      {/* Platforms */}
      <input
        name="platforms"
        placeholder="Platforms (comma separated)"
        value={form.platforms.join(",")}
        onChange={handleChange}
      />

      {/* Ratings */}
      <div>
        <input
          name="ratings.critics"
          type="number"
          placeholder="Critic Rating"
          value={form.ratings.critics}
          onChange={handleChange}
        />
        <input
          name="ratings.recommend"
          type="number"
          placeholder="Recommend Rating"
          value={form.ratings.recommend}
          onChange={handleChange}
        />
        <input
          name="ratings.players"
          type="number"
          placeholder="Players Rating"
          value={form.ratings.players}
          onChange={handleChange}
        />
      </div>

      <button type="submit">Add Game</button>
    </form>
  );
};

export default AddGameForm;
