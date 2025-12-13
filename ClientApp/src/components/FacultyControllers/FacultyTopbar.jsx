import React from "react";

export default function FacultyTopbar({ title, user }) {
  const fullName = user
    ? [user.firstName, user.middleName, user.lastName].filter(Boolean).join(" ")
    : "Professor Name";
  const encodedName = encodeURIComponent(fullName || "User");

  // Generate avatar link using initials
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodedName}`;

  return (
    <div className="topbar">
      <h2>{title}</h2>

      <div className="user-menu">
        <img src={avatarUrl} alt="User" />
        <span className="name">{fullName}</span>
      </div>
    </div>
  );
}
